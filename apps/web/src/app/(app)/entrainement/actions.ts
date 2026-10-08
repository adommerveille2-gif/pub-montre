"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { type Difficulty } from "@pub-montre/db";
import { answerQuizItem, QuizError, startTrainingQuiz } from "@/server/learning/quiz";
import { getCurrentUser } from "@/lib/session";

export type FormState = { status: "idle" | "error"; message?: string };

const DIFFICULTIES = ["EASY", "MEDIUM", "HARD", "EXPERT"] as const;
const COUNTS = [5, 10, 20] as const;

const setupSchema = z.object({
  chapterId: z.string().max(64).optional(),
  difficulty: z.enum(DIFFICULTIES).optional(),
  count: z.coerce.number().refine((value) => (COUNTS as readonly number[]).includes(value), "Nombre de questions non valide."),
});

function optional(value: FormDataEntryValue | null): string | undefined {
  const text = typeof value === "string" ? value.trim() : "";
  return text === "" ? undefined : text;
}

export async function startQuizAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();

  const parsed = setupSchema.safeParse({
    chapterId: optional(formData.get("chapterId")),
    difficulty: optional(formData.get("difficulty")),
    count: formData.get("count"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Paramètres invalides." };
  }

  let quizId: string;
  try {
    const quiz = await startTrainingQuiz(user.id, {
      chapterId: parsed.data.chapterId,
      difficulty: parsed.data.difficulty as Difficulty | undefined,
      count: parsed.data.count,
    });
    quizId = quiz.id;
  } catch (error) {
    if (error instanceof QuizError) return { status: "error", message: error.message };
    throw error;
  }

  revalidatePath("/dashboard");
  redirect(`/entrainement/${quizId}`);
}

const answerSchema = z.object({
  quizId: z.string().min(1).max(64),
  questionId: z.string().min(1).max(64),
  position: z.coerce.number().int().min(1).max(100),
  shownAt: z.coerce.number().int().nonnegative(),
  options: z.array(z.string().min(1).max(64)).min(1, "Sélectionne au moins une réponse."),
});

/** Réponse à une question : la correction s'affiche ensuite sur la même page. */
export async function answerQuestionAction(_previous: FormState, formData: FormData): Promise<FormState> {
  const user = await getCurrentUser();

  const parsed = answerSchema.safeParse({
    quizId: formData.get("quizId"),
    questionId: formData.get("questionId"),
    position: formData.get("position"),
    shownAt: formData.get("shownAt"),
    options: formData.getAll("option"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Réponse invalide." };
  }

  const now = new Date();
  // Temps de réponse borné : une question laissée ouverte une heure n'est pas un temps de réflexion.
  const responseTimeMs =
    parsed.data.shownAt > 0 ? Math.min(Math.max(0, now.getTime() - parsed.data.shownAt), 60 * 60 * 1000) : null;

  try {
    await answerQuizItem({
      userId: user.id,
      quizId: parsed.data.quizId,
      questionId: parsed.data.questionId,
      selectedOptionIds: parsed.data.options,
      responseTimeMs,
      now,
    });
  } catch (error) {
    if (error instanceof QuizError) return { status: "error", message: error.message };
    throw error;
  }

  revalidatePath("/dashboard");
  revalidatePath("/niveau-reel");
  revalidatePath("/progression");
  redirect(`/entrainement/${parsed.data.quizId}?item=${parsed.data.position}`);
}
