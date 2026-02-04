import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/context/AppTheme';
import { Stack } from 'expo-router';

export default function TermsOfServiceScreen() {
    const { theme } = useTheme() as any;

    return (
        <View style={[styles.container, { backgroundColor: theme.appBackground }]}>
            <Stack.Screen options={{ title: "Terms of Service", headerBackTitle: "Back" }} />
            {/* Gradient removed to fix visibility in light mode */}

            <ScrollView contentContainerStyle={styles.content}>
                <Text style={[styles.title, { color: theme.text }]}>Terms of Service</Text>
                <Text style={[styles.date, { color: theme.secondary }]}>Last Updated: January 11, 2026</Text>

                <Text style={[styles.p, { color: theme.text }]}>
                    Welcome to <Text style={styles.bold}>Soul Kindred</Text>. By using our app, you agree to these terms.
                </Text>

                <Text style={[styles.h2, { color: theme.primary }]}>1. Basics</Text>
                <View style={styles.bullet}>
                    <Text style={[styles.bulletPoint, { color: theme.text }]}>• <Text style={styles.bold}>Age:</Text> You must be at least 17 years old.</Text>
                    <Text style={[styles.bulletPoint, { color: theme.text }]}>• <Text style={styles.bold}>Use:</Text> Personal, non-commercial use only.</Text>
                </View>

                <Text style={[styles.h2, { color: theme.primary }]}>2. AI Companion Usage</Text>
                <Text style={[styles.p, { color: theme.text }]}>
                    • <Text style={styles.bold}>Generated Content:</Text> Conversations are generated on-the-fly. The AI is a fictional character, not a person.{"\n"}
                    • <Text style={styles.bold}>No Harassment:</Text> Do not use the app to generate hate speech, abuse, or illegal content.{"\n"}
                    • <Text style={styles.bold}>Reporting:</Text> Please report any offensive content using the reporting tools.
                </Text>

                <Text style={[styles.h2, { color: theme.primary }]}>3. Subscriptions</Text>
                <Text style={[styles.p, { color: theme.text }]}>
                    • <Text style={styles.bold}>Billing:</Text> Managed by Apple App Store / Google Play.{"\n"}
                    • <Text style={styles.bold}>Cancellation:</Text> Must be done via your device Settings at least 24h before renewal.
                </Text>

                <Text style={[styles.h2, { color: theme.primary }]}>4. Prohibited Content (EULA)</Text>
                <Text style={[styles.p, { color: theme.text }]}>
                    Zero tolerance for defamatory, discriminatory, or pornographic content. Abuse may result in a ban.
                </Text>

                <Text style={[styles.h2, { color: theme.primary }]}>5. Medical Disclaimer</Text>
                <Text style={[styles.p, { color: theme.text }]}>
                    Soul Kindred is <Text style={styles.bold}>NOT</Text> a medical device or therapist. If you are in crisis, please contact emergency services immediately.
                </Text>

                <Text style={[styles.h2, { color: theme.primary }]}>6. Contact</Text>
                <Text style={[styles.p, { color: theme.text }]}>
                    Questions? Contact human support at:{"\n"}
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
