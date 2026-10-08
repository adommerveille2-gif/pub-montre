import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { loadOwnedQuiz } from "@/server/learning/quiz";
import { getCurrentUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { AnswerForm } from "./answer-form";

export const metadata: Metadata = { title: "Entraînement en cours" };

export default function QuizPage(props: PageProps<"/entrainement/[quizId]">) {
  return (
    <Suspense fallback={null}>
      <QuizSection {...props} />
    </Suspense>
  );
}

async function QuizSection({ params, searchParams }: PageProps<"/entrainement/[quizId]">) {
  const user = await getCurrentUser();
  const { quizId } = await params;
  const { item } = await searchParams;

  const quiz = await loadOwnedQuiz(user.id, quizId);
  if (!quiz) notFound();

  const total = quiz.items.length;
  const answeredIds = new Set(quiz.attempts.map((attempt) => attempt.questionId));
  const firstOpen = quiz.items.find((entry) => !answeredIds.has(entry.questionId));

  // Quiz terminé sans position demandée : direction le bilan.
  if (!firstOpen && !item) redirect(`/entrainement/${quizId}/bilan`);

  const requested = Number(item);
  const current =
    (Number.isInteger(requested) && quiz.items.find((entry) => entry.position === requested)) || firstOpen;
  if (!current) redirect(`/entrainement/${quizId}/bilan`);

  const { question, position } = current;
  const attempt = quiz.attempts.find((entry) => entry.questionId === question.id);
  const isLast = position === total;
  const nextTarget = isLast ? `/entrainement/${quizId}/bilan` : `/entrainement/${quizId}?item=${position + 1}`;

  const correctIds = new Set(question.options.filter((option) => option.isCorrect).map((option) => option.id));
  const selectedIds = new Set(Array.isArray(attempt?.answer) ? (attempt.answer as string[]) : []);
  const textOf = (id: string) => question.options.find((option) => option.id === id)?.text ?? "";

  return (
    <>
      <PageHeader title={quiz.title ?? "Entraînement"} description={`Question ${position} sur ${total}`} />

      <div className="grid gap-6">
        <Card>
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            {question.chapter.title} · {difficultyLabel(question.difficulty)}
          </p>
          <CardTitle className="mt-2 text-lg leading-snug">{question.statement}</CardTitle>
        </Card>

        {attempt ? (
          <Card className="grid gap-5">
            <div role="status" className={cn("rounded-xl px-4 py-3 text-sm font-medium", attempt.score === 1 ? "bg-success/10 text-success" : "bg-danger/10 text-danger")}>
              {attempt.score === 1 ? "Bonne réponse" : "Réponse incorrecte"}
            </div>

            <div className="grid gap-4 text-sm">
              <div>
                <p className="font-medium text-foreground">Ta réponse</p>
                <ul className="mt-1 list-disc pl-5 text-muted-foreground">
                  {selectedIds.size === 0 ? <li>Aucune réponse</li> : [...selectedIds].map((id) => <li key={id}>{textOf(id)}</li>)}
                </ul>
              </div>
              <div>
                <p className="font-medium text-foreground">Bonne réponse</p>
                <ul className="mt-1 list-disc pl-5 text-muted-foreground">
                  {[...correctIds].map((id) => (
                    <li key={id}>{textOf(id)}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <p className="font-medium text-foreground">Pourquoi ?</p>
              <p className="mt-1 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{question.explanation}</p>
            </div>

            {question.pitfall ? (
              <div>
                <p className="font-medium text-foreground">Piège fréquent</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{question.pitfall}</p>
              </div>
            ) : null}

            {question.memoryTip ? (
              <div>
                <p className="font-medium text-foreground">Astuce mémoire</p>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{question.memoryTip}</p>
              </div>
            ) : null}

            {question.concepts.length > 0 ? (
              <div>
                <p className="font-medium text-foreground">Notions concernées</p>
                <ul className="mt-1 flex flex-wrap gap-2">
                  {question.concepts.map((link) => (
                    <li key={link.concept.id} className="rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                      {link.concept.title}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            <Link href={nextTarget} className={cn(buttonVariants({ size: "lg" }), "w-fit")}>
              {isLast ? "Voir mon bilan" : "Question suivante"}
            </Link>
          </Card>
        ) : (
          <>
            <AnswerForm
              quizId={quizId}
              questionId={question.id}
              position={position}
              options={question.options.map((option) => ({ id: option.id, text: option.text }))}
            />
            <CardDescription className="text-center">Tu verras la correction juste après ta réponse.</CardDescription>
          </>
        )}
      </div>
    </>
  );
}

export function difficultyLabel(value: string): string {
  switch (value) {
    case "EASY":
      return "Facile";
    case "MEDIUM":
      return "Intermédiaire";
    case "HARD":
      return "Difficile";
    case "EXPERT":
      return "Expert";
    default:
      return value;
  }
}
