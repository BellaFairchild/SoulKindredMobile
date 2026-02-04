import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useOverlay } from '@/context/OverlayContext';
import { useAppStore } from '@/state/store';
// import ConfettiCannon from 'react-native-confetti-cannon';

const { width, height } = Dimensions.get('window');

export default function LevelUpOverlay() {
    const { hideOverlay } = useOverlay();
    const insets = useSafeAreaInsets();
    const level = useAppStore(state => state.level) || 1;
    const resonance = useAppStore(state => state.resonance) || 0;

    // Animations
    const scaleAnim = useRef(new Animated.Value(0.5)).current;
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const badgeRotate = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.spring(scaleAnim, {
                toValue: 1,
                friction: 6,
                tension: 40,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 500,
                useNativeDriver: true,
            }),
            Animated.loop(
                Animated.timing(badgeRotate, {
                    toValue: 1,
                    duration: 10000,
                    useNativeDriver: true,
                })
            )
        ]).start();
    }, []);

    const rotateInterp = badgeRotate.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '360deg']
    });

    return (
        <View style={styles.container}>
            <BlurView intensity={90} tint="dark" style={StyleSheet.absoluteFill} />

            {/* <ConfettiCannon
                count={200}
                origin={{ x: width / 2, y: -10 }}
                fadeOut={true}
            /> */}

            <Animated.View style={[styles.content, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>

                {/* Glowing Badge */}
                <View style={styles.badgeContainer}>
                    <Animated.View style={[styles.badgeGlow, { transform: [{ rotate: rotateInterp }] }]} />
                    <View style={styles.badge}>
                        <Ionicons name="star" size={64} color="#FACC15" />
                        <Text style={styles.levelNum}>{level}</Text>
                    </View>
                </View>

                <Text style={styles.title}>LEVEL UP!</Text>
                <Text style={styles.subtitle}>Your resonance has expanded.</Text>

                <View style={styles.statsCard}>
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Total Resonance</Text>
                        <Text style={styles.statValue}>{resonance}</Text>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.statRow}>
                        <Text style={styles.statLabel}>Next Reward</Text>
                        <Text style={styles.statValue}>New Scenery</Text>
                    </View>
                </View>

                <TouchableOpacity style={styles.button} onPress={hideOverlay}>
                    <Text style={styles.buttonText}>Continue Journey</Text>
                </TouchableOpacity>

            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    content: {
        width: width * 0.85,
        alignItems: 'center',
        padding: 24,
    },
    badgeContainer: {
        width: 140,
        height: 140,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 32,
    },
    badgeGlow: {
        position: 'absolute',
        width: 140,
        height: 140,
        borderRadius: 70,
        borderWidth: 2,
        borderColor: '#FACC15',
        borderStyle: 'dashed',
    },
    badge: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: 'rgba(250, 204, 21, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 4,
        borderColor: '#FACC15',
    },
    levelNum: {
        position: 'absolute',
        fontSize: 24,
        fontWeight: '900',
        color: '#FFF',
        top: 38,
    },
    title: {
        fontSize: 36,
        fontWeight: '900',
        color: '#FFF',
        letterSpacing: 2,
        marginBottom: 8,
        textShadowColor: 'rgba(250, 204, 21, 0.5)',
        textShadowOffset: { width: 0, height: 0 },
        textShadowRadius: 20,
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.7)',
        marginBottom: 32,
    },
    statsCard: {
        width: '100%',
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 16,
        padding: 16,
        marginBottom: 32,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
    },
    statLabel: {
        color: 'rgba(255,255,255,0.6)',
        fontSize: 14,
    },
    statValue: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
    divider: {
        height: 1,
        backgroundColor: 'rgba(255,255,255,0.1)',
        marginVertical: 8,
    },
    button: {
        backgroundColor: '#FACC15',
        paddingVertical: 16,
        paddingHorizontal: 40,
        borderRadius: 30,
        shadowColor: "#FACC15",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 10,
    },
    buttonText: {
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
        letterSpacing: 1,
    }
});
