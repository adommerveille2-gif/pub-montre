"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@pub-montre/db";
import { z } from "zod";
import { askTutor, buildTutorSystemPrompt, isTutorConfigured, TutorNotConfiguredError } from "@/server/ai/tutor";
import { getCurrentUser } from "@/lib/session";

export type TutorFormState = { status: "idle" | "error"; message?: string };

const MAX_HISTORY = 20;

const messageSchema = z.object({
  content: z.string().trim().min(1, "Écris ta question.").max(2000, "2000 caractères maximum."),
});

export async function sendTutorMessageAction(_previous: TutorFormState, formData: FormData): Promise<TutorFormState> {
  const user = await getCurrentUser();

  if (!isTutorConfigured()) {
    return { status: "error", message: "Le tuteur IA n'est pas encore connecté." };
  }

  const parsed = messageSchema.safeParse({ content: formData.get("content") ?? "" });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Message invalide." };
  }

  // Une seule conversation active par étudiant pour le moment.
  const conversation =
    (await prisma.conversation.findFirst({ where: { userId: user.id }, orderBy: { updatedAt: "desc" }, select: { id: true } })) ??
    (await prisma.conversation.create({ data: { userId: user.id, title: "Mon tuteur" }, select: { id: true } }));

  await prisma.message.create({
    data: { conversationId: conversation.id, role: "USER", content: parsed.data.content },
  });

  const history = await prisma.message.findMany({
    where: { conversationId: conversation.id },
    orderBy: { createdAt: "desc" },
    take: MAX_HISTORY,
    select: { role: true, content: true },
  });
  const turns = history
    .reverse()
    .filter((message) => message.role === "USER" || message.role === "ASSISTANT")
    .map((message) => ({
      role: message.role === "USER" ? ("user" as const) : ("assistant" as const),
      content: message.content,
    }));

  const system = buildTutorSystemPrompt({
    firstName: user.profile?.firstName,
    yearName: user.profile?.academicYear?.name,
    goal: user.profile?.goal,
  });

  try {
    const reply = await askTutor({ userId: user.id, system, turns });
    await prisma.message.create({
      data: { conversationId: conversation.id, role: "ASSISTANT", content: reply || "Je n'ai pas de réponse à donner pour le moment." },
    });
    await prisma.conversation.update({ where: { id: conversation.id }, data: { updatedAt: new Date() } });
  } catch (error) {
    if (error instanceof TutorNotConfiguredError) {
      return { status: "error", message: error.message };
    }
    console.error("[tuteur] Échec de l'appel au modèle", error);
    return { status: "error", message: "Le tuteur n'a pas pu répondre. Réessaie dans un instant." };
  }

  revalidatePath("/tuteur");
  return { status: "idle" };
}
