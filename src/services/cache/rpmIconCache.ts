import * as FileSystem from "expo-file-system";

// Use documentDirectory so it survives longer than cache
const DIR = `${FileSystem.documentDirectory}rpm-icons/`;

async function ensureDir() {
  const info = await FileSystem.getInfoAsync(DIR);
  if (!info.exists) await FileSystem.makeDirectoryAsync(DIR, { intermediates: true });
}

export async function cacheRpmIcon(remoteUrl: string, key: string) {
  await ensureDir();

  const localPath = `${DIR}${key}.png`;

  // If file already exists, use it
  const existing = await FileSystem.getInfoAsync(localPath);
  if (existing.exists && existing.uri) return existing.uri;

  // Download
  const dl = await FileSystem.downloadAsync(remoteUrl, localPath);

  // ✅ Verify download really exists
  const check = await FileSystem.getInfoAsync(dl.uri);
  if (!check.exists) {
    // Fallback to remote (never crash the UI)
    return remoteUrl;
  }

  return dl.uri;
}

export function rpmIconKey(avatarId: string, version: number) {
  return `rpm_${avatarId}_torso_${version}`;
}
