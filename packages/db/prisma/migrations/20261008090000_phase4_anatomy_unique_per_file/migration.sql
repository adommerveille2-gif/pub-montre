-- Une structure est identifiée par son fichier et sa maille, pas par son nom affiché :
-- deux fichiers différents peuvent contenir une maille de même nom.
DROP INDEX IF EXISTS "AnatomyModel_structureKey_name_key";
CREATE UNIQUE INDEX "AnatomyModel_storageKey_structureKey_key" ON "AnatomyModel" ("storageKey", "structureKey");
