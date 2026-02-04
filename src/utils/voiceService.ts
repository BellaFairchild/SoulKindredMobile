import { app } from "@/firebase/client";
import { getFunctions, httpsCallable } from "firebase/functions";
import * as Speech from "expo-speech";

import { VoiceAnalyzer } from "@/components/chat/Companion3D";

type VoiceResponse = { audioBase64?: string };

import { AudioModule, useAudioPlayer } from 'expo-audio';

const playBase64Audio = async (audioBase64: string) => {
  try {
    const player = AudioModule.createPlayer(`data:audio/mp3;base64,${audioBase64}`);

    player.play();

    // Loop/Status updates in expo-audio are handled via listeners
    const subscription = player.addListener('playbackStatusUpdate', (status: any) => {
      if (status.playbackState === 'finished') {
        VoiceAnalyzer.volume = 0;
        subscription.remove();
        // player.terminate(); // if available
      }
    });

    // For Lip-Sync: expo-audio uses AudioSampleListener which is typically a hook.
    // If we need it here, we might need a different approach or just fallback for now.
    // However, we can use player.isMuted or similar if needed.

    return player;
  } catch (e) {
    console.error("Error playing base64 audio:", e);
    VoiceAnalyzer.volume = 0;
  }
};

import { VoiceService } from "@/services/voice";

export const speakReply = async (text: string, voiceId = "Rachel") => {
  const trimmed = text.trim();
  if (!trimmed) return;

  try {
    const audioBase64 = await VoiceService.generateSpeech(trimmed, voiceId);
    if (audioBase64) {
      await playBase64Audio(audioBase64);
      return;
    }
  } catch (error: any) {
    console.warn("speakReply error:", error);
  }

  Speech.speak(trimmed, voiceId ? { voice: voiceId } : undefined);
};
