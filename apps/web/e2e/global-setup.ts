import { execSync } from "node:child_process";

/**
 * Prépare les données de référence (années, matières) avant les tests.
 * Les tests de schéma vident la base de test : on la reseed ici pour que chaque run soit indépendant.
 */
export default function globalSetup() {
  execSync("pnpm --filter @pub-montre/db exec prisma db seed", {
    stdio: "inherit",
    env: {
      ...process.env,
      DATABASE_URL:
        process.env.TEST_DATABASE_URL ??
        "postgresql://postgres:postgres@localhost:5432/pubmontre_test?schema=public",
    },
  });
}
