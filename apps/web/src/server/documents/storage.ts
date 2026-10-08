import "server-only";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import { dirname, join, resolve, sep } from "node:path";
import { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3";

/**
 * Stockage privé des fichiers.
 * - `local` : disque du serveur (développement uniquement : un hébergeur sans disque persistant l'efface).
 * - `s3` : stockage objet compatible S3 (AWS S3, Cloudflare R2…). Obligatoire en production.
 * Aucun fichier n'est jamais servi directement : toute lecture passe par l'application.
 */
export type StorageDriver = "local" | "s3";

export function storageDriver(): StorageDriver {
  return process.env.STORAGE_DRIVER === "s3" ? "s3" : "local";
}

/** Clé de stockage : cloisonnée par étudiant, nom aléatoire (le nom d'origine n'est jamais utilisé). */
export function newStorageKey(userId: string, extension: string): string {
  if (!/^[a-z0-9]+$/.test(userId)) throw new Error("Identifiant utilisateur invalide.");
  return `users/${userId}/${randomUUID()}.${extension}`;
}

/** Une clé ne peut contenir ni chemin relatif ni caractère de contrôle. */
export function isSafeStorageKey(key: string): boolean {
  return /^[A-Za-z0-9/_.-]{1,300}$/.test(key) && !key.includes("..") && !key.startsWith("/");
}

function localRoot(): string {
  return resolve(process.env.STORAGE_DIR ?? join(process.cwd(), ".data", "storage"));
}

function localPath(key: string): string {
  if (!isSafeStorageKey(key)) throw new Error("Clé de stockage invalide.");
  const root = localRoot();
  const path = resolve(root, key);
  if (!path.startsWith(root + sep)) throw new Error("Clé de stockage invalide.");
  return path;
}

let s3: S3Client | undefined;
function s3Client(): S3Client {
  if (!s3) {
    const endpoint = process.env.S3_ENDPOINT;
    s3 = new S3Client({
      region: process.env.S3_REGION ?? "auto",
      endpoint: endpoint || undefined,
      forcePathStyle: Boolean(endpoint),
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID ?? "",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY ?? "",
      },
    });
  }
  return s3;
}

function bucket(): string {
  const name = process.env.S3_BUCKET;
  if (!name) throw new Error("S3_BUCKET n'est pas défini.");
  return name;
}

export async function writeStoredFile(key: string, bytes: Uint8Array): Promise<void> {
  if (storageDriver() === "s3") {
    await s3Client().send(new PutObjectCommand({ Bucket: bucket(), Key: key, Body: bytes, ContentType: "application/octet-stream" }));
    return;
  }
  const path = localPath(key);
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, bytes);
}

export async function readStoredFile(key: string): Promise<Uint8Array> {
  if (storageDriver() === "s3") {
    const response = await s3Client().send(new GetObjectCommand({ Bucket: bucket(), Key: key }));
    return new Uint8Array(await response.Body!.transformToByteArray());
  }
  return readFile(localPath(key));
}

export async function deleteStoredFile(key: string): Promise<void> {
  if (storageDriver() === "s3") {
    await s3Client().send(new DeleteObjectCommand({ Bucket: bucket(), Key: key }));
    return;
  }
  await rm(localPath(key), { force: true });
}
