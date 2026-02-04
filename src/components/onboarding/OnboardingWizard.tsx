import React, { useState } from 'react';
import { View, StyleSheet, Pressable, Text, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

// Steps
import StepLanguage from './steps/StepLanguage';
import StepGender from './steps/StepGender';
import StepAge from './steps/StepAge';
import StepPersonality from './steps/StepPersonality';
import StepVoice from './steps/StepVoice';
import StepAvatar from './steps/StepAvatar';
import StepScene from './steps/StepScene';
import StepPlan from './steps/StepPlan';

// Types
// Types
type WizardData = {
    language: string;
    gender: string;
    ageRange: string;
    personality: string[];
    personalityIntensity: number;
    voiceId: string;
    avatarId: string;
    glbUrl: string;
    sceneId: string;
    plan: 'free' | 'premium';
};

interface Props {
    onComplete: (data: WizardData) => Promise<void>;
}

const TOTAL_STEPS = 8;

export default function OnboardingWizard({ onComplete }: Props) {
    const insets = useSafeAreaInsets();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [data, setData] = useState<WizardData>({
        language: 'en',
        gender: 'female',
        ageRange: '18-30',
        personality: ['empathetic', 'supportive', 'warm'],
        personalityIntensity: 0.7,
        voiceId: '21m00Tcm4TlvDq8ikWAM', // Default
        avatarId: 'default',
        glbUrl: 'https://models.readyplayer.me/63de9263909794db567432f2.glb',
        sceneId: 'cabin',
        plan: 'free',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const updateData = (updates: Partial<WizardData>) => {
        setData(prev => ({ ...prev, ...updates }));
    };

    const handleNext = async () => {
        // Validation
        if (step === 4) {
            if (data.personality.length < 3) {
                Alert.alert("Choose 3 Traits", "Please select at least 3 personality traits to continue.");
                return;
            }
        }

        if (step < TOTAL_STEPS) {
            setStep(p => p + 1);
        } else {
            // Finish
            setIsSubmitting(true);
            try {
                await onComplete(data);
            } catch (e: any) {
                Alert.alert("Error", e.message || "Failed to save.");
                setIsSubmitting(false);
            }
        }
    };

    const handleBack = () => {
        if (step > 1) {
            setStep(p => p - 1);
        } else {
            router.back();
        }
    };

    const renderStep = () => {
        switch (step) {
            case 1:
                return <StepLanguage selected={data.language} onSelect={l => updateData({ language: l })} />;
            case 2:
                return <StepGender selected={data.gender} onSelect={g => updateData({ gender: g })} />;
            case 3:
                return <StepAge selected={data.ageRange} onSelect={a => updateData({ ageRange: a })} />;
            case 4:
                return (
                    <StepPersonality
                        selected={data.personality}
                        intensity={data.personalityIntensity}
                        onSelect={p => updateData({ personality: p })}
                        onIntensityChange={i => updateData({ personalityIntensity: i })}
                    />
                );
            case 5:
                return <StepVoice selected={data.voiceId} onSelect={v => updateData({ voiceId: v })} />;
            case 6:
                return <StepAvatar glbUrl={data.glbUrl} avatarId={data.avatarId} onUpdate={u => updateData(u)} />;
            case 7:
                return <StepScene selected={data.sceneId} onSelect={s => updateData({ sceneId: s })} />;
            case 8:
                return <StepPlan selected={data.plan} onSelect={p => updateData({ plan: p })} />;
            default:
                return null;
        }
    };

    const progress = step / TOTAL_STEPS;

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            {/* Header */}
            <View style={styles.header}>
                <Pressable onPress={handleBack} style={styles.backBtn}>
                    <Ionicons name="arrow-back" size={24} color="#fff" />
                </Pressable>
                <View style={styles.progressContainer}>
                    <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
                </View>
                <Text style={styles.stepIndicator}>{step}/{TOTAL_STEPS}</Text>
            </View>

            {/* Content */}
            <View style={styles.content}>
                {renderStep()}
            </View>

            {/* Footer */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <Pressable onPress={handleNext} disabled={isSubmitting} style={styles.nextBtn}>
                    <LinearGradient
                        colors={['#5ED5FF', '#F922FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradient}
                    >
                        {isSubmitting ? (
                            <Text style={styles.btnText}>Creating...</Text>
                        ) : (
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                                <Text style={styles.btnText}>{step === TOTAL_STEPS ? 'Finish & Start' : 'Next'}</Text>
                                <Ionicons name="arrow-forward" size={20} color="#fff" />
                            </View>
                        )}
                    </LinearGradient>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#020617' },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        height: 60,
        gap: 16,
    },
    backBtn: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
    },
    progressContainer: {
        flex: 1,
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.1)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressBar: {
        height: '100%',
        backgroundColor: '#F922FF',
        borderRadius: 3,
    },
    stepIndicator: {
        color: '#94a3b8',
        fontWeight: '700',
        fontSize: 14,
    },
    content: {
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    footer: {
        paddingHorizontal: 24,
        paddingTop: 20,
    },
    nextBtn: {
        height: 56,
        borderRadius: 28,
        overflow: 'hidden',
        shadowColor: "#F922FF",
        shadowOpacity: 0.4,
        shadowRadius: 10,
        elevation: 6,
    },
    gradient: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    btnText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '900',
    },
});
