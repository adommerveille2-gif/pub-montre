import "server-only";
import { Prisma, prisma } from "@pub-montre/db";

export type RateResult = { allowed: boolean; retryAfterSeconds: number };

/**
 * Consomme une unité de quota pour `key`. Fenêtre fixe, mise à jour atomique (un seul INSERT … ON CONFLICT).
 * Les requêtes au-delà de la limite sont refusées jusqu'à la fin de la fenêtre.
 */
export async function consumeRate(key: string, limit: number, windowMs: number, now = new Date()): Promise<RateResult> {
  const cutoff = new Date(now.getTime() - windowMs);
  const [row] = await prisma.$queryRaw<{ count: number; windowStart: Date }[]>(Prisma.sql`
    INSERT INTO "RateLimit" ("key", "count", "windowStart")
    VALUES (${key}, 1, ${now})
    ON CONFLICT ("key") DO UPDATE SET
      "count" = CASE WHEN "RateLimit"."windowStart" <= ${cutoff} THEN 1 ELSE "RateLimit"."count" + 1 END,
      "windowStart" = CASE WHEN "RateLimit"."windowStart" <= ${cutoff} THEN ${now} ELSE "RateLimit"."windowStart" END
    RETURNING "count", "windowStart"
  `);
  if (!row) return { allowed: true, retryAfterSeconds: 0 };

  const allowed = row.count <= limit;
  const remainingMs = row.windowStart.getTime() + windowMs - now.getTime();
  return { allowed, retryAfterSeconds: allowed ? 0 : Math.max(1, Math.ceil(remainingMs / 1000)) };
}

export const LIMITS = {
  loginPerEmail: { limit: 5, windowMs: 15 * 60 * 1000 },
  tutorPerUser: { limit: 30, windowMs: 60 * 60 * 1000 },
  importPerUser: { limit: 20, windowMs: 60 * 60 * 1000 },
} as const;
