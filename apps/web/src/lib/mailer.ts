import "server-only";
import nodemailer from "nodemailer";
import { getEnv } from "./env";

type MagicLinkParams = {
  to: string;
  url: string;
};

/**
 * Envoie le lien de connexion.
 * - EMAIL_DRIVER=smtp : envoi réel (SMTP_URL requis).
 * - EMAIL_DRIVER=console : lien affiché dans les journaux du serveur (développement, tests).
 */
export async function sendMagicLink({ to, url }: MagicLinkParams): Promise<void> {
  const env = getEnv();
  const driver = env.EMAIL_DRIVER ?? (process.env.NODE_ENV === "production" ? "smtp" : "console");

  if (driver === "console") {
    console.info(`[auth] Lien de connexion pour ${to} (EMAIL_DRIVER=console) :\n${url}`);
    return;
  }

  if (!env.SMTP_URL) {
    throw new Error("SMTP_URL est requis lorsque EMAIL_DRIVER=smtp.");
  }

  const transport = nodemailer.createTransport(env.SMTP_URL);
  await transport.sendMail({
    from: env.EMAIL_FROM,
    to,
    subject: "Ton lien de connexion",
    text: `Bonjour,\n\nClique sur ce lien pour te connecter à ton tuteur médical :\n${url}\n\nSi tu n'es pas à l'origine de cette demande, ignore cet e-mail.`,
    html: `<p>Bonjour,</p><p>Clique sur ce lien pour te connecter à ton tuteur médical :</p><p><a href="${url}">Me connecter</a></p><p>Si tu n'es pas à l'origine de cette demande, ignore cet e-mail.</p>`,
  });
}
