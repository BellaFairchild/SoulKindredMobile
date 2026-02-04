import {
  addDoc,
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function ensureConversation(uid: string) {
  if (!db) return "main";
  // Create a simple "main" conversation doc if it doesn't exist
  const convoRef = doc(db, `users/${uid}/conversations/main`);
  const snap = await getDoc(convoRef);

  if (!snap.exists()) {
    await setDoc(convoRef, {
      title: "Main",
      createdAt: serverTimestamp(),
      lastMessageAt: null,
      lastMessagePreview: "",
    });
  }

  return "main";
}

export async function sendUserMessage(uid: string, conversationId: string, content: string) {
  if (!db) return;
  const messagesCol = collection(db, `users/${uid}/conversations/${conversationId}/messages`);

  // write user message
  await addDoc(messagesCol, {
    sender: "user",
    content,
    createdAt: serverTimestamp(),
    safetyFlagged: false,
    safetyCategory: null,
  });

  // update conversation preview for snappy UI
  await setDoc(
    doc(db, `users/${uid}/conversations/${conversationId}`),
    {
      lastMessageAt: serverTimestamp(),
      lastMessagePreview: content.slice(0, 140),
    },
    { merge: true }
  );
}

export function subscribeMessages(
  uid: string,
  conversationId: string,
  cb: (items: Array<{ id: string; sender: string; content: string; createdAt?: any }>) => void
) {
  if (!db) return () => { };
  const q = query(
    collection(db, `users/${uid}/conversations/${conversationId}/messages`),
    orderBy("createdAt", "asc")
  );

  return onSnapshot(q, (snap) => {
    const items = snap.docs.map((d) => ({ id: d.id, ...(d.data() as any) }));
    cb(items);
  });
}
