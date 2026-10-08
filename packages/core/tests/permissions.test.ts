import { describe, expect, it } from "vitest";
import { can } from "../src/permissions.ts";
import { validateQcm } from "../src/qcm.ts";

describe("can", () => {
  it("interdit toute action d'administration à un étudiant", () => {
    expect(can("STUDENT", "admin:view")).toBe(false);
    expect(can("STUDENT", "content:review")).toBe(false);
  });

  it("permet au relecteur de valider les contenus, sans modifier la taxonomie ni les rôles", () => {
    expect(can("CONTENT_REVIEWER", "content:review")).toBe(true);
    expect(can("CONTENT_REVIEWER", "taxonomy:edit")).toBe(false);
    expect(can("CONTENT_REVIEWER", "users:manage")).toBe(false);
  });

  it("donne tous les droits à l'administrateur", () => {
    for (const capability of ["admin:view", "content:edit", "content:review", "taxonomy:edit", "users:manage"] as const) {
      expect(can("ADMIN", capability)).toBe(true);
    }
  });
});

describe("validateQcm", () => {
  const ok = [
    { text: "A", isCorrect: true },
    { text: "B", isCorrect: false },
  ];

  it("accepte une question correcte", () => {
    expect(validateQcm(ok)).toBeNull();
  });

  it("refuse une proposition vide", () => {
    expect(validateQcm([{ text: " ", isCorrect: true }, { text: "B", isCorrect: false }])).toMatch(/renseignée/);
  });

  it("exige au moins une bonne réponse et au moins une mauvaise", () => {
    expect(validateQcm([{ text: "A", isCorrect: false }, { text: "B", isCorrect: false }])).toMatch(/correcte/);
    expect(validateQcm([{ text: "A", isCorrect: true }, { text: "B", isCorrect: true }])).toMatch(/Toutes/);
  });

  it("refuse les doublons et les questions trop courtes ou trop longues", () => {
    expect(validateQcm([{ text: "a", isCorrect: true }, { text: "A ", isCorrect: false }])).toMatch(/identiques/);
    expect(validateQcm([{ text: "A", isCorrect: true }])).toMatch(/au moins/);
    const seven = Array.from({ length: 7 }, (_, i) => ({ text: `x${i}`, isCorrect: i === 0 }));
    expect(validateQcm(seven)).toMatch(/Pas plus/);
  });
});
