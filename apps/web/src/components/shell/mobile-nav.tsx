import Link from "next/link";
import { MoreHorizontal } from "lucide-react";
import { NAV_ITEMS } from "@/lib/navigation";
import { NAV_ICONS } from "./nav-icons";
import { NavLinks } from "./nav-links";

/** Barre basse mobile : 4 sections principales, les autres dans « Plus » (sans JavaScript). */
export function MobileNav() {
  const primary = NAV_ITEMS.filter((item) => item.primary);
  const secondary = NAV_ITEMS.filter((item) => !item.primary);

  return (
    <nav
      aria-label="Sections principales"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-card/95 backdrop-blur lg:hidden"
    >
      <ul className="grid grid-cols-5 pb-[env(safe-area-inset-bottom)]">
        {primary.map((item) => {
          const Icon = NAV_ICONS[item.icon];
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className="flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Icon className="size-5" aria-hidden />
                <span className="truncate">{item.shortLabel ?? item.label}</span>
              </Link>
            </li>
          );
        })}
        <li>
          <details className="group relative">
            <summary className="flex cursor-pointer list-none flex-col items-center gap-1 py-2.5 text-[11px] font-medium text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&::-webkit-details-marker]:hidden">
              <MoreHorizontal className="size-5" aria-hidden />
              <span>Plus</span>
            </summary>
            <div className="absolute bottom-full right-2 mb-2 w-64 rounded-2xl border border-border bg-card p-2 shadow-lg">
              <NavLinks items={secondary} />
            </div>
          </details>
        </li>
      </ul>
    </nav>
  );
}
