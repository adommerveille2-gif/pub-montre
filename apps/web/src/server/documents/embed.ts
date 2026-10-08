import "server-only";
import { Prisma, prisma } from "@pub-montre/db";
import { embedTexts, isEmbeddingConfigured, toVectorLiteral } from "../ai/embeddings";

/**
 * Calcule et enregistre les embeddings des fragments sans vecteur (un document, ou tous si `documentId` est absent).
 * Sans clé API : ne fait rien. Les erreurs ne bloquent jamais l'import : la recherche plein texte reste disponible.
 */
export async function embedMissingChunks(options: { documentId?: string } = {}): Promise<number> {
  if (!isEmbeddingConfigured()) return 0;

  const rows = await prisma.$queryRaw<{ id: string; content: string }[]>(
    options.documentId
      ? Prisma.sql`SELECT "id", "content" FROM "DocumentChunk" WHERE "embedding" IS NULL AND "documentId" = ${options.documentId} ORDER BY "documentId", "position" LIMIT 500`
      : Prisma.sql`SELECT "id", "content" FROM "DocumentChunk" WHERE "embedding" IS NULL ORDER BY "createdAt" LIMIT 500`,
  );
  if (rows.length === 0) return 0;

  const vectors = await embedTexts(rows.map((row) => row.content));
  for (const [index, row] of rows.entries()) {
    const vector = vectors[index];
    if (!vector) continue;
    await prisma.$executeRaw`UPDATE "DocumentChunk" SET "embedding" = ${toVectorLiteral(vector)}::vector WHERE "id" = ${row.id}`;
  }
  return rows.length;
}
