import { create } from 'zustand';
import { MoodState } from '@/utils/mood';
import { DAILY_RITUALS, DEFAULT_AFFIRMATIONS } from '@/utils/constants';

// Leveling Logic: level = floor(sqrt(resonance / 100)) + 1
// 0 XP = Lvl 1, 100 XP = Lvl 2, 400 XP = Lvl 3, 900 XP = Lvl 4...
const calculateLevel = (resonance: number) => Math.floor(Math.sqrt(resonance / 100)) + 1;

type Task = {
  id: string;
  label: string;
  completed: boolean;
};


export type VaultItem = {
  id: string;
  type: 'journal' | 'meme' | 'sticker' | 'audio' | 'link';
  title: string;
  content?: string;
  mediaUrl?: string;
  date: string; // ISO string
  mood?: string;
  moodColor?: string;
  tags?: string[];
};

type AppState = {
  mood: MoodState;
  streak: number;
  // Gamification
  resonance: number;
  level: number;
  essence: number;
  affirmations: string[];
  tasks: Task[];
  isDropAvailable: boolean;
  lastDropDate: string | null;
  vaultItems: VaultItem[];
  moodHistory: { date: string; value: number }[];
  companionVoiceId: string;
  setCompanionVoiceId: (id: string) => void;
  companionTraits: string[];
  setCompanionTraits: (traits: string[]) => void;
  companionIntensity: number;
  setCompanionIntensity: (val: number) => void;
  companionName: string;
  setCompanionName: (name: string) => void;
  companionAge: string;
  setCompanionAge: (age: string) => void;
  companionGender: string;
  setCompanionGender: (gender: string) => void;
  currentSceneId: string;
  setCurrentSceneId: (id: string) => void;
  userFacts: string[];
  addUserFact: (fact: string) => void;
  removeUserFact: (index: number) => void;
  setMood: (mood: MoodState) => void;
  logMood: (value: number) => void;
  addAffirmation: (text: string) => void;
  incrementStreak: () => void;
  toggleTask: (id: string) => void;
  claimDailyDrop: () => VaultItem | null;
  checkDailyDropReset: () => void;
  addToVault: (item: VaultItem) => void;
  removeFromVault: (id: string) => void;
  // Gamification Actions
  addResonance: (amount: number) => void;
  // Onboarding
  hasCompletedOnboarding: boolean;
  completeOnboarding: () => void;
};

const LOOT_TABLE: Partial<VaultItem>[] = [
  { type: 'sticker', title: 'Cosmic Cat', mediaUrl: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400', tags: ['#Sticker', '#Rare'] },
  { type: 'meme', title: 'Daily Wisdom', mediaUrl: 'https://images.unsplash.com/photo-1519750783826-e2420f4d687f?w=400', tags: ['#Wisdom'] },
  { type: 'audio', title: 'Forest Rain', mediaUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', tags: ['#Sound', '#Nature'] },
  { type: 'sticker', title: 'Zen Dog', mediaUrl: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=400', tags: ['#Sticker', '#Cute'] },
  { type: 'meme', title: 'Keep Going', mediaUrl: 'https://images.unsplash.com/photo-1552508744-1696d4464960?w=400', tags: ['#Motivation'] },
];

const seedTasks: Task[] = DAILY_RITUALS.map((label, index) => ({
  id: `task-${index}`,
  label,
  completed: false,
}));

// Mock 7 days of history for the chart
const seedMoodHistory = Array.from({ length: 7 }).map((_, i) => ({
  date: new Date(Date.now() - (6 - i) * 86400000).toISOString(),
  value: Math.floor(Math.random() * 5) // Random 0-4
}));

// Seed some initial data for visual testing
const seedVaultItems: VaultItem[] = [
  {
    id: 'seed-1',
    type: 'journal',
    title: 'Morning Reflection',
    content: 'I woke up feeling really energized today. The sun was shining and...',
    date: new Date(Date.now() - 86400000).toISOString(),
    mood: 'Happy',
    moodColor: '#A855F7',
    tags: ['#Morning', '#Gratitude']
  },
  {
    id: 'seed-2',
    type: 'audio',
    title: 'Rain Sounds',
    mediaUrl: 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&q=80&w=400',
    date: new Date().toISOString(),
    tags: ['#Relaxation']
  }
];

export const useAppStore = create<AppState>((set, get) => ({
  mood: 'grounded',
  streak: 3,
  // Initial Gamification State
  resonance: 120, // Example start
  level: 2,
  essence: 50,
  affirmations: DEFAULT_AFFIRMATIONS,
  tasks: seedTasks,
  isDropAvailable: true, // Default to true for demo
  lastDropDate: null,
  vaultItems: seedVaultItems,
  moodHistory: seedMoodHistory,
  setMood: (mood) => set({ mood }),
  // Companion Settings
  companionVoiceId: 'Awx8TeMHHpDzbm42nIB6', // Default: User Selected
  setCompanionVoiceId: (id: string) => set({ companionVoiceId: id }),
  // Personality Settings
  companionTraits: ['empathetic', 'supportive'], // Defaults
  setCompanionTraits: (traits: string[]) => set({ companionTraits: traits }),
  companionIntensity: 50, // 0-100
  setCompanionIntensity: (val: number) => set({ companionIntensity: val }),
  // Identity Settings
  companionName: 'Soul Kindred',
  setCompanionName: (name: string) => set({ companionName: name }),
  companionAge: 'Timeless',
  setCompanionAge: (age: string) => set({ companionAge: age }),
  companionGender: 'Non-binary',
  setCompanionGender: (gender: string) => set({ companionGender: gender }),
  // Visuals
  currentSceneId: 'campfire',
  setCurrentSceneId: (id: string) => set({ currentSceneId: id }),
  // Memory
  userFacts: [],
  addUserFact: (fact: string) => set((state) => ({ userFacts: [...state.userFacts, fact] })),
  removeUserFact: (index: number) => set((state) => ({ userFacts: state.userFacts.filter((_, i) => i !== index) })),

  logMood: (value) =>
    set((state) => {
      const newResonance = state.resonance + 10; // +10 for logging mood
      return {
        moodHistory: [...state.moodHistory, { date: new Date().toISOString(), value }].slice(-14),
        resonance: newResonance,
        level: calculateLevel(newResonance)
      };
    }),
  addAffirmation: (text) =>
    set((state) => ({
      affirmations: [text, ...state.affirmations].slice(0, 10),
    })),
  incrementStreak: () => set((state) => ({ streak: state.streak + 1 })),
  toggleTask: (id) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    })),
  claimDailyDrop: () => {
    const state = get();
    if (!state.isDropAvailable) return null;

    // Pick Random Item
    const randomLoot = LOOT_TABLE[Math.floor(Math.random() * LOOT_TABLE.length)];

    const newItem: VaultItem = {
      id: Date.now().toString(),
      type: randomLoot.type || 'sticker',
      title: randomLoot.title || 'Mystery Drop',
      mediaUrl: randomLoot.mediaUrl,
      date: new Date().toISOString(),
      tags: [...(randomLoot.tags || []), '#DailyDrop', '#Unlock'],
      moodColor: '#F59E0B', // Gold for daily drop
    };

    set((state) => ({
      vaultItems: [newItem, ...state.vaultItems],
      isDropAvailable: false,
      lastDropDate: new Date().toDateString(),
      resonance: state.resonance + 50, // Bonus XP for claiming
    }));

    return newItem;
  },
  checkDailyDropReset: () => {
    const today = new Date().toDateString();
    set((state) => {
      // If it's a new day (lastDropDate != today) AND drop is not yet set to available
      if (state.lastDropDate !== today && !state.isDropAvailable) {
        return { isDropAvailable: true, lastDropDate: null }; // Reset to available
      }
      return {};
    });
  },
  addToVault: (item) => set((state) => ({ vaultItems: [item, ...state.vaultItems] })),
  removeFromVault: (id) => set((state) => ({ vaultItems: state.vaultItems.filter(i => i.id !== id) })),
  addResonance: (amount) => set((state) => {
    const newResonance = state.resonance + amount;
    return {
      resonance: newResonance,
      level: calculateLevel(newResonance)
    };
  }),
  hasCompletedOnboarding: false,
  completeOnboarding: () => set({ hasCompletedOnboarding: true }),
}));

export type { Task };

