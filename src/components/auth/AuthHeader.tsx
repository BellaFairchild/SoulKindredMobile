import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

interface AuthHeaderProps {
    step: number;
    totalSteps?: number;
    stepLabel: string;
    onBack: () => void;
    showProgress?: boolean;
}

export default function AuthHeader({
    step,
    totalSteps = 4,
    stepLabel = 'Identity',
    onBack,
    showProgress = true
}: AuthHeaderProps) {
    const router = useRouter();

    const handleBack = () => {
        if (onBack) {
            onBack();
        } else {
            router.back();
        }
    };

    const progress = (step / totalSteps) * 100;

    return (
        <View style={styles.container}>
            <View style={styles.topRow}>
                <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color="rgba(0,0,0,0.4)" />
                </TouchableOpacity>

                <View style={styles.brandContainer}>
                    <Image
                        source={require('../../../assets/logo.png')}
                        style={styles.logo}
                        resizeMode="contain"
                    />
                    <Text style={styles.brandSubtitle}>{stepLabel === 'Login' ? 'Login' : 'Sign Up'}</Text>
                </View>

                <View style={{ width: 44 }} />
            </View>

            {showProgress && (
                <View style={styles.progressSection}>
                    <View style={styles.progressLabels}>
                        <Text style={styles.stepInfo}>{`Step ${step} of ${totalSteps}`}</Text>
                        <Text style={styles.stepLabel}>{stepLabel}</Text>
                    </View>
                    <View style={styles.progressBarBg}>
                        <LinearGradient
                            colors={['#5ED5FF', '#F922FF']}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[styles.progressBarFill, { width: `${progress}%` }]}
                        />
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 24,
        paddingTop: 12,
        paddingBottom: 24,
        backgroundColor: '#fff',
    },
    topRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    backButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    brandContainer: {
        alignItems: 'center',
    },
    logo: {
        width: 140,
        height: 35,
    },
    brandSubtitle: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.3)',
        marginTop: 2,
        fontWeight: '600',
    },
    progressSection: {
        width: '100%',
    },
    progressLabels: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    stepInfo: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.3)',
        fontWeight: '500',
    },
    stepLabel: {
        fontSize: 14,
        color: '#4CC9F0',
        fontWeight: '700',
    },
    progressBarBg: {
        height: 8,
        backgroundColor: 'rgba(0,0,0,0.05)',
        borderRadius: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: '100%',
        borderRadius: 4,
    },
});
