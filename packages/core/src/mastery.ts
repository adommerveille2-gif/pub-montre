import type { Difficulty, Evidence, MasteryEstimate } from "./types.ts";

/** Pondération selon la difficulté : réussir un exercice difficile compte davantage. */
export const DIFFICULTY_WEIGHT: Record<Difficulty, number> = {
  EASY: 0.7,
  MEDIUM: 1,
  HARD: 1.3,
  EXPERT: 1.5,
};

/** Une preuve perd la moitié de son poids après ce délai (oubli). */
export const HALF_LIFE_DAYS = 30;

/** Pseudo-observations à 50 % : sans preuve, la maîtrise estimée est 0,5. */
const PRIOR_WEIGHT = 2;
const PRIOR_MEAN = 0.5;

/** Poids accumulé à partir duquel la confiance atteint 50 %. */
const CONFIDENCE_SCALE = 5;

const DAY_MS = 24 * 60 * 60 * 1000;

function clamp01(value: number): number {
  if (Number.isNaN(value)) return 0;
  return Math.min(1, Math.max(0, value));
}

/**
 * Estime la maîtrise d'une notion à partir de ses preuves.
 *
 * - Moyenne pondérée des scores, avec deux pseudo-observations à 0,5 (prior).
 *   Une seule bonne réponse ne donne donc pas 100 %.
 * - Chaque preuve est pondérée par sa difficulté et son ancienneté.
 * - La confiance croît avec le poids total des preuves.
 */
export function estimateMastery(evidence: readonly Evidence[], now: Date): MasteryEstimate {
  let totalWeight = 0;
  let weightedScore = 0;

  for (const item of evidence) {
    const ageDays = Math.max(0, (now.getTime() - item.occurredAt.getTime()) / DAY_MS);
    const decay = 0.5 ** (ageDays / HALF_LIFE_DAYS);
    const weight = DIFFICULTY_WEIGHT[item.difficulty] * decay;
    totalWeight += weight;
    weightedScore += weight * clamp01(item.score);
  }

  const mastery = (weightedScore + PRIOR_WEIGHT * PRIOR_MEAN) / (totalWeight + PRIOR_WEIGHT);
  const confidence = totalWeight / (totalWeight + CONFIDENCE_SCALE);

  return {
    mastery: clamp01(mastery),
    confidence: clamp01(confidence),
    evidenceCount: evidence.length,
  };
}
