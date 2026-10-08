import { defineConfig } from "vitest/config";

// Les tests de base utilisent une base dédiée, jamais la base de développement.
const testDatabaseUrl =
  process.env.TEST_DATABASE_URL ??
  "postgresql://postgres:postgres@localhost:5432/pubmontre_test?schema=public";

export default defineConfig({
  test: {
    environment: "node",
    env: { DATABASE_URL: testDatabaseUrl },
    fileParallelism: false,
    include: ["tests/**/*.test.ts"],
  },
});
