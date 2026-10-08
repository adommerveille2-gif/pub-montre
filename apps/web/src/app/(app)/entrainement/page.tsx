import type { Metadata } from "next";
import { ComingSoon } from "@/components/coming-soon";

export const metadata: Metadata = { title: "Entraînement" };

export default function Page() {
  return <ComingSoon title="Entraînement" description="QCM, QROC, cas et flashcards adaptés à ton niveau." phase={1} />;
}
