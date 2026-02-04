import React from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from '@/context/AppTheme';

import { useSubscription } from "@/context/SubscriptionContext";
import { useOverlay } from "@/context/OverlayContext";

const { width, height } = Dimensions.get("window");

export default function Tools() {
    const { tab } = useLocalSearchParams<{ tab?: string }>();
    const router = useRouter();
    const { theme } = useTheme() as any;
    const { isPremium } = useSubscription();
    const { showOverlay } = useOverlay();
    const isLight = theme.mode === "light";

    const toolInfo = {
        breathe: {
            title: "Internal Peace",
            subtitle: "Rhythmic breathing to calm your nervous system.",
            icon: "leaf",
            colors: ["#2DD4BF", "#0D9488"] as [string, string],
            note: "Inhale for 4, Hold for 4, Exhale for 6."
        },
        tap: {
            title: "Anchor Point",
            subtitle: "EFT Tapping to release emotional blockages.",
            icon: "hand-left",
            colors: ["#F43F5E", "#BE123C"] as [string, string],
            note: "Focus on the karate chop point and repeat: 'I am safe.'"
        },

        burn: {
            title: "Burn Your Worries",
            subtitle: "Release your burdens to the fire.",
            icon: "flame",
            colors: ["#F97316", "#DC2626"] as [string, string],
            note: "Write or speak your worries, then watch them burn."
        },
        scan: {
            title: "Body Connection",
            subtitle: "Scan your body to rediscover presence.",
            icon: "body",
            colors: ["#8B5CF6", "#6D28D9"] as [string, string],
            note: "Start from your toes and move up to your crown."
        }
    };

    const currentTab = (tab as keyof typeof toolInfo) || "breathe";
    const current = toolInfo[currentTab];
    const isLocked = !isPremium && currentTab !== "breathe";

    return (
        <View style={styles.container}>
            <LinearGradient
                colors={isLight ? theme.chatGradient : ["#0B1020", "#1E1B4B"]}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.header}>
                <Pressable onPress={() => router.back()} style={styles.closeBtn}>
                    <BlurView intensity={isLight ? 40 : 30} style={[styles.blurCircle, { backgroundColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)' }]} tint={isLight ? "light" : "dark"}>
                        <Ionicons name="close" size={24} color={isLight ? theme.neutralDark : "#fff"} />
                    </BlurView>
                </Pressable>
                <Text style={[styles.typeLabel, { color: isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.4)', fontFamily: theme.typography.h3 }]}>SOUL TOOLBOX</Text>
            </View>

            <View style={styles.content}>
                <View style={[styles.iconContainer, { shadowColor: current.colors[0] }]}>
                    <LinearGradient colors={current.colors} style={styles.iconGradient}>
                        <Ionicons name={current.icon as any} size={60} color="#fff" />
                    </LinearGradient>
                </View>

                <Text style={[styles.title, { color: isLight ? theme.neutralDark : "#fff", fontFamily: theme.typography.h1 }]}>{current.title}</Text>
                <Text style={[styles.subtitle, { color: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.6)', fontFamily: theme.typography.h2 }]}>{current.subtitle}</Text>

                <BlurView intensity={isLight ? 50 : 20} style={[styles.infoCard, { backgroundColor: isLight ? '#FFFFFF80' : 'rgba(255,100,251,0.05)', borderColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)' }]} tint={isLight ? "light" : "dark"}>
                    <Ionicons name="information-circle-outline" size={20} color={isLight ? theme.accent : "#5ED5FF"} />
                    <Text style={[styles.infoText, { color: isLight ? theme.neutralDark : "#fff", fontFamily: theme.typography.main }]}>{current.note}</Text>
                </BlurView>

                <Pressable
                    style={styles.startBtn}
                    onPress={() => {
                        if (isLocked) {
                            router.push('/paywall');
                        } else {
                            // Logic to start session (navigate or play)
                            console.log('Starting session:', current.title);
                            // Implementation dependent...
                        }
                    }}
                >
                    <LinearGradient
                        colors={isLocked ? ["#475569", "#1e293b"] : ["#5ED5FF", "#F922FF"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                        style={styles.startGradient}
                    >
                        {isLocked && <Ionicons name="lock-closed" size={20} color="#94a3b8" style={{ marginRight: 8 }} />}
                        <Text style={[styles.startText, { fontFamily: theme.typography.button, color: isLocked ? "#94a3b8" : "#fff" }]}>
                            {isLocked ? "UNLOCK PREMIUM" : "START SESSION"}
                        </Text>
                    </LinearGradient>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 60,
        paddingHorizontal: 24,
    },
    closeBtn: {
        width: 44,
        height: 44,
        borderRadius: 22,
        overflow: "hidden",
    },
    blurCircle: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "rgba(255,255,255,0.1)",
    },
    typeLabel: {
        color: "rgba(255,255,255,0.4)",
        fontWeight: "800",
        fontSize: 12,
        letterSpacing: 3,
    },
    content: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
        paddingBottom: 60,
    },
    iconContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 30,
        elevation: 20,
        shadowOpacity: 0.5,
        shadowRadius: 20,
        shadowOffset: { width: 0, height: 10 },
    },
    iconGradient: {
        flex: 1,
        borderRadius: 60,
        alignItems: "center",
        justifyContent: "center",
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.2)",
    },
    title: {
        color: "#fff",
        fontSize: 32,
        fontWeight: "900",
        textAlign: "center",
        marginBottom: 12,
    },
    subtitle: {
        color: "rgba(255,255,255,0.6)",
        fontSize: 16,
        textAlign: "center",
        lineHeight: 24,
        marginBottom: 40,
    },
    infoCard: {
        width: "100%",
        padding: 20,
        borderRadius: 20,
        backgroundColor: "rgba(255,255,255,0.05)",
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.1)",
        marginBottom: 40,
    },
    infoText: {
        color: "#fff",
        fontSize: 14,
        fontWeight: "600",
        flex: 1,
    },
    startBtn: {
        width: "100%",
        height: 60,
        borderRadius: 30,
        overflow: "hidden",
        elevation: 10,
    },
    startGradient: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    startText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "900",
        letterSpacing: 2,
    },
});
