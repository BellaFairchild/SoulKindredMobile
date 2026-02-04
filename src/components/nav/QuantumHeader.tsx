import { View, StyleSheet, Platform, Text } from "react-native";
import { BlurView } from "expo-blur";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from '@/context/AppTheme';

type QuantumHeaderProps = {
    left?: React.ReactNode;
    center?: React.ReactNode;
    right?: React.ReactNode;
    height?: number;
};

export function QuantumHeader({ left, center, right, height = 64 }: QuantumHeaderProps) {
    const insets = useSafeAreaInsets();
    const { theme } = useTheme() as any;
    const isLight = theme.mode === "light";

    const colors = {
        bg: isLight ? "rgba(255, 255, 255, 0.95)" : "rgba(3, 9, 33, 0.92)",
        border: isLight ? "rgba(48, 98, 200, 0.12)" : "rgba(29, 216, 255, 0.25)",
    };

    return (
        <View style={[styles.wrapper, { height: height + insets.top, paddingTop: insets.top }]}>
            <BlurView intensity={30} style={StyleSheet.absoluteFill} tint={isLight ? "light" : "dark"} />
            <View style={[styles.container, { backgroundColor: colors.bg, borderBottomColor: colors.border }]}>
                <View style={styles.headerContent}>
                    <View style={styles.sideLeft}>{left}</View>
                    <View style={styles.center}>
                        {typeof center === 'string' ? (
                            <Text style={[styles.title, { color: isLight ? theme.neutralDark : "#FFFFFF", fontFamily: theme.typography.h1 }]}>
                                {center}
                            </Text>
                        ) : (
                            center
                        )}
                    </View>
                    <View style={styles.sideRight}>{right}</View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
    },
    container: {
        flex: 1,
        borderBottomWidth: 1.5,
    },
    headerContent: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 16,
    },
    sideLeft: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
    },
    sideRight: {
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-end",
    },
    center: {
        flex: 2,
        alignItems: "center",
        justifyContent: "center",
    },
    title: {
        fontSize: 16,
        fontWeight: "900",
        letterSpacing: 2.5,
    },
});
