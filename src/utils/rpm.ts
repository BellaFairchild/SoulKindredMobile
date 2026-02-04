export function extractRpmId(urlOrId: string) {
  const m = urlOrId.match(/models\.readyplayer\.me\/([a-zA-Z0-9]+)\.(glb|png)/);
  if (m?.[1]) return m[1];
  if (/^[a-zA-Z0-9]+$/.test(urlOrId)) return urlOrId;
  return undefined;
}
