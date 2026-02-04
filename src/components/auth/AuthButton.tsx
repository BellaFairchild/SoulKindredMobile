import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View, ViewStyle, TextStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

interface AuthButtonProps {
    label: string;
    onPress: () => void;
    type?: 'primary' | 'google' | 'facebook';
    style?: ViewStyle;
}

export default function AuthButton({ label, onPress, type = 'primary', style }: AuthButtonProps) {
    const isIdentity = type === 'primary';
    const isGoogle = type === 'google';
    const isFacebook = type === 'facebook';

    const gradientColors = isIdentity
        ? (['#5ED5FF', '#F922FF'] as const)
        : isGoogle
            ? (['#FF0000', '#D61A1A'] as const)
            : (['#1877F2', '#0C5DC7'] as const);

    return (
        <TouchableOpacity onPress={onPress} style={[styles.container, style]}>
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.gradient}
            >
                <Text style={styles.text}>{label}</Text>
                <View style={styles.arrowCircle}>
                    <Ionicons name="arrow-forward" size={18} color={isIdentity ? '#F922FF' : '#fff'} />
                </View>
            </LinearGradient>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 64,
        borderRadius: 32,
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 8,
        elevation: 5,
    },
    gradient: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 28,
    },
    text: {
        color: '#fff',
        fontSize: 22,
        fontWeight: '900',
        flex: 1,
        textAlign: 'center',
        marginLeft: 32, // Offset for the arrow on the right
    },
    arrowCircle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
});
