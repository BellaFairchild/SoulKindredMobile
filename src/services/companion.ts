import { db } from '@/lib/firebase';
import { doc, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';

export type Persona = "supportive" | "calm" | "reflective";
export type Voice = "warm" | "neutral" | string; // Allow specific ElevenLabs voice IDs

export const updateCompanionProfile = async (uid: string, data: any) => {
  if (!db) return;
  const userRef = doc(db, 'users', uid);
  await updateDoc(userRef, {
    ...data,
    updatedAt: Date.now(),
  });
};

export async function saveCompanion(uid: string, companion: {
  name: string;
  avatarId: string;
  glbUrl?: string; // ReadyPlayerMe URL
  persona: Persona | string | string[];
  personalityIntensity?: number;
  voiceId: string; // ElevenLabs Voice ID
  language: string;
  gender?: string;
  ageRange?: string; // e.g. "18-30"
  sceneId?: string; // e.g. "cabin"
  plan?: 'free' | 'premium';
}) {
  if (!db) return;
  await setDoc(doc(db, `users/${uid}/companion/active`), {
    ...companion,
    isActive: true,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  });
}
