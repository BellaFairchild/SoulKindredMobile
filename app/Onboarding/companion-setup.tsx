import React from "react";
import { View, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/auth/useAuth";
import { saveCompanion } from "@/services/companion";
import OnboardingWizard from "@/components/onboarding/OnboardingWizard";

export default function CompanionSetup() {
  const router = useRouter();
  const { user } = useAuth();

  const handleWizardComplete = async (data: any) => {
    if (!user) return;

    try {
      // Save Companion Data
      await saveCompanion(user.uid, {
        name: "Kindred", // Default name, or prompt for it? 
        // The wizard collected: language, relationship, age, personality, voiceId, avatarId, glbUrl, plan
        // We map 'personality' to 'persona'
        persona: data.personality,
        ...data,
      });

      // Handle Plan Selection (e.g. Navigation to Paywall if Premium)
      // For now, we save the preference and navigate home.
      // If 'premium', a real app would check sub status or trigger purchase.

      router.replace("/(drawer)/(tabs)/");
    } catch (e: any) {
      console.error("Setup Error:", e);
      Alert.alert("Error", "Could not create companion. Please try again.");
      throw e; // Re-throw to let Wizard handle UI state
    }
  };

  return (
    <View style={styles.container}>
      <OnboardingWizard onComplete={handleWizardComplete} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
});
