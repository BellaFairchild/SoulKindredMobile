import { useEffect } from "react";
import { useRouter, useSegments } from "expo-router";
import { View, ActivityIndicator } from "react-native";
import { useAuth } from "@/auth/useAuth";

export default function Index() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const segments = useSegments();

  console.log("=== INDEX COMPONENT RENDER ===");
  console.log("Loading:", loading);
  console.log("User:", user?.email || "null");
  console.log("Segments:", segments);

  useEffect(() => {
    console.log("=== INDEX useEffect TRIGGERED ===");
    if (loading) {
      console.log("Still loading auth, waiting...");
      return;
    }

    console.log("Index: Auth Check - User:", user?.email);

    if (user) {
      // User is logged in, go to home
      console.log("Index: USER LOGGED IN - Redirecting to home");
      router.replace("/(drawer)/(tabs)");
      console.log("Index: router.replace() CALLED");
    } else {
      // No user, go to login
      console.log("Index: NO USER - Redirecting to login");
      router.replace("/(auth)/login");
      console.log("Index: router.replace() to login CALLED");
    }
  }, [user, loading]);

  return (
    <View style={{ flex: 1, backgroundColor: '#030921', justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" color="white" />
    </View>
  );
}

