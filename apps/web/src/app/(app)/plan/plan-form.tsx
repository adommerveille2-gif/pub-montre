"use client";

import { useActionState } from "react";
import { createStudyPlanAction, type PlanFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

const initialState: PlanFormState = { status: "idle" };

export function PlanForm({ hasPlan }: { hasPlan: boolean }) {
  const [state, formAction, pending] = useActionState(createStudyPlanAction, initialState);
  return (
    <Card>
      <CardTitle>{hasPlan ? "Recalculer mon plan" : "Créer mon plan de révision"}</CardTitle>
      <CardDescription className="mt-1">
        Le plan répartit ton temps jusqu’à l’examen, en priorité sur les notions les plus fragiles. Recalcule-le pour tenir compte de tes derniers résultats.
      </CardDescription>
      <form action={formAction} className="mt-5 grid gap-4 sm:grid-cols-[1fr_1fr_auto] sm:items-end" noValidate>
        <div className="grid gap-2">
          <Label htmlFor="examDate">Date de l’examen</Label>
          <Input id="examDate" name="examDate" type="date" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="dailyMinutes">Temps par jour (minutes)</Label>
          <Input id="dailyMinutes" name="dailyMinutes" type="number" min={15} max={360} step={5} defaultValue={30} required />
        </div>
        <Button type="submit" disabled={pending}>
          {pending ? "Calcul…" : hasPlan ? "Recalculer" : "Créer le plan"}
        </Button>
      </form>
      <p role="status" aria-live="polite" className={state.status === "error" ? "mt-3 text-sm text-danger" : "mt-3 text-sm text-success"}>
        {state.message ?? ""}
      </p>
    </Card>
  );
}
