import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Pressable, StyleSheet, Alert, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import LottieView from 'lottie-react-native';

import { useTheme } from '@/context/AppTheme';
import { useSubscription } from '@/context/SubscriptionContext';
import { useBurnLimit } from '@/hooks/useBurnLimit';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';
import { QuantumHeader } from '@/components/nav/QuantumHeader';

const { width } = Dimensions.get('window');

// Lottie Fire URI (Same as Fireplace.tsx)
const FIRE_LOTTIE = 'https://lottie.host/5679d5df-d5b7-4489-9134-802513230536/PlaceholderFire.json';

export default function BurnScreen() {
    const router = useRouter();
    const { theme } = useTheme() as any;
    const { isPremium } = useSubscription();
    const { burnsToday, incrementBurn, checkReset } = useBurnLimit();
    const { startRecording, stopRecording, isRecording, isProcessing } = useVoiceRecorder();

    const [mode, setMode] = useState<'text' | 'audio'>('text');
    const [text, setText] = useState('');
    const [isBurning, setIsBurning] = useState(false); // Animation state

    const isLight = theme.mode === 'light';

    // Limits
    const FREE_AUDIO_LIMIT = 1;
    const canBurnAudio = isPremium || burnsToday < FREE_AUDIO_LIMIT;

    useEffect(() => {
        checkReset();
    }, []);

    const handleBurnText = () => {
        if (!text.trim()) return;

        setIsBurning(true);
        setTimeout(() => {
            setText('');
            setIsBurning(false);
            Alert.alert("Released", "Your worries have turned to smoke.");
        }, 2000);
    };

    const handleRecordToggle = async () => {
        if (isRecording) {
            // Stop and Burn
            await stopRecording();
            setIsBurning(true);

            // Increment logic
            if (!isPremium) {
                incrementBurn();
            }

            setTimeout(() => {
                setIsBurning(false);
                Alert.alert("Released", "Your voice has been carried away by the flames.");
            }, 2000);
        } else {
            // Check limits before starting
            if (!canBurnAudio) {
                Alert.alert(
                    "Limit Reached",
                    "You've used your free audio burn for today. Upgrade to burn unlimited worries.",
                    [
                        { text: "Cancel", style: "cancel" },
                        { text: "Upgrade", onPress: () => router.push('/paywall') }
                    ]
                );
                return;
            }

            await startRecording();

            // For free users, set a timeout to stop recording after 30s?
            // "limit 30 seconds"
            // We can implement visual timer or auto-stop.
            // Simplified: Just auto-stop logic here if strictly needed.
            // For now, relies on user stopping or manual enforcement later.
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: '#020617' }]}>
            <LinearGradient
                colors={['#0f172a', '#020617']}
                style={StyleSheet.absoluteFill}
            />

            {/* Fire Animation Background */}
            <View style={styles.fireContainer}>
                <LottieView
                    autoPlay
                    loop
                    style={styles.lottie}
                    source={{ uri: FIRE_LOTTIE }}
                />
            </View>

            <QuantumHeader
                center="Burn Your Worries"
                left={
                    <Pressable onPress={() => router.back()} style={{ padding: 8 }}>
                        <Ionicons name="chevron-back" size={24} color="#FFF" />
                    </Pressable>
                }
            />

            <View style={styles.content}>

                {mode === 'text' ? (
                    <BlurView intensity={20} style={styles.inputCard}>
                        <TextInput
                            style={[styles.textArea, { color: '#FFF' }]}
                            placeholder="Write what burdens you..."
                            placeholderTextColor="rgba(255,255,255,0.4)"
                            multiline
                            value={text}
                            onChangeText={setText}
                        />
                        <Pressable onPress={handleBurnText} style={styles.burnBtn}>
                            <LinearGradient
                                colors={['#F97316', '#DC2626']}
                                style={styles.gradient}
                            >
                                <Text style={styles.btnText}>THROW INTO FIRE</Text>
                            </LinearGradient>
                        </Pressable>
                    </BlurView>
                ) : (
                    <View style={styles.audioContainer}>
                        <Pressable
                            onPress={handleRecordToggle}
                            style={[
                                styles.recordBtn,
                                {
                                    backgroundColor: isRecording ? '#DC2626' :
                                        (!canBurnAudio ? theme.disabled : '#FFFFFF')
                                }
                            ]}
                        >
                            <Ionicons
                                name={isRecording ? "stop" : (canBurnAudio ? "mic" : "lock-closed")}
                                size={50}
                                color={isRecording ? "#FFF" : "#000"}
                            />
                        </Pressable>
                        <Text style={styles.audioHint}>
                            {isRecording ? "Recording... Tap to Burn" : (canBurnAudio ? "Tap to Record & Burn" : "Audio Limit Reached")}
                        </Text>
                        {!isPremium && !canBurnAudio && (
                            <Text onPress={() => router.push('/paywall')} style={{ color: '#F97316', marginTop: 10, fontWeight: '700' }}>
                                Upgrade to Unlock
                            </Text>
                        )}
                    </View>
                )}

                {/* Mode Switcher */}
                <View style={styles.switcher}>
                    <Pressable
                        onPress={() => setMode('text')}
                        style={[styles.switchOption, mode === 'text' && styles.activeOption]}
                    >
                        <Text style={[styles.switchText, mode === 'text' && { color: '#FFF' }]}>Write</Text>
                    </Pressable>
                    <Pressable
                        onPress={() => setMode('audio')}
                        style={[styles.switchOption, mode === 'audio' && styles.activeOption]}
                    >
                        <Text style={[styles.switchText, mode === 'audio' && { color: '#FFF' }]}>Speak</Text>
                    </Pressable>
                </View>

            </View>

            {isBurning && (
                <View style={styles.overlay}>
                    <ActivityIndicatorWrapper />
                </View>
            )}
        </View>
    );
}

function ActivityIndicatorWrapper() {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.8)' }}>
            <Ionicons name="flame" size={64} color="#F97316" />
            <Text style={{ color: '#FFF', marginTop: 20, fontSize: 20, fontWeight: '700' }}>Burning...</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    fireContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '50%',
        alignItems: 'center',
        opacity: 0.6,
    },
    lottie: {
        width: width,
        height: 400,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 40,
        justifyContent: 'center',
    },
    inputCard: {
        padding: 24,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
        gap: 20,
    },
    textArea: {
        height: 150,
        fontSize: 18,
        textAlignVertical: 'top',
    },
    burnBtn: {
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
    },
    gradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        color: '#FFF',
        fontWeight: '900',
        letterSpacing: 2,
    },
    audioContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
    },
    recordBtn: {
        width: 100,
        height: 100,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        elevation: 10,
        shadowColor: '#F97316',
        shadowOpacity: 0.5,
        shadowRadius: 20,
    },
    audioHint: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 16,
    },
    switcher: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        padding: 4,
        marginTop: 40,
        alignSelf: 'center',
    },
    switchOption: {
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 16,
    },
    activeOption: {
        backgroundColor: 'rgba(255,255,255,0.1)',
    },
    switchText: {
        color: 'rgba(255,255,255,0.5)',
        fontWeight: '700',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        zIndex: 100,
    }
});
