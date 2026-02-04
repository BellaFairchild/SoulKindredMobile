import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { useTheme } from '@/context/AppTheme';

type ComingSoonProps = {
    title: string;
    subtitle?: string;
};

/**
 * Reusable ComingSoon component using a placeholder
 * and theme-aware styling.
 */
export function ComingSoon({ title, subtitle }: ComingSoonProps) {
    const { theme } = useTheme() as any;
    const isLight = theme.mode === 'light';

    return (
        <View style={[styles.container, { backgroundColor: theme.appBackground }]}>
            <View style={styles.animationContainer}>
                <Text style={{ fontSize: 50 }}>🚧</Text>
            </View>

            <View style={styles.textContainer}>
                <Text style={[styles.title, { color: isLight ? theme.neutralDark : '#e2e8f0', fontFamily: theme.typography.h1 }]}>
                    {title}
                </Text>
                {subtitle && (
                    <Text style={[styles.subtitle, { color: isLight ? 'rgba(0,0,0,0.5)' : '#94a3b8', fontFamily: theme.typography.main }]}>
                        {subtitle}
                    </Text>
                )}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
    },
    animationContainer: {
        marginBottom: -20, // Negative margin to bring text closer to animation center if needed
    },
    textContainer: {
        alignItems: 'center',
        gap: 8,
    },
    title: {
        fontSize: 28,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});
