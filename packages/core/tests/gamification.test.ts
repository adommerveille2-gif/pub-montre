import { describe, expect, it } from "vitest";
import { computeXp, levelFromXp, unlockedBadges, XP_RULES } from "../src/gamification.ts";

describe("computeXp", () => {
  it("accorde plus d'XP à une bonne réponse qu'à une mauvaise", () => {
    expect(computeXp({ answers: 2, correctAnswers: 1, flashcardReviews: 0 })).toBe(XP_RULES.correctAnswer + XP_RULES.wrongAnswer);
  });

  it("ajoute l'XP des cartes mémoire", () => {
    expect(computeXp({ answers: 0, correctAnswers: 0, flashcardReviews: 4 })).toBe(4 * XP_RULES.flashcardReview);
  });
});

describe("levelFromXp", () => {
  it("commence au niveau 1 avec 0 XP", () => {
    expect(levelFromXp(0)).toEqual({ level: 1, currentXp: 0, nextLevelXp: 50 });
  });

  it("passe au niveau 2 à 50 XP, au niveau 3 à 200 XP", () => {
    expect(levelFromXp(49).level).toBe(1);
    expect(levelFromXp(50).level).toBe(2);
    expect(levelFromXp(199).level).toBe(2);
    expect(levelFromXp(200).level).toBe(3);
  });

  it("donne la progression dans le niveau courant", () => {
    const result = levelFromXp(250);
    expect(result.level).toBe(3);
    expect(result.currentXp).toBe(50);
    expect(result.nextLevelXp).toBe(250);
  });
});

describe("unlockedBadges", () => {
  const base = { answers: 0, correctAnswers: 0, flashcardReviews: 0, streakDays: 0, conceptsMastered: 0 };

  it("n'accorde aucun badge à un nouvel étudiant", () => {
    expect(unlockedBadges(base)).toEqual([]);
  });

  it("accorde les badges dont la condition est remplie", () => {
    const codes = unlockedBadges({ ...base, answers: 1, streakDays: 7 }).map((b) => b.code);
    expect(codes).toEqual(["first_answer", "week_streak"]);
  });
});
