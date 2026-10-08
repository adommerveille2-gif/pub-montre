import { defineConfig, devices } from "@playwright/test";

// Les tests lisent aussi la base directement : même base de test que le serveur.
process.env.DATABASE_URL ??= process.env.TEST_DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/pubmontre_test?schema=public";

const PORT = 3100;
const EMBEDDINGS_PORT = 3300;
const BASE_URL = `http://localhost:${PORT}`;
// En CI, Playwright installe son navigateur. Dans un environnement avec Chromium préinstallé,
// PLAYWRIGHT_CHROMIUM_PATH pointe vers le binaire.
const chromiumPath = process.env.PLAYWRIGHT_CHROMIUM_PATH || undefined;

// Les e-mails ne sont pas envoyés pendant les tests : le lien est écrit dans un journal
// (voir e2e/helpers.ts). Les embeddings passent par un serveur de test local (e2e/fake-embeddings.mjs).
export default defineConfig({
  testDir: "./e2e",
  globalSetup: "./e2e/global-setup.ts",
  fullyParallel: false,
  workers: 1,
  reporter: [["list"]],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    launchOptions: { executablePath: chromiumPath },
  },
  projects: [
    { name: "desktop", use: { ...devices["Desktop Chrome"] } },
    { name: "mobile", use: { ...devices["Pixel 7"] } },
  ],
  webServer: [
    {
      command: `node e2e/fake-embeddings.mjs`,
      url: `http://localhost:${EMBEDDINGS_PORT}/health`,
      reuseExistingServer: false,
      timeout: 30_000,
    },
    {
      command: `mkdir -p .e2e && pnpm exec next start -p ${PORT} > .e2e/server.log 2>&1`,
      url: BASE_URL,
      reuseExistingServer: false,
      timeout: 120_000,
      env: {
        DATABASE_URL: process.env.TEST_DATABASE_URL ?? "postgresql://postgres:postgres@localhost:5432/pubmontre_test?schema=public",
        AUTH_SECRET: "e2e-only-secret-0123456789abcdef",
        AUTH_URL: BASE_URL,
        EMAIL_DRIVER: "console",
        RATE_LIMIT_LOGIN_IP: "1000",
        OPENAI_API_KEY: "e2e-only-fake-key",
        OPENAI_BASE_URL: `http://localhost:${EMBEDDINGS_PORT}/v1`,
      },
    },
  ],
});
