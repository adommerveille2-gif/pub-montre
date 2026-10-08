import type { Metadata } from "next";
import { prisma } from "@pub-montre/db";
import { PageHeader } from "@/components/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/input";
import { ActionForm } from "@/components/admin/action-form";
import { createQuestionAction, reviewQuestionAction } from "../actions";
import { requireCapability } from "@/server/admin/guard";
import { can } from "@pub-montre/core";

export const metadata: Metadata = { title: "Questions" };

const select = "h-10 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground";

export default async function QuestionsPage() {
  const me = await requireCapability("admin:view");
  const canEdit = can(me.role, "content:edit");
  const canReview = can(me.role, "content:review");
  const [chapters, concepts, queue] = await Promise.all([
    prisma.chapter.findMany({
      orderBy: { title: "asc" },
      select: { id: true, title: true, subjectYear: { select: { subject: { select: { name: true } } } } },
    }),
    prisma.concept.findMany({ orderBy: { title: "asc" }, select: { id: true, title: true, chapterId: true } }),
    prisma.question.findMany({
      where: { status: "DRAFT" },
      orderBy: { createdAt: "asc" },
      take: 30,
      select: {
        id: true,
        statement: true,
        explanation: true,
        difficulty: true,
        chapter: { select: { title: true } },
        options: { orderBy: { position: "asc" }, select: { id: true, text: true, isCorrect: true } },
      },
    }),
  ]);

  return (
    <>
      <PageHeader title="Questions" description="Rédige une question, puis fais-la relire. Seules les questions validées sont proposées aux étudiants." />

      {canEdit ? (
      <Card className="mb-8">
        <CardTitle>Nouvelle question QCM</CardTitle>
        <ActionForm action={createQuestionAction} className="mt-5 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="q-chapter">Chapitre</Label>
              <select id="q-chapter" name="chapterId" className={select}>
                {chapters.map((chapter) => <option key={chapter.id} value={chapter.id}>{chapter.subjectYear.subject.name} · {chapter.title}</option>)}
              </select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="q-concept">Notion (facultatif)</Label>
              <select id="q-concept" name="conceptId" className={select}>
                <option value="">Aucune</option>
                {concepts.map((concept) => <option key={concept.id} value={concept.id}>{concept.title}</option>)}
              </select>
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="q-difficulty">Difficulté</Label>
            <select id="q-difficulty" name="difficulty" className={select} defaultValue="MEDIUM">
              <option value="EASY">Facile</option>
              <option value="MEDIUM">Intermédiaire</option>
              <option value="HARD">Difficile</option>
              <option value="EXPERT">Expert</option>
            </select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="q-statement">Énoncé</Label>
            <textarea id="q-statement" name="statement" rows={2} maxLength={1000} required className="rounded-lg border border-border bg-background p-3 text-sm text-foreground" />
          </div>
          <fieldset className="grid gap-3">
            <legend className="mb-1 text-sm font-medium text-foreground">Propositions (2 à 6, au moins une correcte)</legend>
            {[0, 1, 2, 3].map((index) => (
              <div key={index} className="flex items-center gap-3">
                <input type="checkbox" name={`correct_${index}`} aria-label={`Proposition ${index + 1} correcte`} className="size-4 accent-[var(--primary)]" />
                <Input name={`option_${index}`} maxLength={300} placeholder={`Proposition ${index + 1}`} aria-label={`Texte de la proposition ${index + 1}`} />
              </div>
            ))}
          </fieldset>
          <div className="grid gap-2">
            <Label htmlFor="q-explanation">Explication</Label>
            <textarea id="q-explanation" name="explanation" rows={3} maxLength={2000} required className="rounded-lg border border-border bg-background p-3 text-sm text-foreground" />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="grid gap-2">
              <Label htmlFor="q-pitfall">Piège fréquent (facultatif)</Label>
              <Input id="q-pitfall" name="pitfall" maxLength={500} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="q-tip">Astuce mémoire (facultatif)</Label>
              <Input id="q-tip" name="memoryTip" maxLength={300} />
            </div>
          </div>
          <Button type="submit" className="w-fit">Enregistrer en brouillon</Button>
        </ActionForm>
      </Card>
      ) : null}

      <section aria-labelledby="queue" className="grid gap-4">
        <h2 id="queue" className="text-lg font-semibold text-foreground">À relire ({queue.length})</h2>
        {queue.length === 0 ? (
          <Card><CardDescription>Aucune question en attente de relecture.</CardDescription></Card>
        ) : null}
        {queue.map((question) => (
          <Card key={question.id} className="grid gap-4">
            <p className="text-xs text-muted-foreground">{question.chapter.title} · {question.difficulty}</p>
            <CardTitle className="text-base leading-snug">{question.statement}</CardTitle>
            <ul className="grid gap-1 text-sm">
              {question.options.map((option) => (
                <li key={option.id} className={option.isCorrect ? "text-success" : "text-muted-foreground"}>
                  {option.isCorrect ? "✓ " : "— "}{option.text}
                </li>
              ))}
            </ul>
            <p className="text-sm text-muted-foreground">{question.explanation}</p>
            {canReview ? (
            <ActionForm action={reviewQuestionAction} className="flex flex-wrap items-center gap-3">
              <input type="hidden" name="questionId" value={question.id} />
              <Button type="submit" name="decision" value="VALIDATED" size="sm">Valider</Button>
              <Button type="submit" name="decision" value="REJECTED" variant="secondary" size="sm">Rejeter</Button>
            </ActionForm>
            ) : null}
          </Card>
        ))}
      </section>
    </>
  );
}
