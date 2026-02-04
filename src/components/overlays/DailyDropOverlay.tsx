import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable, Image, Modal, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { ZoomIn, SlideInDown } from 'react-native-reanimated';

import { useTheme } from '@/context/AppTheme';
import { useOverlay } from '@/context/OverlayContext';
import { useAppStore, VaultItem } from '@/state/store';
import { GlowCard } from '@/components/tools/GlowCard';

import { useRouter } from 'expo-router';
import { useSubscription } from '@/context/SubscriptionContext';

const { width } = Dimensions.get('window');


type DailyDropOverlayProps = {
    visible: boolean;
    item: VaultItem | null;
    onClose: () => void;
};

export default function DailyDropOverlay({ visible, item, onClose }: DailyDropOverlayProps) {
    const { theme } = useTheme() as any;
    // const { closeOverlay } = useOverlay(); // Removed unused context
    const router = useRouter();
    const { isPremium } = useSubscription();
    const isLight = theme.mode === 'light';

    // Removed internal state logic since props are passed
    // const claimDailyDrop = useAppStore(state => state.claimDailyDrop);
    // const [item, setItem] = useState<VaultItem | null>(null);

    // useEffect(() => { ... }, []);

    if (!visible || !item) return null;


    if (!item) return null; // Or loading state

    const handleClaim = () => {
        onClose();
        if (!isPremium) {
            // Optional: Upsell flow
            // router.push('/paywall');
        } else {
            // Already saved in store by claimDailyDrop
        }
    };

    return (
        <View style={styles.container}>
            {/* Confetti or Glow Effect Background */}
            <LinearGradient
                colors={[theme.primary + 'CC', 'transparent']} // Hex+Alpha
                style={StyleSheet.absoluteFill}
                start={{ x: 0.5, y: 0 }}
                end={{ x: 0.5, y: 1 }}
            />

            <Animated.View entering={ZoomIn.duration(600).springify()} style={styles.content}>
                <View style={styles.header}>
                    <Ionicons name="sparkles" size={40} color="#FFD700" />
                    <Text style={styles.title}>Daily Drop Unlocked!</Text>
                    <Text style={styles.subtitle}>You found a new memory.</Text>
                </View>

                <Animated.View entering={SlideInDown.delay(300).springify()} style={styles.cardWrapper}>
                    <GlowCard isLight={isLight} gradientColors={['#F59E0B', '#FCD34D']}>
                        <View style={styles.cardInner}>
                            <Image source={{ uri: item.mediaUrl }} style={styles.image} />
                            <Text style={[styles.itemTitle, { color: isLight ? theme.neutralDark : '#fff', fontFamily: theme.typography?.h2 }]}>
                                {item.title}
                            </Text>
                            <View style={styles.tagContainer}>
                                <Ionicons name="pricetag" size={14} color={theme.accent} />
                                <Text style={[styles.tagText, { color: theme.accent }]}>{item.tags?.[0]}</Text>
                            </View>
                        </View>
                    </GlowCard>
                </Animated.View>

                <Pressable onPress={handleClaim} style={styles.claimButton}>
                    <LinearGradient
                        colors={!isPremium ? ['#475569', '#1e293b'] : [theme.accent, theme.primary]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.claimGradient}
                    >
                        {!isPremium && <Ionicons name="lock-closed" size={20} color="#94a3b8" style={{ marginRight: 8 }} />}
                        <Text style={[styles.claimText, { fontFamily: theme.typography?.button, color: !isPremium ? '#94a3b8' : '#fff' }]}>
                            {isPremium ? "KEEP IN VAULT" : "UNLOCK TO SAVE"}
                        </Text>
                    </LinearGradient>
                </Pressable>

                <Text style={styles.xpText}>+50 Resonance Earned</Text>

            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        paddingVertical: 20,
    },
    content: {
        width: '100%',
        alignItems: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        color: '#fff',
        fontSize: 24,
        fontWeight: '900',
        marginTop: 12,
        textAlign: 'center',
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowOffset: { width: 0, height: 2 },
        textShadowRadius: 10,
    },
    subtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
        marginTop: 4,
    },
    cardWrapper: {
        width: '100%',
        marginBottom: 32,
        transform: [{ rotate: '-2deg' }],
    },
    cardInner: {
        alignItems: 'center',
        gap: 12,
    },
    image: {
        width: '100%',
        height: 180,
        borderRadius: 16,
        marginBottom: 8,
    },
    itemTitle: {
        fontSize: 20,
        fontWeight: '800',
    },
    tagContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
    },
    tagText: {
        fontSize: 12,
        fontWeight: '700',
    },
    claimButton: {
        width: '100%',
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#F59E0B', // Gold shadow
        shadowOpacity: 0.4,
        shadowRadius: 12,
        marginBottom: 16,
    },
    claimGradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    claimText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
        letterSpacing: 1,
    },
    xpText: {
        color: '#FCD34D',
        fontSize: 14,
        fontWeight: '700',
    }
});
