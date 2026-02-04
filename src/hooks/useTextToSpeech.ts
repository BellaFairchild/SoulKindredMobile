import { useState, useCallback, useEffect, useRef } from 'react';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';
import * as FileSystem from 'expo-file-system';

import { useAppStore } from '@/state/store';
import { useSubscription } from '@/context/SubscriptionContext';
import { useVoiceEnergy, ENERGY_COSTS } from '@/hooks/useVoiceEnergy';

export function useTextToSpeech() {
    const { isPremium } = useSubscription();
    const { isTired, consumeEnergy } = useVoiceEnergy();
    const [sound, setSound] = useState<Audio.Sound | null>(null);
    const soundRef = useRef<Audio.Sound | null>(null); // Ref to track sound for unmount cleanup
    const [isSpeaking, setIsSpeaking] = useState(false);
    const selectedVoiceId = useAppStore((state) => state.companionVoiceId);

    // Sync Ref
    useEffect(() => {
        soundRef.current = sound;
    }, [sound]);

    // Cleanup sound on unmount ONLY
    useEffect(() => {
        return () => {
            if (soundRef.current) {
                // Prevent crash on reload/double-unload
                soundRef.current.unloadAsync().catch(() => { });
            }
        };
    }, []); // Empty dependency: only run on unmount

    // Energy Consumption Loop
    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isSpeaking && !isPremium) {
            interval = setInterval(() => {
                consumeEnergy(ENERGY_COSTS.SECOND_OF_SPEECH);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isSpeaking, isPremium, consumeEnergy]);

    const speak = useCallback(async (text: string, voiceIdOverride?: string) => {
        // Free user check
        if (!isPremium && isTired) {
            console.log("User is tired (out of energy), skipping TTS.");
            return;
        }

        const voiceId = voiceIdOverride || selectedVoiceId || "21m00Tcm4TlvDq8ikWAM";
        try {
            // Stop any previous sound
            if (sound) {
                await sound.unloadAsync();
                setSound(null);
            }

            setIsSpeaking(true);

            const apiKey = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;
            if (!apiKey) {
                console.warn("Missing ElevenLabs API Key");
                Alert.alert("Configuration Error", "Voice API Key is missing in settings.");
                setIsSpeaking(false);
                return;
            }
            console.log("TTS Key Loaded:", apiKey.slice(0, 4) + "****" + apiKey.slice(-4), "Length:", apiKey.length);

            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'xi-api-key': apiKey,
                },
                body: JSON.stringify({
                    text: text,
                    model_id: "eleven_monolingual_v1", // or eleven_turbo_v2
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.75,
                    }
                }),
            });

            if (!response.ok) {
                const err = await response.json();
                console.error("ElevenLabs Error:", err);
                throw new Error(err.detail?.message || "Failed to generate speech");
            }

            // SIMPLIFICATION for this environment:
            // Since we can't easily stream raw bytes to expo-av safely without `expo-file-system`, 
            // we will try to use `expo-file-system` if available, or assume we handle it via base64.
            // Let's rely on saving response as base64 first.

            try {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: false,
                    playsInSilentModeIOS: true,
                    staysActiveInBackground: true,
                    shouldDuckAndroid: true,
                    playThroughEarpieceAndroid: false,
                });
            } catch (e) {
                console.warn("Failed to set audio mode for playback:", e);
                // Continue anyway, it might work
            }

            const blob = await response.blob();
            console.log("DEBUG: Audio Blob Received. Size:", blob.size, "Type:", blob.type);
            const reader = new FileReader();
            reader.readAsDataURL(blob);

            reader.onloadend = async () => {
                if (reader.error) {
                    console.error("FileReader Error:", reader.error);
                    Alert.alert("Voice Data Error", "Failed to read audio data.");
                    setIsSpeaking(false);
                    return;
                }

                try {
                    const base64data = reader.result as string;
                    if (!base64data || typeof base64data !== 'string') {
                        console.error("FileReader Result Invalid:", base64data);
                        throw new Error("Empty or invalid audio data.");
                    }

                    const storageDir = FileSystem.cacheDirectory || FileSystem.documentDirectory;

                    // FALLBACK: If FileSystem is missing/null (Native Module issue), try Data URI directly
                    if (!FileSystem || !storageDir) {
                        console.warn("FileSystem unavailable. Attempting direct Data URI playback...");

                        const { sound: fallbackSound } = await Audio.Sound.createAsync(
                            { uri: base64data },
                            { shouldPlay: true }
                        );

                        setSound(fallbackSound);
                        fallbackSound.setOnPlaybackStatusUpdate((status) => {
                            if (status.isLoaded && status.didJustFinish) {
                                setIsSpeaking(false);
                            }
                        });
                        return; // Exit here, fallback successful
                    }

                    // NORMAL PATH: Save to file (Better performance on Android)
                    // Strip the header "data:audio/mpeg;base64," if present
                    const base64Raw = base64data.includes(',') ? base64data.split(',')[1] : base64data;
                    const uri = storageDir + 'voice_reply.mp3';

                    await FileSystem.writeAsStringAsync(uri, base64Raw, {
                        encoding: 'base64',
                    });

                    console.log("Audio saved to:", uri);

                    const { sound: newSound } = await Audio.Sound.createAsync(
                        { uri: uri },
                        { shouldPlay: true }
                    );

                    setSound(newSound);

                    newSound.setOnPlaybackStatusUpdate((status) => {
                        if (status.isLoaded && status.didJustFinish) {
                            setIsSpeaking(false);
                        }
                    });
                } catch (writeError: any) {
                    console.error("Audio Playback Error:", writeError);
                    Alert.alert("Playback Error", "Error: " + (writeError?.message || String(writeError)));
                    setIsSpeaking(false);
                }
            };

        } catch (error: any) {
            console.error('TTS Error:', error);
            setIsSpeaking(false);
            Alert.alert("Voice Error", "I lost my voice! " + (error.message || "Unknown error"));
        }
    }, [sound, isPremium, isTired, selectedVoiceId]);

    const stop = useCallback(async () => {
        if (sound) {
            try {
                await sound.stopAsync();
            } catch (e) { /* ignore */ }
        }
        setIsSpeaking(false);
    }, [sound]);

    return {
        speak,
        stop,
        isSpeaking
    };
}
