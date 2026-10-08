import { describe, expect, it } from "vitest";
import { rollupMastery } from "../src/rollup.ts";

describe("rollupMastery", () => {
  it("retourne null quand aucune notion n'est évaluée", () => {
    const result = rollupMastery([{ mastery: 0.5, confidence: 0, weight: 1, evidenceCount: 0 }]);
    expect(result).toEqual({ mastery: null, coverage: 0, total: 1, evaluated: 0 });
  });

  it("ignore les notions non évaluées dans la moyenne mais les compte dans la couverture", () => {
    const result = rollupMastery([
      { mastery: 0.8, confidence: 0.9, weight: 1, evidenceCount: 5 },
      { mastery: 0.5, confidence: 0, weight: 1, evidenceCount: 0 },
    ]);
    expect(result.mastery).toBeCloseTo(0.8, 6);
    expect(result.coverage).toBe(0.5);
  });

  it("pondère par le poids de chaque notion", () => {
    const result = rollupMastery([
      { mastery: 1, confidence: 1, weight: 3, evidenceCount: 2 },
      { mastery: 0, confidence: 1, weight: 1, evidenceCount: 2 },
    ]);
    expect(result.mastery).toBeCloseTo(0.75, 6);
  });
});
