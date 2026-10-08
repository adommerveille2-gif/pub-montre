import { dayKey } from "./calendar.ts";
import { priorityScore, type ConceptState } from "./plan.ts";

export type PlanConcept = ConceptState & { id: string; subjectId: string; weight: number };

export type PlannedSession = {
  date: string;
  minutes: number;
  subjectId: string;
  conceptId: string | null;
  activity: string;
};

const DAY_MS = 24 * 60 * 60 * 1000;

/** Date calendaire « AAAA-MM-JJ » d'un instant, en UTC. Les dates de plan sont des jours, pas des instants. */
export function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/**
 * Répartit le temps de révision jour par jour, de `start` à la veille de l'examen.
 * - le temps total disponible est réparti entre les notions selon leur priorité ;
 * - chaque jour, on prend à chaque fois la notion qui a encore le plus de temps à recevoir,
 *   ce qui fait alterner les notions au lieu de consacrer toute la journée à une seule ;
 * - une session dure entre 15 et 30 minutes et ne dépasse pas le budget du jour.
 */
export function buildStudyPlan(params: {
  start: Date;
  examDate: Date;
  dailyMinutes: number;
  concepts: PlanConcept[];
}): PlannedSession[] {
  const { start, examDate, dailyMinutes, concepts } = params;
  const sessions: PlannedSession[] = [];
  if (concepts.length === 0 || dailyMinutes < 15) return sessions;

  // Nombre de jours calendaires entre le départ et la veille de l'examen.
  const days = Math.round((startOfUtcDay(examDate) - startOfUtcDay(start)) / DAY_MS);
  if (days <= 0) return sessions;

  const scores = concepts.map((concept) => priorityScore(concept, concept.weight));
  const totalScore = scores.reduce((sum, value) => sum + value, 0);
  const totalMinutes = days * dailyMinutes;

  // Temps à recevoir par notion, proportionnel à sa priorité (parts égales si toutes sont à zéro).
  const budget = concepts.map((_, index) =>
    totalScore > 0 ? (totalMinutes * (scores[index] ?? 0)) / totalScore : totalMinutes / concepts.length,
  );

  for (let offset = 0; offset < days; offset++) {
    const date = isoDay(new Date(startOfUtcDay(start) + offset * DAY_MS));
    let remaining = dailyMinutes;

    while (remaining >= 15) {
      // Notion la plus en retard sur son budget.
      let pick = -1;
      for (let index = 0; index < concepts.length; index++) {
        if ((budget[index] ?? 0) >= 15 && (pick === -1 || (budget[index] ?? 0) > (budget[pick] ?? 0))) pick = index;
      }
      if (pick === -1) break;

      const concept = concepts[pick]!;
      const minutes = Math.min(remaining, 30, Math.floor(budget[pick] ?? 0));
      const activity =
        concept.evidenceCount === 0
          ? "Découvrir et lire le cours"
          : concept.mastery < 0.5
            ? "Revoir et s'entraîner"
            : "Consolider par des questions";

      sessions.push({ date, minutes, subjectId: concept.subjectId, conceptId: concept.id, activity });
      remaining -= minutes;
      budget[pick] = (budget[pick] ?? 0) - minutes;
    }
  }
  return sessions;
}

export type ReviewBucket = "today" | "tomorrow" | "in3" | "in7" | "in14" | "later";

/** Classe une échéance de révision par rapport à aujourd'hui, en jours calendaires du fuseau de l'étudiant. */
export function reviewBucket(dueAt: Date, now: Date, timeZone = "UTC"): ReviewBucket {
  const days = Math.round((dayNumber(dayKey(dueAt, timeZone)) - dayNumber(dayKey(now, timeZone))) / DAY_MS);
  if (days <= 0) return "today";
  if (days === 1) return "tomorrow";
  if (days <= 3) return "in3";
  if (days <= 7) return "in7";
  if (days <= 14) return "in14";
  return "later";
}



function dayNumber(key: string): number {
  const [year, month, day] = key.split("-").map(Number);
  return Date.UTC(year!, month! - 1, day!);
}

function startOfUtcDay(date: Date): number {
  return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate());
}
