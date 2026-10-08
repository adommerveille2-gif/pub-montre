import { resolve } from "node:path";
import { expect, test, type Browser } from "@playwright/test";
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

test("anatomie 3D : rien n'est publié sans validation, puis la visionneuse s'affiche", async ({ browser, page }, testInfo) => {
  const adminEmail = uniqueEmail("anat-admin", testInfo.project.name);
  const label = `Structure ${Date.now()}`;
  await signIn(page, adminEmail);
  const { prisma } = await import("@pub-montre/db");
  await prisma.user.update({ where: { email: adminEmail }, data: { role: "ADMIN" } });
  await prisma.$disconnect();

  await page.goto("/admin/anatomie");
  await page.getByLabel("Fichier GLB (50 Mo maximum)").setInputFiles(resolve(process.cwd(), "e2e/fixtures/structure-test.glb"));
  await page.getByLabel("Licence").fill("Test interne");
  await page.getByLabel("Source").fill("Fixture de test (non anatomique)");
  await page.getByLabel("Structures").fill(`structure_test | ${label} | Description de test.`);
  await page.getByRole("button", { name: "Importer en brouillon" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Modèle importé en brouillon" })).toBeVisible();

  // Tant que le modèle n'est pas publié, la visionneuse ne le montre pas.
  const student = await (browser as Browser).newContext();
  const studentPage = await student.newPage();
  await signIn(studentPage, uniqueEmail("anat-etudiant", testInfo.project.name));
  await studentPage.goto("/anatomie-3d");
  await expect(studentPage.getByRole("button", { name: label })).toHaveCount(0);
  await student.close();

  // Publication : le fichier importé le plus récent est en tête de liste.
  await page.getByRole("button", { name: "Publier" }).first().click();
  await expect(page.getByRole("status").filter({ hasText: "Modèle publié." }).first()).toBeVisible();

  const viewer = await (browser as Browser).newContext();
  const viewerPage = await viewer.newPage();
  await signIn(viewerPage, uniqueEmail("anat-visu", testInfo.project.name));
  await viewerPage.goto("/anatomie-3d");
  await expect(viewerPage.getByLabel("Visionneuse anatomique 3D")).toBeVisible();
  // La scène WebGL existe réellement, et non seulement son conteneur.
  await expect(viewerPage.locator("canvas")).toBeVisible();
  const webgl = await viewerPage.locator("canvas").first().evaluate((canvas) => {
    const element = canvas as HTMLCanvasElement;
    return Boolean(element.getContext("webgl2") ?? element.getContext("webgl"));
  });
  expect(webgl).toBe(true);
  await expect(viewerPage.getByRole("button", { name: `Estomper ${label}` })).toBeVisible();
  await viewerPage.getByRole("button", { name: label }).first().click();
  await expect(viewerPage.getByText("Description de test.")).toBeVisible();

  // Le fichier 3D n'est pas accessible sans connexion.
  const anonymous = await (browser as Browser).newContext();
  const response = await anonymous.request.get("/api/anatomy/aaaaaaaaaaaaaaaaaaaa");
  expect(response.status()).toBe(401);
  await anonymous.close();
  await viewer.close();
});
