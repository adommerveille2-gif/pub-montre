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

export type FlashcardRating = "again" | "good" | "easy";

export type FlashcardState = { level: number; reps: number; lapses: number };

/**
 * Passe une carte à son état suivant selon la note de l'étudiant.
 * « À revoir » ramène au niveau 1 ; « Bien » et « Facile » montent d'un niveau (« Facile » d'un de plus).
 */
export function nextFlashcardState(state: FlashcardState, rating: FlashcardRating): FlashcardState & { dueInDays: number } {
  const reps = state.reps + 1;
  if (rating === "again") {
    return { level: 1, reps, lapses: state.lapses + 1, dueInDays: 1 };
  }
  const step = rating === "easy" ? 2 : 1;
  const level = Math.min(5, Math.max(1, state.level) + step);
  return { level, reps, lapses: state.lapses, dueInDays: nextReviewInDays(level, 1) };
}
