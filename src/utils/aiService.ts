import { app } from "@/firebase/client";
import { getFunctions, httpsCallable } from "firebase/functions";

type AIReplyResponse = { reply?: string };

const fallbackReply = (message: string) => `I heard you say: "${message}". How else can I help?`;

export const getAIReply = async (message: string, traits: string[] = []) => {
  const trimmed = message.trim();
  if (!trimmed) return "I didn't catch that. Can you say it again?";

  try {
    const functions = app ? getFunctions(app, "us-central1") : undefined;
    const { auth } = await import("@/lib/firebase");
    console.log("getAIReply: Calling function. Auth User:", auth?.currentUser?.uid || "NONE", "IsAnonymous:", auth?.currentUser?.isAnonymous);

    if (!functions) {
      console.warn("Firebase Functions not configured; returning fallback reply.");
      return fallbackReply(trimmed);
    }

    const callable = httpsCallable<{ message: string; traits?: string[] }, AIReplyResponse>(
      functions,
      "getAIResponse"
    );
    const res = await callable({ message: trimmed, traits });
    return res.data?.reply?.trim() || fallbackReply(trimmed);
  } catch (error: any) {
    console.warn("getAIReply error:", {
      code: error?.code,
      message: error?.message,
      details: error?.details,
    });
    return fallbackReply(trimmed);
  }
};
