/**
 * Machine d'états de l'interface vocale : IDLE → LISTENING → THINKING → SPEAKING.
 * Pure : aucune dépendance au navigateur. L'interruption (barge-in) ramène en écoute.
 */

export type VoiceState = "IDLE" | "LISTENING" | "THINKING" | "SPEAKING";

export type VoiceEvent =
  | { type: "START_LISTENING" }
  | { type: "FINAL_TRANSCRIPT"; text: string }
  | { type: "REPLY_READY" }
  | { type: "SPEECH_ENDED" }
  | { type: "INTERRUPT" }
  | { type: "CANCEL" }
  | { type: "FAILED" };

export type VoiceContext = { state: VoiceState; transcript: string };

export const initialVoice: VoiceContext = { state: "IDLE", transcript: "" };

export function voiceReducer(context: VoiceContext, event: VoiceEvent): VoiceContext {
  switch (event.type) {
    case "START_LISTENING":
      // On écoute depuis l'attente ou pendant que l'IA parle (interruption).
      return context.state === "THINKING" ? context : { state: "LISTENING", transcript: "" };
    case "FINAL_TRANSCRIPT":
      return context.state === "LISTENING" && event.text.trim()
        ? { state: "THINKING", transcript: event.text.trim() }
        : context;
    case "REPLY_READY":
      return context.state === "THINKING" ? { state: "SPEAKING", transcript: context.transcript } : context;
    case "SPEECH_ENDED":
      return context.state === "SPEAKING" ? { state: "IDLE", transcript: "" } : context;
    case "INTERRUPT":
      return context.state === "SPEAKING" ? { state: "LISTENING", transcript: "" } : context;
    case "CANCEL":
    case "FAILED":
      return { state: "IDLE", transcript: "" };
  }
}
