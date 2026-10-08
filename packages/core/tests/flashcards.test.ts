import { describe, expect, it } from "vitest";
import { nextFlashcardState } from "../src/scheduling.ts";

const fresh = { level: 1, reps: 0, lapses: 0 };

describe("nextFlashcardState", () => {
  it("revient au niveau 1 et compte un oubli quand la carte est à revoir", () => {
    const next = nextFlashcardState({ level: 4, reps: 6, lapses: 0 }, "again");
    expect(next).toEqual({ level: 1, reps: 7, lapses: 1, dueInDays: 1 });
  });

  it("monte d'un niveau quand la carte est bien sue", () => {
    expect(nextFlashcardState(fresh, "good").level).toBe(2);
  });

  it("monte de deux niveaux quand elle est facile, sans dépasser 5", () => {
    expect(nextFlashcardState(fresh, "easy").level).toBe(3);
    expect(nextFlashcardState({ level: 5, reps: 3, lapses: 0 }, "easy").level).toBe(5);
  });

  it("espace davantage les cartes qui montent de niveau", () => {
    const soon = nextFlashcardState(fresh, "good").dueInDays;
    const later = nextFlashcardState({ level: 4, reps: 5, lapses: 0 }, "good").dueInDays;
    expect(later).toBeGreaterThan(soon);
  });
});
