import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Progression" };

export default function Page() {
  return <ComingSoon title="Progression" description="L'évolution de tes scores dans le temps." phase={1} />;
}
