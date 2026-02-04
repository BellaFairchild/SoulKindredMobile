import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated, Easing, Dimensions } from "react-native";
import { BlurView } from "expo-blur";
import { useTheme } from '@/context/AppTheme';
import { GlowCard } from "./GlowCard";

const { width } = Dimensions.get("window");

const AFFIRMATIONS = [
    "I am worthy of peace and happiness.",
    "Every breath I take fills me with calm.",
    "I trust the journey of my soul.",
    "I am connected to the wisdom of the universe.",
    "My heart is open to love and healing.",
    "I embrace growth with every step I take.",
    "I am resilient, strong, and capable.",
];

export function AffirmationTicker() {
    const { theme } = useTheme() as any;
    const isLight = theme.mode === "light";

    const [index, setIndex] = useState(0);
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(20)).current;

    useEffect(() => {
        let active = true;
        const runAnimation = () => {
            if (!active) return;

            fadeAnim.setValue(0);
            slideAnim.setValue(20);

            Animated.parallel([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 1000,
                    useNativeDriver: true,
                }),
                Animated.timing(slideAnim, {
                    toValue: 0,
                    duration: 1000,
                    easing: Easing.out(Easing.quad),
                    useNativeDriver: true,
                }),
            ]).start(() => {
                if (!active) return;
                setTimeout(() => {
                    if (!active) return;
                    Animated.parallel([
                        Animated.timing(fadeAnim, {
                            toValue: 0,
                            duration: 800,
                            useNativeDriver: true,
                        }),
                        Animated.timing(slideAnim, {
                            toValue: -20,
                            duration: 800,
                            useNativeDriver: true,
                        }),
                    ]).start(() => {
                        if (!active) return;
                        setIndex((prev) => (prev + 1) % AFFIRMATIONS.length);
                        runAnimation();
                    });
                }, 5000);
            });
        };

        runAnimation();
        return () => { active = false; };
    }, [fadeAnim, slideAnim]);

    return (
        <View style={styles.outerContainer}>
            <GlowCard isLight={isLight} style={{ marginBottom: 0 }}>
                <View style={styles.innerContent}>
                    <Animated.View style={{ opacity: fadeAnim, transform: [{ translateY: slideAnim }] }}>
                        <Text style={[styles.text, { color: isLight ? theme.neutralDark : "#FFFFFF", fontFamily: theme.typography.h3 }]}>
                            ✨ {AFFIRMATIONS[index]}
                        </Text>
                    </Animated.View>
                </View>
            </GlowCard>
        </View>
    );
}

const styles = StyleSheet.create({
    outerContainer: {
        width: '100%',
        marginBottom: 32,
    },
    innerContent: {
        height: 64,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
    },
    text: {
        fontSize: 16,
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 0.3,
    },
});
