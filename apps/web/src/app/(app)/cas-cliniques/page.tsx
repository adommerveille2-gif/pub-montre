import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Cas cliniques" };

export default function Page() {
  return <ComingSoon title="Cas cliniques" description="Raisonne pas à pas, comme au lit du patient." phase={2} />;
}
