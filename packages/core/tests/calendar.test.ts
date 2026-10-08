import { describe, expect, it } from "vitest";
import { currentStreak, dayKey, startOfDayIn } from "../src/calendar.ts";

const PARIS = "Europe/Paris";

describe("calendrier de l'étudiant", () => {
  it("calcule la clé de jour dans le fuseau de l'étudiant, pas en UTC", () => {
    // 23 h 30 à Paris (été, UTC+2) : encore le même jour en France, déjà le lendemain en UTC.
    const lateEvening = new Date("2026-07-10T21:30:00Z");
    expect(dayKey(lateEvening, PARIS)).toBe("2026-07-10");
    expect(dayKey(new Date("2026-07-10T22:30:00Z"), PARIS)).toBe("2026-07-11");
  });

  it("trouve minuit à Paris, en heure d'été comme d'hiver", () => {
    const summer = startOfDayIn(new Date("2026-07-10T12:00:00Z"), PARIS);
    expect(summer.toISOString()).toBe("2026-07-09T22:00:00.000Z");
    const winter = startOfDayIn(new Date("2026-01-10T12:00:00Z"), PARIS);
    expect(winter.toISOString()).toBe("2026-01-09T23:00:00.000Z");
  });

  it("compte une série de jours consécutifs jusqu'à aujourd'hui", () => {
    const now = new Date("2026-10-08T10:00:00Z");
    const dates = [
      new Date("2026-10-08T09:00:00Z"),
      new Date("2026-10-07T09:00:00Z"),
      new Date("2026-10-06T09:00:00Z"),
      new Date("2026-10-04T09:00:00Z"), // trou le 5 : la série s'arrête
    ];
    expect(currentStreak(dates, now, PARIS)).toBe(3);
  });

  it("garde la série si l'étudiant n'a pas encore travaillé aujourd'hui", () => {
    const now = new Date("2026-10-08T10:00:00Z");
    const dates = [new Date("2026-10-07T09:00:00Z"), new Date("2026-10-06T09:00:00Z")];
    expect(currentStreak(dates, now, PARIS)).toBe(2);
  });

  it("vaut zéro sans activité récente", () => {
    expect(currentStreak([new Date("2026-09-01T09:00:00Z")], new Date("2026-10-08T10:00:00Z"), PARIS)).toBe(0);
  });
});
