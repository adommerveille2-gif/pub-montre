import { describe, expect, it } from "vitest";
import { levelFromEstimate, overallLevelLabel } from "../src/levels.ts";

describe("levelFromEstimate", () => {
  it("niveau 1 sans preuve", () => {
    expect(levelFromEstimate({ mastery: 0.5, confidence: 0, evidenceCount: 0 })).toBe(1);
  });

  it("répartit la maîtrise sur les niveaux 2 à 5", () => {
    const at = (mastery: number) => levelFromEstimate({ mastery, confidence: 0.9, evidenceCount: 10 });
    expect(at(0.2)).toBe(2);
    expect(at(0.5)).toBe(3);
    expect(at(0.7)).toBe(4);
    expect(at(0.9)).toBe(5);
  });

  it("plafonne « Maîtrisé » tant que la confiance est faible", () => {
    const level = levelFromEstimate({ mastery: 0.9, confidence: 0.1, evidenceCount: 1 });
    expect(level).toBe(3);
  });
});

describe("overallLevelLabel", () => {
  it("indique l'absence d'évaluation", () => {
    expect(overallLevelLabel(null)).toBe("Pas encore évalué");
  });

  it("qualifie la maîtrise globale", () => {
    expect(overallLevelLabel(0.2)).toBe("Débutant");
    expect(overallLevelLabel(0.5)).toBe("Intermédiaire");
    expect(overallLevelLabel(0.7)).toBe("Avancé");
    expect(overallLevelLabel(0.9)).toBe("Expert");
  });
});
