import { describe, expect, it } from "vitest";
import { canRequestHint, caseStatus, nextStepIndex } from "../src/case-progress.ts";

describe("progression d'un cas", () => {
  it("donne l'étape suivante, puis rien une fois le cas terminé", () => {
    expect(nextStepIndex(0, 4)).toBe(0);
    expect(nextStepIndex(3, 4)).toBe(3);
    expect(nextStepIndex(4, 4)).toBeNull();
    expect(nextStepIndex(0, 0)).toBeNull();
  });

  it("qualifie l'état du cas", () => {
    expect(caseStatus(0, 4)).toBe("NOT_STARTED");
    expect(caseStatus(2, 4)).toBe("IN_PROGRESS");
    expect(caseStatus(4, 4)).toBe("FINISHED");
  });

  it("limite les indices au nombre prévu pour l'étape", () => {
    expect(canRequestHint(0, 2)).toBe(true);
    expect(canRequestHint(2, 2)).toBe(false);
    expect(canRequestHint(0, 0)).toBe(false);
  });
});
