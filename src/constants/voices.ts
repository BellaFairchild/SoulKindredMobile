export interface VoiceConfig {
    id: string;
    name: string;
    previewUrl?: string; // Optional: for hearing a sample in setup
}

export const ELEVEN_LABS_VOICES: VoiceConfig[] = [
    { id: "21m00Tcm4TlvDq8ikWAM", name: "Rachel (Clear)" },
    { id: "29vD33N1CtxCmqQRPOHJ", name: "Drew (Calm)" },
    { id: "2EiwWnXFnvU5JabPnv8n", name: "Clyde (Supportive)" },
    { id: "AZnzlk1XvdvUeBnXmlld", name: "Domi (Friendly)" },
    { id: "EXAV7iH4uB6pSjInI8Y8", name: "Bella (Soft)" },
];

export const DEFAULT_VOICE_ID = "21m00Tcm4TlvDq8ikWAM";
