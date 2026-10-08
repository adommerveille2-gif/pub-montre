/**
 * Fusion de classements (Reciprocal Rank Fusion) : combine plusieurs listes ordonnées
 * (ex. recherche plein texte et recherche vectorielle) sans comparer leurs scores bruts.
 */
export const RRF_K = 60;

export function reciprocalRankFusion(rankings: readonly (readonly string[])[], limit: number, k = RRF_K): string[] {
  const scores = new Map<string, number>();
  for (const ranking of rankings) {
    ranking.forEach((id, index) => {
      scores.set(id, (scores.get(id) ?? 0) + 1 / (k + index + 1));
    });
  }
  return [...scores.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, Math.max(0, limit))
    .map(([id]) => id);
}
