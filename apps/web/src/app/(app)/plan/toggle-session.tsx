"use client";

import { useTransition } from "react";
import { toggleSessionAction } from "./actions";

export function ToggleSession({ sessionId, done, label }: { sessionId: string; done: boolean; label: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
      <input
        type="checkbox"
        className="size-4 accent-[var(--primary)]"
        defaultChecked={done}
        disabled={pending}
        aria-label={`Session terminée : ${label}`}
        onChange={(event) => {
          const checked = event.currentTarget.checked;
          startTransition(() => toggleSessionAction(sessionId, checked));
        }}
      />
      Fait
    </label>
  );
}
