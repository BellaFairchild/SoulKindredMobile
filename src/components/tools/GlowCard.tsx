import React from "react";
import { View, StyleSheet, Platform, ViewStyle, StyleProp } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

type GlowCardProps = {
    children: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    gradientColors?: [string, string, ...string[]];
    isLight?: boolean;
};

/**
 * GlowCard replicates the high-fidelity CSS design with a gradient border 
 * and a soft glowing shadow/glow behind it.
 */
export function GlowCard({
    children,
    style,
    gradientColors = ["#8c43f2", "#22D3EE"],
    isLight = false
}: GlowCardProps) {
    return (
        <View style={[styles.outerBoundary, style]}>
            {/* The Glow (Blurred background gradient) */}
            <View style={styles.glowContainer}>
                <LinearGradient
                    colors={gradientColors}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={styles.glowGradient}
                />
            </View>

            {/* The Gradient Border Shell */}
            <LinearGradient
                colors={gradientColors}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={styles.borderShell}
            >
                {/* The Inner Content Area */}
                <View style={[
                    styles.innerContent,
                    { backgroundColor: isLight ? "#FFFFFF" : "rgba(11, 18, 32, 0.95)" }
                ]}>
                    {children}
                </View>
            </LinearGradient>
        </View>
    );
}

const styles = StyleSheet.create({
    outerBoundary: {
        position: "relative",
        padding: 4, // Space for the glow to bleed out if needed
        marginBottom: 24,
    },
    glowContainer: {
        position: "absolute",
        top: 30, // Offset down as per user's top: 40px
        left: 0,
        right: 0,
        bottom: -10,
        zIndex: -1,
        opacity: 0.6,
        transform: [{ scale: 0.9 }],
    },
    glowGradient: {
        flex: 1,
        borderRadius: 20,
        ...Platform.select({
            ios: {
                shadowColor: "#8c43f2",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 1,
                shadowRadius: 30,
            },
            android: {
                // Android doesn't support blur on standard Views well, 
                // but elevation can provide some depth. 
                // For a true "glow", we rely on the gradient colors.
                elevation: 20,
            },
        }),
    },
    borderShell: {
        padding: 8, // The border thickness
        borderRadius: 24, // 1.5rem approx
        overflow: "hidden",
        ...Platform.select({
            ios: {
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.2,
                shadowRadius: 10,
            },
            android: {
                elevation: 8,
            },
        }),
    },
    innerContent: {
        flex: 1,
        borderRadius: 18, // Slightly smaller than shell
        overflow: "hidden",
    },
});
