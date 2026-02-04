import { useMemo } from 'react';
import { moodToWeather, MoodState } from '@/utils/mood';

export type MoodWeatherSnapshot = {
  condition: string;
  temperature: number;
  prompt: string;
};

const prompts: Record<MoodState, string> = {
  grounded: 'Stay steady and keep the pace that feels sustainable.',
  curious: 'Follow the thread—capture the thought before it drifts.',
  energized: 'Channel that spark into one small, shippable action.',
  restful: 'Protect the calm. A five-minute pause is productive.',
};

export const useMoodWeather = (mood: MoodState): MoodWeatherSnapshot =>
  useMemo(() => {
    const weather = moodToWeather(mood);
    return {
      condition: weather.condition,
      temperature: weather.temperature,
      prompt: prompts[mood],
    };
  }, [mood]);
