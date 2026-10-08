import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Mes cours" };

export default function Page() {
  return <ComingSoon title="Mes cours" description="Tes cours importés et leurs exercices." phase={1} />;
}
