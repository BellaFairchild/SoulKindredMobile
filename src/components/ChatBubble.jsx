// src/components/ChatBubble.jsx
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useTheme } from "../context/ThemeContext";

function detectMood(text = "") {
  const t = text.toLowerCase();

  if (t.match(/\bhappy\b|\bexcited\b|\bgrateful\b|\bgood\b/)) return "happy";
  if (t.match(/\bcalm\b|\bpeaceful\b|\brelaxed\b|\bokay\b/)) return "calm";
  if (t.match(/\bsad\b|\bdown\b|\blonely\b|\bupset\b/)) return "sad";
  if (t.match(/\banxious\b|\bworried\b|\bnervous\b|\bscared\b/)) return "anxious";
  if (t.match(/\boverwhelmed\b|\bstressed\b|\bburnt out\b|\bexhausted\b/))
    return "overwhelmed";

  return "default";
}

export default function ChatBubble({ message, isUser }) {
  const { theme } = useTheme();

  const moodKey = detectMood(message);
  const mood = theme.moodColors?.[moodKey] || theme.moodColors?.default;

  const bg = isUser ? theme.userBubbleBg : theme.aiBubbleBg;
  const fallbackBorder = isUser ? theme.userBubbleBorder : theme.aiBubbleBorder;
  const textColor = isUser ? theme.userBubbleText : theme.aiBubbleText;

  return (
    <View
      style={[
        styles.bubble,
        isUser ? styles.right : styles.left,
        {
          backgroundColor: bg,
          borderColor: mood?.border || fallbackBorder,
          shadowColor: mood?.shadow || "rgba(0,0,0,0.2)"
        }
      ]}
    >
      <Text style={[styles.text, { color: textColor }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: "82%",
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    marginVertical: 6,
    borderWidth: 1,
    shadowOpacity: 0.6,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3
  },
  left: {
    alignSelf: "flex-start",
    borderTopLeftRadius: 6
  },
  right: {
    alignSelf: "flex-end",
    borderTopRightRadius: 6
  },
  text: {
    fontSize: 16,
    lineHeight: 21
  }
});
