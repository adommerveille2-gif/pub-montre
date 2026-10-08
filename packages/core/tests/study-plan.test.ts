import { describe, expect, it } from "vitest";
import { buildStudyPlan, reviewBucket, isoDay, type PlanConcept } from "../src/study-plan.ts";

const START = new Date("2026-10-08T10:00:00Z");
const concept = (id: string, subjectId: string, mastery: number, evidenceCount: number, weight = 1): PlanConcept => ({
  id, subjectId, mastery, confidence: 0.5, evidenceCount, weight,
});

describe("buildStudyPlan", () => {
  it("répartit les jours jusqu'à la veille de l'examen", () => {
    const plan = buildStudyPlan({
      start: START,
      examDate: new Date("2026-10-11T00:00:00Z"),
      dailyMinutes: 30,
      concepts: [concept("c1", "s1", 0.2, 5)],
    });
    expect([...new Set(plan.map((s) => s.date))]).toEqual(["2026-10-08", "2026-10-09", "2026-10-10"]);
  });

  it("ne dépasse jamais le temps quotidien", () => {
    const plan = buildStudyPlan({
      start: START,
      examDate: new Date("2026-10-12T00:00:00Z"),
      dailyMinutes: 40,
      concepts: [concept("c1", "s1", 0.2, 5), concept("c2", "s2", 0.9, 5), concept("c3", "s3", 0.4, 2)],
    });
    for (const day of new Set(plan.map((s) => s.date))) {
      const total = plan.filter((s) => s.date === day).reduce((sum, s) => sum + s.minutes, 0);
      expect(total).toBeLessThanOrEqual(40);
    }
  });

  it("place la notion la plus faible en premier et lui réserve le plus de temps", () => {
    const plan = buildStudyPlan({
      start: START,
      examDate: new Date("2026-10-12T00:00:00Z"),
      dailyMinutes: 60,
      concepts: [concept("forte", "s1", 0.95, 10), concept("faible", "s2", 0.1, 10)],
    });
    expect(plan[0]?.conceptId).toBe("faible");
    const minutesOf = (id: string) => plan.filter((s) => s.conceptId === id).reduce((sum, s) => sum + s.minutes, 0);
    expect(minutesOf("faible")).toBeGreaterThan(minutesOf("forte"));
  });

  it("fait alterner les notions au lieu de consacrer toute la journée à une seule", () => {
    const plan = buildStudyPlan({
      start: START,
      examDate: new Date("2026-10-16T00:00:00Z"),
      dailyMinutes: 30,
      concepts: [concept("a", "s1", 0.2, 5), concept("b", "s1", 0.4, 5), concept("c", "s2", 0.3, 5)],
    });
    const covered = new Set(plan.map((s) => s.conceptId));
    expect(covered).toEqual(new Set(["a", "b", "c"]));
  });

  it("ne produit rien sans notion ou avec moins de 15 minutes par jour", () => {
    expect(buildStudyPlan({ start: START, examDate: new Date("2026-10-20T00:00:00Z"), dailyMinutes: 30, concepts: [] })).toEqual([]);
    expect(buildStudyPlan({ start: START, examDate: new Date("2026-10-20T00:00:00Z"), dailyMinutes: 10, concepts: [concept("c", "s", 0.1, 1)] })).toEqual([]);
  });
});

describe("reviewBucket", () => {
  const now = new Date("2026-10-08T15:00:00Z");
  it("classe les échéances par jours calendaires", () => {
    expect(reviewBucket(new Date("2026-10-07T08:00:00Z"), now)).toBe("today");
    expect(reviewBucket(new Date("2026-10-08T23:00:00Z"), now)).toBe("today");
    expect(reviewBucket(new Date("2026-10-09T08:00:00Z"), now)).toBe("tomorrow");
    expect(reviewBucket(new Date("2026-10-11T08:00:00Z"), now)).toBe("in3");
    expect(reviewBucket(new Date("2026-10-15T08:00:00Z"), now)).toBe("in7");
    expect(reviewBucket(new Date("2026-10-22T08:00:00Z"), now)).toBe("in14");
    expect(reviewBucket(new Date("2026-12-01T08:00:00Z"), now)).toBe("later");
  });

  it("formate les jours en AAAA-MM-JJ", () => {
    expect(isoDay(new Date("2026-10-08T23:30:00Z"))).toBe("2026-10-08");
  });
});

describe("reviewBucket dans le fuseau de l'étudiant", () => {
  it("compte le jour à Paris, pas le jour UTC", () => {
    // 00 h 30 à Paris le 9 octobre = 22 h 30 UTC le 8 : la révision est « demain » à Paris, « aujourd'hui » en UTC.
    const now = new Date("2026-10-08T23:00:00Z");
    expect(reviewBucket(new Date("2026-10-09T10:00:00Z"), now, "Europe/Paris")).toBe("today");
    expect(reviewBucket(new Date("2026-10-09T10:00:00Z"), now, "UTC")).toBe("tomorrow");
  });
});
