// src/screens/SplashScreen.jsx
import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";

export default function SplashScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => navigation.replace("Login"), 1200);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <LinearGradient colors={theme.chatGradient} style={styles.container}>
      <Text style={[styles.title, { color: theme.text }]}>Soul Kindred</Text>
      <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
        Building your space...
      </Text>
      <ActivityIndicator style={{ marginTop: 20 }} color={theme.accent} />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  title: {
    fontSize: 28,
    fontWeight: "700"
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16
  }
});
