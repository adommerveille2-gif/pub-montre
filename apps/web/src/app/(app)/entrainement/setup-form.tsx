"use client";

import { useActionState } from "react";
import { startQuizAction, type FormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

type ChapterOption = { id: string; label: string; count: number };
type YearGroup = { yearName: string; chapters: ChapterOption[] };

const DIFFICULTY_OPTIONS = [
  { value: "", label: "Toutes" },
  { value: "EASY", label: "Facile" },
  { value: "MEDIUM", label: "Intermédiaire" },
  { value: "HARD", label: "Difficile" },
  { value: "EXPERT", label: "Expert" },
];

const initialState: FormState = { status: "idle" };

const selectClass =
  "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";

export function SetupForm({ groups, defaultChapterId }: { groups: YearGroup[]; defaultChapterId?: string }) {
  const [state, formAction, pending] = useActionState(startQuizAction, initialState);

  return (
    <Card>
      <form action={formAction} className="grid gap-5" noValidate>
        <div className="grid gap-2">
          <Label htmlFor="chapterId">Chapitre</Label>
          <select id="chapterId" name="chapterId" defaultValue={defaultChapterId ?? ""} className={selectClass}>
            <option value="">Tous les chapitres</option>
            {groups.map((group) => (
              <optgroup key={group.yearName} label={group.yearName}>
                {group.chapters.map((chapter) => (
                  <option key={chapter.id} value={chapter.id}>
                    {chapter.label} ({chapter.count} questions)
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 sm:gap-4">
          <div className="grid gap-2">
            <Label htmlFor="difficulty">Difficulté</Label>
            <select id="difficulty" name="difficulty" defaultValue="" className={selectClass}>
              {DIFFICULTY_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="count">Nombre de questions</Label>
            <select id="count" name="count" defaultValue="5" className={selectClass}>
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="20">20</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" disabled={pending} size="lg">
            {pending ? "Préparation…" : "Commencer l'entraînement"}
          </Button>
          <p role="status" aria-live="polite" className="text-sm text-danger">
            {state.status === "error" ? state.message : ""}
          </p>
        </div>
      </form>
    </Card>
  );
}
