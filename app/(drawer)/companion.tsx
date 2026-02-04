import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/AppTheme';
import { useAppStore } from '@/state/store';

export default function CompanionScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { theme } = useTheme() as any;
    const isLight = theme.mode === 'light';
    const {
        companionName,
        companionAge,
        companionGender,
        companionPersonality,
        selectedVoiceId
    } = useAppStore();

    const SettingCard = ({ icon, title, subtitle, onPress }: any) => (
        <TouchableOpacity onPress={onPress}>
            <BlurView intensity={10} style={styles.card}>
                <View style={styles.cardIcon}>
                    <Ionicons name={icon} size={24} color={theme.primary} />
                </View>
                <View style={styles.cardContent}>
                    <Text style={[styles.cardTitle, { color: theme.text }]}>{title}</Text>
                    <Text style={[styles.cardSubtitle, { color: theme.secondary }]}>{subtitle}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color={theme.secondary} />
            </BlurView>
        </TouchableOpacity>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.appBackground }]}>
            <LinearGradient
                colors={isLight ? [theme.appBackground, '#F1F5F9'] : ['#0f172a', '#020617']}
                style={StyleSheet.absoluteFill}
            />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>Companion Settings</Text>
            </View>

            {/* Companion Preview */}
            <View style={styles.preview}>
                <View style={[styles.avatarCircle, { borderColor: theme.primary }]}>
                    <Ionicons name="sparkles" size={40} color={theme.primary} />
                </View>
                <Text style={[styles.companionName, { color: theme.text }]}>
                    {companionName || 'Your Companion'}
                </Text>
                <Text style={[styles.companionMeta, { color: theme.secondary }]}>
                    {companionAge || 'Age not set'} • {companionGender || 'Gender not set'}
                </Text>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                <SettingCard
                    icon="person-outline"
                    title="Identity"
                    subtitle={`${companionName || 'Not set'} • ${companionGender || 'Not set'}`}
                    onPress={() => router.push('/settings/identity')}
                />
                <SettingCard
                    icon="sparkles-outline"
                    title="Personality"
                    subtitle={companionPersonality || 'Customize behavior & responses'}
                    onPress={() => router.push('/settings/personality')}
                />
                <SettingCard
                    icon="mic-outline"
                    title="Voice"
                    subtitle={selectedVoiceId ? 'Voice selected' : 'Choose a voice'}
                    onPress={() => router.push('/settings/voice')}
                />
                <SettingCard
                    icon="earth"
                    title="Environment & Mood"
                    subtitle="Set the atmosphere"
                    onPress={() => router.push('/settings/environment')}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backBtn: {
        padding: 8,
        marginRight: 10,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: '700',
    },
    preview: {
        alignItems: 'center',
        paddingVertical: 30,
    },
    avatarCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 3,
        backgroundColor: 'rgba(255,255,255,0.05)',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 16,
    },
    companionName: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 4,
    },
    companionMeta: {
        fontSize: 14,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
        gap: 12,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 18,
        borderRadius: 20,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    cardIcon: {
        width: 48,
        height: 48,
        borderRadius: 14,
        backgroundColor: 'rgba(76, 201, 240, 0.1)',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    cardContent: {
        flex: 1,
    },
    cardTitle: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 4,
    },
    cardSubtitle: {
        fontSize: 13,
    },
});
