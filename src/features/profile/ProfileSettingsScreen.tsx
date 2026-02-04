import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from 'react-native/Libraries/NewAppScreen'; // Fallback or strict theme usage if available

// Strict Props Interface
export interface ProfileSettingsScreenProps {
    section: 'account' | 'notifications' | 'privacy' | 'general';
}

const SECTION_TITLES: Record<ProfileSettingsScreenProps['section'], string> = {
    account: 'Account Details',
    notifications: 'Notification Preferences',
    privacy: 'Privacy and Security',
    general: 'General Settings',
};

export function ProfileSettingsScreen({ section }: ProfileSettingsScreenProps) {
    const router = useRouter();

    const title = useMemo(() => {
        return SECTION_TITLES[section] || 'Settings';
    }, [section]);

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{title}</Text>

            <ScrollView contentContainerStyle={styles.content}>
                <View style={styles.card}>
                    <Text style={styles.cardText}>Configuring: {section}</Text>
                    {/* Placeholder for actual settings implementation */}
                </View>

                <Pressable
                    style={styles.backButton}
                    onPress={() => router.back()}
                    accessibilityRole="button"
                    accessibilityLabel="Go back"
                >
                    <Text style={styles.backButtonText}>Go Back</Text>
                </Pressable>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#030921', // Dark theme background
        padding: 16,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#E0FFFF',
        marginBottom: 20,
        marginTop: 40,
    },
    content: {
        gap: 16,
    },
    card: {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: 12,
        padding: 20,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.2)',
    },
    cardText: {
        color: '#fff',
        fontSize: 16,
    },
    backButton: {
        marginTop: 20,
        padding: 12,
        backgroundColor: '#333',
        borderRadius: 8,
        alignItems: 'center',
    },
    backButtonText: {
        color: '#fff',
        fontWeight: '600',
    }
});
