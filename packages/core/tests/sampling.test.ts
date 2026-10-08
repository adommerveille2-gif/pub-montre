import { describe, expect, it } from "vitest";
import { sameSelection, sampleWithoutReplacement } from "../src/sampling.ts";

describe("sampleWithoutReplacement", () => {
  it("ne renvoie jamais deux fois le même élément", () => {
    const result = sampleWithoutReplacement([1, 2, 3, 4, 5], 5, () => 0.42);
    expect(new Set(result).size).toBe(5);
  });

  it("borne le nombre d'éléments au stock disponible", () => {
    expect(sampleWithoutReplacement([1, 2], 10)).toHaveLength(2);
    expect(sampleWithoutReplacement([1, 2], -3)).toHaveLength(0);
  });

  it("est déterministe avec un générateur fixe", () => {
    const seq = [0, 0, 0];
    const random = () => seq.shift() ?? 0;
    expect(sampleWithoutReplacement(["a", "b", "c"], 2, random)).toEqual(["a", "b"]);
  });
});

describe("sameSelection", () => {
  it("compare des ensembles sans tenir compte de l'ordre", () => {
    expect(sameSelection(["a", "b"], ["b", "a"])).toBe(true);
  });

  it("refuse une sélection partielle ou en trop", () => {
    expect(sameSelection(["a"], ["a", "b"])).toBe(false);
    expect(sameSelection(["a", "b"], ["a"])).toBe(false);
    expect(sameSelection([], ["a"])).toBe(false);
  });

  it("accepte deux sélections vides", () => {
    expect(sameSelection([], [])).toBe(true);
  });
});
