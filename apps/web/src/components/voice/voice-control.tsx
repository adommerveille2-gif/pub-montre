"use client";

import { useEffect, useReducer, useRef, useState } from "react";
import { initialVoice, voiceReducer, type VoiceState } from "@pub-montre/core";
import { cn } from "@/lib/utils";

/** Types minimaux de l'API de reconnaissance vocale du navigateur (non typée par défaut en TypeScript). */
type RecognitionResult = { isFinal: boolean; 0: { transcript: string } };
type RecognitionEvent = { results: ArrayLike<RecognitionResult> };
type RecognitionLike = {
  lang: string;
  interimResults: boolean;
  continuous: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((event: RecognitionEvent) => void) | null;
  onend: (() => void) | null;
  onerror: (() => void) | null;
};
type RecognitionConstructor = new () => RecognitionLike;

function recognitionConstructor(): RecognitionConstructor | null {
  const scope = window as unknown as { SpeechRecognition?: RecognitionConstructor; webkitSpeechRecognition?: RecognitionConstructor };
  return scope.SpeechRecognition ?? scope.webkitSpeechRecognition ?? null;
}

const LABELS: Record<VoiceState, string> = {
  IDLE: "Appuie sur le micro pour me parler",
  LISTENING: "🎙️ Je t'écoute...",
  THINKING: "Analyse de ta question...",
  SPEAKING: "Le tuteur répond. Clique sur le micro pour l'interrompre.",
};

/**
 * Interface vocale : écoute, transcription, lecture de la réponse, interruption.
 * Le texte transcrit est envoyé par le même formulaire que la saisie au clavier.
 */
export function VoiceControl({ formId, replyId, replyText }: { formId: string; replyId: string | null; replyText: string | null }) {
  const [voice, dispatch] = useReducer(voiceReducer, initialVoice);
  const [message, setMessage] = useState<string | null>(null);
  const recognition = useRef<RecognitionLike | null>(null);
  const awaitingReply = useRef(false);

  // Lit la réponse une seule fois, uniquement si la question vient de la voix.
  useEffect(() => {
    if (!awaitingReply.current || !replyId || !replyText || !("speechSynthesis" in window)) return;
    awaitingReply.current = false;

    const utterance = new SpeechSynthesisUtterance(replyText);
    utterance.lang = "fr-FR";
    utterance.onstart = () => dispatch({ type: "REPLY_READY" });
    utterance.onend = () => dispatch({ type: "SPEECH_ENDED" });
    utterance.onerror = () => dispatch({ type: "FAILED" });
    window.speechSynthesis.speak(utterance);
  }, [replyId, replyText]);

  const submit = (text: string) => {
    const form = document.getElementById(formId) as HTMLFormElement | null;
    const field = form?.elements.namedItem("content") as HTMLTextAreaElement | null;
    if (!form || !field) return;
    field.value = text;
    awaitingReply.current = true;
    form.requestSubmit();
  };

  const listen = () => {
    const Constructor = recognitionConstructor();
    if (!Constructor) {
      setMessage("Ton navigateur ne prend pas en charge la reconnaissance vocale. Utilise la saisie au clavier.");
      return;
    }
    setMessage(null);

    if (voice.state === "SPEAKING") {
      window.speechSynthesis?.cancel();
      dispatch({ type: "INTERRUPT" });
    }
    dispatch({ type: "START_LISTENING" });

    const instance = new Constructor();
    instance.lang = "fr-FR";
    instance.interimResults = false;
    instance.continuous = false;
    let gotResult = false;

    instance.onresult = (event) => {
      const final = Array.from(event.results).find((result) => result.isFinal);
      const text = final?.[0]?.transcript ?? "";
      if (!text.trim()) return;
      gotResult = true;
      dispatch({ type: "FINAL_TRANSCRIPT", text });
      submit(text);
    };
    instance.onerror = () => {
      dispatch({ type: "FAILED" });
      setMessage("Je n'ai pas pu t'entendre. Réessaie, ou utilise la saisie au clavier.");
    };
    instance.onend = () => {
      // Pas de transcription : on revient à l'attente sans rien envoyer.
      if (!gotResult) dispatch({ type: "CANCEL" });
    };

    recognition.current = instance;
    instance.start();
  };

  const busy = voice.state === "THINKING";

  return (
    <div className="flex flex-wrap items-center gap-4">
      <button
        type="button"
        onClick={listen}
        disabled={busy}
        aria-pressed={voice.state === "LISTENING"}
        aria-label={voice.state === "SPEAKING" ? "Interrompre le tuteur" : "Parler au tuteur"}
        className={cn(
          "inline-flex size-12 cursor-pointer items-center justify-center rounded-full border border-border text-xl transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50",
          voice.state === "LISTENING" ? "bg-primary text-primary-foreground" : "bg-card text-foreground hover:bg-muted",
        )}
      >
        🎙️
      </button>
      <div className="min-w-0 flex-1" aria-live="polite">
        <p className="text-sm font-medium text-foreground">{LABELS[voice.state]}</p>
        {voice.transcript ? <p className="mt-1 truncate text-xs text-muted-foreground">« {voice.transcript} »</p> : null}
        {message ? <p className="mt-1 text-xs text-danger">{message}</p> : null}
      </div>
    </div>
  );
}
