"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@pub-montre/db";
import { buildStudyPlan, dayKey } from "@pub-montre/core";
import { z } from "zod";
import { getCurrentUser } from "@/lib/session";
import { loadConceptRows } from "@/server/learning/queries";

export type PlanFormState = { status: "idle" | "success" | "error"; message?: string };
const TIME_ZONE = "Europe/Paris";

const planSchema = z.object({
  examDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Indique une date d'examen."),
  dailyMinutes: z.coerce.number().int().min(15, "Minimum 15 minutes par jour.").max(360, "Maximum 360 minutes par jour."),
});

/** Crée (ou remplace) le plan de révision à partir des dates et de la maîtrise actuelle. */
export async function createStudyPlanAction(_previous: PlanFormState, formData: FormData): Promise<PlanFormState> {
  const user = await getCurrentUser();

  const parsed = planSchema.safeParse({
    examDate: formData.get("examDate"),
    dailyMinutes: formData.get("dailyMinutes"),
  });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Paramètres invalides." };
  }

  const now = new Date();
  const today = dayKey(now, TIME_ZONE);
  const examDate = new Date(`${parsed.data.examDate}T00:00:00Z`);
  if (Number.isNaN(examDate.getTime()) || parsed.data.examDate <= today) {
    return { status: "error", message: "La date d’examen doit être après aujourd’hui." };
  }

  const rows = await loadConceptRows(user.id);
  const sessions = buildStudyPlan({
    start: new Date(`${today}T00:00:00Z`),
    examDate,
    dailyMinutes: parsed.data.dailyMinutes,
    concepts: rows.map((row) => ({
      id: row.id,
      subjectId: row.subjectId,
      weight: row.weight,
      mastery: row.mastery,
      confidence: row.confidence,
      evidenceCount: row.evidenceCount,
    })),
  });

  await prisma.$transaction(async (tx) => {
    await tx.studyPlan.deleteMany({ where: { userId: user.id } });
    await tx.studyPlan.create({
      data: {
        userId: user.id,
        title: `Préparation de l'examen du ${parsed.data.examDate}`,
        examDate,
        dailyMinutes: parsed.data.dailyMinutes,
        sessions: {
          create: sessions.map((session) => ({
            scheduledFor: new Date(`${session.date}T00:00:00Z`),
            durationMinutes: session.minutes,
            conceptId: session.conceptId,
            activity: session.activity,
          })),
        },
      },
    });
  });

  revalidatePath("/plan");
  return { status: "success", message: `Plan créé : ${sessions.length} sessions jusqu'à l'examen.` };
}

export async function toggleSessionAction(sessionId: string, done: boolean): Promise<void> {
  const user = await getCurrentUser();
  const session = await prisma.studySession.findFirst({
    where: { id: sessionId, plan: { userId: user.id } },
    select: { id: true },
  });
  if (!session) return;
  await prisma.studySession.update({
    where: { id: session.id },
    data: { completedAt: done ? new Date() : null },
  });
  revalidatePath("/plan");
}
