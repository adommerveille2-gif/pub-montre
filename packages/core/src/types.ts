/** Types purs du moteur : aucune dépendance à Prisma ni à React. */

export type Difficulty = "EASY" | "MEDIUM" | "HARD" | "EXPERT";

/** Une preuve d'apprentissage. `score` vaut 0 (échec) à 1 (réussite). */
export type Evidence = {
  score: number;
  difficulty: Difficulty;
  occurredAt: Date;
};

/** Estimation de la maîtrise d'une notion. */
export type MasteryEstimate = {
  /** Entre 0 et 1. */
  mastery: number;
  /** Entre 0 et 1 : fiabilité de l'estimation, croît avec les preuves. */
  confidence: number;
  evidenceCount: number;
};

export type PlanStepKind = "EXPLAIN" | "QUIZ_EASY" | "QUIZ_MEDIUM" | "CASE" | "REVIEW_LATER";
