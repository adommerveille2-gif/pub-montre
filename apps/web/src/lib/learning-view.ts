import { rollupMastery, type Rollup } from "@pub-montre/core";
import type { ConceptRow } from "@/server/learning/queries";

export type ChapterGroup = {
  chapterId: string;
  chapterTitle: string;
  rollup: Rollup;
  concepts: ConceptRow[];
};

export type SubjectGroup = {
  subjectId: string;
  subjectName: string;
  rollup: Rollup;
  chapters: ChapterGroup[];
};

/** Regroupe les notions par matière puis par chapitre, dans l'ordre d'arrivée des lignes. */
export function groupBySubject(rows: readonly ConceptRow[]): SubjectGroup[] {
  const subjects = new Map<string, { name: string; chapters: Map<string, { title: string; concepts: ConceptRow[] }> }>();

  for (const row of rows) {
    const subject = subjects.get(row.subjectId) ?? { name: row.subjectName, chapters: new Map() };
    const chapter = subject.chapters.get(row.chapterId) ?? { title: row.chapterTitle, concepts: [] };
    chapter.concepts.push(row);
    subject.chapters.set(row.chapterId, chapter);
    subjects.set(row.subjectId, subject);
  }

  return [...subjects.entries()].map(([subjectId, subject]) => {
    const chapters = [...subject.chapters.entries()].map(([chapterId, chapter]) => ({
      chapterId,
      chapterTitle: chapter.title,
      rollup: rollupMastery(chapter.concepts),
      concepts: chapter.concepts,
    }));
    const allConcepts = chapters.flatMap((chapter) => chapter.concepts);
    return {
      subjectId,
      subjectName: subject.name,
      rollup: rollupMastery(allConcepts),
      chapters,
    };
  });
}

export function percent(value: number | null): string {
  return value === null ? "—" : `${Math.round(value * 100)} %`;
}
