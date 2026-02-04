import { create } from "zustand";

export type ThemeMode = "day" | "night";
export type MoodKey = "calm" | "joy" | "sad" | "anxious" | "angry" | "numb" | "panic";
export type EnvironmentKey = "cabin" | "beach" | "patio" | "camping";

type SoulKindredState = {
  theme: ThemeMode;

  moodKey: MoodKey;
  moodIntensity: number; // 1–10
  unread: number;

  environment: EnvironmentKey;

  // User (drawer header)
  userPhotoUrl?: string;
  displayName: string;

  // Friend (Ready Player Me)
  rpmAvatarId?: string;
  rpmGlbUrl?: string;
  rpmIconUrl?: string; // cached file:// uri preferred

  // AI Persona
  personality: Record<string, number>;
  voiceId: string;

  setTheme: (t: ThemeMode) => void;
  setMood: (m: MoodKey, i: number) => void;
  setUnread: (n: number) => void;
  setEnvironment: (e: EnvironmentKey) => void;

  setUser: (u: { photoUrl?: string; name?: string }) => void;
  setFriend: (f: { id?: string; glbUrl?: string; iconUrl?: string; personality?: Record<string, number>; voiceId?: string }) => void;
};

export const useSoulKindred = create<SoulKindredState>((set) => ({
  theme: "night",

  moodKey: "calm",
  moodIntensity: 3,
  unread: 0,

  userPhotoUrl: undefined,
  displayName: "You",

  rpmAvatarId: undefined,
  rpmGlbUrl: "https://models.readyplayer.me/64e3055495439dfcf3f0b665.glb",
  rpmIconUrl: undefined,

  personality: {},
  voiceId: "Rachel",

  environment: "cabin", // Default

  setTheme: (theme) => set({ theme }),
  setMood: (moodKey, moodIntensity) =>
    set({ moodKey, moodIntensity: Math.max(1, Math.min(10, moodIntensity)) }),
  setUnread: (unread) => set({ unread: Math.max(0, unread) }),

  setEnvironment: (env) => set({ environment: env }),

  setUser: ({ photoUrl, name }) =>
    set((s) => ({
      userPhotoUrl: photoUrl ?? s.userPhotoUrl,
      displayName: name ?? s.displayName,
    })),

  setFriend: ({ id, glbUrl, iconUrl, personality, voiceId }) =>
    set((s) => ({
      rpmAvatarId: id ?? s.rpmAvatarId,
      rpmGlbUrl: glbUrl ?? s.rpmGlbUrl,
      rpmIconUrl: iconUrl ?? s.rpmIconUrl,
      personality: personality ?? s.personality,
      voiceId: voiceId ?? s.voiceId,
    })),
}));
