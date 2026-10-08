"use client";

import { useActionState } from "react";
import { updateProfileAction, type ProfileFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

const GOALS = [
  { value: "PREPARE_EXAMS", label: "Préparer mes examens" },
  { value: "MASTER_COURSES", label: "Maîtriser mes cours" },
  { value: "CLINICAL_REASONING", label: "Améliorer mon raisonnement clinique" },
  { value: "COMPETITIVE_EXAM", label: "Préparer un concours" },
] as const;

const initialState: ProfileFormState = { status: "idle" };

type Props = {
  years: { id: string; name: string }[];
  defaults: {
    firstName?: string | null;
    university?: string | null;
    academicYearId?: string | null;
    goal?: string | null;
    dailyMinutes?: number;
  };
};

export function ProfileForm({ years, defaults }: Props) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initialState);
  const errors = state.fieldErrors ?? {};

  return (
    <Card>
      <form action={formAction} className="grid gap-5" noValidate>
        <div className="grid gap-2">
          <Label htmlFor="firstName">Prénom</Label>
          <Input id="firstName" name="firstName" autoComplete="given-name" defaultValue={defaults.firstName ?? ""} aria-invalid={!!errors.firstName} />
          {errors.firstName ? <p className="text-sm text-danger">{errors.firstName}</p> : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="university">Université</Label>
          <Input id="university" name="university" defaultValue={defaults.university ?? ""} aria-invalid={!!errors.university} />
          {errors.university ? <p className="text-sm text-danger">{errors.university}</p> : null}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="academicYearId">Année d’études</Label>
          <select
            id="academicYearId"
            name="academicYearId"
            defaultValue={defaults.academicYearId ?? ""}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Non renseignée</option>
            {years.map((year) => (
              <option key={year.id} value={year.id}>
                {year.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="goal">Objectif</Label>
          <select
            id="goal"
            name="goal"
            defaultValue={defaults.goal ?? ""}
            className="h-10 rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <option value="">Non renseigné</option>
            {GOALS.map((goal) => (
              <option key={goal.value} value={goal.value}>
                {goal.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid gap-2">
          <Label htmlFor="dailyMinutes">Temps de révision par jour (minutes)</Label>
          <Input
            id="dailyMinutes"
            name="dailyMinutes"
            type="number"
            inputMode="numeric"
            min={5}
            max={360}
            step={5}
            defaultValue={defaults.dailyMinutes ?? 30}
            aria-invalid={!!errors.dailyMinutes}
          />
          {errors.dailyMinutes ? <p className="text-sm text-danger">{errors.dailyMinutes}</p> : null}
        </div>

        <div className="flex items-center gap-4">
          <Button type="submit" disabled={pending}>
            {pending ? "Enregistrement…" : "Enregistrer"}
          </Button>
          <p role="status" aria-live="polite" className={state.status === "error" ? "text-sm text-danger" : "text-sm text-success"}>
            {state.message ?? ""}
          </p>
        </div>
      </form>
    </Card>
  );
}
