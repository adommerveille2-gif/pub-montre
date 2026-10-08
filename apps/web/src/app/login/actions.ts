"use server";

import { redirect, unstable_rethrow } from "next/navigation";
import { z } from "zod";
import { signIn } from "@/lib/auth";
import { headers } from "next/headers";
import { consumeRate, LIMITS } from "@/server/security/rate-limit";
import { clientIpFromHeaders } from "@/server/security/client-ip";

export type LoginFormState = {
  status: "idle" | "error";
  message?: string;
};

const emailSchema = z.object({
  email: z.email({ message: "Indique une adresse e-mail valide." }).max(254),
});

/**
 * Envoie un lien de connexion (magic link) puis redirige vers /login/verifier.
 * Le message est identique que le compte existe ou non (pas d'énumération des comptes).
 */
export async function requestMagicLinkAction(
  _previous: LoginFormState,
  formData: FormData,
): Promise<LoginFormState> {
  const parsed = emailSchema.safeParse({ email: String(formData.get("email") ?? "").trim().toLowerCase() });
  if (!parsed.success) {
    return { status: "error", message: parsed.error.issues[0]?.message ?? "Adresse invalide." };
  }

  const rate = await consumeRate(`login:${parsed.data.email}`, LIMITS.loginPerEmail.limit, LIMITS.loginPerEmail.windowMs);
  if (!rate.allowed) {
    return { status: "error", message: `Trop de demandes pour cette adresse. Réessaie dans ${Math.ceil(rate.retryAfterSeconds / 60)} min.` };
  }

  // Plafond par origine réseau : un même appareil ne peut pas essayer de nombreuses adresses.
  const ip = clientIpFromHeaders(await headers());
  if (ip) {
    const byIp = await consumeRate(`login-ip:${ip}`, LIMITS.loginPerIp.limit, LIMITS.loginPerIp.windowMs);
    if (!byIp.allowed) {
      return { status: "error", message: `Trop de demandes depuis cet appareil. Réessaie dans ${Math.ceil(byIp.retryAfterSeconds / 60)} min.` };
    }
  }

  try {
    // Pas de redirection Auth.js ici : elle passe par sa route interne. On redirige nous-mêmes.
    await signIn("nodemailer", { email: parsed.data.email, redirectTo: "/dashboard", redirect: false });
  } catch (error) {
    // Laisse passer les redirections Next.js ; le reste est une vraie erreur.
    unstable_rethrow(error);
    console.error("[auth] Échec de l'envoi du lien de connexion", error);
    return { status: "error", message: "Impossible d'envoyer le lien pour le moment. Réessaie dans quelques instants." };
  }

  redirect("/login/verifier");
}
