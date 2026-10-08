import { describe, expect, it } from "vitest";
import { reciprocalRankFusion } from "../src/fusion.ts";

describe("reciprocalRankFusion", () => {
  it("favorise un passage présent dans les deux classements", () => {
    const result = reciprocalRankFusion([["a", "b", "c"], ["c", "d"]], 3);
    expect(result[0]).toBe("c");
  });

  it("garde les résultats d'une seule liste si l'autre est vide", () => {
    expect(reciprocalRankFusion([["x", "y"], []], 5)).toEqual(["x", "y"]);
  });

  it("borne le nombre de résultats", () => {
    expect(reciprocalRankFusion([["a", "b", "c"]], 2)).toHaveLength(2);
    expect(reciprocalRankFusion([["a"]], 0)).toEqual([]);
  });

  it("est déterministe à score égal", () => {
    expect(reciprocalRankFusion([["b"], ["a"]], 2)).toEqual(["a", "b"]);
  });
});
