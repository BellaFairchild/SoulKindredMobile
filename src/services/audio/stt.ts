import { AudioModule, useAudioRecorder, RecordingPresets } from 'expo-audio';

export type RecordingHandle = any; // AudioRecorder type

export const startRecording = async (): Promise<RecordingHandle | null> => {
  const result = await AudioModule.requestRecordingPermissionsAsync();
  if (result.status !== 'granted') return null;

  const recording = AudioModule.createRecorder();
  // Options are handled via presets
  await recording.prepareRecorder(RecordingPresets.HIGH_QUALITY);
  await recording.startRecorder();
  return recording;
};

export const stopRecording = async (recording: RecordingHandle | null) => {
  if (!recording) return null;
  await recording.stopRecorder();
  const uri = recording.uri;
  // Note: Unloading might be automatic or handled via recorder methods
  return uri ?? null;
};

export const transcribePlaceholder = async (_uri: string | null) => {
  // Wire up a transcription provider when credentials are ready.
  return 'Voice note captured. Connect STT to turn this into text.';
};
