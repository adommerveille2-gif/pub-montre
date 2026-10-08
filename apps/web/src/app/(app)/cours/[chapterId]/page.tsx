import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { MasteryBar } from "@/components/mastery-bar";
import { LevelPill } from "@/components/level-pill";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@pub-montre/db";
import { levelFromEstimate } from "@pub-montre/core";
import { loadConceptRows } from "@/server/learning/queries";
import { getCurrentUser } from "@/lib/session";

export const metadata: Metadata = { title: "Cours" };

export default function ChapterPage(props: PageProps<"/cours/[chapterId]">) {
  return (
    <Suspense fallback={null}>
      <Chapter {...props} />
    </Suspense>
  );
}

async function Chapter({ params }: PageProps<"/cours/[chapterId]">) {
  const user = await getCurrentUser();
  const { chapterId } = await params;

  const chapter = await prisma.chapter.findFirst({
    where: { id: chapterId, status: "VALIDATED" },
    select: {
      id: true,
      title: true,
      subjectYear: { select: { subject: { select: { name: true } }, academicYear: { select: { name: true } } } },
      courses: { where: { status: "VALIDATED" }, orderBy: { createdAt: "asc" }, select: { id: true, title: true, content: true } },
      _count: { select: { questions: { where: { status: "VALIDATED" } } } },
    },
  });
  if (!chapter) notFound();

  const concepts = (await loadConceptRows(user.id)).filter((row) => row.chapterId === chapter.id);

  return (
    <>
      <PageHeader
        title={chapter.title}
        description={`${chapter.subjectYear.subject.name} · ${chapter.subjectYear.academicYear.name}`}
      />

      <div className="grid gap-6">
        {chapter.courses.length === 0 ? (
          <Card>
            <CardTitle>Cours en préparation</CardTitle>
            <CardDescription className="mt-2">Le contenu de ce chapitre n’est pas encore publié.</CardDescription>
          </Card>
        ) : (
          chapter.courses.map((course) => (
            <Card key={course.id}>
              <CardTitle className="text-lg">{course.title}</CardTitle>
              <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-muted-foreground">{course.content}</div>
            </Card>
          ))
        )}

        <Card>
          <CardTitle>Notions de ce chapitre</CardTitle>
          <ul className="mt-4 grid gap-5">
            {concepts.map((concept) => (
              <li key={concept.id} className="grid gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-sm font-medium text-foreground">{concept.title}</span>
                  <LevelPill level={levelFromEstimate(concept)} />
                </div>
                <MasteryBar value={concept.mastery} label={`Maîtrise de ${concept.title}`} />
              </li>
            ))}
          </ul>
        </Card>

        {chapter._count.questions > 0 ? (
          <Link href={`/entrainement?chapterId=${chapter.id}`} className={buttonVariants({ size: "lg" }) + " w-fit"}>
            M’entraîner sur ce chapitre
          </Link>
        ) : null}
      </div>
    </>
  );
}
