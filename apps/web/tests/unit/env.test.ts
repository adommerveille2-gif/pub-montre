import { describe, expect, it } from "vitest";
import { parseEnv } from "@/lib/env";

describe("parseEnv", () => {
  it("exige DATABASE_URL", () => {
    expect(() => parseEnv({})).toThrow(/DATABASE_URL/);
  });

  it("applique l'expéditeur par défaut", () => {
    const env = parseEnv({ DATABASE_URL: "postgresql://localhost/db" });
    expect(env.EMAIL_FROM).toContain("no-reply");
    expect(env.SMTP_URL).toBeUndefined();
  });

  it("refuse une AUTH_URL qui n'est pas une URL", () => {
    expect(() =>
      parseEnv({ DATABASE_URL: "postgresql://localhost/db", AUTH_URL: "pas une url" }),
    ).toThrow(/AUTH_URL/);
  });

  it("refuse une valeur inconnue pour EMAIL_DRIVER", () => {
    expect(() =>
      parseEnv({ DATABASE_URL: "postgresql://localhost/db", EMAIL_DRIVER: "pigeon" }),
    ).toThrow(/EMAIL_DRIVER/);
  });

  it("refuse un AUTH_SECRET trop court", () => {
    expect(() =>
      parseEnv({ DATABASE_URL: "postgresql://localhost/db", AUTH_SECRET: "court" }),
    ).toThrow(/AUTH_SECRET/);
  });
});
