/**
 * Règles de progression d'un cas clinique. Les étapes se révèlent dans l'ordre, une à une.
 */

export type CaseStatus = "NOT_STARTED" | "IN_PROGRESS" | "FINISHED";

/** Index (0-based) de la prochaine étape à révéler, ou null si le cas est terminé. */
export function nextStepIndex(revealedCount: number, totalSteps: number): number | null {
  if (totalSteps <= 0) return null;
  return revealedCount < totalSteps ? revealedCount : null;
}

export function caseStatus(revealedCount: number, totalSteps: number): CaseStatus {
  if (revealedCount <= 0) return "NOT_STARTED";
  return revealedCount >= totalSteps ? "FINISHED" : "IN_PROGRESS";
}

/** Un indice ne peut être demandé qu'une fois par indice disponible, et seulement sur l'étape en cours. */
export function canRequestHint(hintsUsed: number, hintsAvailable: number): boolean {
  return hintsUsed < hintsAvailable;
}
