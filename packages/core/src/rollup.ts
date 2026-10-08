export type WeightedMastery = {
  mastery: number;
  confidence: number;
  weight: number;
  evidenceCount: number;
};

export type Rollup = {
  /** Moyenne pondérée des notions évaluées, ou null si aucune n'a de preuve. */
  mastery: number | null;
  /** Part des notions ayant au moins une preuve (entre 0 et 1). */
  coverage: number;
  total: number;
  evaluated: number;
};

/**
 * Agrège la maîtrise des notions (chapitre, matière, global).
 * Les notions sans preuve ne tirent pas la moyenne vers le bas : elles réduisent la couverture.
 */
export function rollupMastery(items: readonly WeightedMastery[]): Rollup {
  const evaluated = items.filter((item) => item.evidenceCount > 0);
  const totalWeight = evaluated.reduce((sum, item) => sum + item.weight, 0);

  const mastery =
    evaluated.length === 0 || totalWeight === 0
      ? null
      : evaluated.reduce((sum, item) => sum + item.mastery * item.weight, 0) / totalWeight;

  return {
    mastery,
    coverage: items.length === 0 ? 0 : evaluated.length / items.length,
    total: items.length,
    evaluated: evaluated.length,
  };
}
