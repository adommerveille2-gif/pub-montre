import "server-only";
import { redirect } from "next/navigation";
import { can, type Capability } from "@pub-montre/core";
import { getCurrentUser } from "@/lib/session";

/** Pour les pages : redirige vers le tableau de bord si le droit manque. */
export async function requireCapability(capability: Capability) {
  const user = await getCurrentUser();
  if (!can(user.role, capability)) redirect("/dashboard");
  return user;
}

/** Pour les actions serveur : lève une erreur si le droit manque. */
export async function authorize(capability: Capability) {
  const user = await getCurrentUser();
  if (!can(user.role, capability)) throw new Error("Accès refusé.");
  return user;
}
