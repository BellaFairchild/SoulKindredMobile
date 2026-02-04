import { app } from "@/firebase/client";
import { getFunctions, httpsCallable } from "firebase/functions";
import { ELEVEN_LABS_VOICES } from "@/constants/voices";

export interface VoiceResponse {
    audioBase64?: string;
}

/**
 * Service to handle ElevenLabs voice generation via Firebase Functions
 */
export const VoiceService = {
    getVoices: () => ELEVEN_LABS_VOICES,

    generateSpeech: async (text: string, voiceId: string): Promise<string | null> => {
        // 1. Try Cloud Function first purely to test if it's live
        try {
            const functions = app ? getFunctions(app, "us-central1") : undefined;
            if (functions) {
                const callable = httpsCallable<{ text: string; voiceId: string }, VoiceResponse>(
                    functions,
                    "generateVoice"
                );
                const res = await callable({ text, voiceId });
                if (res.data?.audioBase64) return res.data.audioBase64;
            }
        } catch (error) {
            console.log("Cloud Function voice generation failed, trying client-side fallback...", error);
        }

        // 2. Fallback to Client-Side API Call (for development/demo)
        try {
            const apiKey = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;
            if (!apiKey) {
                console.warn("Missing EXPO_PUBLIC_ELEVENLABS_API_KEY for client-side fallback.");
                return null;
            }

            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                method: 'POST',
                headers: {
                    'xi-api-key': apiKey,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text,
                    model_id: "eleven_monolingual_v1",
                    voice_settings: { stability: 0.5, similarity_boost: 0.75 }
                })
            });

            if (!response.ok) {
                const errText = await response.text();
                throw new Error(`ElevenLabs API Error: ${response.status} ${errText}`);
            }

            const arrayBuffer = await response.arrayBuffer();
            // Convert ArrayBuffer to Base64
            const base64 = Buffer.from(arrayBuffer).toString('base64');
            return base64;
        } catch (clientError) {
            console.error("VoiceService client-side error:", clientError);
            return null;
        }
    }
};
