import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { useTheme } from '@/context/AppTheme';

type Props = {
  message: string;
  isUser?: boolean;
  avatar?: string;
};

export default function ChatBubble({ message, isUser = false, avatar }: Props) {
  const { theme } = useTheme() as any;
  const isLight = theme.mode === "light";

  const alignment = isUser ? "flex-end" : "flex-start";

  // Specific colors and styles from mockup
  const userBg = theme.mode === 'light' ? "#5EDDFF" : theme.primary;
  const aiBg = "#9F56FF"; // Mockup purple

  const textColor = isUser ? "#0F172A" : "#FFFFFF";

  return (
    <View style={[styles.row, { justifyContent: alignment, paddingLeft: !isUser && avatar ? 0 : 12 }]}>
      {!isUser && avatar && (
        <View style={styles.avatarContainer}>
          <Image source={{ uri: avatar }} style={styles.avatar} />
        </View>
      )}

      <View style={[
        styles.bubble,
        {
          backgroundColor: isUser ? userBg : aiBg,
          marginLeft: !isUser && avatar ? 10 : 0
        }
      ]}>
        <Text style={[
          styles.text,
          {
            color: textColor,
            fontFamily: isUser ? theme.typography.main : undefined,
            fontSize: 18,
            lineHeight: 26
          }
        ]}>
          {message}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    width: "100%",
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  avatarContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  avatar: {
    width: '100%',
    height: '100%',
  },
  bubble: {
    maxWidth: "80%",
    borderRadius: 20,
    paddingHorizontal: 18,
    paddingVertical: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  text: {
    fontWeight: '500',
  },
});
