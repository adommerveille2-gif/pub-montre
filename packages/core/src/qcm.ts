/** Règles de forme d'une question à choix multiples, appliquées avant tout enregistrement. */

export const MIN_OPTIONS = 2;
export const MAX_OPTIONS = 6;

export type DraftOption = { text: string; isCorrect: boolean };

export function validateQcm(options: readonly DraftOption[]): string | null {
  const filled = options.filter((option) => option.text.trim().length > 0);
  if (filled.length !== options.length) return "Chaque proposition doit être renseignée.";
  if (options.length < MIN_OPTIONS) return `Il faut au moins ${MIN_OPTIONS} propositions.`;
  if (options.length > MAX_OPTIONS) return `Pas plus de ${MAX_OPTIONS} propositions.`;
  if (!options.some((option) => option.isCorrect)) return "Au moins une proposition doit être correcte.";
  if (options.every((option) => option.isCorrect)) return "Toutes les propositions ne peuvent pas être correctes.";
  const texts = new Set(options.map((option) => option.text.trim().toLowerCase()));
  if (texts.size !== options.length) return "Deux propositions sont identiques.";
  return null;
}
