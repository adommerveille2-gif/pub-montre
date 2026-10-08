import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { expect, test, type Page } from "@playwright/test";

const LOG_FILE = resolve(process.cwd(), ".e2e/server.log");

/** Lit le dernier lien de connexion écrit par le serveur (mode sans SMTP). */
async function readMagicLink(page: Page, email: string): Promise<string> {
  for (let attempt = 0; attempt < 50; attempt++) {
    if (existsSync(LOG_FILE)) {
      const log = readFileSync(LOG_FILE, "utf8");
      const marker = `Lien de connexion pour ${email}`;
      const index = log.lastIndexOf(marker);
      if (index !== -1) {
        const match = log.slice(index).match(/https?:\/\/\S+/);
        if (match) return match[0];
      }
    }
    await page.waitForTimeout(200);
  }
  throw new Error(`Aucun lien de connexion trouvé pour ${email}`);
}

test.describe.configure({ mode: "serial" });

test("un visiteur non connecté est redirigé vers la connexion", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
  await expect(page.getByRole("heading", { name: "Connexion" })).toBeVisible();
});

test("un e-mail invalide est refusé sans envoi", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("Adresse e-mail").fill("pas-un-email");
  await page.getByRole("button", { name: "Recevoir mon lien de connexion" }).click();
  await expect(page.locator("#login-error")).toContainText("adresse e-mail valide");
});

test("parcours complet : connexion, profil, tableau de bord, déconnexion", async ({ page }, testInfo) => {
  const email = `etudiant-${testInfo.project.name}-${Date.now()}@example.com`;

  await page.goto("/login");
  await page.getByLabel("Adresse e-mail").fill(email);
  await page.getByRole("button", { name: "Recevoir mon lien de connexion" }).click();
  await expect(page).toHaveURL(/\/login\/verifier$/);
  await expect(page.getByRole("heading", { name: "Vérifie ta boîte mail" })).toBeVisible();

  const link = await readMagicLink(page, email);
  await page.goto(link);
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("heading", { name: "Bonjour" })).toBeVisible();

  // Profil : enregistrement puis retour sur le tableau de bord personnalisé.
  await page.goto("/profil");
  await page.getByLabel("Prénom").fill("Thomas");
  await page.getByLabel("Année d’études").selectOption({ label: "3e année" });
  await page.getByLabel("Objectif").selectOption("MASTER_COURSES");
  await page.getByLabel("Temps de révision par jour (minutes)").fill("45");
  await page.getByRole("button", { name: "Enregistrer" }).click();
  await expect(page.getByRole("status")).toContainText("Profil enregistré");

  await page.goto("/dashboard");
  await expect(page.getByRole("heading", { name: "Bonjour Thomas" })).toBeVisible();
  await expect(page.getByText("Année : 3e année")).toBeVisible();

  // Déconnexion : la session est supprimée, la page protégée redirige à nouveau.
  await page.getByRole("button", { name: "Se déconnecter" }).click();
  await expect(page).toHaveURL(/\/login$/);
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login$/);
});

test("les sections à venir n'ont aucune action factice", async ({ page }, testInfo) => {
  const email = `section-${testInfo.project.name}-${Date.now()}@example.com`;
  await page.goto("/login");
  await page.getByLabel("Adresse e-mail").fill(email);
  await page.getByRole("button", { name: "Recevoir mon lien de connexion" }).click();
  await expect(page).toHaveURL(/\/login\/verifier$/);
  await page.goto(await readMagicLink(page, email));
  await expect(page).toHaveURL(/\/dashboard$/);

  await page.goto("/tuteur");
  await expect(page.getByRole("heading", { name: "Mon tuteur" })).toBeVisible();
  await expect(page.getByText("Bientôt disponible")).toBeVisible();
});

test("navigation adaptée à la taille d'écran et pas de débordement horizontal", async ({ page }, testInfo) => {
  const email = `layout-${testInfo.project.name}-${Date.now()}@example.com`;
  await page.goto("/login");
  await page.getByLabel("Adresse e-mail").fill(email);
  await page.getByRole("button", { name: "Recevoir mon lien de connexion" }).click();
  await expect(page).toHaveURL(/\/login\/verifier$/);
  await page.goto(await readMagicLink(page, email));
  await expect(page).toHaveURL(/\/dashboard$/);

  const isMobile = testInfo.project.name === "mobile";
  const sidebar = page.getByRole("navigation", { name: "Sections" });
  const bottomNav = page.getByRole("navigation", { name: "Sections principales" });

  if (isMobile) {
    await expect(sidebar).toBeHidden();
    await expect(bottomNav).toBeVisible();
  } else {
    await expect(sidebar).toBeVisible();
    await expect(bottomNav).toBeHidden();
  }

  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  expect(overflow).toBe(false);
});

test("le thème sombre peut être activé et appliqué", async ({ page }, testInfo) => {
  test.skip(testInfo.project.name === "mobile", "Testé sur desktop");
  await page.goto("/login");
  await page.getByRole("button", { name: "Passer en mode sombre" }).click();
  await expect(page.locator("html")).toHaveClass(/dark/);
  await page.getByRole("button", { name: "Passer en mode clair" }).click();
  await expect(page.locator("html")).not.toHaveClass(/dark/);
});
