import "server-only";
import { prisma } from "@pub-montre/db";
import { canRequestHint, caseStatus, nextStepIndex } from "@pub-montre/core";

export class CaseError extends Error {}

type StepRow = { id: string; hints: unknown };

/** Tentative en cours de l'étudiant pour ce cas, avec son avancement. */
export async function loadCaseState(userId: string, caseId: string) {
  const steps = await prisma.clinicalCaseStep.findMany({
    where: { caseId },
    orderBy: { position: "asc" },
    select: {
      id: true,
      stage: true,
      prompt: true,
      reveal: true,
      hints: true,
      concept: { select: { id: true, title: true, chapterId: true } },
    },
  });

  const attempts = await prisma.caseAttempt.findMany({
    where: { userId, caseId },
    orderBy: { startedAt: "desc" },
    take: 5,
    select: {
      id: true,
      finishedAt: true,
      steps: { select: { stepId: true, hintsUsed: true, revealedAt: true } },
    },
  });

  // Tentative en cours, sinon la dernière terminée (affichée en bilan jusqu'à un nouveau départ).
  const current = attempts.find((attempt) => !attempt.finishedAt) ?? null;
  const shown = current ?? attempts[0] ?? null;
  const revealedIds = new Set(shown?.steps.filter((s) => s.revealedAt).map((s) => s.stepId) ?? []);
  const next = nextStepIndex(revealedIds.size, steps.length);
  const pendingStep = next === null ? null : steps[next]?.id ?? null;

  return {
    steps: steps.map((step) => ({
      ...step,
      hints: Array.isArray(step.hints) ? (step.hints as string[]) : [],
    })),
    attemptId: current?.id ?? null,
    status: shown?.finishedAt ? ("FINISHED" as const) : caseStatus(revealedIds.size, steps.length),
    revealedIds: [...revealedIds],
    hintsUsed: Object.fromEntries((shown?.steps ?? []).map((s) => [s.stepId, s.hintsUsed])),
    currentStepId: shown?.finishedAt ? null : current ? pendingStep : steps[0]?.id ?? null,
    completedAttempts: attempts.filter((attempt) => attempt.finishedAt).length,
  };
}

/** Démarre une tentative, ou reprend celle en cours. */
export async function startOrResumeAttempt(userId: string, caseId: string): Promise<string> {
  const existing = await prisma.caseAttempt.findFirst({
    where: { userId, caseId, finishedAt: null },
    select: { id: true },
  });
  if (existing) return existing.id;
  const created = await prisma.caseAttempt.create({ data: { userId, caseId }, select: { id: true } });
  return created.id;
}

/** Vérifie que la tentative appartient à l'étudiant, est en cours, et que l'étape visée est la prochaine. */
async function currentStepFor(userId: string, attemptId: string, stepId: string) {
  const attempt = await prisma.caseAttempt.findFirst({
    where: { id: attemptId, userId },
    select: {
      id: true,
      finishedAt: true,
      caseId: true,
      steps: { select: { stepId: true, revealedAt: true } },
    },
  });
  if (!attempt) throw new CaseError("Tentative introuvable.");
  if (attempt.finishedAt) throw new CaseError("Ce cas est terminé.");

  const steps: StepRow[] = await prisma.clinicalCaseStep.findMany({
    where: { caseId: attempt.caseId },
    orderBy: { position: "asc" },
    select: { id: true, hints: true },
  });
  const revealed = attempt.steps.filter((s) => s.revealedAt).length;
  const index = nextStepIndex(revealed, steps.length);
  if (index === null || steps[index]?.id !== stepId) throw new CaseError("Cette étape n'est pas la prochaine.");
  return { attempt, step: steps[index]!, total: steps.length, revealed };
}

export async function requestHint(userId: string, attemptId: string, stepId: string): Promise<void> {
  const { step } = await currentStepFor(userId, attemptId, stepId);
  const hints = Array.isArray(step.hints) ? (step.hints as string[]) : [];
  const existing = await prisma.caseAttemptStep.findUnique({
    where: { attemptId_stepId: { attemptId, stepId } },
  });
  const used = existing?.hintsUsed ?? 0;
  if (!canRequestHint(used, hints.length)) throw new CaseError("Plus d'indice pour cette étape.");

  await prisma.caseAttemptStep.upsert({
    where: { attemptId_stepId: { attemptId, stepId } },
    create: { attemptId, stepId, hintsUsed: 1 },
    update: { hintsUsed: { increment: 1 } },
  });
}

/** Révèle la réponse attendue de l'étape courante. Révéler la dernière étape termine le cas. */
export async function revealCurrentStep(userId: string, attemptId: string, stepId: string): Promise<void> {
  const { total, revealed } = await currentStepFor(userId, attemptId, stepId);
  const now = new Date();
  await prisma.caseAttemptStep.upsert({
    where: { attemptId_stepId: { attemptId, stepId } },
    create: { attemptId, stepId, revealedAt: now },
    update: { revealedAt: now },
  });
  if (revealed + 1 >= total) {
    await prisma.caseAttempt.update({ where: { id: attemptId }, data: { finishedAt: now } });
  }
}
