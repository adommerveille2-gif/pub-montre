import "server-only";
import { prisma } from "@pub-montre/db";
import type { ConceptState } from "@pub-montre/core";

export type ConceptRow = ConceptState & {
  id: string;
  title: string;
  weight: number;
  chapterId: string;
  chapterTitle: string;
  subjectId: string;
  subjectName: string;
  yearId: string;
  yearName: string;
  yearOrder: number;
};

/** Toutes les notions des chapitres validés, avec la maîtrise de l'utilisateur (ou l'absence de preuve). */
export async function loadConceptRows(userId: string): Promise<ConceptRow[]> {
  const concepts = await prisma.concept.findMany({
    where: { status: "VALIDATED", chapter: { status: "VALIDATED" } },
    select: {
      id: true,
      title: true,
      weight: true,
      masteryStates: {
        where: { userId },
        select: { mastery: true, confidence: true, evidenceCount: true },
      },
      chapter: {
        select: {
          id: true,
          title: true,
          subjectYear: {
            select: {
              academicYear: { select: { id: true, name: true, order: true } },
              subject: { select: { id: true, name: true } },
            },
          },
        },
      },
    },
  });

  return concepts
    .map((concept) => {
      const state = concept.masteryStates[0];
      const { chapter } = concept;
      const { academicYear, subject } = chapter.subjectYear;
      return {
        id: concept.id,
        title: concept.title,
        weight: concept.weight,
        mastery: state?.mastery ?? 0.5,
        confidence: state?.confidence ?? 0,
        evidenceCount: state?.evidenceCount ?? 0,
        chapterId: chapter.id,
        chapterTitle: chapter.title,
        subjectId: subject.id,
        subjectName: subject.name,
        yearId: academicYear.id,
        yearName: academicYear.name,
        yearOrder: academicYear.order,
      };
    })
    .sort(
      (a, b) =>
        a.yearOrder - b.yearOrder ||
        a.subjectName.localeCompare(b.subjectName, "fr") ||
        a.chapterTitle.localeCompare(b.chapterTitle, "fr") ||
        a.title.localeCompare(b.title, "fr"),
    );
}

/** Années, matières et chapitres validés, pour les sélecteurs d'entraînement et de cours. */
export async function loadTaxonomy() {
  const years = await prisma.academicYear.findMany({
    where: { active: true },
    orderBy: { order: "asc" },
    select: {
      id: true,
      name: true,
      order: true,
      subjectYears: {
        orderBy: { subject: { name: "asc" } },
        select: {
          id: true,
          subject: { select: { id: true, name: true } },
          chapters: {
            where: { status: "VALIDATED" },
            orderBy: { position: "asc" },
            select: {
              id: true,
              title: true,
              questions: { where: { status: "VALIDATED" }, select: { id: true } },
            },
          },
        },
      },
    },
  });

  return years.map((year) => ({
    ...year,
    subjectYears: year.subjectYears.filter((sy) => sy.chapters.length > 0),
  }));
}
