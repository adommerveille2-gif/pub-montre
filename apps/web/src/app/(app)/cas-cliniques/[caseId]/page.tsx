import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { prisma } from "@pub-montre/db";
import { getCurrentUser } from "@/lib/session";
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
  await getCurrentUser();
  const { caseId } = await params;

  const clinicalCase = await prisma.clinicalCase.findFirst({
    where: { id: caseId, status: "VALIDATED", chapter: { status: "VALIDATED" } },
    select: {
      title: true,
      presentation: true,
      steps: {
        orderBy: { position: "asc" },
        select: {
          id: true,
          stage: true,
          prompt: true,
          reveal: true,
          hints: true,
          concept: { select: { id: true, title: true, chapterId: true } },
        },
      },
    },
  });
  if (!clinicalCase) notFound();

  return (
    <CaseStepper
      title={clinicalCase.title}
      presentation={clinicalCase.presentation}
      steps={clinicalCase.steps.map((step) => ({
        ...step,
        hints: Array.isArray(step.hints) ? (step.hints as string[]) : [],
      }))}
    />
  );
}
