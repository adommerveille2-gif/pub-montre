"use server";

import { revalidatePath } from "next/cache";
import { prisma, StudyGoal } from "@pub-montre/db";
import { z } from "zod";
import { getCurrentUser } from "@/lib/session";

export type ProfileFormState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"firstName" | "university" | "academicYearId" | "goal" | "dailyMinutes", string>>;
};

const profileSchema = z.object({
  firstName: z.string().trim().max(60, "60 caractères maximum").optional(),
  university: z.string().trim().max(120, "120 caractères maximum").optional(),
  academicYearId: z.string().optional(),
  goal: z.enum(StudyGoal).optional(),
  dailyMinutes: z.coerce
    .number({ message: "Indique un nombre de minutes" })
    .int()
    .min(5, "Minimum 5 minutes")
    .max(360, "Maximum 360 minutes"),
});

/** Met à jour le profil de l'utilisateur courant uniquement (identité issue de la session). */
export async function updateProfileAction(
  _previous: ProfileFormState,
  formData: FormData,
): Promise<ProfileFormState> {
  const user = await getCurrentUser();

  const parsed = profileSchema.safeParse({
    firstName: formData.get("firstName") || undefined,
    university: formData.get("university") || undefined,
    academicYearId: formData.get("academicYearId") || undefined,
    goal: formData.get("goal") || undefined,
    dailyMinutes: formData.get("dailyMinutes"),
  });

  if (!parsed.success) {
    const fieldErrors: ProfileFormState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as keyof NonNullable<ProfileFormState["fieldErrors"]>;
      fieldErrors[key] = issue.message;
    }
    return { status: "error", message: "Vérifie les champs signalés.", fieldErrors };
  }

  const data = parsed.data;

  if (data.academicYearId) {
    const exists = await prisma.academicYear.findUnique({ where: { id: data.academicYearId } });
    if (!exists) {
      return { status: "error", message: "Année d'études inconnue.", fieldErrors: { academicYearId: "Choisis une année valide." } };
    }
  }

  await prisma.studentProfile.upsert({
    where: { userId: user.id },
    create: {
      userId: user.id,
      firstName: data.firstName || null,
      university: data.university || null,
      academicYearId: data.academicYearId || null,
      goal: data.goal ?? null,
      dailyMinutes: data.dailyMinutes,
      onboardedAt: new Date(),
    },
    update: {
      firstName: data.firstName || null,
      university: data.university || null,
      academicYearId: data.academicYearId || null,
      goal: data.goal ?? null,
      dailyMinutes: data.dailyMinutes,
      onboardedAt: new Date(),
    },
  });

  revalidatePath("/", "layout");
  return { status: "success", message: "Profil enregistré." };
}
