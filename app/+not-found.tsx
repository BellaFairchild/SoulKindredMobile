import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { Link, Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

// Platform specific Lottie imports
let LottieComponent: any;
if (Platform.OS === 'web') {
    try {
        const { DotLottieReact } = require('@lottiefiles/dotlottie-react');
        LottieComponent = DotLottieReact;
    } catch (e) {
        console.warn('DotLottieReact not available, falling back to basic view');
    }
} else {
    try {
        const LottieView = require('lottie-react-native');
        LottieComponent = LottieView.default || LottieView;
    } catch (e) {
        console.warn('LottieView not available, falling back to basic view');
    }
}

// Replace this with your actual lottie file path or URL
const ANIMATION_URL = "https://assets10.lottiefiles.com/packages/lf20_ghp9on7z.json";

export default function NotFoundScreen() {
    return (
        <>
            <Stack.Screen options={{ title: 'Oops!', headerShown: false }} />
            <View style={styles.container}>
                <LinearGradient
                    colors={['#0b1220', '#1a2a44']}
                    style={StyleSheet.absoluteFill}
                />

                <View style={styles.content}>
                    <View style={styles.animationContainer}>
                        {LottieComponent ? (
                            Platform.OS === 'web' ? (
                                <LottieComponent
                                    src={ANIMATION_URL}
                                    loop
                                    autoplay
                                    style={{ width: 300, height: 300 }}
                                />
                            ) : (
                                <LottieComponent
                                    source={{ uri: ANIMATION_URL }}
                                    autoPlay
                                    loop
                                    style={{ width: 300, height: 300 }}
                                />
                            )
                        ) : (
                            <Ionicons name="alert-circle-outline" size={120} color="#F922FF" />
                        )}
                    </View>

                    <Text style={styles.title}>Lost in Space?</Text>
                    <Text style={styles.subtitle}>
                        We can't find the page you're looking for. Let's get you back to your soul kindred.
                    </Text>

                    <Link href="/" asChild>
                        <TouchableOpacity style={styles.button}>
                            <LinearGradient
                                colors={['#4CC9F0', '#F922FF']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.buttonGradient}
                            >
                                <Text style={styles.buttonText}>Go to Home</Text>
                                <Ionicons name="arrow-forward" size={20} color="#fff" />
                            </LinearGradient>
                        </TouchableOpacity>
                    </Link>
                </View>
            </View>
        </>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0b1220',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    animationContainer: {
        width: 300,
        height: 300,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#fff',
        textAlign: 'center',
        marginBottom: 16,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    subtitle: {
        fontSize: 16,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 48,
        maxWidth: 300,
    },
    button: {
        width: '100%',
        maxWidth: 240,
        height: 60,
        borderRadius: 30,
        overflow: 'hidden',
        elevation: 8,
        shadowColor: '#F922FF',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
    },
    buttonGradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 12,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '800',
    },
});
