import "server-only";
import { Prisma, prisma } from "@pub-montre/db";
import { reciprocalRankFusion, searchTerms } from "@pub-montre/core";
import { embedTexts, isEmbeddingConfigured, toVectorLiteral } from "../ai/embeddings";

export type Passage = {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  pageRef: number | null;
  content: string;
};

const CANDIDATES = 20;

/**
 * Recherche dans les cours de l'étudiant uniquement.
 * - plein texte français, toujours disponible ;
 * - vectorielle (similarité cosinus) si une clé d'embeddings est configurée ;
 * - les deux classements sont fusionnés (RRF). Sans vecteurs, seul le plein texte est utilisé.
 * Le filtre sur le propriétaire est appliqué dans chaque requête SQL.
 */
export async function searchOwnPassages(userId: string, query: string, limit = 8): Promise<Passage[]> {
  const terms = searchTerms(query);
  if (terms.length === 0 && !isEmbeddingConfigured()) return [];

  const lexical = terms.length > 0 ? await lexicalSearch(userId, terms.join(" | "), CANDIDATES) : [];
  const semantic = await semanticSearch(userId, query, CANDIDATES);

  const rankings = [lexical.map((row) => row.chunkId), semantic.map((row) => row.chunkId)];
  const byId = new Map<string, Passage>();
  for (const row of [...lexical, ...semantic]) byId.set(row.chunkId, row);

  return reciprocalRankFusion(rankings, limit)
    .map((id) => byId.get(id))
    .filter((row): row is Passage => row !== undefined);
}

async function lexicalSearch(userId: string, tsquery: string, limit: number): Promise<Passage[]> {
  return prisma.$queryRaw<Passage[]>(Prisma.sql`
    SELECT c."id" AS "chunkId", d."id" AS "documentId", d."title" AS "documentTitle",
           c."pageRef", c."content"
    FROM "DocumentChunk" c
    JOIN "CourseDocument" d ON d."id" = c."documentId"
    WHERE c."ownerId" = ${userId} AND d."ownerId" = ${userId}
      AND to_tsvector('french', c."content") @@ to_tsquery('french', ${tsquery})
    ORDER BY ts_rank(to_tsvector('french', c."content"), to_tsquery('french', ${tsquery})) DESC
    LIMIT ${limit}
  `);
}

async function semanticSearch(userId: string, query: string, limit: number): Promise<Passage[]> {
  if (!isEmbeddingConfigured()) return [];
  let vector: number[];
  try {
    const [embedding] = await embedTexts([query]);
    if (!embedding) return [];
    vector = embedding;
  } catch (error) {
    console.error("[recherche] Embedding de la requête indisponible, plein texte seul", error);
    return [];
  }
  const literal = toVectorLiteral(vector);

  return prisma.$queryRaw<Passage[]>(Prisma.sql`
    SELECT c."id" AS "chunkId", d."id" AS "documentId", d."title" AS "documentTitle",
           c."pageRef", c."content"
    FROM "DocumentChunk" c
    JOIN "CourseDocument" d ON d."id" = c."documentId"
    WHERE c."ownerId" = ${userId} AND d."ownerId" = ${userId} AND c."embedding" IS NOT NULL
    ORDER BY c."embedding" <=> ${literal}::vector
    LIMIT ${limit}
  `);
}
