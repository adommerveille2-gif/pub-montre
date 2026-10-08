import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import JSZip from "jszip";
import { describe, expect, it } from "vitest";
import { extractSections, matchesSignature, ExtractionUnavailableError } from "@/server/documents/extract";

const fixture = (name: string) => new Uint8Array(readFileSync(resolve(process.cwd(), "e2e/fixtures", name)));

async function makePptx(slides: string[]): Promise<Uint8Array> {
  const zip = new JSZip();
  zip.file("[Content_Types].xml", "<Types/>");
  slides.forEach((text, index) => {
    zip.file(`ppt/slides/slide${index + 1}.xml`, `<p:sld><a:t>${text}</a:t></p:sld>`);
  });
  return zip.generateAsync({ type: "uint8array" });
}

describe("extractSections", () => {
  it("extrait le texte d'un PDF page par page", async () => {
    const sections = await extractSections(fixture("cours-insuffisance.pdf"), "application/pdf");
    expect(sections).toHaveLength(2);
    expect(sections[0]?.pageRef).toBe(1);
    expect(sections[0]?.text).toContain("orthopnee");
    expect(sections[1]?.pageRef).toBe(2);
    expect(sections[1]?.text).toContain("echocardiographie");
  });

  it("extrait le texte d'un DOCX", async () => {
    const sections = await extractSections(
      fixture("cours-hta.docx"),
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    );
    expect(sections.map((s) => s.text).join(" ")).toContain("140 mmHg");
    expect(sections[0]?.pageRef).toBeNull();
  });

  it("extrait le texte des diapositives dans l'ordre, en décodant les entités XML", async () => {
    const bytes = await makePptx(["Diapo deux &amp; suite", "Diapo un"]);
    const sections = await extractSections(bytes, "application/vnd.openxmlformats-officedocument.presentationml.presentation");
    expect(sections.map((s) => s.pageRef)).toEqual([1, 2]);
    expect(sections[0]?.text).toBe("Diapo deux & suite");
  });

  it("signale clairement qu'une image ne peut pas encore être lue", async () => {
    await expect(extractSections(new Uint8Array([0x89, 0x50, 0x4e, 0x47]), "image/png")).rejects.toBeInstanceOf(ExtractionUnavailableError);
  });
});

describe("matchesSignature", () => {
  it("refuse un fichier renommé dont le contenu n'est pas celui annoncé", () => {
    const text = new TextEncoder().encode("ceci n'est pas un pdf");
    expect(matchesSignature(text, "application/pdf")).toBe(false);
    expect(matchesSignature(fixture("cours-insuffisance.pdf"), "application/pdf")).toBe(true);
  });
});
