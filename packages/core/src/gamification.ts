/**
 * Gamification : XP, niveaux et badges, dérivés de l'activité réelle.
 * Elle reste secondaire : aucun XP n'est accordé sans apprentissage mesuré.
 */

export const XP_RULES = {
  correctAnswer: 10,
  wrongAnswer: 3,
  flashcardReview: 5,
} as const;

export type ActivityStats = {
  answers: number;
  correctAnswers: number;
  flashcardReviews: number;
  streakDays: number;
  conceptsMastered: number;
};

export function computeXp(stats: Pick<ActivityStats, "correctAnswers" | "answers" | "flashcardReviews">): number {
  const wrong = Math.max(0, stats.answers - stats.correctAnswers);
  return (
    stats.correctAnswers * XP_RULES.correctAnswer +
    wrong * XP_RULES.wrongAnswer +
    stats.flashcardReviews * XP_RULES.flashcardReview
  );
}

/** Niveau de progression : le niveau L demande 50 × (L − 1)² XP. */
export function levelFromXp(xp: number): { level: number; currentXp: number; nextLevelXp: number } {
  let level = 1;
  while (50 * level * level <= xp) level += 1;
  const floor = 50 * (level - 1) * (level - 1);
  const next = 50 * level * level;
  return { level, currentXp: xp - floor, nextLevelXp: next - floor };
}

export type Badge = {
  code: string;
  title: string;
  description: string;
  unlocked: (stats: ActivityStats) => boolean;
};

export const BADGES: Badge[] = [
  { code: "first_answer", title: "Premier pas", description: "Répondre à une première question.", unlocked: (s) => s.answers >= 1 },
  { code: "hundred_correct", title: "Centurion", description: "Réussir 100 questions.", unlocked: (s) => s.correctAnswers >= 100 },
  { code: "week_streak", title: "Régulier", description: "7 jours d'activité consécutifs.", unlocked: (s) => s.streakDays >= 7 },
  { code: "ten_concepts", title: "Solide", description: "Maîtriser 10 notions.", unlocked: (s) => s.conceptsMastered >= 10 },
  { code: "flashcards_50", title: "Mémoire d'éléphant", description: "Revoir 50 cartes mémoire.", unlocked: (s) => s.flashcardReviews >= 50 },
];

export function unlockedBadges(stats: ActivityStats): Badge[] {
  return BADGES.filter((badge) => badge.unlocked(stats));
}
