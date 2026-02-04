// src/components/AvatarDisplay.jsx
import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useTheme } from "../context/ThemeContext";

export default function AvatarDisplay({ name = "Kindred", uri }) {
  const { theme } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.surface }]}>
      {uri ? (
        <Image source={{ uri }} style={styles.avatar} />
      ) : (
        <View style={[styles.placeholder, { borderColor: theme.border }]}>
          <Text style={{ color: theme.textSecondary }}>{name[0] || "K"}</Text>
        </View>
      )}
      <View style={styles.meta}>
        <Text style={[styles.name, { color: theme.text }]}>{name}</Text>
        <Text style={{ color: theme.textSecondary }}>Digital companion</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 16
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 16
  },
  placeholder: {
    width: 64,
    height: 64,
    borderRadius: 16,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  meta: {
    marginLeft: 12
  },
  name: {
    fontWeight: "700",
    fontSize: 18
  }
});
