import "server-only";
import { Prisma, prisma } from "@pub-montre/db";
import { searchTerms } from "@pub-montre/core";

export type Passage = {
  chunkId: string;
  documentId: string;
  documentTitle: string;
  pageRef: number | null;
  content: string;
  rank: number;
};

/**
 * Recherche plein texte dans les cours de l'étudiant uniquement.
 * Le filtre sur owner_id est appliqué dans la requête : aucun passage d'un autre étudiant ne peut remonter.
 */
export async function searchOwnPassages(userId: string, query: string, limit = 8): Promise<Passage[]> {
  const terms = searchTerms(query);
  if (terms.length === 0) return [];
  const tsquery = terms.join(" | ");

  const rows = await prisma.$queryRaw<Passage[]>(Prisma.sql`
    SELECT c."id" AS "chunkId",
           d."id" AS "documentId",
           d."title" AS "documentTitle",
           c."pageRef",
           c."content",
           ts_rank(to_tsvector('french', c."content"), to_tsquery('french', ${tsquery})) AS "rank"
    FROM "DocumentChunk" c
    JOIN "CourseDocument" d ON d."id" = c."documentId"
    WHERE c."ownerId" = ${userId}
      AND d."ownerId" = ${userId}
      AND to_tsvector('french', c."content") @@ to_tsquery('french', ${tsquery})
    ORDER BY "rank" DESC
    LIMIT ${limit}
  `);
  return rows;
}
