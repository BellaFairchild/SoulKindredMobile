// src/screens/ChatScreen.jsx

import React, { useState } from "react";
import {
  View,
  FlatList,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "../context/ThemeContext";
import ChatBubble from "../components/ChatBubble";
import { getAIReply } from "../utils/aiService";
import { speakReply } from "../utils/voiceService";

export default function ChatScreen() {
  const { theme } = useTheme();

  const [messages, setMessages] = useState([
    {
      id: "1",
      sender: "ai",
      text: "Hi, I'm Soul Kindred — I’m here for you. How are you feeling today?"
    }
  ]);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  // -------------------------------------------------------------------
  // SEND USER MESSAGE
  // -------------------------------------------------------------------
  const sendMessage = async () => {
    if (!input.trim() || isSending) return;

    const text = input.trim();
    setInput("");

    const userMessage = {
      id: Date.now().toString(),
      sender: "user",
      text
    };

    // Add user message to chat UI
    setMessages((prev) => [...prev, userMessage]);

    // AI reply
    setIsSending(true);
    try {
      const traits = []; // later we connect personality picker
      const replyText = await getAIReply(text, traits);

      const aiMessage = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: replyText
      };

      setMessages((prev) => [...prev, aiMessage]);

      // Speak it out loud
      await speakReply(replyText);

    } catch (err) {
      console.log("AI Error:", err);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString() + "err",
          sender: "ai",
          text: "I’m having trouble responding right now. Could we try again?"
        }
      ]);
    }

    setIsSending(false);
  };

  // -------------------------------------------------------------------
  // UI RENDER
  // -------------------------------------------------------------------
  return (
    <LinearGradient
      colors={theme.chatGradient}
      style={styles.container}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={80}
      >
        {/* CHAT LIST */}
        <FlatList
          data={messages}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          renderItem={({ item }) => (
            <ChatBubble message={item.text} isUser={item.sender === "user"} />
          )}
        />

        {/* INPUT AREA */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={input}
            onChangeText={setInput}
            placeholder="Type your message..."
            placeholderTextColor="#888"
            multiline
          />

          <TouchableOpacity
            style={styles.sendBtn}
            onPress={sendMessage}
            disabled={isSending}
          >
            <Text style={styles.sendText}>
              {isSending ? "..." : "➤"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </LinearGradient>
  );
}

// -------------------------------------------------------------------
// STYLES
// -------------------------------------------------------------------
const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingBottom: 16
  },
  input: {
    flex: 1,
    minHeight: 42,
    maxHeight: 110,
    backgroundColor: "rgba(255,255,255,0.85)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 16,
    color: "#000"
  },
  sendBtn: {
    marginLeft: 10,
    backgroundColor: "#416ECA",
    borderRadius: 22,
    paddingHorizontal: 14,
    paddingVertical: 10
  },
  sendText: {
    color: "#fff",
    fontSize: 18
  }
});
