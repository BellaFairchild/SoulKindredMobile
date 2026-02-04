import React, { useState, useEffect } from "react";
import { View, Pressable, StyleSheet, Text, Dimensions, Image, Alert } from "react-native";
import { CabinScene } from "@/components/livingWorld/CabinScene";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { useSoulKindred } from "@/state/useSoulKindred";
import { QuantumHeader } from "@/components/nav/QuantumHeader";
import { useTheme } from '@/context/AppTheme';
import { useAppStore, VaultItem } from "@/state/store";
import DailyDropOverlay from "@/components/overlays/DailyDropOverlay";

const { width, height } = Dimensions.get("window");

export default function Home() {
  console.log("=== HOME SCREEN MOUNTING ===");
  const { theme } = useTheme() as any;
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { rpmGlbUrl, moodKey, displayName, environment } = useSoulKindred();
  const isLight = theme.mode === "light";
  console.log("Home: Theme loaded, displayName:", displayName);

  // Daily Drop Logic
  const isDropAvailable = useAppStore((state) => state.isDropAvailable);
  const claimDailyDrop = useAppStore((state) => state.claimDailyDrop);
  const checkDailyDropReset = useAppStore((state) => state.checkDailyDropReset);

  const [droppedItem, setDroppedItem] = useState<VaultItem | null>(null);
  const [showDropOverlay, setShowDropOverlay] = useState(false);

  useEffect(() => {
    checkDailyDropReset();
  }, []);

  const handleClaimDrop = () => {
    const item = claimDailyDrop();
    if (item) {
      setDroppedItem(item);
      setShowDropOverlay(true);
    } else {
      Alert.alert("Already Claimed", "You have already claimed today's drop. Come back tomorrow!");
    }
  };

  const getBackgroundImage = () => {
    switch (environment) {
      case 'cabin': return require("@/../assets/images/cabin_final.png");
      case 'beach': return { uri: 'https://images.unsplash.com/photo-1548261353-9a008c352a8e?w=800' };
      case 'patio': return { uri: 'https://images.unsplash.com/photo-1596241913256-b5d144579c36?w=800' };
      case 'camping': return { uri: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800' };
      default: return require("@/../assets/images/cabin_final.png");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.appBackground }]}>
      {/* Background Image Layer */}
      <View style={StyleSheet.absoluteFill}>
        <Image
          source={getBackgroundImage()}
          style={[StyleSheet.absoluteFill, { top: 80 }]}
          resizeMode="cover"
        />
        <View style={[StyleSheet.absoluteFill, { backgroundColor: isLight ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.3)" }]} />
      </View>

      {/* 3D Background Scene - DISABLED for Debugging Grey Screen */}
      <View style={StyleSheet.absoluteFill}>
        {/* <CabinScene /> */}
        <View style={{ flex: 1, backgroundColor: theme.primary }} />
      </View>

      {/* Top Header / Bar */}
      <QuantumHeader
        left={
          <View style={[styles.statusContainer, { backgroundColor: isLight ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.1)" }]}>
            <View style={[styles.statusDot, { backgroundColor: getMoodColor(moodKey) }]} />
            <Text style={[styles.statusText, {
              color: isLight ? theme.neutralDark : "#FFFFFF",
              fontFamily: theme.typography.main
            }]}>{moodKey.toUpperCase()}</Text>
          </View>
        }
        right={
          <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
            {/* Streak Counter */}
            <View style={[styles.streakContainer, { backgroundColor: isLight ? "rgba(255,255,255,0.8)" : "rgba(255,255,255,0.1)" }]}>
              <Ionicons name="flame" size={16} color="#F59E0B" style={{ marginRight: 4 }} />
              <Text style={[styles.statusText, { color: isLight ? theme.neutralDark : "#FFFFFF" }]}>{useAppStore(s => s.streak)}</Text>
            </View>

            {isDropAvailable && (
              <Pressable onPress={handleClaimDrop}>
                <LinearGradient
                  colors={['#F59E0B', '#FCD34D']}
                  style={styles.dropButton}
                >
                  <Ionicons name="gift" size={20} color="#fff" />
                </LinearGradient>
              </Pressable>
            )}
            <Pressable
              onPress={() => navigation.openDrawer()}
              style={styles.circleButton}
            >
              <BlurView intensity={20} style={styles.blurCircle}>
                <Ionicons name="menu" size={24} color={isLight ? theme.neutralDark : "#FFFFFF"} />
              </BlurView>
            </Pressable>
          </View>
        }
      />

      {/* Centered Top Text */}
      <View style={styles.topCenterArea}>
        <Text style={[styles.welcomeTitle, { color: "#FFFFFF", fontFamily: theme.typography.h1 }]}>Hello, {displayName}</Text>
        <Text style={[styles.welcomeSubtitle, { color: "rgba(255,255,255,0.9)", fontFamily: theme.typography.h2 }]}>
          {isDropAvailable ? "A spirit gift awaits you." : "Your companion is waiting for you."}
        </Text>
      </View>

      {/* Bottom Interface Area */}
      <View style={[styles.bottomArea, { paddingBottom: insets.bottom + 160 }]}>
        <View style={styles.actionRow}>
          <Pressable
            onPress={() => router.push("/chat")}
            style={styles.mainAction}
          >
            <LinearGradient
              colors={[theme.primary, theme.accent]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.gradientAction}
            >
              <Ionicons name="chatbubbles" size={28} color="#FFFFFF" />
              <Text style={[styles.actionLabel, { fontFamily: theme.typography.button }]}>Chat Now</Text>
            </LinearGradient>
          </Pressable>

          <Pressable
            onPress={() => Alert.alert("Checked In", "Thanks for checking in today! ✨")}
            style={styles.secondaryAction}
          >
            <BlurView intensity={isLight ? 60 : 25} style={[styles.blurAction, { backgroundColor: isLight ? 'rgba(255,255,255,0.7)' : 'rgba(0,0,0,0.4)' }]}>
              <Ionicons name="checkbox-outline" size={24} color={isLight ? theme.neutralDark : "#FFFFFF"} />
              <Text style={[styles.secondaryLabel, { color: isLight ? theme.neutralDark : "#FFFFFF", fontFamily: theme.typography.button }]}>Check-in</Text>
            </BlurView>
          </Pressable>
        </View>
      </View>

      {/* Overlay */}
      <DailyDropOverlay
        visible={showDropOverlay}
        item={droppedItem}
        onClose={() => setShowDropOverlay(false)}
      />
    </View>
  );
}

function getMoodColor(mood: string) {
  switch (mood) {
    case "joy": return "#FFD700";
    case "calm": return "#4CC9F0";
    case "sad": return "#38BDF8"; // Primary
    case "anxious": return "#F922FF"; // Alert
    default: return "#38BDF8";
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  circleButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    overflow: "hidden",
  },
  dropButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: "#F59E0B",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
    elevation: 8,
  },
  blurCircle: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  streakContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    height: 32,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  statusText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 1,
  },
  bottomArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    gap: 20,
  },
  topCenterArea: {
    marginTop: 220, // Lowered text further
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  welcomeTitle: {
    fontSize: 36,
    fontWeight: "800",
    color: "#fff",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  welcomeSubtitle: {
    fontSize: 18,
    color: "rgba(255,255,255,0.8)",
    fontWeight: "500",
  },
  actionRow: {
    flexDirection: "row",
    gap: 16,
  },
  mainAction: {
    flex: 2,
    height: 70,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 10,
    shadowColor: "#F922FF",
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  gradientAction: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  actionLabel: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "700",
  },
  secondaryAction: {
    flex: 1,
    height: 70,
    borderRadius: 20,
    overflow: "hidden",
  },
  blurAction: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  secondaryLabel: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "600",
  },
});
