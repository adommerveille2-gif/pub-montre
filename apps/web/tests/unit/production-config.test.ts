import { describe, expect, it } from "vitest";
import { productionProblems } from "@/lib/env";

const complete = {
  DATABASE_URL: "postgresql://u:p@db.example.com/app",
  AUTH_SECRET: "x".repeat(40),
  AUTH_URL: "https://app.example.com",
  EMAIL_DRIVER: "smtp",
  SMTP_URL: "smtp://user:pass@smtp.example.com:587",
  STORAGE_DRIVER: "s3",
  S3_BUCKET: "pub-montre",
  S3_ACCESS_KEY_ID: "id",
  S3_SECRET_ACCESS_KEY: "secret",
};

describe("productionProblems", () => {
  it("accepte une configuration complète", () => {
    expect(productionProblems(complete)).toEqual([]);
  });

  it("signale un secret trop court et une adresse non sécurisée", () => {
    const problems = productionProblems({ ...complete, AUTH_SECRET: "court", AUTH_URL: "http://app.example.com" });
    expect(problems.join("\n")).toContain("AUTH_SECRET");
    expect(problems.join("\n")).toContain("https://");
  });

  it("refuse le disque local et la console pour les e-mails", () => {
    const problems = productionProblems({ ...complete, STORAGE_DRIVER: undefined, EMAIL_DRIVER: "console" });
    expect(problems.join("\n")).toContain("STORAGE_DRIVER=s3");
    expect(problems.join("\n")).toContain("EMAIL_DRIVER=smtp");
  });

  it("liste chaque identifiant S3 manquant", () => {
    const problems = productionProblems({ ...complete, S3_BUCKET: undefined, S3_SECRET_ACCESS_KEY: "" });
    expect(problems.join("\n")).toContain("S3_BUCKET");
    expect(problems.join("\n")).toContain("S3_SECRET_ACCESS_KEY");
  });
});
