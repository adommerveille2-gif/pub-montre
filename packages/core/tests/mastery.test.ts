import { describe, expect, it } from "vitest";
import { estimateMastery, HALF_LIFE_DAYS } from "../src/mastery.ts";
import type { Evidence } from "../src/types.ts";

const NOW = new Date("2026-10-08T12:00:00Z");
const daysAgo = (days: number) => new Date(NOW.getTime() - days * 24 * 60 * 60 * 1000);
const ev = (score: number, difficulty: Evidence["difficulty"] = "MEDIUM", days = 0): Evidence => ({
  score,
  difficulty,
  occurredAt: daysAgo(days),
});

describe("estimateMastery", () => {
  it("vaut 0,5 sans aucune preuve, avec une confiance nulle", () => {
    const result = estimateMastery([], NOW);
    expect(result).toEqual({ mastery: 0.5, confidence: 0, evidenceCount: 0 });
  });

  it("une seule bonne réponse ne donne pas 100 %", () => {
    const result = estimateMastery([ev(1)], NOW);
    expect(result.mastery).toBeGreaterThan(0.5);
    expect(result.mastery).toBeLessThan(0.75);
    expect(result.confidence).toBeLessThan(0.25);
  });

  it("plusieurs réussites augmentent la maîtrise et la confiance", () => {
    const one = estimateMastery([ev(1)], NOW);
    const many = estimateMastery([ev(1), ev(1), ev(1), ev(1), ev(1)], NOW);
    expect(many.mastery).toBeGreaterThan(one.mastery);
    expect(many.confidence).toBeGreaterThan(one.confidence);
  });

  it("des échecs répétés font baisser la maîtrise sous 0,5", () => {
    const result = estimateMastery([ev(0), ev(0), ev(0)], NOW);
    expect(result.mastery).toBeLessThan(0.3);
  });

  it("une réussite difficile compte davantage qu'une réussite facile", () => {
    const easy = estimateMastery([ev(0), ev(1, "EASY")], NOW);
    const hard = estimateMastery([ev(0), ev(1, "EXPERT")], NOW);
    expect(hard.mastery).toBeGreaterThan(easy.mastery);
  });

  it("les preuves anciennes pèsent moins que les récentes", () => {
    const recent = estimateMastery([ev(0, "MEDIUM", 0)], NOW);
    const old = estimateMastery([ev(0, "MEDIUM", HALF_LIFE_DAYS * 3)], NOW);
    // Une preuve ancienne se rapproche du prior (0,5) ; une preuve récente le tire davantage vers 0.
    expect(old.mastery).toBeGreaterThan(recent.mastery);
    expect(old.confidence).toBeLessThan(recent.confidence);
  });

  it("une preuve vieille d'une demi-vie pèse la moitié d'une preuve récente", () => {
    const fresh = estimateMastery([ev(1, "MEDIUM", 0)], NOW);
    const halfLife = estimateMastery([ev(1, "MEDIUM", HALF_LIFE_DAYS)], NOW);
    expect(halfLife.confidence).toBeLessThan(fresh.confidence);
    // Poids 0,5 contre 1 : la confiance passe de 1/6 à 0,5/5,5.
    expect(halfLife.confidence).toBeCloseTo(0.5 / 5.5, 6);
  });

  it("reste borné entre 0 et 1 même avec des entrées hors bornes", () => {
    const result = estimateMastery([ev(5), ev(-3)], NOW);
    expect(result.mastery).toBeGreaterThanOrEqual(0);
    expect(result.mastery).toBeLessThanOrEqual(1);
    expect(result.confidence).toBeGreaterThanOrEqual(0);
    expect(result.confidence).toBeLessThanOrEqual(1);
  });
});
