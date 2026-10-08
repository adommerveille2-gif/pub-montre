"use client";

import { useActionState } from "react";
import { requestMagicLinkAction, type LoginFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";

const initialState: LoginFormState = { status: "idle" };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(requestMagicLinkAction, initialState);

  return (
    <form action={formAction} className="grid gap-4" noValidate>
      <div className="grid gap-2">
        <Label htmlFor="email">Adresse e-mail</Label>
        <Input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          placeholder="prenom.nom@email.fr"
          required
          aria-invalid={state.status === "error"}
          aria-describedby={state.status === "error" ? "login-error" : undefined}
        />
      </div>
      {state.status === "error" ? (
        <p id="login-error" role="alert" className="text-sm text-danger">
          {state.message}
        </p>
      ) : null}
      <Button type="submit" size="lg" disabled={pending} className="w-full">
        {pending ? "Envoi en cours…" : "Recevoir mon lien de connexion"}
      </Button>
      <p className="text-center text-xs text-muted-foreground">
        Pas de mot de passe : tu reçois un lien unique par e-mail.
      </p>
    </form>
  );
}
