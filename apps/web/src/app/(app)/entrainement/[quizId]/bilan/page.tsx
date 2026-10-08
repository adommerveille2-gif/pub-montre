import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { buildPlan, describeState, levelFromEstimate } from "@pub-montre/core";
import { PageHeader } from "@/components/page-header";
import { MasteryBar } from "@/components/mastery-bar";
import { LevelPill } from "@/components/level-pill";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { loadConceptRows } from "@/server/learning/queries";
import { loadOwnedQuiz } from "@/server/learning/quiz";
import { getCurrentUser } from "@/lib/session";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Bilan de l'entraînement" };

export default function QuizReportPage(props: PageProps<"/entrainement/[quizId]/bilan">) {
  return (
    <Suspense fallback={null}>
      <Report {...props} />
    </Suspense>
  );
}

async function Report({ params }: PageProps<"/entrainement/[quizId]/bilan">) {
  const user = await getCurrentUser();
  const { quizId } = await params;
  const quiz = await loadOwnedQuiz(user.id, quizId);
  if (!quiz) notFound();

  const attempts = quiz.attempts;
  const answered = attempts.length;
  if (answered === 0) {
    return (
      <>
        <PageHeader title="Bilan" />
        <Card>
          <CardTitle>Pas encore de réponse</CardTitle>
          <CardDescription className="mt-2">Réponds à au moins une question pour obtenir un bilan.</CardDescription>
          <Link href={`/entrainement/${quizId}`} className={cn(buttonVariants({ size: "md" }), "mt-4 w-fit")}>
            Reprendre le quiz
          </Link>
        </Card>
      </>
    );
  }

  const correctCount = attempts.filter((attempt) => attempt.score === 1).length;
  const percent = Math.round((correctCount / answered) * 100);
  const timed = attempts.map((attempt) => attempt.responseTimeMs).filter((value): value is number => value !== null);
  const averageSeconds = timed.length ? Math.round(timed.reduce((sum, value) => sum + value, 0) / timed.length / 1000) : null;

  const wrong = quiz.items.filter((item) => attempts.some((a) => a.questionId === item.questionId && a.score === 0));

  // Notions travaillées dans ce quiz, avec leur état actuel.
  const conceptIds = new Set(quiz.items.flatMap((item) => item.question.concepts.map((link) => link.concept.id)));
  const rows = (await loadConceptRows(user.id)).filter((row) => conceptIds.has(row.id));
  const weakest = [...rows].sort((a, b) => a.mastery - b.mastery);

  return (
    <>
      <PageHeader title="Bilan" description={quiz.title ?? undefined} />

      <div className="grid gap-6">
        <div className="grid gap-4 sm:grid-cols-3">
          <Stat label="Score" value={`${correctCount} / ${answered}`} />
          <Stat label="Taux de réussite" value={`${percent} %`} />
          <Stat label="Temps moyen par question" value={averageSeconds === null ? "—" : `${averageSeconds} s`} />
        </div>

        <Card>
          <CardTitle>Notions travaillées</CardTitle>
          <ul className="mt-4 grid gap-5">
            {weakest.map((row) => {
              const state = { mastery: row.mastery, confidence: row.confidence, evidenceCount: row.evidenceCount };
              const first = buildPlan(state)[0];
              return (
                <li key={row.id} className="grid gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="font-medium text-foreground">{row.title}</span>
                    <LevelPill level={levelFromEstimate(state)} />
                  </div>
                  <MasteryBar value={row.mastery} label={`Maîtrise de ${row.title}`} />
                  <p className="text-sm text-muted-foreground">{describeState(row.title, state)}</p>
                  {first ? <p className="text-sm text-foreground">Prochaine étape : {first.label.toLowerCase()}</p> : null}
                </li>
              );
            })}
          </ul>
        </Card>

        {wrong.length > 0 ? (
          <Card>
            <CardTitle>Questions à revoir</CardTitle>
            <ul className="mt-4 grid gap-3 text-sm">
              {wrong.map((item) => (
                <li key={item.id}>
                  <Link href={`/entrainement/${quizId}?item=${item.position}`} className="text-foreground underline-offset-4 hover:underline">
                    Question {item.position} : {item.question.statement}
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        ) : (
          <Card>
            <CardTitle>Aucune erreur sur ce quiz</CardTitle>
            <CardDescription className="mt-2">Bravo. Une révision espacée est programmée pour consolider.</CardDescription>
          </Card>
        )}

        <div className="flex flex-wrap gap-3">
          <Link href="/entrainement" className={buttonVariants({ size: "md" })}>Nouvel entraînement</Link>
          <Link href="/niveau-reel" className={buttonVariants({ variant: "secondary", size: "md" })}>Voir mon niveau réel</Link>
        </div>
      </div>
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
    </Card>
  );
}
