// src/components/PersonalityPicker.jsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { PERSONALITY_TRAITS } from "../utils/constants";
import { useTheme } from "../context/ThemeContext";

export default function PersonalityPicker({ selected = [], onToggle }) {
  const { theme } = useTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.label, { color: theme.textSecondary }]}>Personality</Text>
      <View style={styles.row}>
        {PERSONALITY_TRAITS.map((trait) => {
          const active = selected.includes(trait);
          return (
            <TouchableOpacity
              key={trait}
              style={[
                styles.chip,
                {
                  backgroundColor: active ? theme.userBubbleBg : theme.surfaceMuted,
                  borderColor: active ? theme.userBubbleBorder : theme.surfaceMuted
                }
              ]}
              onPress={() => onToggle?.(trait)}
            >
              <Text style={{ color: active ? theme.text : theme.textSecondary }}>{trait}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12
  },
  label: {
    fontSize: 14,
    marginBottom: 6
  },
  row: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 14,
    borderWidth: 1
  }
});
