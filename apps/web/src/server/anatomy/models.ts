import "server-only";
import { randomUUID } from "node:crypto";
import { prisma } from "@pub-montre/db";
import { isGlbBuffer, isValidMeshName } from "@pub-montre/core";
import { readStoredFile, writeStoredFile } from "@/server/documents/storage";

export const MAX_GLB_BYTES = 50 * 1024 * 1024;

export class AnatomyError extends Error {}


export type StructureSpec = { meshName: string; name: string; description: string };

/** Lit « meshName | Nom affiché | Description », une structure par ligne. */
export function parseStructureLines(text: string): StructureSpec[] {
  const lines = text.split("\n").map((line) => line.trim()).filter(Boolean);
  return lines.map((line) => {
    const [meshName = "", name = "", ...rest] = line.split("|").map((part) => part.trim());
    if (!isValidMeshName(meshName)) throw new AnatomyError(`Nom de maille invalide : « ${meshName} ».`);
    if (!name) throw new AnatomyError(`Nom affiché manquant pour « ${meshName} ».`);
    return { meshName, name, description: rest.join(" | ") };
  });
}

/** Enregistre un fichier GLB et une entrée par structure, en brouillon. */
export async function importAnatomyFile(params: {
  bytes: Uint8Array;
  license: string;
  sourceName: string;
  structures: StructureSpec[];
  conceptId?: string | null;
}) {
  if (params.bytes.byteLength === 0 || params.bytes.byteLength > MAX_GLB_BYTES) {
    throw new AnatomyError("Fichier vide ou trop volumineux (50 Mo maximum).");
  }
  if (!isGlbBuffer(params.bytes)) throw new AnatomyError("Le fichier n'est pas un GLB valide.");
  if (params.structures.length === 0) throw new AnatomyError("Indique au moins une structure.");
  if (!params.license.trim() || !params.sourceName.trim()) {
    throw new AnatomyError("La licence et la source sont obligatoires : un modèle sans licence ne peut pas être publié.");
  }

  const storageKey = `curated/anatomy/${randomUUID()}.glb`;
  await writeStoredFile(storageKey, params.bytes);
  await prisma.anatomyModel.createMany({
    data: params.structures.map((structure) => ({
      name: structure.name,
      description: structure.description || null,
      structureKey: structure.meshName,
      storageKey,
      license: params.license.trim(),
      sourceName: params.sourceName.trim(),
      conceptId: params.conceptId ?? null,
      status: "DRAFT",
    })),
  });
  return storageKey;
}

/** Structures publiées, groupées par fichier : une seule lecture du fichier par groupe côté visionneuse. */
export async function loadPublishedAnatomy() {
  const rows = await prisma.anatomyModel.findMany({
    where: { status: "VALIDATED", storageKey: { not: null } },
    orderBy: { name: "asc" },
    select: { id: true, name: true, description: true, structureKey: true, storageKey: true, license: true, sourceName: true },
  });
  const groups = new Map<string, { fileId: string; license: string; sourceName: string; structures: { id: string; name: string; description: string | null; meshName: string }[] }>();
  for (const row of rows) {
    const key = row.storageKey!;
    const group = groups.get(key) ?? { fileId: row.id, license: row.license, sourceName: row.sourceName, structures: [] };
    group.structures.push({ id: row.id, name: row.name, description: row.description, meshName: row.structureKey });
    groups.set(key, group);
  }
  return [...groups.values()];
}

/** Octets d'un modèle publié. Un modèle non validé n'est jamais servi. */
export async function readPublishedFile(id: string): Promise<Uint8Array | null> {
  const row = await prisma.anatomyModel.findFirst({
    where: { id, status: "VALIDATED", storageKey: { not: null } },
    select: { storageKey: true },
  });
  if (!row?.storageKey) return null;
  return readStoredFile(row.storageKey);
}
