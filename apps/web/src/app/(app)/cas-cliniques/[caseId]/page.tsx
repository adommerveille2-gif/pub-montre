import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { prisma } from "@pub-montre/db";
import { getCurrentUser } from "@/lib/session";
import { loadCaseState } from "@/server/cases/attempts";
import { CaseStepper } from "./case-stepper";

export const metadata: Metadata = { title: "Cas clinique" };

export default function CasePage(props: PageProps<"/cas-cliniques/[caseId]">) {
  return (
    <Suspense fallback={null}>
      <CaseSection {...props} />
    </Suspense>
  );
}

async function CaseSection({ params }: PageProps<"/cas-cliniques/[caseId]">) {
  const user = await getCurrentUser();
  const { caseId } = await params;

  const clinicalCase = await prisma.clinicalCase.findFirst({
    where: { id: caseId, status: "VALIDATED", chapter: { status: "VALIDATED" } },
    select: { title: true, presentation: true },
  });
  if (!clinicalCase) notFound();

  const state = await loadCaseState(user.id, caseId);

  return (
    <CaseStepper
      caseId={caseId}
      title={clinicalCase.title}
      presentation={clinicalCase.presentation}
      steps={state.steps}
      revealedIds={state.revealedIds}
      hintsUsed={state.hintsUsed}
      currentStepId={state.currentStepId}
      status={state.status}
      completedAttempts={state.completedAttempts}
    />
  );
}
