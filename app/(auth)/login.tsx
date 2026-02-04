import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/auth/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { statusCodes } from '@react-native-google-signin/google-signin';

export default function LoginScreen() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, signInWithGoogle } = useAuth();
    const router = useRouter();
    const insets = useSafeAreaInsets();

    const handleLogin = async () => {
        try {
            setError('');
            await login(email.trim(), password);
            router.replace('/(drawer)/(tabs)');
        } catch (e: any) {
            console.error(e);
            if (e.code === 'auth/invalid-credential' || e.message.includes('invalid-credential')) {
                setError('Incorrect email or password. Please try again or Sign Up.');
            } else if (e.code === 'auth/user-not-found') {
                setError('No account found with this email. Please Sign Up.');
            } else if (e.code === 'auth/wrong-password') {
                setError('Incorrect password.');
            } else if (e.code === 'auth/too-many-requests') {
                setError('Too many failed attempts. Please try again later.');
            } else {
                setError(e.message.replace('Firebase: Error (', '').replace(').', ''));
            }
        }
    };

    const handleGoogleSignIn = async () => {
        try {
            setError('');
            console.log('LoginScreen: await signInWithGoogle() START');
            await signInWithGoogle();
            console.log('LoginScreen: signInWithGoogle() COMPLETE');

            // Short delay to ensure AuthContext updates?
            console.log('LoginScreen: Attempting router.replace("/")');
            router.replace('/');
            console.log('LoginScreen: router.replace("/") CALLED');
        } catch (e: any) {
            console.error('LoginScreen Google Error:', e);
            // console.error(e);
            if (e.code === statusCodes.SIGN_IN_CANCELLED) {
                // Ignore cancellation
            } else if (e.code === 'auth/invalid-credential' || e.message?.includes('invalid-credential')) {
                setError('Configuration Error: Add SHA-1 fingerprint to Firebase Console.');
            } else {
                setError(e.message.replace('Firebase: Error (', '').replace(').', ''));
            }
        }
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>SOUL KINDRED</Text>
                        <Text style={styles.subtitle}>Welcome Back</Text>
                    </View>

                    {/* Welcome Text */}
                    <View style={styles.welcomeContainer}>
                        <Text style={styles.welcomeTitle}>Hello, Friend! 👋</Text>
                        <Text style={styles.welcomeSubtitle}>Sign in to continue your journey</Text>
                    </View>

                    {/* Form */}
                    <View style={styles.form}>

                        {/* Email Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Email</Text>
                            <View style={styles.inputField}>
                                <Ionicons name="mail-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="hello@soulkindred.com"
                                    placeholderTextColor="#CBD5E1"
                                    value={email}
                                    onChangeText={setEmail}
                                    autoCapitalize="none"
                                    keyboardType="email-address"
                                />
                            </View>
                        </View>

                        {/* Password Input */}
                        <View style={styles.inputContainer}>
                            <Text style={styles.inputLabel}>Password</Text>
                            <View style={styles.inputField}>
                                <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your password"
                                    placeholderTextColor="#CBD5E1"
                                    value={password}
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                            </View>
                        </View>

                        {/* Error Message */}
                        {error ? (
                            <View style={styles.errorContainer}>
                                <Ionicons name="alert-circle" size={20} color="#EF4444" />
                                <Text style={styles.errorText}>{error}</Text>
                            </View>
                        ) : null}

                        {/* Login Button */}
                        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                            <LinearGradient
                                colors={['#38BDF8', '#8B5CF6']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientButton}
                            >
                                <Text style={styles.loginButtonText}>Sign In</Text>
                            </LinearGradient>
                        </TouchableOpacity>

                        {/* Divider */}
                        <View style={styles.divider}>
                            <View style={styles.dividerLine} />
                            <Text style={styles.dividerText}>or</Text>
                            <View style={styles.dividerLine} />
                        </View>

                        {/* Google Sign In */}
                        <TouchableOpacity style={styles.googleButton} onPress={handleGoogleSignIn}>
                            <Ionicons name="logo-google" size={20} color="#4285F4" />
                            <Text style={styles.googleButtonText}>Continue with Google</Text>
                        </TouchableOpacity>

                        {/* Sign Up Link */}
                        <View style={styles.signupContainer}>
                            <Text style={styles.signupText}>Don't have an account? </Text>
                            <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
                                <Text style={styles.signupLink}>Sign Up</Text>
                            </TouchableOpacity>
                        </View>

                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F8FAFC',
    },
    scrollContent: {
        flexGrow: 1,
        padding: 24,
    },
    header: {
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 40,
    },
    title: {
        fontSize: 32,
        fontWeight: '900',
        color: '#0F172A',
        letterSpacing: 2,
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: '#64748B',
        fontWeight: '500',
    },
    welcomeContainer: {
        marginBottom: 32,
    },
    welcomeTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#0F172A',
        marginBottom: 8,
    },
    welcomeSubtitle: {
        fontSize: 16,
        color: '#64748B',
    },
    form: {
        flex: 1,
    },
    inputContainer: {
        marginBottom: 20,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#334155',
        marginBottom: 8,
    },
    inputField: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    inputIcon: {
        marginRight: 12,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#0F172A',
    },
    errorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FEE2E2',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    errorText: {
        color: '#DC2626',
        marginLeft: 8,
        fontSize: 14,
        flex: 1,
    },
    loginButton: {
        marginTop: 8,
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
    },
    gradientButton: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    loginButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
        letterSpacing: 0.5,
    },
    divider: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    dividerLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#E2E8F0',
    },
    dividerText: {
        marginHorizontal: 16,
        color: '#94A3B8',
        fontSize: 14,
    },
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E2E8F0',
    },
    googleButtonText: {
        marginLeft: 12,
        fontSize: 16,
        fontWeight: '600',
        color: '#0F172A',
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 24,
    },
    signupText: {
        color: '#64748B',
        fontSize: 14,
    },
    signupLink: {
        color: '#8B5CF6',
        fontSize: 14,
        fontWeight: '700',
    },
});
