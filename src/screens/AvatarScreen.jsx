// src/screens/AvatarScreen.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";
import AvatarDisplay from "../components/AvatarDisplay";

export default function AvatarScreen() {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Your Avatar</Text>
      <AvatarDisplay name="Kindred" />
      <Text style={[styles.caption, { color: theme.textSecondary }]}>
        Add scene assets and gradient backdrops later.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 16 },
  title: { fontSize: 22, fontWeight: "700" },
  caption: { fontSize: 14 }
});
