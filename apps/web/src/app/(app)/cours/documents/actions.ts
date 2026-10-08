"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/session";
import { consumeRate, LIMITS } from "@/server/security/rate-limit";
import { deleteOwnedDocument, importDocument, ImportError } from "@/server/documents/ingest";

export type DocumentFormState = { status: "idle" | "success" | "error"; message?: string };

const titleSchema = z.string().trim().max(120, "120 caractères maximum.");

export async function importDocumentAction(_previous: DocumentFormState, formData: FormData): Promise<DocumentFormState> {
  const user = await getCurrentUser();

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return { status: "error", message: "Choisis un fichier à importer." };
  }
  const rate = await consumeRate(`import:${user.id}`, LIMITS.importPerUser.limit, LIMITS.importPerUser.windowMs);
  if (!rate.allowed) {
    return { status: "error", message: `Trop d'imports récents. Réessaie dans ${Math.ceil(rate.retryAfterSeconds / 60)} min.` };
  }

  const titleParsed = titleSchema.safeParse(String(formData.get("title") ?? ""));
  if (!titleParsed.success) {
    return { status: "error", message: titleParsed.error.issues[0]?.message ?? "Titre invalide." };
  }

  try {
    const bytes = new Uint8Array(await file.arrayBuffer());
    const result = await importDocument({
      userId: user.id,
      title: titleParsed.data,
      filename: file.name.slice(0, 200),
      mimeType: file.type,
      bytes,
    });
    revalidatePath("/cours/documents");
    return result.chunks > 0
      ? { status: "success", message: `Document importé : ${result.chunks} passages indexés.` }
      : { status: "error", message: "Le document est enregistré, mais aucun texte n'a pu être extrait. Voir le détail dans la liste." };
  } catch (error) {
    if (error instanceof ImportError) return { status: "error", message: error.message };
    throw error;
  }
}

const idSchema = z.string().min(1).max(64);

export async function deleteDocumentAction(documentId: string): Promise<void> {
  const user = await getCurrentUser();
  const id = idSchema.parse(documentId);
  await deleteOwnedDocument(user.id, id);
  revalidatePath("/cours/documents");
}
