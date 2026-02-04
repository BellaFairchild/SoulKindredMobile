// src/screens/LoginScreen.jsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../context/ThemeContext";
import { emailSignIn } from "../utils/authService";

export default function LoginScreen() {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onLogin = async () => {
    setError("");
    try {
      await emailSignIn(email, password);
      navigation.replace("Main");
    } catch (err) {
      setError(err?.message || "Unable to sign in");
    }
  };

  return (
    <LinearGradient colors={theme.chatGradient} style={styles.container}>
      <View style={[styles.card, { backgroundColor: theme.surface }]}>
        <Text style={[styles.title, { color: theme.text }]}>Welcome back</Text>
        <TextInput
          placeholder="Email"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={theme.textSecondary}
          style={[styles.input, { color: theme.text, borderColor: theme.border }]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <TouchableOpacity style={[styles.btn, { backgroundColor: theme.accent }]} onPress={onLogin}>
          <Text style={styles.btnText}>Continue</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("PlanPicker")}>
          <Text style={[styles.link, { color: theme.textSecondary }]}>
            New here? Explore plans
          </Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24 },
  card: {
    borderRadius: 20,
    padding: 18,
    gap: 12
  },
  title: {
    fontSize: 22,
    fontWeight: "700"
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 12
  },
  btn: {
    padding: 14,
    borderRadius: 14,
    alignItems: "center"
  },
  btnText: {
    fontWeight: "700",
    color: "#0B172A"
  },
  link: {
    textAlign: "center",
    marginTop: 4
  },
  error: {
    color: "#FF5C9E",
    fontSize: 13
  }
});
