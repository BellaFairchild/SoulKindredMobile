import { db } from '@/lib/firebase';
import { doc, setDoc, getDoc, updateDoc } from 'firebase/firestore';

export interface UserProfile {
    uid: string;
    email: string;
    username: string;
    companionType?: string | null;
    avatarId?: string | null;
    aiName?: string;
    ageRange?: string | null;
    language?: string;
    personality?: Record<string, number>;
    voiceId?: string;
    themeId?: string;
    planId?: 'free' | 'premium';
    billingCycle?: 'monthly' | 'annually';

    // Gamification
    gamification?: {
        resonance: number; // XP
        level: number;
        essence: number; // Currency
        unlockedStars: string[]; // Achievement IDs
    };

    // Persistent Stats for Achievements
    stats?: {
        totalJournalEntries: number;
        totalMindfulMinutes: number;
        totalBreathingSessions: number;
        currentStreak: number;
        longestStreak: number;
        lastActiveDate: string;
    };

    createdAt: number;
    updatedAt: number;
}

export const saveUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    if (!db) return;
    const userRef = doc(db, 'users', uid);
    const now = Date.now();

    const profile: UserProfile = {
        uid,
        email: data.email || '',
        username: data.username || '',
        ...data,
        createdAt: now,
        updatedAt: now,
    } as UserProfile;

    await setDoc(userRef, profile, { merge: true });
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
    if (!db) return null;
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);

    if (snap.exists()) {
        return snap.data() as UserProfile;
    }
    return null;
};

export const updateUserProfile = async (uid: string, data: Partial<UserProfile>) => {
    if (!db) return;
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
        ...data,
        updatedAt: Date.now(),
    });
};
