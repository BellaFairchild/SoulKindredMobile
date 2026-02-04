import React, { useMemo, useState, useEffect, useRef } from "react";
import { View, Pressable, Text, StyleSheet, Platform, Animated, useColorScheme, Dimensions, Easing } from "react-native";
import Svg, { Path, Defs, LinearGradient as SvgGradient, Stop, Circle } from "react-native-svg";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { BlurView } from "expo-blur";

import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM_MARGIN, CENTER_BUTTON_OVERHANG } from "@/constants/layout";
import { useTheme } from '@/context/AppTheme';
import { useRouter } from "expo-router";

// --- SpeedDialFab ---
// (No changes to SpeedDialFab logic, but will use brand colors later)

type Action = {
  key: string;
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
};

type SpeedDialFabProps = {
  actions: Action[];
  open: boolean;
  onClose: () => void;
  lift?: number;
};

function SpeedDialFab({ actions, open, onClose, lift = 34 }: SpeedDialFabProps) {
  const { theme } = useTheme() as any;
  const isLight = theme.mode === "light";
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, {
      toValue: open ? 1 : 0,
      useNativeDriver: true,
      friction: 7,
      tension: 90,
    }).start();
  }, [anim, open]);

  const closeAndRun = (fn: () => void) => {
    onClose();
    Animated.spring(anim, { toValue: 0, useNativeDriver: true, friction: 7, tension: 90 }).start();
    fn();
  };

  const insets = useSafeAreaInsets();
  const bottom = TAB_BAR_HEIGHT + insets.bottom + lift;

  const laidOut = useMemo(() => {
    const count = actions.length;
    const radius = 100;
    const startAngle = -145; // Aggressively widened
    const endAngle = -35;    // Aggressively widened
    const step = count > 1 ? (endAngle - startAngle) / (count - 1) : 0;

    return actions.map((a, i) => {
      const deg = startAngle + step * i;
      const rad = (deg * Math.PI) / 180;
      return {
        ...a,
        dx: Math.cos(rad) * radius,
        dy: Math.sin(rad) * radius,
      };
    });
  }, [actions]);

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <Animated.View
        pointerEvents={open ? "auto" : "none"}
        style={[
          styles.backdrop,
          {
            opacity: anim.interpolate({ inputRange: [0, 1], outputRange: [0, 1] }),
          },
        ]}
      >
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} />
      </Animated.View>

      <View pointerEvents="box-none" style={[styles.container, { bottom }]}>
        {laidOut.map((a) => {
          const translateX = anim.interpolate({ inputRange: [0, 1], outputRange: [0, a.dx] });
          const translateY = anim.interpolate({ inputRange: [0, 1], outputRange: [0, a.dy] });
          const scale = anim.interpolate({ inputRange: [0, 1], outputRange: [0.6, 1] });
          const opacity = anim.interpolate({ inputRange: [0, 0.15, 1], outputRange: [0, 0.9, 1] });

          return (
            <Animated.View
              key={a.key}
              style={[
                styles.actionWrap,
                {
                  opacity,
                  transform: [{ translateX }, { translateY }, { scale }],
                },
              ]}
            >
              <Pressable
                onPress={() => closeAndRun(a.onPress)}
                style={({ pressed }) => [styles.actionBtn, pressed && styles.pressed, { backgroundColor: theme.neutral }]}
              >
                <Ionicons name={a.icon} size={22} color={theme.neutralDark} />
              </Pressable>
              <Text style={[styles.actionLabel, { color: isLight ? "#0B1020" : "rgba(255,255,255,0.9)", fontFamily: theme.typography.button }]}>
                {a.label}
              </Text>
            </Animated.View>
          );
        })}
      </View>
    </View>
  );
}

function NotchBackground({ isLight, width, height, theme }: { isLight: boolean; width: number; height: number; theme: any }) {
  if (!width || !height) return null;
  const cx = width / 2;

  const d = `M22,0 H${cx - 52} C${cx - 35},0 ${cx - 40},45 ${cx},45 C${cx + 40},45 ${cx + 35},0 ${cx + 52},0 H${width - 22} A22,22 0 0 1 ${width},22 V${height - 22} A22,22 0 0 1 ${width - 22},${height} H22 A22,22 0 0 1 0,${height - 22} V22 A22,22 0 0 1 22,0 Z`;

  return (
    <View style={StyleSheet.absoluteFill}>
      <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <Defs>
          <SvgGradient id="borderGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <Stop offset="0%" stopColor="#5ED5FF" />
            <Stop offset="50%" stopColor="#A855F7" />
            <Stop offset="100%" stopColor="#5ED5FF" />
          </SvgGradient>
        </Defs>
        <Path
          d={d}
          fill={isLight ? "rgba(255, 255, 255, 0.9)" : "rgba(11, 18, 32, 0.95)"}
          stroke="url(#borderGradient)"
          strokeWidth={1.8}
          opacity={isLight ? 0.7 : 1}
        />
      </Svg>
    </View>
  );
}

// --- Main Component ---

export default function NotchedTabBar({ state, navigation, descriptors }: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme() as any;
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const isLight = theme.mode === "light";
  const [barWidth, setBarWidth] = useState(0);

  const lightAnim = useRef(new Animated.Value(-1)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Light Pass Animation
    const startLightPass = () => {
      lightAnim.setValue(-1);
      Animated.timing(lightAnim, {
        toValue: 2,
        duration: 3500,
        easing: Easing.bezier(0.4, 0, 0.2, 1),
        useNativeDriver: true,
      }).start(() => {
        setTimeout(startLightPass, 2000);
      });
    };
    startLightPass();

    // Pulse Animation for center button
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
      ])
    ).start();
  }, [lightAnim, pulseAnim]);

  const activeRouteName = state.routes[state.index]?.name;
  const barBottom = TAB_BAR_BOTTOM_MARGIN + insets.bottom;

  const colors = {
    activeIcon: theme.primary,
    inactiveIcon: isLight ? "#64748b" : "#FFFFFF", // White icons in dark mode
    activeLabel: theme.primary,
    inactiveLabel: isLight ? "rgba(71, 85, 105, 0.7)" : "#FFFFFF", // White labels in dark mode
  };

  const goTo = (name: string) => {
    setOpen(false);
    navigation.navigate(name as never);
  };

  const lightTranslateX = lightAnim.interpolate({
    inputRange: [-1, 2],
    outputRange: [-barWidth, barWidth * 2],
  });

  return (
    <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
      <SpeedDialFab
        open={open}
        onClose={() => setOpen(false)}
        actions={[
          { key: "breath", label: "Breath", icon: "leaf-outline", onPress: () => router.push("/tools?tab=breathe") },
          { key: "tap", label: "Tap", icon: "hand-left-outline", onPress: () => router.push("/tools?tab=tap") },
          { key: "body", label: "Body", icon: "body-outline", onPress: () => router.push("/tools?tab=scan") },
        ]}
      />

      <View
        onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
        style={[
          styles.bar,
          { height: TAB_BAR_HEIGHT, bottom: barBottom }
        ]}
      >
        <NotchBackground isLight={isLight} width={barWidth} height={TAB_BAR_HEIGHT} theme={theme} />

        {/* Animated Light Pass */}
        <View style={[styles.lightPassContainer, { width: barWidth }]}>
          <Animated.View style={[styles.lightPass, { width: barWidth * 0.5, transform: [{ translateX: lightTranslateX }] }]}>
            <LinearGradient
              colors={['transparent', isLight ? 'rgba(94, 213, 255, 0.4)' : 'rgba(94, 213, 255, 0.6)', 'transparent']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={StyleSheet.absoluteFill}
            />
          </Animated.View>
        </View>

        <View style={styles.innerRow}>
          <View style={styles.side}>
            {TABS.slice(0, 2).map((t, idx) => (
              <React.Fragment key={t.key}>
                <Pressable onPress={() => goTo(t.key)} style={styles.tabBtn}>
                  <Ionicons name={t.icon as any} size={22} color={activeRouteName === t.key ? colors.activeIcon : colors.inactiveIcon} />
                  <Text style={[styles.label, { color: activeRouteName === t.key ? colors.activeLabel : colors.inactiveLabel, fontFamily: theme.typography.button }]}>{t.label}</Text>
                </Pressable>
                {/* Visual Separator */}
                {idx === 0 && <View style={[styles.separator, { backgroundColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)' }]} />}
              </React.Fragment>
            ))}
          </View>

          <View style={styles.centerSpacer} />

          <View style={styles.side}>
            {TABS.slice(2, 4).map((t, idx) => (
              <React.Fragment key={t.key}>
                <Pressable onPress={() => goTo(t.key)} style={styles.tabBtn}>
                  <Ionicons name={t.icon as any} size={22} color={activeRouteName === t.key ? colors.activeIcon : colors.inactiveIcon} />
                  <Text style={[styles.label, { color: activeRouteName === t.key ? colors.activeLabel : colors.inactiveLabel, fontFamily: theme.typography.button }]}>{t.label}</Text>
                </Pressable>
                {/* Visual Separator */}
                {idx === 0 && <View style={[styles.separator, { backgroundColor: isLight ? 'rgba(0,0,0,0.06)' : 'rgba(255,255,255,0.08)' }]} />}
              </React.Fragment>
            ))}
          </View>
        </View>

        {/* Central Button Area */}
        <Pressable
          onPress={() => setOpen(!open)}
          style={[styles.centerBtnWrap, { bottom: TAB_BAR_HEIGHT - CENTER_BUTTON_OVERHANG }]}
        >
          {/* Mockup Outer Glow Rings */}
          <Animated.View style={[
            styles.haloOuter,
            {
              borderColor: theme.primary,
              opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.3, 0.6] }),
              transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.95, 1.15] }) }]
            }
          ]} />

          <Animated.View style={[
            styles.haloInner,
            {
              backgroundColor: theme.accent,
              opacity: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [0.2, 0.4] }),
              transform: [{ scale: pulseAnim.interpolate({ inputRange: [0, 1], outputRange: [1, 1.1] }) }]
            }
          ]} />

          <LinearGradient
            colors={open ? [theme.alert, theme.accent] : ['#06B6D4', '#8B5CF6']}
            style={styles.centerBtn}
          >
            <MaterialCommunityIcons name={open ? "close" : "yin-yang"} size={32} color="#ffffff" />
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

const TABS: Array<{ key: string; label: string; icon: string }> = [
  { key: "index", label: "Home", icon: "home-outline" },
  { key: "chat", label: "Chat", icon: "chatbubbles-outline" },
  { key: "journal", label: "Journal", icon: "book-outline" },
  { key: "insights", label: "Insights", icon: "sparkles-outline" },
];

const styles = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  actionWrap: {
    position: "absolute",
    alignItems: "center",
  },
  actionBtn: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowOpacity: 0.3,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 8,
    borderWidth: 2,
    borderColor: '#06b6d4',
  },
  pressed: {
    transform: [{ scale: 0.94 }],
  },
  actionLabel: {
    marginTop: 8,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  bar: {
    position: "absolute",
    left: 14,
    right: 14,
    backgroundColor: "transparent",
  },
  lightPassContainer: {
    ...StyleSheet.absoluteFillObject,
    overflow: 'hidden',
    borderRadius: 22,
  },
  lightPass: {
    height: '100%',
    opacity: 0.6,
  },
  innerRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
  },
  side: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
  },
  separator: {
    width: 1.5,
    height: 36,
    borderRadius: 1,
    opacity: 0.6,
  },
  centerSpacer: {
    width: 90,
  },
  tabBtn: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
  },
  label: {
    marginTop: 6,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.2,
    textTransform: 'lowercase',
  },
  centerBtnWrap: {
    position: "absolute",
    left: "50%",
    transform: [{ translateX: -38 }],
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 99,
  },
  centerBtn: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2.5,
    borderColor: "rgba(255,255,255,0.95)",
    shadowColor: '#A855F7',
    shadowOpacity: 0.8,
    shadowRadius: 15,
    elevation: 12,
  },
  haloOuter: {
    position: "absolute",
    width: 86,
    height: 86,
    borderRadius: 43,
    borderWidth: 2,
    borderStyle: 'dashed',
  },
  haloInner: {
    position: "absolute",
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1,
  },
});
