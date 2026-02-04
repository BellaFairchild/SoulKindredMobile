import { useAppStore } from './store';

export const useMood = () => useAppStore((state) => state.mood);
export const useAffirmations = () => useAppStore((state) => state.affirmations);
export const useStreak = () => useAppStore((state) => state.streak);
export const useTasks = () => useAppStore((state) => state.tasks);
export const useToggleTask = () => useAppStore((state) => state.toggleTask);
export const useAddAffirmation = () => useAppStore((state) => state.addAffirmation);
export const useSetMood = () => useAppStore((state) => state.setMood);
export const useIncrementStreak = () => useAppStore((state) => state.incrementStreak);
