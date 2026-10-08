import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@pub-montre/db";
import { dayKey, reviewBucket, type ReviewBucket } from "@pub-montre/core";
import { PageHeader } from "@/components/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";
import { cn } from "@/lib/utils";
import { PlanForm } from "./plan-form";
import { ToggleSession } from "./toggle-session";

export const metadata: Metadata = { title: "Mon plan" };
const TIME_ZONE = "Europe/Paris";

const BUCKETS: { key: ReviewBucket; label: string }[] = [
  { key: "today", label: "Aujourd'hui" },
  { key: "tomorrow", label: "Demain" },
  { key: "in3", label: "Dans 3 jours" },
  { key: "in7", label: "Dans 7 jours" },
  { key: "in14", label: "Dans 14 jours" },
  { key: "later", label: "Plus tard" },
];

export default function PlanPage() {
  return (
    <>
      <PageHeader title="Mon plan" description="Tes révisions du jour et ton plan jusqu’à l’examen." />
      <Suspense fallback={null}>
        <PlanSection />
      </Suspense>
    </>
  );
}

async function PlanSection() {
  const user = await getCurrentUser();
  const now = new Date();

  const [reviews, plan] = await Promise.all([
    prisma.reviewItem.findMany({
      where: { userId: user.id },
      orderBy: { dueAt: "asc" },
      select: {
        id: true,
        dueAt: true,
        level: true,
        concept: { select: { id: true, title: true, chapter: { select: { id: true, title: true } } } },
      },
    }),
    prisma.studyPlan.findFirst({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      select: {
        examDate: true,
        dailyMinutes: true,
        sessions: {
          orderBy: [{ scheduledFor: "asc" }, { id: "asc" }],
          select: {
            id: true,
            scheduledFor: true,
            durationMinutes: true,
            activity: true,
            completedAt: true,
            conceptId: true,
          },
        },
      },
    }),
  ]);

  const conceptTitles = plan
    ? new Map(
        (
          await prisma.concept.findMany({
            where: { id: { in: plan.sessions.map((s) => s.conceptId).filter((id): id is string => !!id) } },
            select: { id: true, title: true },
          })
        ).map((concept) => [concept.id, concept.title]),
      )
    : new Map<string, string>();

  const counts = new Map<ReviewBucket, number>();
  for (const review of reviews) {
    const bucket = reviewBucket(review.dueAt, now, TIME_ZONE);
    counts.set(bucket, (counts.get(bucket) ?? 0) + 1);
  }
  const dueToday = reviews.filter((review) => reviewBucket(review.dueAt, now, TIME_ZONE) === "today");

  const today = dayKey(now, TIME_ZONE);
  const upcomingDays = new Map<string, typeof plan extends null ? never : NonNullable<typeof plan>["sessions"]>();
  for (const session of plan?.sessions ?? []) {
    const key = session.scheduledFor.toISOString().slice(0, 10);
    if (key < today) continue;
    upcomingDays.set(key, [...(upcomingDays.get(key) ?? []), session]);
  }

  return (
    <div className="grid gap-8">
      <section aria-labelledby="due" className="grid gap-4">
        <h2 id="due" className="text-lg font-semibold text-foreground">Révisions espacées</h2>
        {reviews.length === 0 ? (
          <Card>
            <CardTitle>Pas encore de révision programmée</CardTitle>
            <CardDescription className="mt-2">Réponds à quelques questions : les notions à revoir seront planifiées automatiquement.</CardDescription>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {BUCKETS.map((bucket) => (
                <Card key={bucket.key} className="p-4">
                  <p className="text-xs text-muted-foreground">{bucket.label}</p>
                  <p className="mt-1 text-xl font-semibold tabular-nums text-foreground">{counts.get(bucket.key) ?? 0}</p>
                </Card>
              ))}
            </div>
            <Card>
              <CardTitle>À réviser aujourd’hui</CardTitle>
              {dueToday.length === 0 ? (
                <CardDescription className="mt-2">Rien à revoir aujourd’hui. Profite-en pour avancer sur ton plan.</CardDescription>
              ) : (
                <ul className="mt-4 grid gap-2">
                  {dueToday.map((review) => (
                    <li key={review.id} className="flex flex-wrap items-center justify-between gap-3 rounded-lg px-3 py-2">
                      <span className="text-sm text-foreground">
                        {review.concept.title} <span className="text-muted-foreground">· {review.concept.chapter.title}</span>
                      </span>
                      <Link href={`/entrainement?chapterId=${review.concept.chapter.id}`} className={buttonVariants({ variant: "secondary", size: "sm" })}>
                        Réviser
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          </>
        )}
      </section>

      <section aria-labelledby="plan" className="grid gap-4">
        <h2 id="plan" className="text-lg font-semibold text-foreground">Plan jusqu’à l’examen</h2>
        <PlanForm hasPlan={!!plan} />

        {plan ? (
          <div className="grid gap-4">
            <p className="text-sm text-muted-foreground">
              Examen le {plan.examDate?.toLocaleDateString("fr-FR", { timeZone: "UTC" })} · {plan.dailyMinutes} min par jour
            </p>
            {upcomingDays.size === 0 ? (
              <Card>
                <CardDescription>Plus aucune session à venir dans ce plan.</CardDescription>
              </Card>
            ) : (
              [...upcomingDays.entries()].slice(0, 14).map(([day, sessions]) => (
                <Card key={day} className="p-5">
                  <div className="flex items-center justify-between">
                    <h3 className="font-medium text-foreground">
                      {new Date(`${day}T12:00:00Z`).toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" })}
                    </h3>
                    <span className="text-sm tabular-nums text-muted-foreground">
                      {sessions.reduce((sum, s) => sum + s.durationMinutes, 0)} min
                    </span>
                  </div>
                  <ul className="mt-4 grid gap-3">
                    {sessions.map((session) => {
                      const label = session.conceptId ? conceptTitles.get(session.conceptId) ?? "Notion" : "Notion";
                      const done = !!session.completedAt;
                      return (
                        <li key={session.id} className={cn("flex flex-wrap items-center justify-between gap-3 rounded-lg px-3 py-2", done && "opacity-60")}>
                          <div>
                            <p className={cn("text-sm font-medium text-foreground", done && "line-through")}>{label}</p>
                            <p className="text-xs text-muted-foreground">
                              {session.activity} · {session.durationMinutes} min
                            </p>
                          </div>
                          <ToggleSession sessionId={session.id} done={done} label={label} />
                        </li>
                      );
                    })}
                  </ul>
                </Card>
              ))
            )}
          </div>
        ) : null}
      </section>
    </div>
  );
}
