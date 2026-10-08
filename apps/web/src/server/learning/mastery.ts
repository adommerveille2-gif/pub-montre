import "server-only";
import { prisma } from "@pub-montre/db";
import {
  addDays,
  estimateMastery,
  levelFromEstimate,
  nextReviewInDays,
  type Evidence,
} from "@pub-montre/core";

/**
 * Recalcule la maîtrise d'une notion à partir de toutes ses preuves.
 * Le résultat ne dépend que des événements : il peut être recalculé à tout moment.
 */
export async function refreshConceptState(userId: string, conceptId: string, now: Date) {
  const events = await prisma.learningEvent.findMany({
    where: { userId, conceptId },
    orderBy: { occurredAt: "asc" },
    select: { score: true, difficulty: true, occurredAt: true },
  });

  const evidence: Evidence[] = events.map((event) => ({
    score: event.score,
    difficulty: event.difficulty ?? "MEDIUM",
    occurredAt: event.occurredAt,
  }));

  const estimate = estimateMastery(evidence, now);
  const level = levelFromEstimate(estimate);
  const lastScore = events.at(-1)?.score ?? 0;
  const lapses = events.filter((event) => event.score < 0.5).length;
  const dueAt = addDays(now, nextReviewInDays(level, lastScore));

  await prisma.masteryState.upsert({
    where: { userId_conceptId: { userId, conceptId } },
    create: { userId, conceptId, ...estimate },
    update: { ...estimate },
  });

  await prisma.reviewItem.upsert({
    where: { userId_conceptId: { userId, conceptId } },
    create: { userId, conceptId, level, dueAt, reps: events.length, lapses, lastReviewAt: now },
    update: { level, dueAt, reps: events.length, lapses, lastReviewAt: now },
  });

  return { ...estimate, level };
}
