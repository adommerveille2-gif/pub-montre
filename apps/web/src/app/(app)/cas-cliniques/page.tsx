import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@pub-montre/db";
import { PageHeader } from "@/components/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { difficultyLabel } from "@/lib/labels";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Cas cliniques" };

export default function CasesPage() {
  return (
    <>
      <PageHeader
        title="Cas cliniques"
        description="Avance étape par étape. Tu réfléchis d'abord, puis tu compares avec la réponse attendue."
      />
      <Suspense fallback={null}>
        <CaseList />
      </Suspense>
    </>
  );
}

const STATUS_TEXT = { NOT_STARTED: "Non commencé", IN_PROGRESS: "En cours", FINISHED: "Terminé" } as const;

async function CaseList() {
  const user = await getCurrentUser();
  const cases = await prisma.clinicalCase.findMany({
    where: { status: "VALIDATED", chapter: { status: "VALIDATED" } },
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      title: true,
      difficulty: true,
      presentation: true,
      chapter: { select: { title: true } },
      _count: { select: { steps: true } },
      attempts: {
        where: { userId: user.id },
        orderBy: { startedAt: "desc" },
        take: 1,
        select: { finishedAt: true },
      },
    },
  });

  if (cases.length === 0) {
    return (
      <Card>
        <CardTitle>Aucun cas publié</CardTitle>
        <CardDescription className="mt-2">Les cas cliniques apparaîtront ici dès qu’ils auront été validés.</CardDescription>
      </Card>
    );
  }

  return (
    <div className="grid gap-4">
      {cases.map((clinicalCase) => (
        <Link key={clinicalCase.id} href={`/cas-cliniques/${clinicalCase.id}`} className="block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
          <Card className="transition-colors hover:bg-muted/60">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              {clinicalCase.chapter.title} · {difficultyLabel(clinicalCase.difficulty)} · {clinicalCase._count.steps} étapes
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
              <CardTitle>{clinicalCase.title}</CardTitle>
              <span className="text-xs font-medium text-muted-foreground">
                {STATUS_TEXT[clinicalCase.attempts.length === 0 ? "NOT_STARTED" : clinicalCase.attempts[0]?.finishedAt ? "FINISHED" : "IN_PROGRESS"]}
              </span>
            </div>
            <CardDescription className="mt-2">{clinicalCase.presentation}</CardDescription>
          </Card>
        </Link>
      ))}
    </div>
  );
}
