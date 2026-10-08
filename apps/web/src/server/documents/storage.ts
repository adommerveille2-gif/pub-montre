import "server-only";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { dirname, join, resolve, sep } from "node:path";

/** Dossier de stockage privé, jamais servi directement par le serveur web. */
function storageRoot(): string {
  return resolve(process.env.STORAGE_DIR ?? join(process.cwd(), ".data", "storage"));
}

/** Clé de stockage : cloisonnée par étudiant, nom aléatoire (le nom d'origine n'est jamais utilisé sur le disque). */
export function newStorageKey(userId: string, extension: string): string {
  if (!/^[a-z0-9]+$/.test(userId)) throw new Error("Identifiant utilisateur invalide.");
  return `users/${userId}/${randomUUID()}.${extension}`;
}

/** Résout une clé en chemin absolu, en refusant toute sortie du dossier de stockage. */
function resolveKey(key: string): string {
  const root = storageRoot();
  const path = resolve(root, key);
  if (!path.startsWith(root + sep)) throw new Error("Clé de stockage invalide.");
  return path;
}

export async function writeStoredFile(key: string, bytes: Uint8Array): Promise<void> {
  const path = resolveKey(key);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, bytes);
}

export async function readStoredFile(key: string): Promise<Uint8Array> {
  return readFile(resolveKey(key));
}

export async function deleteStoredFile(key: string): Promise<void> {
  await rm(resolveKey(key), { force: true });
}
