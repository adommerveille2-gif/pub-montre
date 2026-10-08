import "server-only";
import { extractText as extractPdfText } from "unpdf";
import mammoth from "mammoth";
import JSZip from "jszip";
import type { TextSection } from "@pub-montre/core";

export const ALLOWED_TYPES = {
  "application/pdf": { extension: "pdf", signature: [0x25, 0x50, 0x44, 0x46] }, // %PDF
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": { extension: "docx", signature: [0x50, 0x4b, 0x03, 0x04] },
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": { extension: "pptx", signature: [0x50, 0x4b, 0x03, 0x04] },
  "image/png": { extension: "png", signature: [0x89, 0x50, 0x4e, 0x47] },
  "image/jpeg": { extension: "jpg", signature: [0xff, 0xd8, 0xff] },
} as const;

export type AllowedType = keyof typeof ALLOWED_TYPES;

export const MAX_UPLOAD_BYTES = 15 * 1024 * 1024;

export class ExtractionUnavailableError extends Error {}

/** Vérifie que le contenu correspond au type déclaré, pour ne pas accepter n'importe quel fichier renommé. */
export function matchesSignature(bytes: Uint8Array, mimeType: AllowedType): boolean {
  const { signature } = ALLOWED_TYPES[mimeType];
  return signature.every((byte, index) => bytes[index] === byte);
}

/** Extrait le texte par section (page ou diapositive). Lève ExtractionUnavailableError si le format n'a pas de texte exploitable. */
export async function extractSections(bytes: Uint8Array, mimeType: AllowedType): Promise<TextSection[]> {
  switch (mimeType) {
    case "application/pdf": {
      const result = await extractPdfText(bytes, { mergePages: false });
      const pages = Array.isArray(result.text) ? result.text : [result.text];
      return pages.map((text, index) => ({ text, pageRef: index + 1 }));
    }
    case "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      const { value } = await mammoth.extractRawText({ buffer: Buffer.from(bytes) });
      return [{ text: value, pageRef: null }];
    }
    case "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      return extractSlides(bytes);
    case "image/png":
    case "image/jpeg":
      throw new ExtractionUnavailableError(
        "Image enregistrée. L'extraction du texte (OCR) n'est pas encore disponible : l'image ne peut pas être utilisée pour les recherches et le tuteur.",
      );
  }
}

/** Texte des diapositives d'un PPTX, dans l'ordre de présentation. */
async function extractSlides(bytes: Uint8Array): Promise<TextSection[]> {
  const zip = await JSZip.loadAsync(bytes);
  const slideNames = Object.keys(zip.files)
    .filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))
    .sort((a, b) => slideNumber(a) - slideNumber(b));

  const sections: TextSection[] = [];
  for (const name of slideNames) {
    const xml = await zip.files[name]!.async("string");
    const runs = [...xml.matchAll(/<a:t>([^<]*)<\/a:t>/g)].map((match) => decodeXml(match[1] ?? ""));
    sections.push({ text: runs.join(" "), pageRef: slideNumber(name) });
  }
  return sections;
}

function slideNumber(name: string): number {
  return Number(/slide(\d+)\.xml$/.exec(name)?.[1] ?? 0);
}

function decodeXml(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, "&");
}
