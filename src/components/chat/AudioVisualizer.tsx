import React, { useEffect } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withTiming, Easing } from 'react-native-reanimated';
import { useTheme } from '@/context/AppTheme';

const Bar = ({ delay, color }: { delay: number, color: string }) => {
    const height = useSharedValue(10);

    useEffect(() => {
        height.value = withRepeat(
            withTiming(Math.random() * 40 + 20, { duration: 500 - delay, easing: Easing.linear }),
            -1,
            true
        );
    }, []);

    const style = useAnimatedStyle(() => ({
        height: height.value,
        backgroundColor: color,
    }));

    return <Animated.View style={[styles.bar, style]} />;
};

export const AudioVisualizer = () => {
    const { theme } = useTheme();

    return (
        <View style={styles.container}>
            <Text style={styles.statusText}>I’m Listening...</Text>
            <View style={styles.bars}>
                {[...Array(12)].map((_, i) => (
                    <Bar key={i} delay={i * 50} color={i % 2 === 0 ? theme.secondary : theme.alert} />
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        paddingVertical: 20,
    },
    statusText: {
        color: '#22D3EE',
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 16,
        textShadowColor: 'rgba(0,0,0,0.5)',
        textShadowRadius: 4,
    },
    bars: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 60,
        gap: 6,
    },
    bar: {
        width: 6,
        borderRadius: 3,
    }
});
