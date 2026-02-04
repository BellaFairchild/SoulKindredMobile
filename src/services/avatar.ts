/**
 * Service to handle ReadyPlayerMe avatar logic
 */
export const AvatarService = {
    /**
     * Constructs a full GLB URL from a ReadyPlayerMe avatar ID if needed.
     * If it's already a URL, it returns it as is.
     */
    getGlbUrl: (idOrUrl: string) => {
        if (idOrUrl.startsWith('http')) {
            return idOrUrl;
        }
        // Default RPM template or construction pattern
        return `https://models.readyplayer.me/${idOrUrl}.glb`;
    },

    /**
     * Returns a preview image URL for the avatar
     */
    getPreviewUrl: (idOrUrl: string) => {
        const baseUrl = AvatarService.getGlbUrl(idOrUrl).replace('.glb', '');
        return `${baseUrl}.png`;
    },

    /**
     * Helper to set common RPM parameters (like pose or texture size)
     */
    getOptimizedUrl: (url: string) => {
        if (!url.includes('readyplayer.me')) return url;
        // Example optimization parameters
        return `${url}?meshLod=2&textureSizeLimit=1024`;
    }
};
