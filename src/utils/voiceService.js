// src/utils/voiceService.js
// Stubbed voice playback. Swap with expo-speech or another TTS engine later.

export async function speakReply(text) {
  if (!text) return;
  // In production, connect to your TTS solution.
  console.log("speakReply (stub):", text);
}

export async function stopVoice() {
  console.log("stopVoice (stub)");
}
import { httpsCallable } from "firebase/functions";
import { Audio } from "expo-av";
import { functions } from "../firebaseConfig";

const generateVoiceFn = httpsCallable(functions, "generateVoice");

export async function speakReply(text, voiceId = "default") {
  const res = await generateVoiceFn({ text, voiceId });
  const { audioBase64 } = res.data;

  const sound = new Audio.Sound();
  const buffer = Buffer.from(audioBase64, "base64");

  await sound.loadAsync({ uri: `data:audio/mpeg;base64,${audioBase64}` });
  await sound.playAsync();
}
