import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { buildPlan, currentStreak, describeState, levelFromEstimate, overallLevelLabel, priorityScore, rollupMastery, startOfDayIn } from "@pub-montre/core";
import { prisma } from "@pub-montre/db";
import { PageHeader } from "@/components/page-header";
import { MasteryBar } from "@/components/mastery-bar";
import { LevelPill } from "@/components/level-pill";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { loadConceptRows } from "@/server/learning/queries";
import { getCurrentUser } from "@/lib/session";
import { percent } from "@/lib/learning-view";

export const metadata: Metadata = { title: "Tableau de bord" };
const TIME_ZONE = "Europe/Paris";

export default function DashboardPage() {
  return (
    <Suspense fallback={null}>
      <Dashboard />
    </Suspense>
  );
}

async function Dashboard() {
  const user = await getCurrentUser();
  const now = new Date();
  const todayStart = startOfDayIn(now, TIME_ZONE);

  const [rows, todayEvents, allEvents, answers] = await Promise.all([
    loadConceptRows(user.id),
    prisma.learningEvent.findMany({
      where: { userId: user.id, occurredAt: { gte: todayStart } },
      select: { responseTimeMs: true },
    }),
    prisma.learningEvent.findMany({
      where: { userId: user.id, occurredAt: { gte: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000) } },
      select: { occurredAt: true },
    }),
    prisma.quizAttempt.count({ where: { userId: user.id } }),
  ]);

  const rollup = rollupMastery(rows);
  const todayMinutes = Math.round(todayEvents.reduce((sum, event) => sum + (event.responseTimeMs ?? 0), 0) / 60000);
  const streak = currentStreak(allEvents.map((event) => event.occurredAt), now, TIME_ZONE);
  const year = user.profile?.academicYear?.name;
  const firstName = user.profile?.firstName;

  const priorities = [...rows]
    .map((row) => ({ row, score: priorityScore(row, row.weight) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 3);
  const top = priorities[0]?.row;

  return (
    <>
      <PageHeader
        title={firstName ? `Bonjour ${firstName}` : "Bonjour"}
        description={year ? `Année : ${year}` : "Complète ton profil pour personnaliser ton parcours."}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Progression générale" value={percent(rollup.mastery)} hint={`${rollup.evaluated} notions évaluées sur ${rollup.total}`} />
        <Stat label="Niveau réel" value={overallLevelLabel(rollup.mastery)} />
        <Stat label="Révision aujourd'hui" value={`${todayMinutes} min`} />
        <Stat label="Série" value={`${streak} jour${streak > 1 ? "s" : ""}`} hint={`${answers} questions au total`} />
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        {top ? (
          <Link href={`/entrainement?chapterId=${top.chapterId}`} className={buttonVariants({ size: "lg" })}>
            Commencer ma révision
          </Link>
        ) : (
          <Link href="/entrainement" className={buttonVariants({ size: "lg" })}>
            Commencer ma révision
          </Link>
        )}
        <p className="text-sm text-muted-foreground">{top ? `Priorité : ${top.chapterTitle}` : "Les questions validées apparaîtront ici."}</p>
      </div>

      <section aria-labelledby="priorities" className="mt-8 grid gap-4">
        <h2 id="priorities" className="text-lg font-semibold text-foreground">Tes priorités aujourd’hui</h2>
        {priorities.length === 0 ? (
          <Card>
            <CardTitle>Rien à prioriser pour l’instant</CardTitle>
            <CardDescription className="mt-2">Dès que des notions seront publiées, tes priorités apparaîtront ici.</CardDescription>
          </Card>
        ) : (
          <ol className="grid gap-4">
            {priorities.map(({ row }, index) => {
              const state = { mastery: row.mastery, confidence: row.confidence, evidenceCount: row.evidenceCount };
              const first = buildPlan(state)[0];
              return (
                <li key={row.id}>
                  <Card className="grid gap-3 p-5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm text-muted-foreground">{index + 1}. {row.subjectName}</span>
                      <LevelPill level={levelFromEstimate(state)} />
                    </div>
                    <p className="font-medium text-foreground">{row.title}</p>
                    <MasteryBar value={row.mastery} label={`Maîtrise de ${row.title}`} />
                    <p className="text-sm text-muted-foreground">{describeState(row.title, state)}</p>
                    <div className="flex flex-wrap items-center gap-3">
                      {first ? <span className="text-sm text-foreground">→ {first.label}</span> : null}
                      <Link href={`/entrainement?chapterId=${row.chapterId}`} className={buttonVariants({ variant: "secondary", size: "sm" })}>
                        Faire des questions
                      </Link>
                      <Link href={`/cours/${row.chapterId}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
                        Revoir le cours
                      </Link>
                    </div>
                  </Card>
                </li>
              );
            })}
          </ol>
        )}
      </section>
    </>
  );
}

function Stat({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card className="p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums text-foreground">{value}</p>
      {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
    </Card>
  );
}
