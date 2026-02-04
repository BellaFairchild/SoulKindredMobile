const apiKey = process.env.EXPO_PUBLIC_ELEVENLABS_API_KEY;

if (!apiKey) {
    console.warn("ElevenLabs API Key is missing. Voice features will be limited.");
}

export const elevenLabsService = {
    /**
     * Fetch all available voices from the authenticated account.
     */
    getVoices: async () => {
        try {
            if (!apiKey) return [];

            const response = await fetch('https://api.elevenlabs.io/v1/voices', {
                method: 'GET',
                headers: {
                    'xi-api-key': apiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error("ElevenLabs API Error:", response.status, errorText);
                return [];
            }

            const data = await response.json();
            return data.voices || [];
        } catch (error) {
            console.error("Failed to fetch voices:", error);
            return [];
        }
    },

    /**
     * Get a specific voice by ID.
     */
    getVoice: async (voiceId: string) => {
        try {
            // Note: Since we are listing all voices, we typically already have the data.
            // But if we need to fetch specifically:
            if (!apiKey) return null;

            const response = await fetch(`https://api.elevenlabs.io/v1/voices/${voiceId}`, {
                method: 'GET',
                headers: {
                    'xi-api-key': apiKey,
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) return null;
            return await response.json();
        } catch (error) {
            console.error(`Failed to fetch voice ${voiceId}:`, error);
            return null;
        }
    }
};
