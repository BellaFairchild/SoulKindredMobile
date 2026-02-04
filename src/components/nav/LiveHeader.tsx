import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { useTheme } from '@/context/AppTheme';

export const LiveHeader = () => {
    const { theme } = useTheme();
    const isLight = theme.mode === 'light';
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<DrawerNavigationProp<any>>();

    // Mock Timer
    const [seconds, setSeconds] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setSeconds(s => s + 1);
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    const formatTime = (s: number) => {
        const mins = Math.floor(s / 60);
        const secs = s % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <LinearGradient
                colors={isLight ? ['#F8FAFC', '#F8FAFC'] : ['#8B5CF6', '#7C3AED']} // Vibrant purple gradient for dark mode
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.content}>
                {/* Left: Back */}
                <Pressable onPress={() => navigation.goBack()} style={styles.iconBtn}>
                    <Ionicons name="arrow-back" size={24} color="#FFF" />
                </Pressable>

                {/* Center: Avatar & Status */}
                <View style={styles.centerInfo}>
                    <LinearGradient
                        colors={[theme.accent, theme.primary]}
                        style={styles.avatarRing}
                    >
                        <View style={styles.avatarInner}>
                            <Ionicons name="happy" size={20} color={theme.accent} />
                        </View>
                    </LinearGradient>
                    <View>
                        <Text style={styles.nameText}>Soul Companion</Text>
                        <Text style={styles.statusText}>Online • Active</Text>
                    </View>
                </View>

                {/* Right: Menu */}
                <Pressable onPress={() => navigation.openDrawer()} style={styles.iconBtn}>
                    <Ionicons name="ellipsis-vertical" size={24} color="#FFF" />
                </Pressable>
            </View>

            {/* Live Pill Overlay */}
            <View style={styles.livePillContainer}>
                <BlurView intensity={30} tint="light" style={styles.livePill}>
                    <View style={styles.liveIndicator}>
                        <View style={styles.dot} />
                        <Text style={styles.liveText}>Live Session</Text>
                    </View>
                    <Text style={styles.timerText}>{formatTime(seconds)}</Text>
                </BlurView>
            </View>

            {/* Progress Bar under Pill (Mock) */}
            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { backgroundColor: theme.secondary, width: '40%' }]} />
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingBottom: 20,
        backgroundColor: '#8B5CF6', // Fallback
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
        overflow: 'hidden',
        elevation: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 10,
        zIndex: 100,
    },
    content: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    iconBtn: {
        padding: 8,
    },
    centerInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    avatarRing: {
        width: 42,
        height: 42,
        borderRadius: 21,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarInner: {
        width: 38,
        height: 38,
        borderRadius: 19,
        backgroundColor: '#FFF',
        justifyContent: 'center',
        alignItems: 'center',
    },
    nameText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    statusText: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
    },
    livePillContainer: {
        alignItems: 'center',
        width: '100%',
        marginTop: 8,
    },
    livePill: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '90%',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 24,
        overflow: 'hidden',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.2)',
    },
    liveIndicator: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#22D3EE', // Secondary
    },
    liveText: {
        color: '#22D3EE',
        fontWeight: 'bold',
        fontSize: 14,
    },
    timerText: {
        color: '#FFF',
        fontFamily: 'monospace',
    },
    progressContainer: {
        width: '80%',
        height: 4,
        backgroundColor: 'rgba(255,255,255,0.1)',
        alignSelf: 'center',
        marginTop: -2, // Overlap pill slightly or sit on bottom
        borderRadius: 2,
    },
    progressBar: {
        height: '100%',
        borderRadius: 2,
    }
});
