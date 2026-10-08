-- This is an empty migration.
-- Recherche plein texte en français dans les fragments de cours (filtrée ensuite par propriétaire).
CREATE INDEX "DocumentChunk_content_fts_idx" ON "DocumentChunk" USING GIN (to_tsvector('french', "content"));
