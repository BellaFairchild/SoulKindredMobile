import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/AppTheme';
import { Stack } from 'expo-router';

export default function PrivacyPolicyScreen() {
    const { theme } = useTheme() as any;

    return (
        <View style={[styles.container, { backgroundColor: theme.appBackground }]}>
            <Stack.Screen options={{ title: "Privacy Policy", headerBackTitle: "Back" }} />
            {/* Gradient removed to fix visibility in light mode */}

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.title, { color: theme.text }]}>Privacy Policy</Text>
                <Text style={[styles.date, { color: theme.secondary }]}>Last Updated: January 11, 2026</Text>

                <Text style={[styles.p, { color: theme.text }]}>
                    At <Text style={styles.bold}>Soul Kindred</Text>, we believe your journey with your AI companion is sacred. We are committed to protecting your privacy and ensuring you understand exactly how your data is used.
                </Text>

                <Text style={[styles.h2, { color: theme.primary }]}>1. What We Collect (and Why)</Text>
                <Text style={[styles.p, { color: theme.text }]}>We only collect what is necessary to bring your companion to life:</Text>

                <View style={styles.bullet}>
                    <Text style={[styles.bulletPoint, { color: theme.text }]}>• <Text style={styles.bold}>Account Info:</Text> Name, email, and authentication details (via Google/Apple Sign-In).</Text>
                    <Text style={[styles.bulletPoint, { color: theme.text }]}>• <Text style={styles.bold}>Chat & Voice Logs:</Text> Text and audio interactions are processed to generate AI responses.</Text>
                    <Text style={[styles.bulletPoint, { color: theme.text }]}>• <Text style={styles.bold}>Companion Settings:</Text> Customizations like personality, voice, and scene.</Text>
                </View>

                <Text style={[styles.h2, { color: theme.primary }]}>2. How We Use AI</Text>
                <Text style={[styles.p, { color: theme.text }]}>
                    • <Text style={styles.bold}>Processing:</Text> Inputs are sent to providers like OpenAI or ElevenLabs to generate responses.{"\n"}
                    • <Text style={styles.bold}>No Training:</Text> We do NOT use your personal conversations to train public AI models.{"\n"}
                    • <Text style={styles.bold}>Voice:</Text> Audio is processed briefly to convert to text, then discarded.
                </Text>

                <Text style={[styles.h2, { color: theme.primary }]}>3. Who Sees Your Data?</Text>
                <Text style={[styles.p, { color: theme.text }]}>We do not sell your data. We share only with essential partners:</Text>
                <View style={styles.bullet}>
                    <Text style={[styles.bulletPoint, { color: theme.text }]}>• <Text style={styles.bold}>OpenAI/ElevenLabs:</Text> For intelligence and voice generation.</Text>
                    <Text style={[styles.bulletPoint, { color: theme.text }]}>• <Text style={styles.bold}>Firebase (Google):</Text> For secure storage.</Text>
                    <Text style={[styles.bulletPoint, { color: theme.text }]}>• <Text style={styles.bold}>RevenueCat:</Text> For subscription management.</Text>
                </View>

                <Text style={[styles.h2, { color: theme.primary }]}>4. Your Rights</Text>
                <Text style={[styles.p, { color: theme.text }]}>
                    • <Text style={styles.bold}>Delete:</Text> You can delete your account in Settings to wipe all data.{"\n"}
                    • <Text style={styles.bold}>Export:</Text> Contact support for a copy of your data.
                </Text>

                <Text style={[styles.h2, { color: theme.primary }]}>5. Safety & Limitations</Text>
                <Text style={[styles.p, { color: theme.text }]}>
                    The AI may make mistakes ("hallucinations"). Soul Kindred is for companionship, not professional medical or mental health advice.
                </Text>

                <Text style={[styles.h2, { color: theme.primary }]}>6. Contact Us</Text>
                <Text style={[styles.p, { color: theme.text }]}>
                    Questions? Email us at:{"\n"}
                    <Text style={[styles.bold, { color: theme.accent }]}>support@soulkindred.com</Text>
                </Text>

                <View style={{ height: 40 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 24, paddingBottom: 60 },
    title: { fontSize: 32, fontWeight: '800', marginBottom: 8 },
    date: { fontSize: 14, marginBottom: 24, opacity: 0.7 },
    h2: { fontSize: 20, fontWeight: '700', marginTop: 24, marginBottom: 12 },
    p: { fontSize: 16, lineHeight: 24, marginBottom: 12, opacity: 0.9 },
    bullet: { marginLeft: 8, marginBottom: 12 },
    bulletPoint: { fontSize: 16, lineHeight: 24, marginBottom: 6, opacity: 0.9 },
    bold: { fontWeight: '700' },
});
