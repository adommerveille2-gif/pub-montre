"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/session";
import { CaseError, requestHint, revealCurrentStep, startOrResumeAttempt } from "@/server/cases/attempts";

export type CaseActionResult = { ok: boolean; message?: string };
const id = z.string().min(1).max(64);

/** Indice ou révélation sur l'étape courante. La tentative est créée si elle n'existe pas encore. */
export async function caseStepAction(caseId: string, stepId: string, kind: "hint" | "reveal"): Promise<CaseActionResult> {
  const user = await getCurrentUser();
  const parsed = z.object({ caseId: id, stepId: id, kind: z.enum(["hint", "reveal"]) }).safeParse({ caseId, stepId, kind });
  if (!parsed.success) return { ok: false, message: "Action invalide." };

  try {
    const attemptId = await startOrResumeAttempt(user.id, parsed.data.caseId);
    if (parsed.data.kind === "hint") {
      await requestHint(user.id, attemptId, parsed.data.stepId);
    } else {
      await revealCurrentStep(user.id, attemptId, parsed.data.stepId);
    }
  } catch (error) {
    if (error instanceof CaseError) return { ok: false, message: error.message };
    throw error;
  }
  revalidatePath(`/cas-cliniques/${parsed.data.caseId}`);
  revalidatePath("/cas-cliniques");
  return { ok: true };
}

/** Recommence le cas : une nouvelle tentative, l'ancienne reste dans l'historique. */
export async function restartCaseAction(caseId: string): Promise<CaseActionResult> {
  const user = await getCurrentUser();
  const parsed = id.safeParse(caseId);
  if (!parsed.success) return { ok: false, message: "Cas introuvable." };
  await startOrResumeAttempt(user.id, parsed.data);
  revalidatePath(`/cas-cliniques/${parsed.data}`);
  return { ok: true };
}
