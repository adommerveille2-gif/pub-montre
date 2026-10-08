-- Extension pgvector (idempotente) : nécessaire à la base de comparaison de Prisma.
CREATE EXTENSION IF NOT EXISTS vector;

-- AlterTable
ALTER TABLE "DocumentChunk" ADD COLUMN     "embedding" vector(1536);

-- Index vectoriel HNSW (similarité cosinus) pour la recherche sémantique dans les cours.
CREATE INDEX "DocumentChunk_embedding_hnsw_idx" ON "DocumentChunk" USING hnsw ("embedding" vector_cosine_ops);
