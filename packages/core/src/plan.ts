import type { PlanStepKind } from "./types.ts";

export type PlanStep = {
  kind: PlanStepKind;
  label: string;
};

export type ConceptState = {
  mastery: number;
  confidence: number;
  evidenceCount: number;
};

/**
 * Parcours recommandé pour une notion. Règles explicites et testées,
 * le LLM (phase 2) ne fera que les formuler.
 */
export function buildPlan(state: ConceptState): PlanStep[] {
  if (state.evidenceCount === 0) {
    return [
      { kind: "EXPLAIN", label: "Lire le cours (15 min)" },
      { kind: "QUIZ_EASY", label: "5 questions faciles" },
    ];
  }
  if (state.mastery < 0.5) {
    return [
      { kind: "EXPLAIN", label: "Revoir le cours (15 min)" },
      { kind: "QUIZ_EASY", label: "5 questions faciles" },
      { kind: "QUIZ_MEDIUM", label: "5 questions intermédiaires" },
      { kind: "CASE", label: "Un cas clinique" },
      { kind: "REVIEW_LATER", label: "Revoir dans 48 h" },
    ];
  }
  if (state.mastery < 0.8) {
    return [
      { kind: "QUIZ_MEDIUM", label: "5 questions intermédiaires" },
      { kind: "CASE", label: "Un cas clinique" },
      { kind: "REVIEW_LATER", label: "Revoir dans 3 jours" },
    ];
  }
  return [{ kind: "REVIEW_LATER", label: "Revoir dans 7 jours" }];
}

/** Plus la valeur est haute, plus la notion doit être travaillée en premier. */
export function priorityScore(state: ConceptState, weight: number): number {
  if (state.evidenceCount === 0) return 0.5 * weight;
  return (1 - state.mastery) * weight * (0.5 + 0.5 * state.confidence);
}

/** Phrase de diagnostic lisible par l'étudiant. */
export function describeState(title: string, state: ConceptState): string {
  if (state.evidenceCount === 0) {
    return `Tu n'as pas encore travaillé « ${title} ».`;
  }
  if (state.mastery < 0.5) {
    return `Tu rencontres des difficultés sur « ${title} ».`;
  }
  if (state.mastery < 0.8) {
    return `Tu progresses sur « ${title} », il reste à consolider.`;
  }
  return `Tu maîtrises bien « ${title} ».`;
}
