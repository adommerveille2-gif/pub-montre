import { describe, expect, it } from "vitest";
import { chunkSections, searchTerms } from "../src/chunking.ts";

const words = (n: number, prefix = "mot") => Array.from({ length: n }, (_, i) => `${prefix}${i}`).join(" ");

describe("chunkSections", () => {
  it("garde un seul fragment pour un petit texte", () => {
    const chunks = chunkSections([{ text: words(10), pageRef: 2 }], 350, 50);
    expect(chunks).toHaveLength(1);
    expect(chunks[0]).toMatchObject({ position: 0, pageRef: 2 });
  });

  it("recouvre les fragments successifs du nombre de mots demandé", () => {
    const chunks = chunkSections([{ text: words(100), pageRef: null }], 40, 10);
    const first = chunks[0]!.content.split(" ");
    const second = chunks[1]!.content.split(" ");
    expect(first).toHaveLength(40);
    expect(second.slice(0, 10)).toEqual(first.slice(30, 40));
  });

  it("ne perd aucun mot du texte d'origine", () => {
    const source = words(777);
    const chunks = chunkSections([{ text: source, pageRef: null }], 100, 20);
    const last = chunks.at(-1)!.content.split(" ");
    expect(last.at(-1)).toBe("mot776");
  });

  it("numérote les fragments de façon continue entre les sections", () => {
    const chunks = chunkSections(
      [
        { text: words(5, "a"), pageRef: 1 },
        { text: words(5, "b"), pageRef: 2 },
      ],
      350,
      50,
    );
    expect(chunks.map((c) => c.position)).toEqual([0, 1]);
    expect(chunks.map((c) => c.pageRef)).toEqual([1, 2]);
  });

  it("ignore les sections vides et refuse un recouvrement trop grand", () => {
    expect(chunkSections([{ text: "   ", pageRef: null }])).toEqual([]);
    expect(() => chunkSections([{ text: "a b", pageRef: null }], 10, 10)).toThrow();
  });
});

describe("searchTerms", () => {
  it("retire accents, casse, mots vides et ponctuation", () => {
    expect(searchTerms("Le potentiel d'action, du cœur ?")).toEqual(["potentiel", "action", "coeur"]);
    expect(searchTerms("Hypertension ARTÉRIELLE")).toEqual(["hypertension", "arterielle"]);
  });
});
