import { describe, expect, it } from "vitest";
import { isGlbBuffer, isValidMeshName } from "../src/anatomy.ts";

describe("isGlbBuffer", () => {
  it("reconnaît un en-tête GLB 2", () => {
    expect(isGlbBuffer(new Uint8Array([0x67, 0x6c, 0x54, 0x46, 2, 0, 0, 0, 0, 0, 0, 0]))).toBe(true);
  });

  it("refuse un autre format ou un fichier tronqué", () => {
    expect(isGlbBuffer(new TextEncoder().encode("%PDF-1.3 contenu"))).toBe(false);
    expect(isGlbBuffer(new Uint8Array([0x67, 0x6c, 0x54, 0x46]))).toBe(false);
    expect(isGlbBuffer(new Uint8Array([0x67, 0x6c, 0x54, 0x46, 1, 0, 0, 0, 0, 0, 0, 0]))).toBe(false);
  });
});

describe("isValidMeshName", () => {
  it("accepte les noms simples et refuse les caractères dangereux", () => {
    expect(isValidMeshName("heart.left_ventricle")).toBe(true);
    expect(isValidMeshName("ventricule gauche")).toBe(false);
    expect(isValidMeshName("../etc")).toBe(false);
    expect(isValidMeshName("")).toBe(false);
  });
});
