"use client";

import Link from "next/link";
import { useTransition, useState } from "react";
import { caseStepAction, restartCaseAction } from "./actions";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export type CaseStep = {
  id: string;
  stage: string;
  prompt: string;
  reveal: string | null;
  hints: string[];
  concept: { id: string; title: string; chapterId: string } | null;
};

type Props = {
  caseId: string;
  title: string;
  presentation: string;
  steps: CaseStep[];
  revealedIds: string[];
  hintsUsed: Record<string, number>;
  currentStepId: string | null;
  status: "NOT_STARTED" | "IN_PROGRESS" | "FINISHED";
  completedAttempts: number;
};

/**
 * Affichage piloté par l'état serveur : ce qui est révélé, les indices demandés et l'étape courante
 * viennent de la base. Une reprise (même après rechargement) retrouve donc exactement le même point.
 */
export function CaseStepper(props: Props) {
  const { caseId, title, presentation, steps, revealedIds, hintsUsed, currentStepId, status, completedAttempts } = props;
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const revealed = new Set(revealedIds);

  const act = (stepId: string, kind: "hint" | "reveal") => {
    setError(null);
    startTransition(async () => {
      const result = await caseStepAction(caseId, stepId, kind);
      if (!result.ok) setError(result.message ?? "Action impossible.");
    });
  };

  const restart = () => {
    startTransition(async () => {
      await restartCaseAction(caseId);
    });
  };

  const visibleSteps = status === "FINISHED" ? steps : steps.filter((step, index) => index <= steps.findIndex((s) => s.id === currentStepId) || revealed.has(step.id));

  return (
    <div className="grid gap-6">
      <Card>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {title}{completedAttempts > 0 ? ` · cas terminé ${completedAttempts} fois` : ""}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-foreground">{presentation}</p>
      </Card>

      <nav aria-label="Progression du cas" className="flex flex-wrap gap-2">
        {steps.map((step, index) => (
          <span
            key={step.id}
            aria-current={step.id === currentStepId ? "step" : undefined}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              step.id === currentStepId ? "border-primary text-primary" : revealed.has(step.id) ? "border-border text-foreground" : "border-border text-muted-foreground",
            )}
          >
            {index + 1}. {step.stage}
          </span>
        ))}
      </nav>

      {visibleSteps.map((step) => {
        const isCurrent = step.id === currentStepId && status !== "FINISHED";
        const isRevealed = revealed.has(step.id);
        const used = hintsUsed[step.id] ?? 0;
        return (
          <Card key={step.id} className="grid gap-4">
            <div>
              <p className="text-xs font-medium text-muted-foreground">Étape {steps.findIndex((s) => s.id === step.id) + 1} sur {steps.length} · {step.stage}</p>
              <CardTitle className="mt-2 text-lg leading-snug">{step.prompt}</CardTitle>
            </div>

            {isCurrent ? (
              <div className="grid gap-3">
                <p className="text-sm text-muted-foreground">Réfléchis avant de regarder la réponse. Tu peux demander des indices.</p>
                {used > 0 ? (
                  <ul className="grid gap-2 rounded-xl bg-muted p-4 text-sm text-foreground">
                    {step.hints.slice(0, used).map((hint) => <li key={hint}>Indice : {hint}</li>)}
                  </ul>
                ) : null}
                <div className="flex flex-wrap gap-3">
                  {used < step.hints.length ? (
                    <Button variant="secondary" size="sm" disabled={pending} onClick={() => act(step.id, "hint")}>Donne-moi un indice</Button>
                  ) : null}
                  <Button size="sm" disabled={pending} onClick={() => act(step.id, "reveal")}>Voir la réponse attendue</Button>
                </div>
              </div>
            ) : null}

            {isRevealed && step.reveal ? (
              <div className="grid gap-3 border-t border-border pt-4">
                <div>
                  <p className="font-medium text-foreground">Réponse attendue</p>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.reveal}</p>
                </div>
                {step.concept ? (
                  <p className="text-sm text-muted-foreground">
                    Notion : <Link href={`/cours/${step.concept.chapterId}`} className="text-foreground underline-offset-4 hover:underline">{step.concept.title}</Link>
                  </p>
                ) : null}
              </div>
            ) : null}
          </Card>
        );
      })}

      {error ? <p role="alert" className="text-sm text-danger">{error}</p> : null}

      {status === "FINISHED" ? (
        <Card>
          <CardTitle>Cas terminé</CardTitle>
          <CardDescription className="mt-2">Revois les notions de ce cas dans tes cours et tes entraînements.</CardDescription>
          <div className="mt-5">
            <Button variant="secondary" disabled={pending} onClick={restart}>Recommencer le cas</Button>
          </div>
        </Card>
      ) : null}

      <Link href="/cas-cliniques" className={buttonVariants({ variant: "ghost", size: "sm" }) + " w-fit"}>
        ← Tous les cas
      </Link>
    </div>
  );
}
