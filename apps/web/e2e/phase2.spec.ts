import { resolve } from "node:path";
import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";

const uniqueEmail = (label: string, project: string) => `${label}-${project}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;
const PDF = resolve(process.cwd(), "e2e/fixtures/cours-insuffisance.pdf");

test.describe.configure({ mode: "serial" });

test("import d'un cours PDF, recherche avec page, suppression", async ({ page }, testInfo) => {
  await signIn(page, uniqueEmail("docs", testInfo.project.name));
  await page.goto("/cours/documents");

  await page.getByLabel("Titre (facultatif)").fill("Cours insuffisance");
  await page.locator("#file").setInputFiles(PDF);
  await page.getByRole("button", { name: "Importer" }).click();
  await expect(page.getByRole("status")).toContainText("passages indexés");
  await expect(page.getByRole("listitem").filter({ hasText: "Cours insuffisance" }).getByText("Indexé", { exact: false })).toBeVisible();

  await page.locator("#q").fill("orthopnee");
  await page.getByRole("button", { name: "Rechercher" }).click();
  await expect(page.getByText("Cours insuffisance · p. 1")).toBeVisible();
  await expect(page.getByText(/orthopnee/).first()).toBeVisible();

  await page.getByRole("button", { name: "Supprimer Cours insuffisance" }).click();
  await expect(page.getByText("Aucun document importé pour l’instant.")).toBeVisible();
});

test("un étudiant ne voit jamais les cours importés par un autre", async ({ browser, page }, testInfo) => {
  await signIn(page, uniqueEmail("owner", testInfo.project.name));
  await page.goto("/cours/documents");
  await page.getByLabel("Titre (facultatif)").fill("Privé");
  await page.locator("#file").setInputFiles(PDF);
  await page.getByRole("button", { name: "Importer" }).click();
  await expect(page.getByRole("status")).toContainText("passages indexés");

  const context = await browser.newContext();
  const other = await context.newPage();
  await signIn(other, uniqueEmail("autre", testInfo.project.name));
  await other.goto("/cours/documents?q=orthopnee");
  await expect(other.getByText("Aucun passage trouvé dans tes cours")).toBeVisible();
  await expect(other.getByText("Privé")).toHaveCount(0);
  await context.close();
});

test("un fichier dont le contenu ne correspond pas à son format est refusé", async ({ page }, testInfo) => {
  await signIn(page, uniqueEmail("faux", testInfo.project.name));
  await page.goto("/cours/documents");
  await page.locator("#file").setInputFiles({ name: "faux.pdf", mimeType: "application/pdf", buffer: Buffer.from("ceci n'est pas un pdf") });
  await page.getByRole("button", { name: "Importer" }).click();
  await expect(page.getByRole("status")).toContainText("ne correspond pas à son format");
});

test("cas clinique : réflexion, indice, réponse attendue, fin du cas", async ({ page }, testInfo) => {
  await signIn(page, uniqueEmail("cas", testInfo.project.name));
  await page.goto("/cas-cliniques");
  await page.getByRole("link", { name: /Dyspnée d'effort/ }).click();
  await expect(page.getByText(/Étape 1 sur 4/)).toBeVisible();

  await page.getByRole("button", { name: "Donne-moi un indice" }).click();
  await expect(page.getByText(/Indice :/)).toBeVisible();

  for (let step = 1; step <= 4; step++) {
    await page.getByRole("button", { name: "Voir la réponse attendue" }).click();
    await expect(page.getByText("Réponse attendue", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: step === 4 ? "Terminer le cas" : "Étape suivante" }).click();
  }
  await expect(page.getByRole("heading", { name: "Cas terminé" })).toBeVisible();
});

test("plan de révision : création, sessions, case cochée", async ({ page }, testInfo) => {
  await signIn(page, uniqueEmail("plan", testInfo.project.name));
  await page.goto("/plan");

  const exam = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);
  await page.getByLabel("Date de l’examen").fill(exam);
  await page.getByLabel("Temps par jour (minutes)").fill("45");
  await page.getByRole("button", { name: "Créer le plan" }).click();
  await expect(page.getByRole("status")).toContainText("Plan créé");
  await expect(page.getByRole("heading", { name: "Plan jusqu’à l’examen" })).toBeVisible();

  const firstSession = page.getByRole("checkbox", { name: /Session terminée/ }).first();
  await firstSession.check();
  await expect(firstSession).toBeChecked();
});

test("une date d'examen passée est refusée", async ({ page }, testInfo) => {
  await signIn(page, uniqueEmail("date", testInfo.project.name));
  await page.goto("/plan");
  await page.getByLabel("Date de l’examen").fill("2020-01-01");
  await page.getByLabel("Temps par jour (minutes)").fill("30");
  await page.getByRole("button", { name: "Créer le plan" }).click();
  await expect(page.getByRole("status")).toContainText("après aujourd’hui");
});
