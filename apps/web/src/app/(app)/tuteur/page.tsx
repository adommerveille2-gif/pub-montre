import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Mon tuteur" };

export default function Page() {
  return <ComingSoon title="Mon tuteur" description="Pose tes questions, à l'écrit ou à l'oral." phase={1} />;
}
