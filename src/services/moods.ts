import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

/**
 * Logs a mood entry to Firestore.
 */
export async function logMood(uid: string, emotion: string, intensity: number, note?: string) {
  if (!db) return;
  await addDoc(collection(db, `users/${uid}/moods`), {
    emotion,
    intensity,
    note: note || "",
    createdAt: serverTimestamp(),
  });
}
