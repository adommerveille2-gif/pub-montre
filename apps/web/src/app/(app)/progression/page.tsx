import type { Metadata } from "next";
import { Suspense } from "react";
import { BADGES, computeXp, currentStreak, dayKey, levelFromEstimate, levelFromXp, startOfDayIn, unlockedBadges } from "@pub-montre/core";
import { prisma } from "@pub-montre/db";
import { PageHeader } from "@/components/page-header";
import { MasteryBar } from "@/components/mastery-bar";
import { Card, CardTitle } from "@/components/ui/card";
import { loadConceptRows } from "@/server/learning/queries";
import { getCurrentUser } from "@/lib/session";
import { groupBySubject, percent } from "@/lib/learning-view";

export const metadata: Metadata = { title: "Progression" };
const TIME_ZONE = "Europe/Paris";

export default function ProgressPage() {
  return (
    <>
      <PageHeader title="Ma progression" description="Ton activité et l'évolution de tes résultats." />
      <Suspense fallback={null}>
        <ProgressSection />
      </Suspense>
    </>
  );
}

async function ProgressSection() {
  const user = await getCurrentUser();
  const now = new Date();
  const since = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

  const [attempts, events, rows] = await Promise.all([
    prisma.quizAttempt.findMany({
      where: { userId: user.id, createdAt: { gte: since } },
      select: { score: true, createdAt: true, responseTimeMs: true },
    }),
    prisma.learningEvent.findMany({
      where: { userId: user.id },
      select: { occurredAt: true, responseTimeMs: true },
    }),
    loadConceptRows(user.id),
  ]);

  const [totalAnswers, totalCorrect, flashcardReviews, todayEvents] = await Promise.all([
    prisma.quizAttempt.count({ where: { userId: user.id } }),
    prisma.quizAttempt.count({ where: { userId: user.id, score: 1 } }),
    prisma.learningEvent.count({ where: { userId: user.id, source: "FLASHCARD" } }),
    prisma.learningEvent.findMany({ where: { userId: user.id, occurredAt: { gte: startOfDayIn(now, TIME_ZONE) } }, select: { responseTimeMs: true } }),
  ]);
  const xp = computeXp({ answers: totalAnswers, correctAnswers: totalCorrect, flashcardReviews });
  const levelInfo = levelFromXp(xp);
  const conceptsMastered = rows.filter((row) => levelFromEstimate(row) === 5).length;
  const todayMinutes = Math.round(todayEvents.reduce((sum, event) => sum + (event.responseTimeMs ?? 0), 0) / 60000);
  const goal = user.profile?.dailyMinutes ?? 30;
  const totalTimeMs = events.reduce((sum, event) => sum + (event.responseTimeMs ?? 0), 0);
  const accuracy = totalAnswers === 0 ? null : totalCorrect / totalAnswers;
  const streak = currentStreak(
    events.map((event) => event.occurredAt),
    now,
    TIME_ZONE,
  );
  const badges = unlockedBadges({ answers: totalAnswers, correctAnswers: totalCorrect, flashcardReviews, streakDays: streak, conceptsMastered });
  const unlockedCodes = new Set(badges.map((badge) => badge.code));

  // Taux de réussite par jour sur 14 jours, dans le fuseau de l'étudiant.
  const DAY_MS = 24 * 60 * 60 * 1000;
  const days = Array.from({ length: 14 }, (_, index) => {
    const date = new Date(now.getTime() - (13 - index) * DAY_MS);
    const key = dayKey(date, TIME_ZONE);
    const dayAttempts = attempts.filter((attempt) => dayKey(attempt.createdAt, TIME_ZONE) === key);
    const correct = dayAttempts.filter((attempt) => attempt.score === 1).length;
    return {
      key,
      label: date.toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit", timeZone: TIME_ZONE }),
      total: dayAttempts.length,
      rate: dayAttempts.length ? correct / dayAttempts.length : null,
    };
  });

  const subjects = groupBySubject(rows);

  return (
    <div className="grid gap-6">
      <Card className="grid gap-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Niveau de progression</p>
            <p className="text-3xl font-semibold tabular-nums text-foreground">Niveau {levelInfo.level}</p>
          </div>
          <p className="text-sm tabular-nums text-muted-foreground">{xp} XP · {levelInfo.nextLevelXp - levelInfo.currentXp} XP avant le niveau {levelInfo.level + 1}</p>
        </div>
        <MasteryBar value={levelInfo.currentXp / Math.max(1, levelInfo.nextLevelXp)} label="Progression vers le niveau suivant" />
        <div>
          <p className="text-sm text-muted-foreground">Objectif du jour : {Math.min(todayMinutes, goal)} / {goal} min</p>
          <MasteryBar value={todayMinutes / Math.max(1, goal)} label="Objectif quotidien" className="mt-2" />
        </div>
      </Card>

      <Card>
        <CardTitle>Badges</CardTitle>
        <ul className="mt-4 grid gap-3 sm:grid-cols-2">
          {BADGES.map((badge) => (
            <li key={badge.code} className={unlockedCodes.has(badge.code) ? "rounded-xl border border-primary/30 bg-primary/5 p-4" : "rounded-xl border border-border p-4 opacity-60"}>
              <p className="font-medium text-foreground">{badge.title}</p>
              <p className="mt-1 text-sm text-muted-foreground">{badge.description}</p>
              <p className="mt-2 text-xs text-muted-foreground">{unlockedCodes.has(badge.code) ? "Débloqué" : "À débloquer"}</p>
            </li>
          ))}
        </ul>
      </Card>

      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Questions" value={String(totalAnswers)} />
        <Stat label="Taux de réussite" value={percent(accuracy)} />
        <Stat label="Temps de travail" value={formatDuration(totalTimeMs)} />
        <Stat label="Série" value={`${streak} j`} />
      </div>

      <Card>
        <CardTitle>Taux de réussite sur 14 jours</CardTitle>
        <div className="mt-6 flex h-40 items-end gap-2" role="list" aria-label="Taux de réussite par jour">
          {days.map((day) => (
            <div key={day.key} role="listitem" className="flex h-full flex-1 flex-col justify-end gap-2" title={`${day.label} : ${percent(day.rate)} (${day.total} questions)`}>
              <div className="w-full rounded-t-md bg-primary/80" style={{ height: `${Math.max(day.rate === null ? 0 : 4, (day.rate ?? 0) * 100)}%` }} />
              <span className="text-center text-[10px] text-muted-foreground">{day.label}</span>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <CardTitle>Maîtrise par matière</CardTitle>
        <ul className="mt-5 grid gap-5">
          {subjects.map((subject) => (
            <li key={subject.subjectId} className="grid gap-2">
              <span className="text-sm font-medium text-foreground">{subject.subjectName}</span>
              <MasteryBar value={subject.rollup.mastery ?? 0} label={`Maîtrise de ${subject.subjectName}`} />
            </li>
          ))}
        </ul>
      </Card>

    </div>
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

function formatDuration(ms: number): string {
  const minutes = Math.round(ms / 60000);
  if (minutes < 60) return `${minutes} min`;
  return `${Math.floor(minutes / 60)} h ${String(minutes % 60).padStart(2, "0")}`;
}
