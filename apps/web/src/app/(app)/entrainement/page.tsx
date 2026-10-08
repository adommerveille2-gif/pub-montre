import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { loadTaxonomy } from "@/server/learning/queries";
import { getCurrentUser } from "@/lib/session";
import { SetupForm } from "./setup-form";
import { prisma } from "@pub-montre/db";

export const metadata: Metadata = { title: "Entraînement" };

export default function TrainingPage({ searchParams }: PageProps<"/entrainement">) {
  return (
    <>
      <PageHeader title="Entraînement" description="QCM validés, corrigés pas à pas." />
      <p className="-mt-2 mb-6 text-sm">
        <Link href="/entrainement/cartes" className="text-primary underline-offset-4 hover:underline">
          Réviser mes cartes mémoire →
        </Link>
      </p>
      <Suspense fallback={null}>
        <TrainingSetup searchParams={searchParams} />
      </Suspense>
    </>
  );
}

async function TrainingSetup({ searchParams }: { searchParams: PageProps<"/entrainement">["searchParams"] }) {
  const user = await getCurrentUser();
  const { chapterId: rawChapterId } = await searchParams;
  const chapterId = typeof rawChapterId === "string" ? rawChapterId : undefined;
  const years = await loadTaxonomy();

  const groups = years
    .map((year) => ({
      yearName: year.name,
      chapters: year.subjectYears.flatMap((sy) =>
        sy.chapters
          .filter((chapter) => chapter.questions.length > 0)
          .map((chapter) => ({
            id: chapter.id,
            label: `${sy.subject.name} · ${chapter.title}`,
            count: chapter.questions.length,
          })),
      ),
    }))
    .filter((group) => group.chapters.length > 0);

  const inProgress = await prisma.quiz.findMany({
    where: { userId: user.id, status: "IN_PROGRESS" },
    orderBy: { startedAt: "desc" },
    take: 3,
    select: { id: true, title: true, startedAt: true, _count: { select: { items: true, attempts: true } } },
  });

  if (groups.length === 0) {
    return (
      <Card>
        <CardTitle>Aucune question disponible</CardTitle>
        <CardDescription className="mt-2">
          Les questions apparaîtront ici dès qu’elles auront été validées par l’équipe pédagogique.
        </CardDescription>
      </Card>
    );
  }

  return (
    <div className="grid gap-6">
      {inProgress.length > 0 ? (
        <Card>
          <CardTitle>Reprendre</CardTitle>
          <ul className="mt-3 grid gap-2">
            {inProgress.map((quiz) => (
              <li key={quiz.id}>
                <Link href={`/entrainement/${quiz.id}`} className="flex items-center justify-between rounded-lg px-3 py-2 text-sm hover:bg-muted">
                  <span className="font-medium text-foreground">{quiz.title ?? "Entraînement"}</span>
                  <span className="text-muted-foreground">
                    {quiz._count.attempts} / {quiz._count.items}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
      <SetupForm groups={groups} defaultChapterId={chapterId} />
    </div>
  );
}
