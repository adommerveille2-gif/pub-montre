import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { prisma } from "@pub-montre/db";
import { PageHeader } from "@/components/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { difficultyLabel } from "@/lib/labels";

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

async function CaseList() {
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
            <CardTitle className="mt-2">{clinicalCase.title}</CardTitle>
            <CardDescription className="mt-2">{clinicalCase.presentation}</CardDescription>
          </Card>
        </Link>
      ))}
    </div>
  );
}
