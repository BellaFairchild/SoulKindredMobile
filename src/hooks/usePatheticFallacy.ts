import { useMemo } from 'react';
import { useAppStore } from '@/state/store';
import { MoodState } from '@/utils/mood';

export type WeatherType = 'clear' | 'rain' | 'snow' | 'ember' | 'wind';

export type EnvironmentalTheme = {
    weather: WeatherType;
    primaryColor: string;
    accentColor: string;
    intensity: number; // 0 to 1
};

export const MOOD_ENV_MAP: Record<MoodState, EnvironmentalTheme> = {
    anxious: {
        weather: 'wind',
        primaryColor: '#F59E0B',
        accentColor: '#EF4444',
        intensity: 0.8,
    },
    sad: {
        weather: 'rain',
        primaryColor: '#3B82F6',
        accentColor: '#60A5FA',
        intensity: 0.6,
    },
    grounded: {
        weather: 'clear',
        primaryColor: '#10B981',
        accentColor: '#34D399',
        intensity: 0.2,
    },
    angry: {
        weather: 'ember',
        primaryColor: '#EF4444',
        accentColor: '#B91C1C',
        intensity: 1.0,
    },
    overwhelmed: {
        weather: 'snow',
        primaryColor: '#6366F1',
        accentColor: '#818CF8',
        intensity: 0.7,
    },
    neutral: {
        weather: 'clear',
        primaryColor: '#8B5CF6',
        accentColor: '#A78BFA',
        intensity: 0.0,
    }
};

export function usePatheticFallacy() {
    const mood = useAppStore((state) => state.mood);

    const environment = useMemo(() => {
        return MOOD_ENV_MAP[mood] || MOOD_ENV_MAP.neutral;
    }, [mood]);

    return environment;
}
