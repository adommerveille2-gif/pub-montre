import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { PageHeader } from "@/components/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import { getCurrentUser } from "@/lib/session";
import { loadDueFlashcards } from "@/server/learning/flashcards";
import { FlashcardSession } from "./flashcard-session";

export const metadata: Metadata = { title: "Cartes mémoire" };

export default function FlashcardsPage() {
  return (
    <>
      <PageHeader title="Cartes mémoire" description="Quelques secondes par carte, planifiées selon ta mémoire." />
      <Suspense fallback={null}>
        <Session />
      </Suspense>
    </>
  );
}

async function Session() {
  const user = await getCurrentUser();
  const cards = await loadDueFlashcards(user.id, new Date());

  if (cards.length === 0) {
    return (
      <div className="grid gap-6">
        <Card>
          <CardTitle>Rien à revoir pour l’instant</CardTitle>
          <CardDescription className="mt-2">Les cartes reviendront au moment prévu. Tu peux aussi t’entraîner sur des QCM.</CardDescription>
        </Card>
        <Link href="/entrainement" className={buttonVariants({ variant: "secondary", size: "md" }) + " w-fit"}>
          Aller aux QCM
        </Link>
      </div>
    );
  }

  return (
    <FlashcardSession
      cards={cards.map((card) => ({
        id: card.id,
        front: card.front,
        back: card.back,
        kind: card.kind,
        notion: card.concept.title,
        chapter: card.concept.chapter.title,
      }))}
    />
  );
}
