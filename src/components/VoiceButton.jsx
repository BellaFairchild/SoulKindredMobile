// src/components/VoiceButton.jsx
import React from "react";
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";

export default function VoiceButton({ onPress, isListening }) {
  const { theme } = useTheme();

  return (
    <TouchableOpacity onPress={onPress} style={styles.wrapper} disabled={isListening}>
      <LinearGradient colors={theme.buttonGradient} style={styles.button}>
        {isListening ? (
          <ActivityIndicator color="#0B172A" />
        ) : (
          <Text style={styles.label}>Hold to Speak</Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignSelf: "center"
  },
  button: {
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderRadius: 18,
    minWidth: 140,
    alignItems: "center"
  },
  label: {
    fontWeight: "700",
    color: "#0B172A"
  }
});
