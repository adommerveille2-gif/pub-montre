import { describe, expect, it } from "vitest";
import { buildPlan, describeState, priorityScore } from "../src/plan.ts";
import { nextReviewInDays } from "../src/scheduling.ts";

describe("buildPlan", () => {
  it("commence par le cours pour une notion jamais travaillée", () => {
    const plan = buildPlan({ mastery: 0.5, confidence: 0, evidenceCount: 0 });
    expect(plan[0]?.kind).toBe("EXPLAIN");
    expect(plan.map((step) => step.kind)).toEqual(["EXPLAIN", "QUIZ_EASY"]);
  });

  it("une notion faible suit la séquence cours → faciles → intermédiaires → cas → révision 48 h", () => {
    const plan = buildPlan({ mastery: 0.3, confidence: 0.6, evidenceCount: 8 });
    expect(plan.map((step) => step.kind)).toEqual([
      "EXPLAIN",
      "QUIZ_EASY",
      "QUIZ_MEDIUM",
      "CASE",
      "REVIEW_LATER",
    ]);
    expect(plan.at(-1)?.label).toContain("48 h");
  });

  it("une notion maîtrisée ne demande qu'une révision à 7 jours", () => {
    const plan = buildPlan({ mastery: 0.9, confidence: 0.9, evidenceCount: 12 });
    expect(plan).toEqual([{ kind: "REVIEW_LATER", label: "Revoir dans 7 jours" }]);
  });
});

describe("priorityScore", () => {
  it("classe les notions faibles et fiables avant les notions maîtrisées", () => {
    const weak = priorityScore({ mastery: 0.2, confidence: 0.8, evidenceCount: 10 }, 1);
    const strong = priorityScore({ mastery: 0.9, confidence: 0.8, evidenceCount: 10 }, 1);
    expect(weak).toBeGreaterThan(strong);
  });

  it("tient compte du poids de la notion", () => {
    const state = { mastery: 0.2, confidence: 0.8, evidenceCount: 10 };
    expect(priorityScore(state, 2)).toBeGreaterThan(priorityScore(state, 1));
  });
});

describe("describeState", () => {
  it("formule un diagnostic lisible", () => {
    expect(describeState("ECG", { mastery: 0.3, confidence: 0.5, evidenceCount: 4 })).toContain("difficultés");
    expect(describeState("ECG", { mastery: 0.9, confidence: 0.5, evidenceCount: 4 })).toContain("maîtrises");
    expect(describeState("ECG", { mastery: 0.5, confidence: 0, evidenceCount: 0 })).toContain("pas encore");
  });
});

describe("nextReviewInDays", () => {
  it("revient le lendemain après une réponse fragile", () => {
    expect(nextReviewInDays(5, 0.2)).toBe(1);
  });

  it("espace davantage les notions maîtrisées", () => {
    expect(nextReviewInDays(1, 1)).toBe(1);
    expect(nextReviewInDays(3, 1)).toBe(4);
    expect(nextReviewInDays(5, 1)).toBe(14);
  });
});
