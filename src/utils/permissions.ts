import { useAudioPlayer, AudioModule } from 'expo-audio';

export const requestMicPermission = async () => {
  const result = await AudioModule.requestRecordingPermissionsAsync();
  return result.status === 'granted';
};

export const requestPlaybackPermission = async () => {
  // Playback permission is often not needed or handled differently in newer SDKs
  // but we can check the module status if it exists.
  return true;
};

export const ensureAudioSession = async () => {
  // In SDK 54 with expo-audio, session management is often more automatic
  // but we can still set categories if needed via AudioModule.
  // For now, we'll keep it simple as expo-audio handles most of this.
};
