import type { Metadata } from "next";
import { Suspense } from "react";
import { prisma } from "@pub-montre/db";
import { PageHeader } from "@/components/page-header";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { getCurrentUser } from "@/lib/session";
import { isTutorConfigured } from "@/server/ai/tutor";
import { ChatForm } from "./chat-form";
import { VoiceControl } from "@/components/voice/voice-control";
import { cn } from "@/lib/utils";

export const metadata: Metadata = { title: "Mon tuteur" };

export default function TutorPage() {
  return (
    <>
      <PageHeader title="Mon tuteur" description="Pose tes questions. Il explique, puis vérifie que tu as compris." />
      <Suspense fallback={null}>
        <Chat />
      </Suspense>
    </>
  );
}

async function Chat() {
  const user = await getCurrentUser();
  const configured = isTutorConfigured();

  const conversation = await prisma.conversation.findFirst({
    where: { userId: user.id },
    orderBy: { updatedAt: "desc" },
    select: {
      messages: {
        orderBy: { createdAt: "asc" },
        take: 100,
        select: { id: true, role: true, content: true, citations: true },
      },
    },
  });
  const messages = conversation?.messages ?? [];
  const lastReply = [...messages].reverse().find((message) => message.role === "ASSISTANT") ?? null;

  return (
    <div className="grid gap-6">
      {!configured ? (
        <Card>
          <CardTitle>Le tuteur IA n’est pas encore connecté</CardTitle>
          <CardDescription className="mt-2">
            Pour activer les réponses, l’administrateur doit renseigner la variable <code className="text-foreground">ANTHROPIC_API_KEY</code> sur le serveur.
            Les autres sections restent utilisables.
          </CardDescription>
        </Card>
      ) : null}

      <Card className="grid gap-4 p-0">
        <div className="flex min-h-72 flex-col gap-3 overflow-y-auto p-5" aria-live="polite">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">Aucun message pour l’instant. Commence par une question sur ton cours.</p>
          ) : (
            messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "max-w-[85%] whitespace-pre-line rounded-2xl px-4 py-3 text-sm leading-relaxed",
                  message.role === "USER"
                    ? "ml-auto bg-primary text-primary-foreground"
                    : "bg-muted text-foreground",
                )}
              >
                {message.content}
                {Array.isArray(message.citations) && message.citations.length > 0 ? (
                  <ul className="mt-2 grid gap-1 border-t border-border pt-2 text-xs text-muted-foreground">
                    {(message.citations as { label: string; documentTitle: string; pageRef: number | null }[]).map((citation) => (
                      <li key={citation.label}>
                        [{citation.label}] {citation.documentTitle}
                        {citation.pageRef ? `, p. ${citation.pageRef}` : ""}
                      </li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ))
          )}
        </div>
        <div className="grid gap-4 border-t border-border p-5">
          {configured ? <VoiceControl formId="tutor-form" replyId={lastReply?.id ?? null} replyText={lastReply?.content ?? null} /> : null}
          <ChatForm disabled={!configured} />
        </div>
      </Card>

      <p className="text-xs text-muted-foreground">
        Outil éducatif. Il ne remplace pas un avis médical et ne sert pas au diagnostic ni au traitement de patients.
      </p>
    </div>
  );
}
