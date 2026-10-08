import { describe, expect, it } from "vitest";
import { initialVoice, voiceReducer, type VoiceContext } from "../src/voice.ts";

const run = (events: Parameters<typeof voiceReducer>[1][], start: VoiceContext = initialVoice) =>
  events.reduce(voiceReducer, start);

describe("voiceReducer", () => {
  it("parcourt le cycle complet d'une question vocale", () => {
    const end = run([
      { type: "START_LISTENING" },
      { type: "FINAL_TRANSCRIPT", text: "Explique le nerf vague" },
      { type: "REPLY_READY" },
      { type: "SPEECH_ENDED" },
    ]);
    expect(end).toEqual({ state: "IDLE", transcript: "" });
  });

  it("garde la transcription pendant la réflexion", () => {
    const thinking = run([{ type: "START_LISTENING" }, { type: "FINAL_TRANSCRIPT", text: "  bonjour  " }]);
    expect(thinking).toEqual({ state: "THINKING", transcript: "bonjour" });
  });

  it("permet d'interrompre l'IA pendant qu'elle parle", () => {
    const speaking = run([
      { type: "START_LISTENING" },
      { type: "FINAL_TRANSCRIPT", text: "question" },
      { type: "REPLY_READY" },
    ]);
    expect(speaking.state).toBe("SPEAKING");
    expect(voiceReducer(speaking, { type: "INTERRUPT" }).state).toBe("LISTENING");
  });

  it("ignore une transcription vide", () => {
    const listening = run([{ type: "START_LISTENING" }]);
    expect(voiceReducer(listening, { type: "FINAL_TRANSCRIPT", text: "   " })).toEqual(listening);
  });

  it("revient à l'attente en cas d'erreur ou d'annulation", () => {
    expect(run([{ type: "START_LISTENING" }, { type: "FAILED" }]).state).toBe("IDLE");
    expect(run([{ type: "START_LISTENING" }, { type: "CANCEL" }]).state).toBe("IDLE");
  });

  it("ne passe pas à « parle » sans question", () => {
    expect(run([{ type: "REPLY_READY" }]).state).toBe("IDLE");
  });
});
