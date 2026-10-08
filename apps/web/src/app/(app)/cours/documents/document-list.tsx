"use client";

import { useTransition } from "react";
import { deleteDocumentAction } from "./actions";
import { Button } from "@/components/ui/button";

export type DocumentRow = {
  id: string;
  title: string;
  filename: string;
  status: "PENDING" | "PROCESSED" | "FAILED";
  errorMessage: string | null;
  sizeBytes: number;
};

const STATUS_LABEL = { PENDING: "En cours", PROCESSED: "Indexé", FAILED: "Non exploitable" } as const;

export function DocumentList({ documents }: { documents: DocumentRow[] }) {
  return (
    <ul className="grid gap-3">
      {documents.map((document) => (
        <DocumentItem key={document.id} document={document} />
      ))}
    </ul>
  );
}

function DocumentItem({ document }: { document: DocumentRow }) {
  const [pending, startTransition] = useTransition();
  return (
    <li className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-border p-4">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium text-foreground">{document.title}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {document.filename} · {Math.round(document.sizeBytes / 1024)} Ko · {STATUS_LABEL[document.status]}
        </p>
        {document.errorMessage ? <p className="mt-2 text-sm text-muted-foreground">{document.errorMessage}</p> : null}
      </div>
      <Button
        variant="ghost"
        size="sm"
        disabled={pending}
        aria-label={`Supprimer ${document.title}`}
        onClick={() => startTransition(() => deleteDocumentAction(document.id))}
      >
        Supprimer
      </Button>
    </li>
  );
}
