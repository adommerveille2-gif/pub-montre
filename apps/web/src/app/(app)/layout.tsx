import { Suspense } from "react";
import { getCurrentUser } from "@/lib/session";
import { Sidebar } from "@/components/shell/sidebar";
import { MobileNav } from "@/components/shell/mobile-nav";
import { MobileHeader } from "@/components/shell/mobile-header";

export default function AppLayout({ children }: LayoutProps<"/">) {
  // Les sections authentifiées lisent la session à la requête : elles sont streamées dans un Suspense.
  return (
    <Suspense fallback={<div className="min-h-dvh" aria-busy="true" />}>
      <AuthenticatedShell>{children}</AuthenticatedShell>
    </Suspense>
  );
}

async function AuthenticatedShell({ children }: { children: React.ReactNode }) {
  const user = await getCurrentUser();
  const label = user.profile?.firstName ?? user.name ?? user.email;

  return (
    <div className="flex min-h-dvh">
      <Sidebar userLabel={label} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileHeader />
        <main className="flex-1 px-4 pb-28 pt-6 sm:px-6 lg:px-10 lg:pb-10">
          <div className="mx-auto max-w-5xl">{children}</div>
        </main>
      </div>
      <MobileNav />
    </div>
  );
}
