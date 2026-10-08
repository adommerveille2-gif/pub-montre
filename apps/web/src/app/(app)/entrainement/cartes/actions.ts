"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getCurrentUser } from "@/lib/session";
import { rateFlashcard } from "@/server/learning/flashcards";

const schema = z.object({
  flashcardId: z.string().min(1).max(64),
  rating: z.enum(["again", "good", "easy"]),
});

export async function rateFlashcardAction(flashcardId: string, rating: "again" | "good" | "easy"): Promise<void> {
  const user = await getCurrentUser();
  const parsed = schema.parse({ flashcardId, rating });
  await rateFlashcard(user.id, parsed.flashcardId, parsed.rating, new Date());
  revalidatePath("/progression");
}
