"use client";

import { useActionState, useEffect, useRef, type ReactNode } from "react";
import type { AdminState } from "@/app/(app)/admin/actions";

const initial: AdminState = { status: "idle" };

/**
 * Formulaire d'administration : affiche le résultat de l'action.
 * React vide les champs après chaque action : en cas d'erreur, on restaure ce que l'utilisateur avait saisi.
 */
export function ActionForm({
  action,
  className,
  children,
}: {
  action: (previous: AdminState, formData: FormData) => Promise<AdminState>;
  className?: string;
  children: ReactNode;
}) {
  const formRef = useRef<HTMLFormElement>(null);
  const submitted = useRef<FormData | null>(null);

  const remember = async (previous: AdminState, formData: FormData) => {
    submitted.current = formData;
    return action(previous, formData);
  };
  const [state, formAction, pending] = useActionState(remember, initial);

  useEffect(() => {
    const form = formRef.current;
    const saved = submitted.current;
    if (state.status !== "error" || !form || !saved) return;

    for (const element of Array.from(form.elements)) {
      if (element instanceof HTMLInputElement && element.type === "checkbox") element.checked = false;
    }
    for (const [name, value] of saved.entries()) {
      const element = form.elements.namedItem(name);
      if (element instanceof HTMLInputElement && element.type === "checkbox") {
        element.checked = value === "on";
      } else if (
        typeof value === "string" &&
        (element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement || element instanceof HTMLSelectElement)
      ) {
        element.value = value;
      }
    }
  }, [state]);

  return (
    <form ref={formRef} action={formAction} className={className} noValidate>
      <fieldset disabled={pending} className="contents">
        {children}
      </fieldset>
      <p role="status" aria-live="polite" className={state.status === "error" ? "text-sm text-danger" : "text-sm text-success"}>
        {state.message ?? ""}
      </p>
    </form>
  );
}
