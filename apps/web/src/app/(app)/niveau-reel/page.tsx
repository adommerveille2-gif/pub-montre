import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { buildPlan, describeState, levelFromEstimate } from "@pub-montre/core";
import { PageHeader } from "@/components/page-header";
import { MasteryBar } from "@/components/mastery-bar";
import { LevelPill } from "@/components/level-pill";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { loadConceptRows } from "@/server/learning/queries";
import { getCurrentUser } from "@/lib/session";
import { groupBySubject, percent } from "@/lib/learning-view";

export const metadata: Metadata = { title: "Mon niveau réel" };

export default function RealLevelPage() {
  return (
    <>
      <PageHeader title="Mon niveau réel" description="Calculé à partir de tes réponses : QCM et entraînements." />
      <Suspense fallback={null}>
        <LevelMap />
      </Suspense>
    </>
  );
}

async function LevelMap() {
  const user = await getCurrentUser();
  const rows = await loadConceptRows(user.id);

  if (rows.length === 0) {
    return (
      <Card>
        <CardTitle>Aucune notion publiée</CardTitle>
        <CardDescription className="mt-2">Ton niveau apparaîtra dès que des chapitres seront publiés.</CardDescription>
      </Card>
    );
  }

  const subjects = groupBySubject(rows);

  return (
    <div className="grid gap-8">
      {subjects.map((subject) => (
        <section key={subject.subjectId} aria-labelledby={`subject-${subject.subjectId}`} className="grid gap-4">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id={`subject-${subject.subjectId}`} className="text-lg font-semibold text-foreground">
              {subject.subjectName}
            </h2>
            <p className="text-sm text-muted-foreground">
              Maîtrise {percent(subject.rollup.mastery)} · {subject.rollup.evaluated} / {subject.rollup.total} notions évaluées
            </p>
          </div>

          {subject.chapters.map((chapter) => (
            <Card key={chapter.chapterId}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <CardTitle>{chapter.chapterTitle}</CardTitle>
                <span className="text-sm tabular-nums text-muted-foreground">{percent(chapter.rollup.mastery)}</span>
              </div>

              <ul className="mt-5 grid gap-6">
                {chapter.concepts.map((concept) => {
                  const state = { mastery: concept.mastery, confidence: concept.confidence, evidenceCount: concept.evidenceCount };
                  const steps = buildPlan(state);
                  return (
                    <li key={concept.id} className="grid gap-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-medium text-foreground">{concept.title}</span>
                        <LevelPill level={levelFromEstimate(state)} />
                      </div>
                      <MasteryBar value={concept.mastery} label={`Maîtrise de ${concept.title}`} />
                      <p className="text-sm text-muted-foreground">{describeState(concept.title, state)}</p>
                      <p className="text-sm text-foreground">
                        Parcours recommandé : {steps.map((step) => step.label.toLowerCase()).join(" → ")}
                      </p>
                      {concept.evidenceCount === 0 || concept.mastery < 0.8 ? (
                        <div className="flex flex-wrap gap-2">
                          <Link href={`/cours/${concept.chapterId}`} className={buttonVariants({ variant: "secondary", size: "sm" })}>
                            Revoir le cours
                          </Link>
                          <Link href={`/entrainement?chapterId=${concept.chapterId}`} className={buttonVariants({ size: "sm" })}>
                            Faire des questions
                          </Link>
                        </div>
                      ) : null}
                    </li>
                  );
                })}
              </ul>
            </Card>
          ))}
        </section>
      ))}
    </div>
  );
}
