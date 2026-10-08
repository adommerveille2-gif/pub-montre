import "server-only";
import { redirect } from "next/navigation";
import { prisma } from "@pub-montre/db";
import { auth } from "./auth";

/**
 * Accès à l'utilisateur courant. Point d'entrée unique pour les pages et actions :
 * l'identité vient toujours de la session serveur, jamais d'un paramètre client.
 * Doit être appelé dans un <Suspense> (Cache Components).
 */
export async function getCurrentUser() {
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      profile: {
        select: {
          firstName: true,
          university: true,
          goal: true,
          dailyMinutes: true,
          academicYear: { select: { id: true, name: true, order: true } },
        },
      },
    },
  });

  if (!user) {
    redirect("/login");
  }
  return user;
}
