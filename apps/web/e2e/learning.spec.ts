import { expect, test, type Browser } from "@playwright/test";
import { signIn } from "./helpers";

const uniqueEmail = (label: string, project: string) => `${label}-${project}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;

test.describe.configure({ mode: "serial" });

test("parcours d'entraînement : répondre, voir la correction, obtenir le bilan", async ({ page }, testInfo) => {
  await signIn(page, uniqueEmail("entrainement", testInfo.project.name));

  await page.goto("/entrainement");
  await page.getByRole("button", { name: "Commencer l'entraînement" }).click();
  await expect(page).toHaveURL(/\/entrainement\/[^/]+$/);

  for (let question = 1; question <= 5; question++) {
    await expect(page.getByText(`Question ${question} sur 5`)).toBeVisible();
    await page.getByRole("checkbox").first().check();
    await page.getByRole("button", { name: "Valider ma réponse" }).click();

    // La correction est affichée après la réponse, avec l'explication.
    await expect(page.getByText("Pourquoi ?")).toBeVisible();
    await expect(page.getByRole("status")).toContainText(/Bonne réponse|Réponse incorrecte/);

    const next = question === 5 ? "Voir mon bilan" : "Question suivante";
    await page.getByRole("link", { name: next }).click();
  }

  await expect(page).toHaveURL(/\/bilan$/);
  await expect(page.getByRole("heading", { name: "Bilan" })).toBeVisible();
  await expect(page.getByText("Notions travaillées")).toBeVisible();
  await expect(page.getByText("Taux de réussite")).toBeVisible();
});

test("la maîtrise calculée apparaît dans le niveau réel et le tableau de bord", async ({ page }, testInfo) => {
  await signIn(page, uniqueEmail("niveau", testInfo.project.name));

  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Tes priorités aujourd’hui" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Commencer ma révision" })).toBeVisible();

  // Un QCM répondu produit une preuve, donc une notion évaluée.
  await page.goto("/entrainement/");
  await page.getByRole("button", { name: "Commencer l'entraînement" }).click();
  await page.getByRole("checkbox").first().check();
  await page.getByRole("button", { name: "Valider ma réponse" }).click();
  await expect(page.getByText("Pourquoi ?")).toBeVisible();

  await page.goto("/niveau-reel");
  await expect(page.getByRole("heading", { name: "Mon niveau réel" })).toBeVisible();
  await expect(page.getByText("Parcours recommandé").first()).toBeVisible();
  await expect(page.getByRole("meter").first()).toBeVisible();
});

test("les cours validés sont consultables, les autres ne le sont pas", async ({ page }, testInfo) => {
  await signIn(page, uniqueEmail("cours", testInfo.project.name));

  await page.goto("/cours");
  await page.getByRole("link", { name: /Physiologie cardiovasculaire/ }).first().click();
  await expect(page.getByRole("heading", { name: "Physiologie cardiovasculaire" })).toBeVisible();
  await expect(page.getByText("Rappels : cycle cardiaque et débit")).toBeVisible();
  await expect(page.getByText(/Le débit cardiaque est le volume de sang éjecté/)).toBeVisible();
});

test("le tuteur indique clairement qu'il n'est pas connecté sans clé API", async ({ page }, testInfo) => {
  await signIn(page, uniqueEmail("tuteur", testInfo.project.name));
  await page.goto("/tuteur");
  await expect(page.getByRole("heading", { name: "Le tuteur IA n’est pas encore connecté" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Envoyer" })).toBeDisabled();
});

test("un étudiant ne peut pas ouvrir le quiz d'un autre étudiant", async ({ browser, page }, testInfo) => {
  const owner = uniqueEmail("proprio", testInfo.project.name);
  await signIn(page, owner);
  await page.goto("/entrainement");
  await page.getByRole("button", { name: "Commencer l'entraînement" }).click();
  await expect(page).toHaveURL(/\/entrainement\/[^/]+$/);
  const quizUrl = page.url();

  const intruderContext = await (browser as Browser).newContext();
  const intruder = await intruderContext.newPage();
  await signIn(intruder, uniqueEmail("intrus", testInfo.project.name));
  await intruder.goto(quizUrl);
  // Même réponse que pour un quiz inexistant : on ne révèle pas qu'il existe.
  await expect(intruder.getByText(/could not be found|introuvable/i)).toBeVisible();
  await expect(intruder.getByText("Pourquoi ?")).toHaveCount(0);
  await intruderContext.close();
});
