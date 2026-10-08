import "server-only";

/** Dimension attendue : doit correspondre à la colonne `vector(1536)` de la base. */
export const EMBEDDING_DIMENSIONS = 1536;
const DEFAULT_MODEL = "text-embedding-3-small";
const MAX_BATCH = 64;

export class EmbeddingError extends Error {}

export function isEmbeddingConfigured(): boolean {
  return Boolean(process.env.OPENAI_API_KEY);
}

/**
 * Calcule les embeddings d'un lot de textes (fournisseur : API OpenAI).
 * Lève EmbeddingError si la clé manque, si l'API échoue, ou si la dimension ne correspond pas.
 */
export async function embedTexts(texts: readonly string[], fetchImpl: typeof fetch = fetch): Promise<number[][]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new EmbeddingError("OPENAI_API_KEY n'est pas défini.");
  if (texts.length === 0) return [];

  const vectors: number[][] = [];
  for (let start = 0; start < texts.length; start += MAX_BATCH) {
    const batch = texts.slice(start, start + MAX_BATCH);
    const response = await fetchImpl(`${process.env.OPENAI_BASE_URL ?? "https://api.openai.com/v1"}/embeddings`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ model: process.env.EMBEDDING_MODEL ?? DEFAULT_MODEL, input: batch }),
    });
    if (!response.ok) {
      throw new EmbeddingError(`Le service d'embeddings a répondu ${response.status}.`);
    }
    const payload = (await response.json()) as { data?: { embedding: number[]; index: number }[] };
    const data = [...(payload.data ?? [])].sort((a, b) => a.index - b.index);
    if (data.length !== batch.length) throw new EmbeddingError("Réponse d'embeddings incomplète.");
    for (const item of data) {
      if (item.embedding.length !== EMBEDDING_DIMENSIONS) {
        throw new EmbeddingError(`Dimension inattendue : ${item.embedding.length} au lieu de ${EMBEDDING_DIMENSIONS}.`);
      }
      vectors.push(item.embedding);
    }
  }
  return vectors;
}

/** Littéral vectoriel pour pgvector, ex. « [0.1,0.2] ». */
export function toVectorLiteral(vector: readonly number[]): string {
  return `[${vector.map((value) => (Number.isFinite(value) ? value : 0)).join(",")}]`;
}
