import type { Metadata } from "next";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export const metadata: Metadata = { title: "Vérifie ta boîte mail" };

export default function VerifyRequestPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center px-4 py-12">
      <Card className="w-full max-w-sm text-center">
        <CardTitle>Vérifie ta boîte mail</CardTitle>
        <CardDescription className="mt-2">
          Si l’adresse est valide, un lien de connexion vient de t’être envoyé. Il expire après un court délai.
        </CardDescription>
      </Card>
    </main>
  );
}
