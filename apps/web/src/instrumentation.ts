import { productionProblems } from "@/lib/env";

/** Exécuté au démarrage du serveur (pas pendant le build). Une configuration de production incomplète est signalée tout de suite. */
export async function register() {
  if (process.env.NEXT_RUNTIME !== "nodejs" || process.env.NODE_ENV !== "production") return;
  const problems = productionProblems(process.env);
  if (problems.length > 0) {
    console.error(`[configuration] Production incomplète :\n- ${problems.join("\n- ")}`);
  }
}
