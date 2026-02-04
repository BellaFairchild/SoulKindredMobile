export type MoodState = 'grounded' | 'curious' | 'energized' | 'restful';

export const moodToColor = (mood: MoodState) => {
  switch (mood) {
    case 'energized':
      return '#f59e0b';
    case 'curious':
      return '#8b5cf6';
    case 'restful':
      return '#38bdf8';
    case 'grounded':
    default:
      return '#22c55e';
  }
};

export const moodToWeather = (mood: MoodState) => {
  switch (mood) {
    case 'energized':
      return { condition: 'Sunny sparks', temperature: 74 };
    case 'curious':
      return { condition: 'Shifting clouds', temperature: 67 };
    case 'restful':
      return { condition: 'Calm mist', temperature: 62 };
    case 'grounded':
    default:
      return { condition: 'Steady breeze', temperature: 70 };
  }
};
