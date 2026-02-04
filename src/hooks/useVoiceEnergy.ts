import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { isSameDay } from 'date-fns';

type VoiceEnergyState = {
    energy: number; // 0 to 100
    lastResetDate: string; // ISO date string
    isTired: boolean;

    // Actions
    consumeEnergy: (amount: number) => void;
    checkReset: () => void;
    refill: () => void;
};

// 100 energy = 5 minutes (300 seconds)
// 1 second = 0.33 energy (approx) -> 100 / 300 = 0.333
// TEMPORARY: Cost set to 0 for unlimited testing
const ENERGY_COST_PER_SECOND = 0; // Was: 100 / 300;

export const useVoiceEnergy = create<VoiceEnergyState>()(
    persist(
        (set, get) => ({
            energy: 100,
            lastResetDate: new Date().toISOString(),
            isTired: false,

            consumeEnergy: (amount: number) => {
                set((state) => {
                    // Safety check for reset before consumption?
                    // We can do it here lightly, or rely on a global check.
                    // Let's do a quick inline check just in case.
                    const now = new Date();
                    const last = new Date(state.lastResetDate);
                    if (!isSameDay(now, last)) {
                        return {
                            energy: Math.max(0, 100 - amount),
                            lastResetDate: now.toISOString(),
                            isTired: false
                        };
                    }

                    const newEnergy = Math.max(0, state.energy - amount);
                    return {
                        energy: newEnergy,
                        isTired: newEnergy <= 0
                    };
                });
            },

            checkReset: () => {
                const state = get();
                const now = new Date();
                const last = new Date(state.lastResetDate);

                if (!isSameDay(now, last)) {
                    console.log('Voice Energy: New day detected, resetting energy.');
                    set({
                        energy: 100,
                        lastResetDate: now.toISOString(),
                        isTired: false
                    });
                }
            },

            refill: () => {
                set({ energy: 100, isTired: false });
            }
        }),
        {
            name: 'soul-kindred-voice-energy',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);

export const ENERGY_COSTS = {
    SECOND_OF_SPEECH: ENERGY_COST_PER_SECOND,
    // Maybe a fixed cost for starting a sentence?
    SENTENCE_START: 1,
};
