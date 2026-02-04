import React, { useEffect, useRef } from "react";
import { View, Pressable, StyleSheet, Animated, Easing } from "react-native";
import { Ionicons } from "@expo/vector-icons";

type ThemeToggleProps = {
    isLight: boolean;
    onToggle: () => void;
};

export function ThemeToggle({ isLight, onToggle }: ThemeToggleProps) {
    const animatedValue = useRef(new Animated.Value(isLight ? 0 : 1)).current;

    useEffect(() => {
        Animated.timing(animatedValue, {
            toValue: isLight ? 0 : 1,
            duration: 400,
            easing: Easing.bezier(0, -0.02, 0.4, 1.25),
            useNativeDriver: false, // Color and positioning need false
        }).start();
    }, [isLight]);

    const containerBg = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["#3D7EAE", "#1D1F2C"],
    });

    const circleTranslateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [4, 46], // Adjusted for size
    });

    const moonTranslateX = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [40, 0],
    });

    const sunBg = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ["#ECCA2F", "#C4C9D1"],
    });

    const cloudsBottom = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-10, -40],
    });

    const starsTop = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [-30, 8],
    });

    return (
        <Pressable onPress={onToggle} style={styles.pressable}>
            <Animated.View style={[styles.container, { backgroundColor: containerBg }]}>
                {/* Stars Background (Dark Mode) */}
                <Animated.View style={[styles.starsContainer, { transform: [{ translateY: starsTop }] }]}>
                    <Ionicons name="sparkles" size={10} color="#fff" style={{ position: 'absolute', top: 2, left: 12, opacity: 0.8 }} />
                    <Ionicons name="sparkles" size={6} color="#fff" style={{ position: 'absolute', top: 12, left: 6, opacity: 0.6 }} />
                    <Ionicons name="sparkles" size={5} color="#fff" style={{ position: 'absolute', top: 5, left: 26, opacity: 0.7 }} />
                    <Ionicons name="sparkles" size={7} color="#fff" style={{ position: 'absolute', top: 15, left: 22, opacity: 0.5 }} />
                    <Ionicons name="sparkles" size={4} color="#fff" style={{ position: 'absolute', top: 8, left: 32, opacity: 0.9 }} />
                </Animated.View>

                {/* Clouds Background (Light Mode) */}
                <Animated.View style={[styles.clouds, { bottom: cloudsBottom }]}>
                    <View style={[styles.cloudPart, { width: 24, height: 24, borderRadius: 12, left: 0, bottom: -4 }]} />
                    <View style={[styles.cloudPart, { width: 28, height: 28, borderRadius: 14, left: 14, bottom: 2 }]} />
                    <View style={[styles.cloudPart, { width: 22, height: 22, borderRadius: 11, left: 32, bottom: -6 }]} />
                    <View style={[styles.cloudPart, { width: 18, height: 18, borderRadius: 9, left: 48, bottom: -2 }]} />
                </Animated.View>

                {/* Slidable Circle */}
                <Animated.View style={[styles.circle, { transform: [{ translateX: circleTranslateX }] }]}>
                    <Animated.View style={[styles.sunMoon, { backgroundColor: sunBg }]}>
                        {/* Moon Over Sun Effect */}
                        <Animated.View style={[styles.moonOverlay, { transform: [{ translateX: moonTranslateX }] }]}>
                            <View style={styles.spot} />
                            <View style={[styles.spot, { top: 12, left: 18, width: 4, height: 4 }]} />
                            <View style={[styles.spot, { top: 4, left: 12, width: 3, height: 3 }]} />
                        </Animated.View>
                    </Animated.View>
                </Animated.View>
            </Animated.View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    pressable: {
        borderRadius: 20,
        overflow: "hidden",
    },
    container: {
        width: 84, // ~5.625em
        height: 38, // ~2.5em
        borderRadius: 20,
        position: "relative",
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
    },
    circle: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: "rgba(255,255,255,0.1)",
        position: "absolute",
        top: 2,
        justifyContent: "center",
        alignItems: "center",
    },
    sunMoon: {
        width: 26,
        height: 26,
        borderRadius: 13,
        overflow: "hidden",
        position: "relative",
    },
    moonOverlay: {
        width: "100%",
        height: "100%",
        backgroundColor: "#C4C9D1",
        borderRadius: 13,
        position: "absolute",
        top: 0,
        left: 0,
    },
    spot: {
        position: "absolute",
        top: 8,
        left: 4,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: "#959DB1",
        opacity: 0.6,
    },
    clouds: {
        position: "absolute",
        left: 4,
        flexDirection: "row",
    },
    cloudPart: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#F3FDFF",
        position: "absolute",
        bottom: 0,
    },
    starsContainer: {
        position: "absolute",
        left: 4,
        width: 40,
        height: 20,
    },
});
