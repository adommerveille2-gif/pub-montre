import { cn } from "@/lib/utils";

/** Barre de maîtrise accessible (role meter), colorée selon le niveau. */
export function MasteryBar({ value, label, className }: { value: number; label: string; className?: string }) {
  const percent = Math.round(Math.min(1, Math.max(0, value)) * 100);
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        role="meter"
        aria-label={label}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={percent}
        className="h-2 flex-1 overflow-hidden rounded-full bg-muted"
      >
        <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${percent}%` }} />
      </div>
      <span className="w-10 text-right text-sm font-medium tabular-nums text-foreground">{percent} %</span>
    </div>
  );
}
