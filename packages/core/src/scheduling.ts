/**
 * Intervalle de révision selon le niveau (en jours), version v1.
 * Remplaçable par FSRS sans changer les appelants.
 */
const INTERVAL_BY_LEVEL_DAYS = [1, 2, 4, 7, 14];

/** Prochaine révision d'une notion : plus tôt si la dernière réponse était fragile. */
export function nextReviewInDays(level: number, lastScore: number): number {
  if (lastScore < 0.5) return 1;
  const index = Math.min(Math.max(level, 1), INTERVAL_BY_LEVEL_DAYS.length) - 1;
  return INTERVAL_BY_LEVEL_DAYS[index] ?? 1;
}

export function addDays(date: Date, days: number): Date {
  return new Date(date.getTime() + days * 24 * 60 * 60 * 1000);
}
