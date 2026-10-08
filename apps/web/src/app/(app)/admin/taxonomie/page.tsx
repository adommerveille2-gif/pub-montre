import type { Metadata } from "next";
import { prisma } from "@pub-montre/db";
import { PageHeader } from "@/components/page-header";
import { Card, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ActionForm } from "@/components/admin/action-form";
import { requireCapability } from "@/server/admin/guard";
import { can } from "@pub-montre/core";
import { createChapterAction, createConceptAction, createSubjectAction, linkSubjectYearAction, setChapterStatusAction } from "../actions";

export const metadata: Metadata = { title: "Taxonomie" };

const select = "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground";

export default async function TaxonomyPage() {
  const me = await requireCapability("admin:view");
  const editable = can(me.role, "taxonomy:edit");
  const [years, subjects, subjectYears] = await Promise.all([
    prisma.academicYear.findMany({ orderBy: { order: "asc" }, select: { id: true, name: true } }),
    prisma.subject.findMany({ orderBy: { name: "asc" }, select: { id: true, name: true } }),
    prisma.subjectYear.findMany({
      orderBy: [{ academicYear: { order: "asc" } }, { subject: { name: "asc" } }],
      select: {
        id: true,
        academicYear: { select: { name: true } },
        subject: { select: { name: true } },
        chapters: {
          orderBy: { position: "asc" },
          select: { id: true, title: true, status: true, concepts: { orderBy: { position: "asc" }, select: { id: true, title: true, weight: true } } },
        },
      },
    }),
  ]);

  return (
    <>
      <PageHeader title="Taxonomie" description="Années, matières, chapitres et notions. Un chapitre n'est visible des étudiants que publié." />

      {editable ? (
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardTitle>Nouvelle matière</CardTitle>
          <ActionForm action={createSubjectAction} className="mt-4 grid gap-3">
            <Label htmlFor="subject-name">Nom</Label>
            <Input id="subject-name" name="name" maxLength={120} required />
            <Button type="submit" className="w-fit">Créer</Button>
          </ActionForm>
        </Card>

        <Card>
          <CardTitle>Rattacher une matière à une année</CardTitle>
          <ActionForm action={linkSubjectYearAction} className="mt-4 grid gap-3">
            <Label htmlFor="link-year">Année</Label>
            <select id="link-year" name="academicYearId" className={select}>
              {years.map((year) => <option key={year.id} value={year.id}>{year.name}</option>)}
            </select>
            <Label htmlFor="link-subject">Matière</Label>
            <select id="link-subject" name="subjectId" className={select}>
              {subjects.map((subject) => <option key={subject.id} value={subject.id}>{subject.name}</option>)}
            </select>
            <Button type="submit" className="w-fit">Rattacher</Button>
          </ActionForm>
        </Card>

        <Card>
          <CardTitle>Nouveau chapitre (brouillon)</CardTitle>
          <ActionForm action={createChapterAction} className="mt-4 grid gap-3">
            <Label htmlFor="chapter-sy">Matière et année</Label>
            <select id="chapter-sy" name="subjectYearId" className={select}>
              {subjectYears.map((sy) => <option key={sy.id} value={sy.id}>{sy.academicYear.name} · {sy.subject.name}</option>)}
            </select>
            <Label htmlFor="chapter-title">Titre</Label>
            <Input id="chapter-title" name="title" maxLength={160} required />
            <Button type="submit" className="w-fit">Créer</Button>
          </ActionForm>
        </Card>

        <Card>
          <CardTitle>Nouvelle notion (brouillon)</CardTitle>
          <ActionForm action={createConceptAction} className="mt-4 grid gap-3">
            <Label htmlFor="concept-chapter">Chapitre</Label>
            <select id="concept-chapter" name="chapterId" className={select}>
              {subjectYears.flatMap((sy) => sy.chapters.map((chapter) => (
                <option key={chapter.id} value={chapter.id}>{sy.subject.name} · {chapter.title}</option>
              )))}
            </select>
            <Label htmlFor="concept-title">Intitulé</Label>
            <Input id="concept-title" name="title" maxLength={200} required />
            <Label htmlFor="concept-weight">Poids (0,1 à 5)</Label>
            <Input id="concept-weight" name="weight" type="number" step="0.1" min={0.1} max={5} defaultValue={1} required />
            <Button type="submit" className="w-fit">Créer</Button>
          </ActionForm>
        </Card>
      </div>
      ) : null}

      <section className="mt-10 grid gap-6" aria-labelledby="tree">
        <h2 id="tree" className="text-lg font-semibold text-foreground">Arborescence</h2>
        {subjectYears.map((sy) => (
          <Card key={sy.id}>
            <CardTitle>{sy.academicYear.name} · {sy.subject.name}</CardTitle>
            <ul className="mt-4 grid gap-5">
              {sy.chapters.length === 0 ? <li className="text-sm text-muted-foreground">Aucun chapitre.</li> : null}
              {sy.chapters.map((chapter) => (
                <li key={chapter.id} className="grid gap-2">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span className="font-medium text-foreground">{chapter.title}</span>
                    {editable ? (
                    <ActionForm action={setChapterStatusAction} className="flex items-center gap-2">
                      <input type="hidden" name="chapterId" value={chapter.id} />
                      <span className="text-xs text-muted-foreground">{chapter.status === "VALIDATED" ? "Publié" : "Brouillon"}</span>
                      <Button type="submit" name="status" value={chapter.status === "VALIDATED" ? "DRAFT" : "VALIDATED"} variant="secondary" size="sm">
                        {chapter.status === "VALIDATED" ? "Retirer" : "Publier"}
                      </Button>
                    </ActionForm>
                    ) : <span className="text-xs text-muted-foreground">{chapter.status === "VALIDATED" ? "Publié" : "Brouillon"}</span>}
                  </div>
                  <ul className="grid gap-1 pl-4 text-sm text-muted-foreground">
                    {chapter.concepts.map((concept) => <li key={concept.id}>{concept.title} <span className="text-xs">(poids {concept.weight})</span></li>)}
                  </ul>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </section>
    </>
  );
}
