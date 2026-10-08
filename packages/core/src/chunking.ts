/**
 * Découpe un texte en fragments de taille contrôlée, avec recouvrement, en conservant
 * la position de page ou de diapositive quand elle est connue.
 */

export type TextSection = { text: string; pageRef: number | null };

export type Chunk = { position: number; content: string; pageRef: number | null };

export const CHUNK_WORDS = 350;
export const CHUNK_OVERLAP_WORDS = 50;

/** Découpe chaque section en fragments de `size` mots, avec `overlap` mots en commun entre deux fragments. */
export function chunkSections(
  sections: readonly TextSection[],
  size = CHUNK_WORDS,
  overlap = CHUNK_OVERLAP_WORDS,
): Chunk[] {
  if (overlap >= size) throw new Error("Le recouvrement doit être inférieur à la taille du fragment.");

  const chunks: Chunk[] = [];
  for (const section of sections) {
    const words = section.text.replace(/\s+/g, " ").trim().split(" ").filter(Boolean);
    if (words.length === 0) continue;

    const step = size - overlap;
    for (let start = 0; start < words.length; start += step) {
      const slice = words.slice(start, start + size);
      chunks.push({
        position: chunks.length,
        content: slice.join(" "),
        pageRef: section.pageRef,
      });
      if (start + size >= words.length) break;
    }
  }
  return chunks;
}

const STOPWORDS = new Set(["le", "la", "les", "de", "des", "du", "un", "une", "et", "ou", "en", "au", "aux", "à", "a", "est", "que", "qui", "dans", "sur", "pour", "par", "pas", "ne", "se", "ce", "il", "elle"]);

/** Termes de recherche : mots significatifs de la requête (sans accents ni mots vides). */
export function searchTerms(query: string): string[] {
  return query
    .toLowerCase()
    .replace(/œ/g, "oe")
    .replace(/æ/g, "ae")
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((term) => term.length > 1 && !STOPWORDS.has(term));
}
