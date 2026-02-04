import { useState, useCallback, useRef, useEffect } from 'react';
import { Audio } from 'expo-av';
import { Alert } from 'react-native';

/**
 * Real voice recorder hook using expo-av and OpenAI Whisper.
 * Includes basic VAD (Voice Activity Detection) for auto-stop on silence.
 */
export function useVoiceRecorder() {
    const [recording, setRecording] = useState<Audio.Recording | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [permissionResponse, requestPermission] = Audio.usePermissions();

    // VAD State Refs
    const silenceStartTimeRef = useRef<number | null>(null);
    const isSpeakingDetectedRef = useRef<boolean>(false);
    const onSpeechEndRef = useRef<((text: string) => void) | undefined>(undefined);

    // We need a ref to the recording object to stop it from within the status update callback
    const recordingRef = useRef<Audio.Recording | null>(null);

    // Stop and transcribe logic (Reusable)
    const stopAndTranscribe = useCallback(async () => {
        const currentRecording = recordingRef.current;
        if (!currentRecording) return;

        // Prevent double tagging
        recordingRef.current = null;
        setRecording(null);

        try {
            await currentRecording.stopAndUnloadAsync();
            const uri = currentRecording.getURI();

            if (!uri) {
                console.error('No recording URI found');
                return;
            }

            // Reset Audio Mode to Playback (Speaker)
            // This ensures TTS works immediately after
            await Audio.setAudioModeAsync({
                allowsRecordingIOS: false,
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });

            setIsProcessing(true);

            const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
            if (!apiKey) {
                Alert.alert('Configuration Error', 'OpenAI API Key is missing. Check .env file.');
                setIsProcessing(false);
                return;
            }

            // Upload to OpenAI Whisper
            const formData = new FormData();
            formData.append('file', {
                uri: uri,
                type: 'audio/m4a',
                name: 'recording.m4a',
            } as any);
            formData.append('model', 'whisper-1');
            formData.append('prompt', 'Soul Kindred, spiritual companion, feelings, emotions, meditation, mental health, therapy, caring.'); // Context to improve accuracy

            console.log("Transcribing audio...");
            console.log("Transcribing audio...");

            const fetchPromise = fetch('https://api.openai.com/v1/audio/transcriptions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'multipart/form-data',
                },
                body: formData,
            });

            const timeoutPromise = new Promise((_, reject) => {
                setTimeout(() => reject(new Error('Transcription timed out (20s)')), 20000);
            });

            const response = await Promise.race([fetchPromise, timeoutPromise]) as Response;

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`Whisper API Failed (${response.status}):`, errorText);
                throw new Error(`Whisper API Error: ${response.status} ${response.statusText}`);
            }

            let data;
            try {
                data = await response.json();
            } catch (e) {
                const text = await response.text();
                console.error('Failed to parse Whisper JSON:', text);
                throw new Error('Invalid JSON response from Whisper API');
            }
            setIsProcessing(false);

            if (data.error) {
                console.error('Whisper API Error:', data.error);
                Alert.alert('Transcription Failed', data.error.message);
                return;
            }

            const text = data.text || '';
            console.log("Transcription result:", text);

            // Callback if auto-stopped
            if (onSpeechEndRef.current && text.trim()) {
                onSpeechEndRef.current(text);
            }

            return text;

        } catch (error) {
            console.error('Transcription failed:', error);
            setIsProcessing(false);
            return '';
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (recordingRef.current) {
                recordingRef.current.stopAndUnloadAsync().catch(() => { });
            }
        };
    }, []);

    const startRecording = useCallback(async (onSpeechEndCallback?: (text: string) => void) => {
        try {
            // Prevent multiple recordings
            if (recordingRef.current) {
                try {
                    await recordingRef.current.stopAndUnloadAsync();
                } catch (e) { /* ignore */ }
                recordingRef.current = null;
                setRecording(null);
            }

            // Store callback
            onSpeechEndRef.current = onSpeechEndCallback;

            // Reset VAD
            silenceStartTimeRef.current = null;
            isSpeakingDetectedRef.current = false;

            if (permissionResponse?.status !== 'granted') {
                const response = await requestPermission();
                if (response.status !== 'granted') {
                    Alert.alert('Permission needed', 'Microphone permission is required to use dictation.');
                    return;
                }
            }

            await Audio.setAudioModeAsync({
                allowsRecordingIOS: true,
                playsInSilentModeIOS: true,
                staysActiveInBackground: true,
                shouldDuckAndroid: true,
                playThroughEarpieceAndroid: false,
            });

            // 16kHz AAC: Optimal for Speech Recognition (Whisper)
            // Smaller files, clearer voice, less static than 44.1kHz
            const recordingOptions: any = {
                isMeteringEnabled: true,
                android: {
                    extension: '.m4a',
                    outputFormat: Audio.AndroidOutputFormat.MPEG_4,
                    audioEncoder: Audio.AndroidAudioEncoder.AAC,
                    sampleRate: 16000, // standard wideband speech
                    numberOfChannels: 1, // mono
                    bitRate: 64000,
                },
                ios: {
                    extension: '.m4a',
                    audioQuality: Audio.IOSAudioQuality.HIGH,
                    sampleRate: 16000,
                    numberOfChannels: 1,
                    bitRate: 64000,
                    linearPCMBitDepth: 16,
                    linearPCMIsBigEndian: false,
                    linearPCMIsFloat: false,
                },
                web: {
                    mimeType: 'audio/webm',
                    bitsPerSecond: 64000,
                },
            };

            const { recording: newRecording } = await Audio.Recording.createAsync(
                recordingOptions,
                (status) => {
                    // VAD Logic in Status Update
                    if (status.isRecording && status.metering !== undefined) {
                        const level = status.metering; // dB, typically -160 to 0

                        // DEBUG: Log level occasionally
                        if (Math.random() < 0.1) {
                            console.log(`[VAD] Level: ${level.toFixed(1)} dB | Speaking: ${isSpeakingDetectedRef.current}`);
                        }

                        // Thresholds (Adjusted for Emulator/Low-Quality Mics)
                        const SILENCE_THRESHOLD_DB = -60; // Was -50
                        const SPEAKING_THRESHOLD_DB = -55; // Was -45
                        const SILENCE_DURATION_MS = 2000; // Wait 2 seconds before cutting off

                        // 1. Detect if speaking has started
                        if (level > SPEAKING_THRESHOLD_DB) {
                            if (!isSpeakingDetectedRef.current) console.log("[VAD] Speaking Detected!");
                            isSpeakingDetectedRef.current = true;
                            silenceStartTimeRef.current = null; // Reset silence timer
                        }

                        // 2. Detect Silence (only if we have already detected some speech)
                        if (isSpeakingDetectedRef.current && level < SILENCE_THRESHOLD_DB) {
                            if (silenceStartTimeRef.current === null) {
                                console.log("[VAD] Silence timer started...");
                                silenceStartTimeRef.current = Date.now();
                            } else {
                                const duration = Date.now() - silenceStartTimeRef.current;
                                if (duration > SILENCE_DURATION_MS) {
                                    console.log("VAD: Silence detected (>1.5s), stopping...");
                                    // Stop recording!
                                    // Remove listener to prevent multiple calls
                                    newRecording.setOnRecordingStatusUpdate(null);
                                    stopAndTranscribe();
                                }
                            }
                        }
                    }
                },
                100 // Update every 100ms
            );

            setRecording(newRecording);
            recordingRef.current = newRecording;

        } catch (error) {
            console.error('Failed to start recording:', error);
            Alert.alert('Error', 'Failed to start recording: ' + error);
        }
    }, [permissionResponse, requestPermission, stopAndTranscribe]);

    const stopRecording = useCallback(async () => {
        // Manual stop
        // Use the same logic but return the text directly
        if (!recordingRef.current) return '';

        // Disable auto-callback for manual stop if desired, or keep it.
        // Usually manual stop implies we want the text returned to the caller of this function.
        onSpeechEndRef.current = undefined; // Clear callback so we don't double fire

        // We can reuse stopAndTranscribe but we need to return the text.
        // stopAndTranscribe returns promise<string | undefined>
        const text = await stopAndTranscribe();
        return text || '';
    }, [stopAndTranscribe]);

    return {
        isRecording: !!recording,
        isProcessing,
        startRecording,
        stopRecording
    };
}
