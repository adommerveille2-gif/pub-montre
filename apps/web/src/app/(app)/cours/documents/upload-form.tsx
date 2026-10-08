"use client";

import { useActionState, useEffect, useRef } from "react";
import { importDocumentAction, type DocumentFormState } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardTitle, CardDescription } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";

const initialState: DocumentFormState = { status: "idle" };

export function UploadForm() {
  const [state, formAction, pending] = useActionState(importDocumentAction, initialState);
  const fileInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.status === "success" && fileInput.current) fileInput.current.value = "";
  }, [state]);

  return (
    <Card>
      <CardTitle>Importer un cours</CardTitle>
      <CardDescription className="mt-1">PDF, DOCX, PPTX, PNG ou JPEG, 15 Mo maximum. Seul toi peux voir ce document.</CardDescription>
      <form action={formAction} className="mt-5 grid gap-4" encType="multipart/form-data">
        <div className="grid gap-2">
          <Label htmlFor="title">Titre (facultatif)</Label>
          <Input id="title" name="title" maxLength={120} placeholder="Cours de cardiologie, semaine 3" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="file">Fichier</Label>
          <input
            ref={fileInput}
            id="file"
            name="file"
            type="file"
            accept=".pdf,.docx,.pptx,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
            className="text-sm text-muted-foreground file:mr-4 file:cursor-pointer file:rounded-lg file:border-0 file:bg-muted file:px-4 file:py-2 file:text-sm file:font-medium file:text-foreground"
          />
        </div>
        <div className="flex flex-wrap items-center gap-4">
          <Button type="submit" disabled={pending}>
            {pending ? "Import et extraction…" : "Importer"}
          </Button>
          <p role="status" aria-live="polite" className={state.status === "error" ? "text-sm text-danger" : "text-sm text-success"}>
            {state.message ?? ""}
          </p>
        </div>
      </form>
    </Card>
  );
}
