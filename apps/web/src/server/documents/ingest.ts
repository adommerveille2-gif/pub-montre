import "server-only";
import { prisma } from "@pub-montre/db";
import { chunkSections } from "@pub-montre/core";
import { deleteStoredFile, newStorageKey, writeStoredFile } from "./storage";
import {
  ALLOWED_TYPES,
  ExtractionUnavailableError,
  extractSections,
  matchesSignature,
  MAX_UPLOAD_BYTES,
  type AllowedType,
} from "./extract";

export class ImportError extends Error {}

export async function importDocument(params: {
  userId: string;
  title: string;
  filename: string;
  mimeType: string;
  bytes: Uint8Array;
}) {
  const { userId, title, filename, bytes } = params;

  if (bytes.byteLength === 0) throw new ImportError("Le fichier est vide.");
  if (bytes.byteLength > MAX_UPLOAD_BYTES) throw new ImportError("Fichier trop volumineux (15 Mo maximum).");
  if (!(params.mimeType in ALLOWED_TYPES)) throw new ImportError("Format non pris en charge. Formats acceptés : PDF, DOCX, PPTX, PNG, JPEG.");

  const mimeType = params.mimeType as AllowedType;
  if (!matchesSignature(bytes, mimeType)) {
    throw new ImportError("Le contenu du fichier ne correspond pas à son format.");
  }

  const storageKey = newStorageKey(userId, ALLOWED_TYPES[mimeType].extension);
  await writeStoredFile(storageKey, bytes);

  const document = await prisma.courseDocument.create({
    data: {
      ownerId: userId,
      title: title.trim() || filename,
      filename,
      mimeType,
      sizeBytes: bytes.byteLength,
      storageKey,
      status: "PENDING",
    },
    select: { id: true },
  });

  try {
    const sections = await extractSections(bytes, mimeType);
    const chunks = chunkSections(sections);
    if (chunks.length === 0) {
      throw new ExtractionUnavailableError("Aucun texte exploitable dans ce fichier.");
    }
    await prisma.$transaction([
      prisma.documentChunk.createMany({
        data: chunks.map((chunk) => ({
          documentId: document.id,
          ownerId: userId,
          position: chunk.position,
          pageRef: chunk.pageRef,
          content: chunk.content,
        })),
      }),
      prisma.courseDocument.update({
        where: { id: document.id },
        data: { status: "PROCESSED", errorMessage: null },
      }),
    ]);
    return { id: document.id, chunks: chunks.length };
  } catch (error) {
    const message =
      error instanceof ExtractionUnavailableError
        ? error.message
        : "Le texte n'a pas pu être extrait de ce fichier. Vérifie qu'il n'est pas protégé ou corrompu.";
    if (!(error instanceof ExtractionUnavailableError)) console.error("[documents] Extraction échouée", error);
    await prisma.courseDocument.update({
      where: { id: document.id },
      data: { status: "FAILED", errorMessage: message },
    });
    return { id: document.id, chunks: 0 };
  }
}

/** Supprime un document appartenant à l'utilisateur, avec son fichier et ses fragments. */
export async function deleteOwnedDocument(userId: string, documentId: string): Promise<boolean> {
  const document = await prisma.courseDocument.findFirst({
    where: { id: documentId, ownerId: userId },
    select: { id: true, storageKey: true },
  });
  if (!document) return false;
  await prisma.courseDocument.delete({ where: { id: document.id } });
  await deleteStoredFile(document.storageKey);
  return true;
}
