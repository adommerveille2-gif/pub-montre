import { expect, test, type Browser } from "@playwright/test";
import { signIn } from "./helpers";

const uniqueEmail = (label: string, project: string) => `${label}-${project}-${Date.now()}-${Math.floor(Math.random() * 1e6)}@example.com`;

/** Donne un rôle directement en base : seul moyen de créer un administrateur, jamais depuis l'interface. */
async function setRole(email: string, role: "STUDENT" | "CONTENT_REVIEWER" | "ADMIN") {
  const { prisma } = await import("@pub-montre/db");
  await prisma.user.update({ where: { email }, data: { role } });
  await prisma.$disconnect();
}

test.describe.configure({ mode: "serial" });

test("un étudiant ne peut pas accéder à l'administration", async ({ page }, testInfo) => {
  await signIn(page, uniqueEmail("etudiant-admin", testInfo.project.name));
  await page.goto("/admin");
  await expect(page).toHaveURL(/\/dashboard$/);
  await expect(page.getByRole("link", { name: "Administration" })).toHaveCount(0);
});

test("administrateur : matière, question refusée puis enregistrée et validée", async ({ page }, testInfo) => {
  const email = uniqueEmail("admin", testInfo.project.name);
  await signIn(page, email);
  await setRole(email, "ADMIN");

  await page.goto("/admin");
  await expect(page.getByRole("heading", { name: "Administration" })).toBeVisible();
  if (testInfo.project.name === "desktop") {
    await expect(page.getByRole("link", { name: "Administration" })).toBeVisible();
  } else {
    await expect(page.locator('details a[href="/admin"]')).toHaveCount(1);
  }

  const subject = `Matière test ${Date.now()}`;
  await page.goto("/admin/taxonomie");
  await page.getByLabel("Nom").first().fill(subject);
  await page.getByRole("button", { name: "Créer" }).first().click();
  await expect(page.getByRole("status").filter({ hasText: "Matière créée." })).toBeVisible();

  await page.goto("/admin/questions");
  await page.getByLabel("Énoncé").fill("Question incomplète ?");
  await page.getByLabel("Explication").fill("Explication.");
  await page.getByLabel("Texte de la proposition 1").fill("Seule proposition");
  await page.getByLabel("Proposition 1 correcte").check();
  await page.getByRole("button", { name: "Enregistrer en brouillon" }).click();
  await expect(page.getByRole("status").filter({ hasText: "au moins 2 propositions" })).toBeVisible();

  const statement = `Question de test ${Date.now()} ?`;
  await page.getByLabel("Énoncé").fill(statement);
  await page.getByLabel("Texte de la proposition 2").fill("Autre proposition");
  await page.getByRole("button", { name: "Enregistrer en brouillon" }).click();
  await expect(page.getByRole("status").filter({ hasText: "Question enregistrée" })).toBeVisible();

  await expect(page.getByText(statement)).toBeVisible();
  await page.locator("div.rounded-2xl", { has: page.getByText(statement, { exact: true }) }).getByRole("button", { name: "Valider" }).click();
  // Une question validée sort de la file de relecture.
  await expect(page.getByText(statement, { exact: true })).toHaveCount(0);

  await page.goto("/admin");
  await expect(page.getByText("subject.create").first()).toBeVisible();
});

test("relecteur : voit la file de relecture, pas les formulaires de création", async ({ browser, page }, testInfo) => {
  const reviewerEmail = uniqueEmail("relecteur", testInfo.project.name);
  const adminEmail = uniqueEmail("admin2", testInfo.project.name);

  const reviewerContext = await (browser as Browser).newContext();
  const reviewer = await reviewerContext.newPage();
  await signIn(reviewer, reviewerEmail);
  await signIn(page, adminEmail);
  await setRole(adminEmail, "ADMIN");

  await page.goto("/admin/utilisateurs");
  const row = page.locator("li", { has: page.getByLabel(`Rôle de ${reviewerEmail}`) });
  await row.getByLabel(`Rôle de ${reviewerEmail}`).selectOption("CONTENT_REVIEWER");
  await row.getByRole("button", { name: "Enregistrer" }).click();
  await expect.poll(async () => {
    const { prisma } = await import("@pub-montre/db");
    const user = await prisma.user.findUnique({ where: { email: reviewerEmail } });
    await prisma.$disconnect();
    return user?.role;
  }).toBe("CONTENT_REVIEWER");

  await reviewer.goto("/admin/questions");
  await expect(reviewer.getByRole("heading", { name: /À relire/ })).toBeVisible();
  await expect(reviewer.getByRole("heading", { name: "Nouvelle question QCM" })).toHaveCount(0);

  await reviewer.goto("/admin/taxonomie");
  await expect(reviewer.getByRole("heading", { name: "Nouvelle matière" })).toHaveCount(0);
  await reviewerContext.close();
});
