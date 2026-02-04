import * as Speech from 'expo-speech';

export const speak = (text: string, voice?: string) => {
  const options = voice ? { voice } : undefined;
  Speech.speak(text, options);
};

export const stopSpeaking = () => {
  Speech.stop();
};
