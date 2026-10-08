import { expect, test } from "@playwright/test";
import { signIn } from "./helpers";

const uniqueEmail = (label: string, project: string) => `${label}-${project}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;

test.describe.configure({ mode: "serial" });

test("cartes mémoire : révision jusqu'au bilan", async ({ page }, testInfo) => {
  await signIn(page, uniqueEmail("cartes", testInfo.project.name));
  await page.goto("/entrainement/cartes");

  await expect(page.getByText("Question", { exact: true })).toBeVisible();
  for (let card = 1; card <= 3; card++) {
    await page.getByRole("button", { name: "Voir la réponse" }).click();
    await expect(page.getByText("Réponse", { exact: true })).toBeVisible();
    await page.getByRole("button", { name: "Bien" }).click();
  }
  await expect(page.getByRole("heading", { name: "Bravo, tu as fait le tour" })).toBeVisible();
});

test("progression : niveau, objectif quotidien et badges", async ({ page }, testInfo) => {
  await signIn(page, uniqueEmail("gamif", testInfo.project.name));

  await page.goto("/entrainement");
  await page.getByRole("button", { name: "Commencer l'entraînement" }).click();
  await page.getByRole("checkbox").first().check();
  await page.getByRole("button", { name: "Valider ma réponse" }).click();
  await expect(page.getByText("Pourquoi ?")).toBeVisible();

  await page.goto("/progression");
  await expect(page.getByText("Niveau 1", { exact: true })).toBeVisible();
  await expect(page.getByRole("meter", { name: "Objectif quotidien" })).toBeVisible();
  await expect(page.getByRole("heading", { name: "Badges" })).toBeVisible();
  await expect(page.getByText("Premier pas")).toBeVisible();
});

test("tuteur sans clé : pas de micro proposé, message explicite", async ({ page }, testInfo) => {
  await signIn(page, uniqueEmail("voix", testInfo.project.name));
  await page.goto("/tuteur");
  await expect(page.getByRole("button", { name: "Parler au tuteur" })).toHaveCount(0);
  await expect(page.getByRole("heading", { name: "Le tuteur IA n’est pas encore connecté" })).toBeVisible();
});
