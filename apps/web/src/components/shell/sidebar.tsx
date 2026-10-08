import { NAV_ITEMS } from "@/lib/navigation";
import Link from "next/link";
import { NavLinks } from "./nav-links";
import { UserMenu } from "./user-menu";
import { ThemeToggle } from "@/components/theme-toggle";

export function Sidebar({ userLabel, staff }: { userLabel: string; staff: boolean }) {
  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 flex-col border-r border-border bg-card lg:flex">
      <div className="flex items-center justify-between px-5 py-5">
        <span className="text-sm font-semibold text-foreground">Tuteur médical</span>
        <ThemeToggle />
      </div>
      <nav aria-label="Sections" className="flex-1 overflow-y-auto px-3">
        <NavLinks items={NAV_ITEMS} />
        {staff ? (
          <Link href="/admin" className="mt-4 block rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground">
            Administration
          </Link>
        ) : null}
      </nav>
      <UserMenu userLabel={userLabel} />
    </aside>
  );
}
