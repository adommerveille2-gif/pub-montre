import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import { expect, type Page } from "@playwright/test";

const LOG_FILE = resolve(process.cwd(), ".e2e/server.log");

/** Lit le dernier lien de connexion écrit par le serveur (EMAIL_DRIVER=console). */
export async function readMagicLink(page: Page, email: string): Promise<string> {
  for (let attempt = 0; attempt < 50; attempt++) {
    if (existsSync(LOG_FILE)) {
      const log = readFileSync(LOG_FILE, "utf8");
      const index = log.lastIndexOf(`Lien de connexion pour ${email}`);
      if (index !== -1) {
        const match = log.slice(index).match(/https?:\/\/\S+/);
        if (match) return match[0];
      }
    }
    await page.waitForTimeout(200);
  }
  throw new Error(`Aucun lien de connexion trouvé pour ${email}`);
}

/** Connecte un étudiant via le parcours réel (lien magique). */
export async function signIn(page: Page, email: string) {
  await page.goto("/login");
  await page.getByLabel("Adresse e-mail").fill(email);
  await page.getByRole("button", { name: "Recevoir mon lien de connexion" }).click();
  await expect(page).toHaveURL(/\/login\/verifier$/);
  await page.goto(await readMagicLink(page, email));
  await expect(page).toHaveURL(/\/dashboard$/);
}
