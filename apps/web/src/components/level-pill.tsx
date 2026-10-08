import { LEVEL_LABELS } from "@pub-montre/core";
import { cn } from "@/lib/utils";

export function LevelPill({ level, className }: { level: number; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-medium text-muted-foreground",
        level >= 4 && "border-primary/30 text-primary",
        className,
      )}
    >
      {LEVEL_LABELS[level] ?? LEVEL_LABELS[1]}
    </span>
  );
}
