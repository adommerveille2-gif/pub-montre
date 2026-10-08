import "server-only";
import Anthropic from "@anthropic-ai/sdk";
import { prisma } from "@pub-montre/db";

export class TutorNotConfiguredError extends Error {
  constructor() {
    super("Le tuteur IA n'est pas encore connecté (clé ANTHROPIC_API_KEY manquante).");
  }
}

export function isTutorConfigured(): boolean {
  return Boolean(process.env.ANTHROPIC_API_KEY);
}

const DEFAULT_MODEL = "claude-sonnet-5-5";

/** Consignes pédagogiques : enseigner, vérifier la compréhension, ne jamais diagnostiquer. */
export function buildTutorSystemPrompt(context: { firstName?: string | null; yearName?: string | null; goal?: string | null }): string {
  const who = context.firstName ? `L'étudiant s'appelle ${context.firstName}.` : "L'étudiant n'a pas indiqué son prénom.";
  const year = context.yearName ? `Il est en ${context.yearName} de médecine.` : "Son année d'études n'est pas renseignée.";
  return [
    "Tu es un tuteur médical pédagogique pour étudiants en médecine, de la 1re à la 6e année.",
    who,
    year,
    "",
    "Règles :",
    "- Explique clairement, adapte ton niveau à la question et propose un exemple concret.",
    "- Après une explication, propose 1 à 3 questions de vérification pour contrôler la compréhension.",
    "- Si l'étudiant se trompe, corrige sans humilier et explique pourquoi.",
    "- Tu es un outil éducatif. Tu ne poses aucun diagnostic et ne proposes aucun traitement pour un patient réel.",
    "- Si tu n'es pas certain d'une information, dis-le explicitement : « Je ne dispose pas de suffisamment d'informations fiables pour répondre avec certitude. »",
    "- Ne cite pas de référence bibliographique inventée. Si tu cites une recommandation, indique son nom exact et son année.",
    "- Réponds en français.",
  ].join("\n");
}

type Turn = { role: "user" | "assistant"; content: string };

/**
 * Appelle le modèle. Les messages sont passés tels quels ; la mémoire de la conversation
 * est celle de la base (Message). Lève TutorNotConfiguredError sans clé.
 */
export async function askTutor(params: {
  userId: string;
  system: string;
  turns: Turn[];
}): Promise<string> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new TutorNotConfiguredError();

  const model = process.env.TUTOR_MODEL ?? DEFAULT_MODEL;
  const client = new Anthropic({ apiKey });
  const response = await client.messages.create({
    model,
    max_tokens: 1200,
    system: params.system,
    messages: params.turns,
  });

  const text = response.content
    .map((block) => (block.type === "text" ? block.text : ""))
    .join("")
    .trim();

  await prisma.llmUsage.create({
    data: {
      userId: params.userId,
      provider: "anthropic",
      model,
      task: "tutor_chat",
      inputTokens: response.usage.input_tokens,
      outputTokens: response.usage.output_tokens,
    },
  });

  return text;
}
