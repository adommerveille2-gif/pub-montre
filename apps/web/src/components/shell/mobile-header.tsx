import { LogOut } from "lucide-react";
import { signOutAction } from "@/app/(app)/actions";
import { ThemeToggle } from "@/components/theme-toggle";

/** En-tête mobile : le thème et la déconnexion restent accessibles sans la barre latérale. */
export function MobileHeader() {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-card/95 px-4 py-3 backdrop-blur lg:hidden">
      <span className="text-sm font-semibold text-foreground">Tuteur médical</span>
      <div className="flex items-center gap-1">
        <ThemeToggle />
        <form action={signOutAction}>
          <button
            type="submit"
            aria-label="Se déconnecter"
            className="inline-flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <LogOut className="size-4" aria-hidden />
          </button>
        </form>
      </div>
    </header>
  );
}
