import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.string().min(1, "DATABASE_URL est requis"),
  /** Requis en production (Auth.js). */
  AUTH_SECRET: z.string().min(16).optional(),
  /** URL publique de l'application. */
  AUTH_URL: z.url().optional(),
  /** `smtp` envoie les e-mails ; `console` affiche le lien dans les journaux du serveur. Par défaut : smtp en production, console ailleurs. */
  EMAIL_DRIVER: z.enum(["smtp", "console"]).optional(),
  /** Requis si EMAIL_DRIVER = smtp. */
  SMTP_URL: z.string().optional(),
  EMAIL_FROM: z.string().min(1).default("Tuteur médical <no-reply@example.com>"),
});

export type Env = z.infer<typeof envSchema>;

/** Valide un ensemble de variables d'environnement. Lève une erreur explicite si la configuration est invalide. */
export function parseEnv(source: Record<string, string | undefined>): Env {
  const result = envSchema.safeParse(source);
  if (!result.success) {
    const details = result.error.issues
      .map((issue) => `- ${issue.path.join(".")} : ${issue.message}`)
      .join("\n");
    throw new Error(`Configuration d'environnement invalide :\n${details}`);
  }
  return result.data;
}

let cached: Env | undefined;

/** Accès paresseux : la validation n'a lieu qu'à l'exécution, pas pendant le build. */
export function getEnv(): Env {
  cached ??= parseEnv(process.env);
  return cached;
}
