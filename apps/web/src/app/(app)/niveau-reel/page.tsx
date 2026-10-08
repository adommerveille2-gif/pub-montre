import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Mon niveau réel" };

export default function Page() {
  return <ComingSoon title="Mon niveau réel" description="Ta carte de maîtrise, notion par notion." phase={1} />;
}
