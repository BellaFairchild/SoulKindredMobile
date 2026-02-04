import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useTheme } from '@/context/AppTheme';
import { useSubscription } from '@/context/SubscriptionContext';
import { useSoulKindred, EnvironmentKey } from '@/state/useSoulKindred';
import { QuantumHeader } from '@/components/nav/QuantumHeader';

const ENVIRONMENTS: { id: EnvironmentKey; name: string; icon: string; image: string; locked: boolean }[] = [
    { id: 'cabin', name: 'Log Cabin', icon: 'home', image: 'https://images.unsplash.com/photo-1449156493391-d2cfa28e468b?w=400', locked: false },
    { id: 'beach', name: 'Beach Bonfire', icon: 'bonfire', image: 'https://images.unsplash.com/photo-1548261353-9a008c352a8e?w=400', locked: true },
    { id: 'patio', name: 'Backyard Patio', icon: 'leaf', image: 'https://images.unsplash.com/photo-1596241913256-b5d144579c36?w=400', locked: true },
    { id: 'camping', name: 'Deep Forest', icon: 'map', image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=400', locked: true },
];

export default function EnvironmentScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    const { theme } = useTheme() as any;
    const { isPremium } = useSubscription();
    const { environment, setEnvironment, theme: appTheme, setTheme: setAppTheme } = useSoulKindred();
    const isLight = theme.mode === 'light';

    const handleSelectEnv = (env: typeof ENVIRONMENTS[0]) => {
        if (env.locked && !isPremium) {
            router.push('/paywall');
        } else {
            setEnvironment(env.id);
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.appBackground }]}>
            <LinearGradient colors={[theme.appBackground, isLight ? '#f0f9ff' : '#020617']} style={StyleSheet.absoluteFill} />

            <QuantumHeader
                center="World Settings"
                left={
                    <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
                        <Ionicons name="chevron-back" size={24} color={isLight ? theme.neutralDark : "#FFF"} />
                    </Pressable>
                }
            />

            <ScrollView contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 40 }]}>

                {/* Time of Day */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.secondary }]}>TIME OF DAY</Text>
                    <View style={styles.row}>
                        <Pressable
                            onPress={() => setAppTheme('day')}
                            style={[styles.toggleBtn, appTheme === 'day' && { backgroundColor: '#FDB813', borderColor: '#FDB813' }]}
                        >
                            <Ionicons name="sunny" size={24} color={appTheme === 'day' ? '#FFF' : theme.text} />
                            <Text style={[styles.toggleText, { color: appTheme === 'day' ? '#FFF' : theme.text }]}>Day</Text>
                        </Pressable>
                        <Pressable
                            onPress={() => setAppTheme('night')}
                            style={[styles.toggleBtn, appTheme === 'night' && { backgroundColor: '#6366F1', borderColor: '#6366F1' }]}
                        >
                            <Ionicons name="moon" size={24} color={appTheme === 'night' ? '#FFF' : theme.text} />
                            <Text style={[styles.toggleText, { color: appTheme === 'night' ? '#FFF' : theme.text }]}>Night</Text>
                        </Pressable>
                    </View>
                </View>

                {/* Environment Selection */}
                <View style={styles.section}>
                    <Text style={[styles.sectionTitle, { color: theme.secondary }]}>ENVIRONMENT</Text>
                    <View style={styles.grid}>
                        {ENVIRONMENTS.map((env) => {
                            const isActive = environment === env.id;
                            const isLockedState = env.locked && !isPremium;

                            return (
                                <Pressable
                                    key={env.id}
                                    onPress={() => handleSelectEnv(env)}
                                    style={[
                                        styles.card,
                                        isActive && { borderColor: theme.primary, borderWidth: 2 },
                                        { backgroundColor: isLight ? '#FFF' : 'rgba(255,255,255,0.05)' }
                                    ]}
                                >
                                    <Image source={{ uri: env.image }} style={styles.cardInfo} />
                                    <View style={styles.overlay} />

                                    <View style={styles.cardContent}>
                                        <Ionicons name={env.icon as any} size={24} color="#FFF" />
                                        <Text style={styles.cardTitle}>{env.name}</Text>
                                    </View>

                                    {isActive && (
                                        <View style={styles.activeBadge}>
                                            <Ionicons name="checkmark-circle" size={20} color={theme.primary} />
                                        </View>
                                    )}

                                    {isLockedState && (
                                        <View style={styles.lockOverlay}>
                                            <BlurView intensity={20} style={StyleSheet.absoluteFill} />
                                            <Ionicons name="lock-closed" size={32} color="#FFF" />
                                        </View>
                                    )}
                                </Pressable>
                            )
                        })}
                    </View>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    content: { padding: 20 },
    section: { marginBottom: 32 },
    sectionTitle: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 1.2,
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        gap: 12,
    },
    toggleBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        backgroundColor: 'rgba(255,255,255,0.02)',
        gap: 8,
    },
    toggleText: {
        fontWeight: '600',
    },
    grid: {
        gap: 16,
    },
    card: {
        height: 120,
        borderRadius: 20,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: 'transparent',
    },
    cardInfo: {
        width: '100%',
        height: '100%',
        position: 'absolute',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
    },
    cardContent: {
        flex: 1,
        justifyContent: 'flex-end',
        padding: 16,
    },
    cardTitle: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: '700',
        marginTop: 4,
    },
    activeBadge: {
        position: 'absolute',
        top: 12,
        right: 12,
        backgroundColor: '#FFF',
        borderRadius: 12,
    },
    lockOverlay: {
        ...StyleSheet.absoluteFillObject,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.3)',
    },
});
