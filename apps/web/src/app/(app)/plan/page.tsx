import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Mon plan" };

export default function Page() {
  return <ComingSoon title="Mon plan" description="Un programme de révision qui s'adapte à tes performances." phase={2} />;
}
