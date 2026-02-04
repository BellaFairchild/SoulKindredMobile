import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isSameDay } from 'date-fns';

type BurnLimitState = {
    burnsToday: number;
    lastResetDate: string;

    // Actions
    incrementBurn: () => void;
    checkReset: () => void;
};

export const useBurnLimit = create<BurnLimitState>()(
    persist(
        (set, get) => ({
            burnsToday: 0,
            lastResetDate: new Date().toISOString(),

            incrementBurn: () => {
                const state = get();
                const now = new Date();
                const last = new Date(state.lastResetDate);

                if (!isSameDay(now, last)) {
                    // Reset and count 1
                    set({ burnsToday: 1, lastResetDate: now.toISOString() });
                } else {
                    set({ burnsToday: state.burnsToday + 1 });
                }
            },

            checkReset: () => {
                const state = get();
                const now = new Date();
                const last = new Date(state.lastResetDate);

                if (!isSameDay(now, last)) {
                    set({ burnsToday: 0, lastResetDate: now.toISOString() });
                }
            }
        }),
        {
            name: 'soul-kindred-burn-limit',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
