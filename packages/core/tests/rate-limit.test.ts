import { describe, expect, it } from "vitest";
import { decideRate } from "../src/rate-limit.ts";

const NOW = new Date("2026-10-08T10:00:00Z");
const MINUTE = 60_000;

describe("decideRate", () => {
  it("autorise la première requête d'une fenêtre neuve", () => {
    const d = decideRate(null, NOW, 3, MINUTE);
    expect(d.allowed).toBe(true);
    expect(d.next).toEqual({ count: 1, windowStart: NOW });
  });

  it("bloque après la limite dans la fenêtre, avec un délai d'attente", () => {
    const state = { count: 3, windowStart: new Date(NOW.getTime() - 20_000) };
    const d = decideRate(state, NOW, 3, MINUTE);
    expect(d.allowed).toBe(false);
    expect(d.retryAfterSeconds).toBe(40);
  });

  it("réinitialise la fenêtre une fois expirée", () => {
    const state = { count: 3, windowStart: new Date(NOW.getTime() - 2 * MINUTE) };
    const d = decideRate(state, NOW, 3, MINUTE);
    expect(d.allowed).toBe(true);
    expect(d.next.count).toBe(1);
  });
});
