import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { loadTaxonomy } from "@/server/learning/queries";

export const metadata: Metadata = { title: "Mes cours" };

export default function CoursesPage() {
  return (
    <>
      <PageHeader title="Mes cours" description="Les chapitres validés, année par année." />
      <Suspense fallback={null}>
        <CourseList />
      </Suspense>
    </>
  );
}

async function CourseList() {
  const years = await loadTaxonomy();
  const withContent = years.filter((year) => year.subjectYears.length > 0);

  if (withContent.length === 0) {
    return (
      <Card>
        <CardTitle>Aucun cours publié</CardTitle>
        <CardDescription className="mt-2">Les cours apparaîtront ici dès qu’ils auront été validés.</CardDescription>
      </Card>
    );
  }

  return (
    <div className="grid gap-8">
      {withContent.map((year) => (
        <section key={year.id} aria-labelledby={`year-${year.id}`} className="grid gap-4">
          <h2 id={`year-${year.id}`} className="text-lg font-semibold text-foreground">{year.name}</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {year.subjectYears.map((sy) => (
              <Card key={sy.id} className="p-5">
                <CardTitle>{sy.subject.name}</CardTitle>
                <ul className="mt-3 grid gap-1">
                  {sy.chapters.map((chapter) => (
                    <li key={chapter.id}>
                      <Link href={`/cours/${chapter.id}`} className="block rounded-lg px-3 py-2 text-sm text-foreground hover:bg-muted">
                        {chapter.title}
                        <span className="ml-2 text-muted-foreground">· {chapter.questions.length} questions</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
