import { useState, useEffect } from 'react';
import * as FileSystem from 'expo-file-system';

export function useCachedModel(url?: string) {
    const [localUri, setLocalUri] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!url) {
            setLocalUri(null);
            return;
        }

        async function downloadModel() {
            setIsLoading(true);
            setError(null);
            try {
                const cleanUrl = url!.trim();
                const filename = `v2_${cleanUrl.split('/').pop()?.split('?')[0] || 'model.glb'}`;
                const fileUri = `${FileSystem.cacheDirectory}${filename}`;

                const info = await FileSystem.getInfoAsync(fileUri);
                if (info.exists && info.size && info.size > 5000) {
                    setLocalUri(fileUri);
                    setIsLoading(false);
                    return;
                }

                console.log("[useCachedModel] Downloading:", cleanUrl);
                const result = await FileSystem.downloadAsync(cleanUrl, fileUri);

                if (result.status !== 200) {
                    throw new Error(`Download failed with status ${result.status}`);
                }

                setLocalUri(result.uri);
            } catch (err: any) {
                console.warn("[useCachedModel] Failed:", err);
                setError(err.message);
                // Fallback to Duck if everything fails? Or just return null and let component handle it.
                // For now, return null so component can show placeholder or nothing.
            } finally {
                setIsLoading(false);
            }
        }

        downloadModel();
    }, [url]);

    return { localUri, isLoading, error };
}
