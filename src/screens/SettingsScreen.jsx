// src/screens/SettingsScreen.jsx
import React from "react";
import { View, Text, StyleSheet, Switch } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function SettingsScreen() {
  const { theme, mode, setMode } = useTheme();
  const isDark = mode === "dark";

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
      <View style={[styles.row, { borderColor: theme.border }]}>
        <Text style={{ color: theme.text }}>Dark mode</Text>
        <Switch value={isDark} onValueChange={(val) => setMode(val ? "dark" : "light")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, gap: 12 },
  title: { fontSize: 22, fontWeight: "700" },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1
  }
});
