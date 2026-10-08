"use client";

import { useState, useTransition } from "react";
import { rateFlashcardAction } from "./actions";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";

export type CardItem = {
  id: string;
  front: string;
  back: string;
  kind: string;
  notion: string;
  chapter: string;
};

export function FlashcardSession({ cards: initialCards }: { cards: CardItem[] }) {
  // La file est figée à l'arrivée sur la page : une mise à jour serveur ne doit pas en changer le contenu en cours.
  const [cards] = useState(initialCards);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [done, setDone] = useState(0);
  const [pending, startTransition] = useTransition();

  if (index >= cards.length) {
    return (
      <Card>
        <CardTitle>Bravo, tu as fait le tour</CardTitle>
        <CardDescription className="mt-2">
          {done} carte{done > 1 ? "s" : ""} revue{done > 1 ? "s" : ""}. Les cartes reviendront au moment où tu dois les revoir.
        </CardDescription>
      </Card>
    );
  }

  const card = cards[index]!;

  const rate = (rating: "again" | "good" | "easy") => {
    startTransition(() => rateFlashcardAction(card.id, rating));
    setDone((value) => value + 1);
    setIndex((value) => value + 1);
    setRevealed(false);
  };

  return (
    <Card className="grid gap-6">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{card.chapter} · {card.notion}</span>
        <span className="tabular-nums">{index + 1} / {cards.length}</span>
      </div>

      <div className="min-h-40">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Question</p>
        <CardTitle className="mt-2 text-lg leading-snug">{card.front}</CardTitle>
        {revealed ? (
          <div className="mt-6 border-t border-border pt-6">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Réponse</p>
            <p className="mt-2 text-base leading-relaxed text-foreground">{card.back}</p>
          </div>
        ) : null}
      </div>

      {!revealed ? (
        <Button size="lg" onClick={() => setRevealed(true)} className="w-fit">
          Voir la réponse
        </Button>
      ) : (
        <div className="grid gap-3 sm:grid-cols-3">
          <Button variant="secondary" disabled={pending} onClick={() => rate("again")}>À revoir</Button>
          <Button variant="secondary" disabled={pending} onClick={() => rate("good")}>Bien</Button>
          <Button disabled={pending} onClick={() => rate("easy")}>Facile</Button>
        </div>
      )}
    </Card>
  );
}
