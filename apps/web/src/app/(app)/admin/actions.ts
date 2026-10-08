"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@pub-montre/db";
import { validateQcm } from "@pub-montre/core";
import { z } from "zod";
import { authorize } from "@/server/admin/guard";
import { recordAudit } from "@/server/admin/audit";

export type AdminState = { status: "idle" | "success" | "error"; message?: string };
const ok = (message: string): AdminState => ({ status: "success", message });
const fail = (message: string): AdminState => ({ status: "error", message });

const text = (max: number) => z.string().trim().min(1, "Champ obligatoire.").max(max, `${max} caractères maximum.`);
const id = z.string().min(1).max(64);

function slugify(value: string): string {
  return value.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function firstError(error: z.ZodError): string {
  return error.issues[0]?.message ?? "Données invalides.";
}

export async function createSubjectAction(_previous: AdminState, formData: FormData): Promise<AdminState> {
  const user = await authorize("taxonomy:edit");
  const parsed = z.object({ name: text(120), description: z.string().trim().max(500).optional() }).safeParse({
    name: formData.get("name"),
    description: formData.get("description") || undefined,
  });
  if (!parsed.success) return fail(firstError(parsed.error));
  try {
    const subject = await prisma.subject.create({
      data: { name: parsed.data.name, slug: slugify(parsed.data.name), description: parsed.data.description ?? null },
    });
    await recordAudit({ actorId: user.id, action: "subject.create", entityType: "Subject", entityId: subject.id });
  } catch {
    return fail("Cette matière existe déjà.");
  }
  revalidatePath("/admin/taxonomie");
  return ok("Matière créée.");
}

export async function linkSubjectYearAction(_previous: AdminState, formData: FormData): Promise<AdminState> {
  const user = await authorize("taxonomy:edit");
  const parsed = z.object({ academicYearId: id, subjectId: id }).safeParse({
    academicYearId: formData.get("academicYearId"),
    subjectId: formData.get("subjectId"),
  });
  if (!parsed.success) return fail(firstError(parsed.error));
  const link = await prisma.subjectYear.upsert({
    where: { academicYearId_subjectId: parsed.data },
    update: {},
    create: parsed.data,
  });
  await recordAudit({ actorId: user.id, action: "subjectYear.link", entityType: "SubjectYear", entityId: link.id });
  revalidatePath("/admin/taxonomie");
  return ok("Matière rattachée à l'année.");
}

export async function createChapterAction(_previous: AdminState, formData: FormData): Promise<AdminState> {
  const user = await authorize("taxonomy:edit");
  const parsed = z.object({ subjectYearId: id, title: text(160) }).safeParse({
    subjectYearId: formData.get("subjectYearId"),
    title: formData.get("title"),
  });
  if (!parsed.success) return fail(firstError(parsed.error));
  const chapter = await prisma.chapter.create({ data: { ...parsed.data, status: "DRAFT" } });
  await recordAudit({ actorId: user.id, action: "chapter.create", entityType: "Chapter", entityId: chapter.id });
  revalidatePath("/admin/taxonomie");
  return ok("Chapitre créé en brouillon.");
}

export async function createConceptAction(_previous: AdminState, formData: FormData): Promise<AdminState> {
  const user = await authorize("taxonomy:edit");
  const parsed = z.object({
    chapterId: id,
    title: text(200),
    weight: z.coerce.number().min(0.1, "Poids minimum 0,1.").max(5, "Poids maximum 5."),
  }).safeParse({ chapterId: formData.get("chapterId"), title: formData.get("title"), weight: formData.get("weight") });
  if (!parsed.success) return fail(firstError(parsed.error));
  const concept = await prisma.concept.create({ data: { ...parsed.data, status: "DRAFT" } });
  await recordAudit({ actorId: user.id, action: "concept.create", entityType: "Concept", entityId: concept.id });
  revalidatePath("/admin/taxonomie");
  return ok("Notion créée en brouillon.");
}

/** Publie ou retire un chapitre : seul un chapitre validé est visible des étudiants. */
export async function setChapterStatusAction(_previous: AdminState, formData: FormData): Promise<AdminState> {
  const user = await authorize("taxonomy:edit");
  const parsed = z.object({ chapterId: id, status: z.enum(["DRAFT", "VALIDATED"]) }).safeParse({
    chapterId: formData.get("chapterId"),
    status: formData.get("status"),
  });
  if (!parsed.success) return fail(firstError(parsed.error));
  await prisma.chapter.update({ where: { id: parsed.data.chapterId }, data: { status: parsed.data.status } });
  await recordAudit({
    actorId: user.id,
    action: "chapter.status",
    entityType: "Chapter",
    entityId: parsed.data.chapterId,
    metadata: { status: parsed.data.status },
  });
  revalidatePath("/admin/taxonomie");
  return ok(parsed.data.status === "VALIDATED" ? "Chapitre publié." : "Chapitre retiré de la publication.");
}

export async function createQuestionAction(_previous: AdminState, formData: FormData): Promise<AdminState> {
  const user = await authorize("content:edit");
  const parsed = z.object({
    chapterId: id,
    conceptId: z.string().max(64).optional(),
    difficulty: z.enum(["EASY", "MEDIUM", "HARD", "EXPERT"]),
    statement: text(1000),
    explanation: text(2000),
    pitfall: z.string().trim().max(500).optional(),
    memoryTip: z.string().trim().max(300).optional(),
  }).safeParse({
    chapterId: formData.get("chapterId"),
    conceptId: formData.get("conceptId") || undefined,
    difficulty: formData.get("difficulty"),
    statement: formData.get("statement"),
    explanation: formData.get("explanation"),
    pitfall: formData.get("pitfall") || undefined,
    memoryTip: formData.get("memoryTip") || undefined,
  });
  if (!parsed.success) return fail(firstError(parsed.error));

  const options = [0, 1, 2, 3, 4, 5]
    .map((index) => ({ text: String(formData.get(`option_${index}`) ?? ""), isCorrect: formData.get(`correct_${index}`) === "on" }))
    .filter((option) => option.text.trim() !== "" || option.isCorrect);
  const problem = validateQcm(options);
  if (problem) return fail(problem);

  const question = await prisma.question.create({
    data: {
      chapterId: parsed.data.chapterId,
      type: "QCM",
      difficulty: parsed.data.difficulty,
      statement: parsed.data.statement,
      explanation: parsed.data.explanation,
      pitfall: parsed.data.pitfall ?? null,
      memoryTip: parsed.data.memoryTip ?? null,
      status: "DRAFT",
      createdById: user.id,
      options: { create: options.map((option, position) => ({ ...option, text: option.text.trim(), position })) },
      ...(parsed.data.conceptId ? { concepts: { create: [{ conceptId: parsed.data.conceptId }] } } : {}),
    },
    select: { id: true },
  });
  await recordAudit({ actorId: user.id, action: "question.create", entityType: "Question", entityId: question.id });
  revalidatePath("/admin/questions");
  return ok("Question enregistrée. Elle attend une validation avant d'être visible.");
}

/** Relecture : valider ou rejeter un contenu rédigé par l'équipe. Un contenu rejeté ne sort jamais. */
export async function reviewQuestionAction(_previous: AdminState, formData: FormData): Promise<AdminState> {
  const user = await authorize("content:review");
  const parsed = z.object({ questionId: id, decision: z.enum(["VALIDATED", "REJECTED"]) }).safeParse({
    questionId: formData.get("questionId"),
    decision: formData.get("decision"),
  });
  if (!parsed.success) return fail(firstError(parsed.error));
  await prisma.question.update({ where: { id: parsed.data.questionId }, data: { status: parsed.data.decision } });
  await recordAudit({
    actorId: user.id,
    action: "question.review",
    entityType: "Question",
    entityId: parsed.data.questionId,
    metadata: { decision: parsed.data.decision },
  });
  revalidatePath("/admin/questions");
  return ok(parsed.data.decision === "VALIDATED" ? "Question validée." : "Question rejetée.");
}

/** Changement de rôle : réservé à l'administrateur, et jamais sur son propre compte. */
export async function setRoleAction(_previous: AdminState, formData: FormData): Promise<AdminState> {
  const user = await authorize("users:manage");
  const parsed = z.object({ userId: id, role: z.enum(["STUDENT", "CONTENT_REVIEWER", "ADMIN"]) }).safeParse({
    userId: formData.get("userId"),
    role: formData.get("role"),
  });
  if (!parsed.success) return fail(firstError(parsed.error));
  if (parsed.data.userId === user.id) return fail("Tu ne peux pas modifier ton propre rôle.");
  await prisma.user.update({ where: { id: parsed.data.userId }, data: { role: parsed.data.role } });
  await recordAudit({
    actorId: user.id,
    action: "user.role",
    entityType: "User",
    entityId: parsed.data.userId,
    metadata: { role: parsed.data.role },
  });
  revalidatePath("/admin/utilisateurs");
  return ok("Rôle mis à jour.");
}
