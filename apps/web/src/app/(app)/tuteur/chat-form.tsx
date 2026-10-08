"use client";

import { useActionState, useEffect, useRef } from "react";
import { sendTutorMessageAction, type TutorFormState } from "./actions";
import { Button } from "@/components/ui/button";

const initialState: TutorFormState = { status: "idle" };

export function ChatForm({ disabled }: { disabled: boolean }) {
  const [state, formAction, pending] = useActionState(sendTutorMessageAction, initialState);
  const textarea = useRef<HTMLTextAreaElement>(null);

  // Vide la saisie après un envoi réussi.
  useEffect(() => {
    if (state.status === "idle" && !pending && textarea.current) textarea.current.value = "";
  }, [state, pending]);

  return (
    <form action={formAction} className="grid gap-3" noValidate>
      <label htmlFor="content" className="sr-only">Ta question</label>
      <textarea
        ref={textarea}
        id="content"
        name="content"
        rows={3}
        maxLength={2000}
        disabled={disabled || pending}
        placeholder="Pose ta question, par exemple : « Explique-moi le nerf vague. »"
        className="w-full resize-y rounded-xl border border-border bg-background p-3 text-sm text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50"
      />
      <div className="flex flex-wrap items-center gap-4">
        <Button type="submit" disabled={disabled || pending}>
          {pending ? "Le tuteur réfléchit…" : "Envoyer"}
        </Button>
        <p role="alert" className="text-sm text-danger">{state.status === "error" ? state.message : ""}</p>
      </div>
    </form>
  );
}
