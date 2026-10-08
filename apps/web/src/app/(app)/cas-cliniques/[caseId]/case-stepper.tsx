"use client";

import Link from "next/link";
import { useState } from "react";
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

/**
 * Parcours guidé : l'étudiant réfléchit, demande des indices si besoin,
 * puis compare avec la réponse attendue. Rien n'est enregistré côté serveur à ce stade.
 */
export function CaseStepper({ title, presentation, steps }: { title: string; presentation: string; steps: CaseStep[] }) {
  const [index, setIndex] = useState(0);
  const [hintsShown, setHintsShown] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [finished, setFinished] = useState(false);

  if (finished) {
    return (
      <Card>
        <CardTitle>Cas terminé</CardTitle>
        <CardDescription className="mt-2">
          Revois les notions de ce cas dans tes cours et tes entraînements.
        </CardDescription>
        <div className="mt-5 flex flex-wrap gap-3">
          <Button variant="secondary" onClick={() => { setIndex(0); setHintsShown(0); setRevealed(false); setFinished(false); }}>
            Recommencer le cas
          </Button>
        </div>
      </Card>
    );
  }

  const step = steps[index];
  if (!step) return null;
  const isLast = index === steps.length - 1;

  const goNext = () => {
    setIndex((value) => value + 1);
    setHintsShown(0);
    setRevealed(false);
    if (isLast) setFinished(true);
  };

  return (
    <div className="grid gap-6">
      <Card>
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{title}</p>
        <p className="mt-3 text-sm leading-relaxed text-foreground">{presentation}</p>
      </Card>

      <nav aria-label="Progression du cas" className="flex flex-wrap gap-2">
        {steps.map((item, position) => (
          <span
            key={item.id}
            aria-current={position === index ? "step" : undefined}
            className={cn(
              "rounded-full border px-3 py-1 text-xs",
              position === index ? "border-primary text-primary" : position < index ? "border-border text-foreground" : "border-border text-muted-foreground",
            )}
          >
            {position + 1}. {item.stage}
          </span>
        ))}
      </nav>

      <Card className="grid gap-5">
        <div>
          <p className="text-xs font-medium text-muted-foreground">Étape {index + 1} sur {steps.length} · {step.stage}</p>
          <CardTitle className="mt-2 text-lg leading-snug">{step.prompt}</CardTitle>
        </div>

        <div className="grid gap-3">
          <p className="text-sm text-muted-foreground">Réfléchis avant de regarder la réponse. Tu peux demander des indices.</p>
          {hintsShown > 0 ? (
            <ul className="grid gap-2 rounded-xl bg-muted p-4 text-sm text-foreground">
              {step.hints.slice(0, hintsShown).map((hint) => (
                <li key={hint}>Indice : {hint}</li>
              ))}
            </ul>
          ) : null}
          <div className="flex flex-wrap gap-3">
            {hintsShown < step.hints.length ? (
              <Button variant="secondary" size="sm" onClick={() => setHintsShown((value) => value + 1)}>
                Donne-moi un indice
              </Button>
            ) : null}
            {!revealed ? (
              <Button size="sm" onClick={() => setRevealed(true)}>
                Voir la réponse attendue
              </Button>
            ) : null}
          </div>
        </div>

        {revealed && step.reveal ? (
          <div className="grid gap-4 border-t border-border pt-5">
            <div>
              <p className="font-medium text-foreground">Réponse attendue</p>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{step.reveal}</p>
            </div>
            {step.concept ? (
              <p className="text-sm text-muted-foreground">
                Notion : <Link href={`/cours/${step.concept.chapterId}`} className="text-foreground underline-offset-4 hover:underline">{step.concept.title}</Link>
              </p>
            ) : null}
            <Button onClick={goNext} className="w-fit">
              {isLast ? "Terminer le cas" : "Étape suivante"}
            </Button>
          </div>
        ) : null}
      </Card>

      <Link href="/cas-cliniques" className={buttonVariants({ variant: "ghost", size: "sm" }) + " w-fit"}>
        ← Tous les cas
      </Link>
    </div>
  );
}
