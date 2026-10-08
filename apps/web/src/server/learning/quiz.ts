import "server-only";
import { prisma, type Difficulty } from "@pub-montre/db";
import { sameSelection, sampleWithoutReplacement } from "@pub-montre/core";
import { refreshConceptState } from "./mastery";

export class QuizError extends Error {}

export type StartQuizInput = {
  chapterId?: string;
  difficulty?: Difficulty;
  count: number;
};

/** Crée un quiz d'entraînement à partir des questions validées. Ne renvoie que les questions de l'utilisateur. */
export async function startTrainingQuiz(userId: string, input: StartQuizInput) {
  const candidates = await prisma.question.findMany({
    where: {
      status: "VALIDATED",
      chapter: { status: "VALIDATED", ...(input.chapterId ? { id: input.chapterId } : {}) },
      ...(input.difficulty ? { difficulty: input.difficulty } : {}),
    },
    select: { id: true, chapter: { select: { title: true } } },
  });

  if (candidates.length === 0) {
    throw new QuizError("Aucune question validée ne correspond à ces critères.");
  }

  const picked = sampleWithoutReplacement(candidates, input.count);
  const title = picked[0] ? picked[0].chapter.title : "Entraînement";

  return prisma.quiz.create({
    data: {
      userId,
      mode: "TRAINING",
      title,
      items: {
        create: picked.map((question, index) => ({ questionId: question.id, position: index + 1 })),
      },
    },
    select: { id: true },
  });
}

/** Charge un quiz appartenant à l'utilisateur. Retourne null sinon, sans distinguer « absent » de « interdit ». */
export async function loadOwnedQuiz(userId: string, quizId: string) {
  return prisma.quiz.findFirst({
    where: { id: quizId, userId },
    include: {
      items: {
        orderBy: { position: "asc" },
        include: {
          question: {
            include: {
              options: { orderBy: { position: "asc" } },
              concepts: { include: { concept: { select: { id: true, title: true } } } },
              chapter: { select: { title: true } },
            },
          },
        },
      },
      attempts: true,
    },
  });
}

export type AnswerResult = {
  correct: boolean;
  selectedOptionIds: string[];
  correctOptionIds: string[];
  explanation: string;
  pitfall: string | null;
  memoryTip: string | null;
  conceptLevels: { title: string; level: number; mastery: number }[];
};

/**
 * Enregistre la réponse à une question d'un quiz :
 * tentative, preuves par notion, mise à jour de la maîtrise et de la révision.
 */
export async function answerQuizItem(params: {
  userId: string;
  quizId: string;
  questionId: string;
  selectedOptionIds: string[];
  responseTimeMs: number | null;
  now: Date;
}): Promise<AnswerResult> {
  const { userId, quizId, questionId, selectedOptionIds, responseTimeMs, now } = params;

  const quiz = await loadOwnedQuiz(userId, quizId);
  if (!quiz) throw new QuizError("Quiz introuvable.");
  if (quiz.status === "FINISHED") throw new QuizError("Ce quiz est terminé.");

  const item = quiz.items.find((entry) => entry.questionId === questionId);
  if (!item) throw new QuizError("Cette question ne fait pas partie du quiz.");
  if (quiz.attempts.some((attempt) => attempt.questionId === questionId)) {
    throw new QuizError("Cette question a déjà reçu une réponse.");
  }

  const { question } = item;
  const optionIds = new Set(question.options.map((option) => option.id));
  if (selectedOptionIds.some((id) => !optionIds.has(id))) {
    throw new QuizError("Réponse invalide.");
  }

  const correctOptionIds = question.options.filter((option) => option.isCorrect).map((option) => option.id);
  const correct = sameSelection(selectedOptionIds, correctOptionIds);
  const score = correct ? 1 : 0;
  const conceptIds = question.concepts.map((link) => link.concept.id);

  await prisma.$transaction([
    prisma.quizAttempt.create({
      data: {
        quizId,
        userId,
        questionId,
        answer: selectedOptionIds,
        score,
        responseTimeMs,
        createdAt: now,
      },
    }),
    prisma.learningEvent.createMany({
      data: conceptIds.map((conceptId) => ({
        userId,
        conceptId,
        source: "QCM",
        score,
        difficulty: question.difficulty,
        responseTimeMs,
        occurredAt: now,
      })),
    }),
  ]);

  const conceptLevels = [];
  for (const link of question.concepts) {
    const state = await refreshConceptState(userId, link.concept.id, now);
    conceptLevels.push({ title: link.concept.title, level: state.level, mastery: state.mastery });
  }

  const answeredCount = quiz.attempts.length + 1;
  if (answeredCount >= quiz.items.length) {
    await prisma.quiz.update({
      where: { id: quizId },
      data: { status: "FINISHED", finishedAt: now },
    });
  }

  return {
    correct,
    selectedOptionIds,
    correctOptionIds,
    explanation: question.explanation,
    pitfall: question.pitfall,
    memoryTip: question.memoryTip,
    conceptLevels,
  };
}
