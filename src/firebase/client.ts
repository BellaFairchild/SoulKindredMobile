export * from "@/lib/firebase";

// Analytics is web-only
let analyticsInstance: unknown;

export async function getAnalyticsInstance() {
  if (analyticsInstance) return analyticsInstance;
  if (typeof window === "undefined") return undefined;

  try {
    const { getAnalytics, isSupported } = await import("firebase/analytics");
    const { firebaseApp } = await import("@/lib/firebase");
    if (await isSupported()) {
      analyticsInstance = getAnalytics(firebaseApp);
      return analyticsInstance;
    }
  } catch {
    // ignore; analytics not available (e.g., native runtime)
  }

  return undefined;
}
