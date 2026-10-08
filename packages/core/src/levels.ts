import type { MasteryEstimate } from "./types.ts";

export const LEVEL_LABELS: Record<number, string> = {
  1: "À découvrir",
  2: "Fragile",
  3: "En progression",
  4: "Maîtrisé",
  5: "Très bien maîtrisé",
};

/** Seuil de confiance en dessous duquel on ne peut pas afficher « Maîtrisé ». */
const MIN_CONFIDENCE_FOR_MASTERED = 0.3;

/**
 * Niveau affiché (1 à 5) d'une notion.
 * Sans preuve : niveau 1. Une maîtrise élevée reposant sur trop peu de preuves
 * est plafonnée à « En progression » (3) tant que la confiance est faible.
 */
export function levelFromEstimate(estimate: MasteryEstimate): number {
  if (estimate.evidenceCount === 0) return 1;

  let level: number;
  if (estimate.mastery < 0.4) level = 2;
  else if (estimate.mastery < 0.6) level = 3;
  else if (estimate.mastery < 0.8) level = 4;
  else level = 5;

  if (level > 3 && estimate.confidence < MIN_CONFIDENCE_FOR_MASTERED) {
    return 3;
  }
  return level;
}

/** Libellé global affiché sur le tableau de bord. */
export function overallLevelLabel(mastery: number | null): string {
  if (mastery === null) return "Pas encore évalué";
  if (mastery < 0.35) return "Débutant";
  if (mastery < 0.6) return "Intermédiaire";
  if (mastery < 0.8) return "Avancé";
  return "Expert";
}
