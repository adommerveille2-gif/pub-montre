import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Anatomie 3D" };

export default function Page() {
  return <ComingSoon title="Anatomie 3D" description="Explore les structures en trois dimensions." phase={4} />;
}
