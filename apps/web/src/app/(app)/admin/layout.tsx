import { Suspense } from "react";
import { requireCapability } from "@/server/admin/guard";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      <AdminGate>{children}</AdminGate>
    </Suspense>
  );
}

async function AdminGate({ children }: { children: React.ReactNode }) {
  await requireCapability("admin:view");
  return children;
}
