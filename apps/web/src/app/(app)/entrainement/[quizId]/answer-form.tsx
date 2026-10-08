"use client";

import { useActionState, useEffect, useRef } from "react";
import { answerQuestionAction, type FormState } from "../actions";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

type Props = {
  quizId: string;
  questionId: string;
  position: number;
  options: { id: string; text: string }[];
};

const initialState: FormState = { status: "idle" };

export function AnswerForm({ quizId, questionId, position, options }: Props) {
  const [state, formAction, pending] = useActionState(answerQuestionAction, initialState);
  const shownAtRef = useRef<HTMLInputElement>(null);

  // Heure d'affichage mesurée dans le navigateur, après le rendu (le temps de réponse reste ainsi réaliste).
  useEffect(() => {
    if (shownAtRef.current) shownAtRef.current.value = String(Date.now());
  }, []);

  return (
    <Card>
      <form action={formAction} className="grid gap-4" noValidate>
        <input type="hidden" name="quizId" value={quizId} />
        <input type="hidden" name="questionId" value={questionId} />
        <input type="hidden" name="position" value={position} />
        <input ref={shownAtRef} type="hidden" name="shownAt" defaultValue="" />

        <fieldset className="grid gap-3">
          <legend className="mb-2 text-sm font-medium text-muted-foreground">Coche la ou les bonnes réponses.</legend>
          {options.map((option) => (
            <label
              key={option.id}
              className="flex cursor-pointer items-start gap-3 rounded-xl border border-border p-4 text-sm text-foreground transition-colors hover:bg-muted has-[:checked]:border-primary has-[:checked]:bg-primary/5"
            >
              <input type="checkbox" name="option" value={option.id} className="mt-0.5 size-4 accent-[var(--primary)]" />
              <span>{option.text}</span>
            </label>
          ))}
        </fieldset>

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" disabled={pending}>
            {pending ? "Enregistrement…" : "Valider ma réponse"}
          </Button>
          <p role="alert" className="text-sm text-danger">
            {state.status === "error" ? state.message : ""}
          </p>
        </div>
      </form>
    </Card>
  );
}
