import "server-only";
import { prisma } from "@pub-montre/db";
import { addDays, nextFlashcardState, type FlashcardRating } from "@pub-montre/core";

export const DAILY_CARD_LIMIT = 20;

/** Cartes à réviser : nouvelles d'abord, puis celles dont l'échéance est passée. */
export async function loadDueFlashcards(userId: string, now: Date) {
  const reviewed = await prisma.flashcardReview.findMany({
    where: { userId },
    select: { flashcardId: true, dueAt: true },
  });
  const dueIds = new Set(reviewed.filter((review) => review.dueAt <= now).map((review) => review.flashcardId));
  const seenIds = new Set(reviewed.map((review) => review.flashcardId));

  const cards = await prisma.flashcard.findMany({
    where: { status: "VALIDATED", concept: { chapter: { status: "VALIDATED" } } },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      kind: true,
      front: true,
      back: true,
      concept: { select: { title: true, chapter: { select: { title: true } } } },
    },
  });

  const due = cards.filter((card) => dueIds.has(card.id));
  const fresh = cards.filter((card) => !seenIds.has(card.id));
  return [...due, ...fresh].slice(0, DAILY_CARD_LIMIT);
}

/** Enregistre la note d'une carte et programme sa prochaine révision. Vérifie que la carte est visible par l'étudiant. */
export async function rateFlashcard(userId: string, flashcardId: string, rating: FlashcardRating, now: Date): Promise<boolean> {
  const card = await prisma.flashcard.findFirst({
    where: { id: flashcardId, status: "VALIDATED" },
    select: { id: true, conceptId: true },
  });
  if (!card) return false;

  const existing = await prisma.flashcardReview.findUnique({
    where: { userId_flashcardId: { userId, flashcardId } },
  });
  const next = nextFlashcardState(
    { level: existing?.level ?? 1, reps: existing?.reps ?? 0, lapses: existing?.lapses ?? 0 },
    rating,
  );
  const dueAt = addDays(now, next.dueInDays);

  await prisma.$transaction([
    prisma.flashcardReview.upsert({
      where: { userId_flashcardId: { userId, flashcardId } },
      create: { userId, flashcardId, level: next.level, reps: next.reps, lapses: next.lapses, dueAt, lastReviewAt: now },
      update: { level: next.level, reps: next.reps, lapses: next.lapses, dueAt, lastReviewAt: now },
    }),
    // Une carte revue compte comme une preuve sur sa notion, pour le moteur d'apprentissage.
    prisma.learningEvent.create({
      data: {
        userId,
        conceptId: card.conceptId,
        source: "FLASHCARD",
        score: rating === "again" ? 0 : rating === "good" ? 0.7 : 1,
        occurredAt: now,
      },
    }),
  ]);
  return true;
}
