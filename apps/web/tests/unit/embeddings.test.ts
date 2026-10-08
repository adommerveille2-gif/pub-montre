import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { EMBEDDING_DIMENSIONS, EmbeddingError, embedTexts, isEmbeddingConfigured, toVectorLiteral } from "@/server/ai/embeddings";

const vector = () => Array.from({ length: EMBEDDING_DIMENSIONS }, (_, i) => i / 1000);
const okResponse = (count: number, dims = EMBEDDING_DIMENSIONS) =>
  new Response(JSON.stringify({ data: Array.from({ length: count }, (_, index) => ({ index, embedding: Array.from({ length: dims }, () => 0.5) })) }), { status: 200 });

describe("embeddings", () => {
  const original = process.env.OPENAI_API_KEY;
  beforeEach(() => { process.env.OPENAI_API_KEY = "test-key"; });
  afterEach(() => { process.env.OPENAI_API_KEY = original; vi.restoreAllMocks(); });

  it("n'est actif que si la clé est définie", () => {
    delete process.env.OPENAI_API_KEY;
    expect(isEmbeddingConfigured()).toBe(false);
    process.env.OPENAI_API_KEY = "x";
    expect(isEmbeddingConfigured()).toBe(true);
  });

  it("envoie le lot avec la clé et renvoie un vecteur par texte", async () => {
    const fetchMock = vi.fn(async () => okResponse(2));
    const result = await embedTexts(["un", "deux"], fetchMock as unknown as typeof fetch);
    expect(result).toHaveLength(2);
    expect(result[0]).toHaveLength(EMBEDDING_DIMENSIONS);
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("https://api.openai.com/v1/embeddings");
    expect((init.headers as Record<string, string>).Authorization).toBe("Bearer test-key");
    expect(JSON.parse(init.body as string).input).toEqual(["un", "deux"]);
  });

  it("refuse une dimension qui ne correspond pas à la base", async () => {
    await expect(embedTexts(["x"], (async () => okResponse(1, 10)) as unknown as typeof fetch)).rejects.toBeInstanceOf(EmbeddingError);
  });

  it("signale une erreur HTTP sans exposer la réponse brute", async () => {
    const failing = (async () => new Response("secret", { status: 429 })) as unknown as typeof fetch;
    await expect(embedTexts(["x"], failing)).rejects.toThrow("429");
  });

  it("refuse de travailler sans clé", async () => {
    delete process.env.OPENAI_API_KEY;
    await expect(embedTexts(["x"], vi.fn() as unknown as typeof fetch)).rejects.toThrow("OPENAI_API_KEY");
  });

  it("produit un littéral pgvector valide", () => {
    expect(toVectorLiteral([0.1, NaN, 2])).toBe("[0.1,0,2]");
    expect(vector()).toHaveLength(EMBEDDING_DIMENSIONS);
  });
});
