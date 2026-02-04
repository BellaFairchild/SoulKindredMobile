import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Pressable, Keyboard, Vibration } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withSpring,
    withTiming,
    runOnJS,
    withSequence,
    interpolate,
    Extrapolate
} from 'react-native-reanimated';
import { useTheme } from '@/context/AppTheme';
import { useOverlay } from '@/context/OverlayContext';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import LottieView from 'lottie-react-native';

export default function BurnOverlay() {
    const { theme } = useTheme() as any;
    const { closeOverlay } = useOverlay();
    const isLight = theme.mode === 'light';

    const [worry, setWorry] = useState('');
    const [stage, setStage] = useState<'writing' | 'crumpling' | 'burning' | 'done'>('writing');

    // Animation Values
    const scale = useSharedValue(1);
    const rotate = useSharedValue(0);
    const opacity = useSharedValue(1);
    const burnProgress = useSharedValue(0);

    const handleBurn = () => {
        if (!worry.trim()) return;
        Keyboard.dismiss();
        setStage('crumpling');

        // Crumple Animation: Shrink and Rotate violently
        scale.value = withSequence(
            withSpring(0.8),
            withTiming(0.1, { duration: 600 })
        );
        rotate.value = withTiming(720, { duration: 600 });
        opacity.value = withTiming(0, { duration: 600 }, (finished) => {
            if (finished) {
                runOnJS(startBurning)();
            }
        });
    };

    const startBurning = () => {
        setStage('burning');
        Vibration.vibrate([0, 50, 50, 50]); // Crackle feel
        setTimeout(() => {
            setStage('done');
        }, 3000);
    };

    const paperStyle = useAnimatedStyle(() => {
        return {
            transform: [
                { scale: scale.value },
                { rotate: `${rotate.value}deg` }
            ],
            opacity: opacity.value
        };
    });

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={[styles.title, { color: isLight ? theme.neutralDark : '#FFFFFF', fontFamily: theme.typography.h2 }]}>
                    Release Your Burden
                </Text>
                <Pressable onPress={closeOverlay} style={styles.closeBtn}>
                    <Ionicons name="close" size={24} color={isLight ? theme.neutralDark : '#FFFFFF'} />
                </Pressable>
            </View>

            <View style={styles.content}>
                {stage === 'writing' && (
                    <Animated.View style={[styles.paperArea, paperStyle]}>
                        <View style={[styles.paper, { backgroundColor: isLight ? '#F1F5F9' : '#1E293B' }]}>
                            <TextInput
                                style={[styles.input, { color: isLight ? '#0F172A' : '#FFFFFF', fontFamily: theme.typography.main }]}
                                multiline
                                placeholder="Write down what is troubling you..."
                                placeholderTextColor={isLight ? '#94A3B8' : '#64748B'}
                                value={worry}
                                onChangeText={setWorry}
                                autoFocus
                            />
                        </View>
                        <Text style={[styles.hint, { color: theme.secondary }]}>
                            When you are ready, burn it away.
                        </Text>
                    </Animated.View>
                )}

                {stage === 'burning' && (
                    <View style={styles.fireContainer}>
                        {/* Reusing Fire Lottie */}
                        <LottieView
                            autoPlay
                            loop={false}
                            source={{ uri: 'https://lottie.host/5679d5df-d5b7-4489-9134-802513230536/PlaceholderFire.json' }}
                            style={styles.fireLottie}
                        />
                        <Text style={[styles.burningText, { color: '#F59E0B', fontFamily: theme.typography.h3 }]}>
                            Releasing...
                        </Text>
                    </View>
                )}

                {stage === 'done' && (
                    <View style={styles.doneContainer}>
                        <Ionicons name="sparkles" size={48} color={theme.primary} />
                        <Text style={[styles.doneText, { color: isLight ? theme.neutralDark : '#fff', fontFamily: theme.typography.h2 }]}>
                            Gone.
                        </Text>
                        <Pressable onPress={closeOverlay} style={styles.doneBtn}>
                            <Text style={{ color: theme.primary, fontWeight: 'bold' }}>Close</Text>
                        </Pressable>
                    </View>
                )}
            </View>

            {stage === 'writing' && (
                <Pressable onPress={handleBurn} style={styles.burnBtn}>
                    <LinearGradient
                        colors={['#EF4444', '#B91C1C']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradient}
                    >
                        <Ionicons name="flame" size={24} color="#FFF" />
                        <Text style={[styles.btnText, { fontFamily: theme.typography.button }]}>BURN IT</Text>
                    </LinearGradient>
                </Pressable>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        alignItems: 'center',
        paddingBottom: 20,
    },
    header: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 24,
    },
    title: {
        fontSize: 20,
        fontWeight: '900',
    },
    closeBtn: {
        padding: 8,
    },
    content: {
        width: '100%',
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
    },
    paperArea: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
    },
    paper: {
        width: '100%',
        height: 220,
        borderRadius: 4,
        padding: 20,
        marginBottom: 16,
        // Paper shadow
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    input: {
        fontSize: 18,
        lineHeight: 28,
        textAlignVertical: 'top',
        flex: 1,
    },
    hint: {
        fontSize: 14,
        opacity: 0.8,
    },
    burnBtn: {
        width: '100%',
        height: 56,
        borderRadius: 28,
        marginTop: 20,
        overflow: 'hidden',
        elevation: 5,
        shadowColor: '#EF4444',
        shadowOpacity: 0.4,
        shadowRadius: 10,
    },
    gradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '900',
        letterSpacing: 2,
    },
    fireContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    fireLottie: {
        width: 200,
        height: 200,
    },
    burningText: {
        marginTop: 10,
        fontSize: 18,
        fontWeight: '600',
        letterSpacing: 1,
    },
    doneContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16,
    },
    doneText: {
        fontSize: 24,
        fontWeight: '800',
    },
    doneBtn: {
        padding: 12,
    }
});
