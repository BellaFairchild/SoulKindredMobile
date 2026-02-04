import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Pressable,
  Dimensions,
  FlatList,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useNavigation } from "expo-router";
import { useTheme } from '@/context/AppTheme';
import { useSoulKindred } from "@/state/useSoulKindred";
import { QuantumHeader } from "@/components/nav/QuantumHeader";
import { GlowCard } from "@/components/tools/GlowCard";
import LottieView from "lottie-react-native";

const { width } = Dimensions.get("window");
const CAROUSEL_ITEM_WIDTH = width * 0.75;

const CATEGORIES = ["Popular", "Lake", "Beach", "Nature", "Forest", "Indoor"];

const SCENES = [
  { id: "1", title: "Backyard Firepit", rating: "4.8k+", image: "https://images.unsplash.com/photo-1518331614251-792a39e94bf1?auto=format&fit=crop&q=80&w=600", category: "Nature" },
  { id: "2", title: "Beach Bungalow", rating: "4.9k+", image: "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&q=80&w=600", category: "Beach" },
  { id: "3", title: "Camping", rating: "4.9k+", image: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?auto=format&fit=crop&q=80&w=600", category: "Nature" },
  { id: "4", title: "Cozy Cabin", rating: "5.0k+", image: "https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&q=80&w=600", category: "Indoor" },
  { id: "5", title: "Ancient Temple", rating: "Coming Soon", lottieUrl: "https://lottie.host/06f4e33b-77e9-4ecd-a3a6-dcb4b8ac1f1e/gHPU21JACY.json", category: "Nature" },
  { id: "6", title: "Zen Garden", rating: "Coming Soon", lottieUrl: "https://lottie.host/06f4e33b-77e9-4ecd-a3a6-dcb4b8ac1f1e/gHPU21JACY.json", category: "Nature" },
];

const HERO_SCENES = [
  { id: "h1", image: "https://images.unsplash.com/photo-1544133782-b621fe018ca3?auto=format&fit=crop&q=80&w=800" },
  { id: "h2", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=800" },
  { id: "h3", image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&q=80&w=800" },
  { id: "h4", lottieUrl: "https://lottie.host/06f4e33b-77e9-4ecd-a3a6-dcb4b8ac1f1e/gHPU21JACY.json" },
];

export default function ScenesScreen() {
  const { theme } = useTheme() as any;
  const { displayName, userPhotoUrl } = useSoulKindred();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const isLight = theme.mode === "light";

  const [activeCategory, setActiveCategory] = useState("Popular");
  const [carouselIndex, setCarouselIndex] = useState(0);

  return (
    <View style={[styles.container, { backgroundColor: theme.appBackground }]}>
      <QuantumHeader
        left={
          <View style={styles.headerLeft}>
            <Image
              source={{ uri: userPhotoUrl || "https://api.dicebear.com/7.x/avataaars/svg?seed=John" }}
              style={styles.headerAvatar}
            />
          </View>
        }
        center={
          <Text style={[styles.headerTitle, { color: isLight ? theme.neutralDark : "#FFF", fontFamily: theme.typography.h1 }]}>
            SCENES
          </Text>
        }
        right={
          <Pressable onPress={() => (navigation as any).openDrawer()} style={styles.menuBtn}>
            <Ionicons name="menu" size={24} color={isLight ? theme.neutralDark : "#FFF"} />
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingTop: 100 + insets.top, paddingBottom: 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Greetings */}
        <View style={styles.heroSection}>
          <Text style={[styles.subtitle, { color: isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.5)", fontFamily: theme.typography.main }]}>
            Lets Start On Our Journey, {displayName}
          </Text>
          <Text style={[styles.title, { color: isLight ? theme.neutralDark : "#FFF", fontFamily: theme.typography.h2 }]}>
            I'll Meet You There?
          </Text>
        </View>

        {/* Hero Carousel */}
        <View style={styles.carouselContainer}>
          <FlatList
            data={HERO_SCENES}
            horizontal
            showsHorizontalScrollIndicator={false}
            pagingEnabled
            snapToInterval={CAROUSEL_ITEM_WIDTH + 20}
            snapToAlignment="center"
            decelerationRate="fast"
            contentContainerStyle={{ paddingHorizontal: (width - CAROUSEL_ITEM_WIDTH) / 2 }}
            onMomentumScrollEnd={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / (CAROUSEL_ITEM_WIDTH + 20));
              setCarouselIndex(index);
            }}
            renderItem={({ item }) => (
              <View style={[styles.carouselItem, { width: CAROUSEL_ITEM_WIDTH, backgroundColor: item.lottieUrl ? (isLight ? '#f1f5f9' : '#0f172a') : 'transparent' }]}>
                {item.lottieUrl ? (
                  <LottieView
                    source={{ uri: item.lottieUrl }}
                    autoPlay
                    loop
                    speed={0.5}
                    style={StyleSheet.absoluteFill}
                  />
                ) : (
                  <Image source={{ uri: item.image }} style={styles.carouselImage} />
                )}
              </View>
            )}
            keyExtractor={(item) => item.id}
          />
          {/* Pagination */}
          <View style={styles.pagination}>
            {HERO_SCENES.map((_, i) => (
              <View
                key={i}
                style={[
                  styles.dot,
                  { backgroundColor: i === carouselIndex ? theme.primary : isLight ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.2)" }
                ]}
              />
            ))}
          </View>
        </View>

        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryScroll}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setActiveCategory(cat)}
              style={[
                styles.categoryBtn,
                {
                  backgroundColor: activeCategory === cat ? theme.neutralDark : isLight ? "#FFF" : "rgba(255,255,255,0.05)",
                  borderColor: isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.1)"
                }
              ]}
            >
              <Text style={[
                styles.categoryText,
                { color: activeCategory === cat ? "#FFF" : isLight ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.6)" }
              ]}>
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Scene Grid */}
        <View style={styles.grid}>
          {SCENES.map((scene) => (
            <Pressable key={scene.id} style={styles.gridItem}>
              <GlowCard
                style={styles.sceneCard}
                gradientColors={[theme.primary, theme.secondary]}
              >
                <View style={[StyleSheet.absoluteFill, { backgroundColor: scene.lottieUrl ? (isLight ? '#f1f5f9' : '#0f172a') : 'transparent' }]}>
                  {scene.lottieUrl ? (
                    <LottieView
                      source={{ uri: scene.lottieUrl }}
                      autoPlay
                      loop
                      speed={0.5}
                      style={StyleSheet.absoluteFill}
                    />
                  ) : (
                    <Image source={{ uri: scene.image }} style={styles.sceneImage} />
                  )}
                </View>

                <LinearGradient
                  colors={["transparent", "rgba(0,0,0,0.8)"]}
                  style={styles.sceneOverlay}
                >
                  <Text style={[styles.sceneTitle, { color: "#FFF", fontFamily: theme.typography.h3 }]} numberOfLines={1}>
                    {scene.title}
                  </Text>
                  <View style={styles.ratingRow}>
                    {!scene.lottieUrl && <Ionicons name="star" size={12} color="#F59E0B" />}
                    <Text style={styles.ratingText}>
                      {scene.lottieUrl ? scene.rating : `(${scene.rating})`}
                    </Text>
                  </View>
                </LinearGradient>
              </GlowCard>
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerLeft: {
    width: 42,
    height: 42,
    borderRadius: 21,
    overflow: 'hidden',
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  headerAvatar: {
    width: '100%',
    height: '100%',
  },
  headerTitle: {
    fontSize: 20,
    letterSpacing: 2,
    textAlign: 'center',
    fontWeight: '900',
  },
  menuBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  heroSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  subtitle: {
    fontSize: 15,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  title: {
    fontSize: 32,
    textAlign: 'center',
    lineHeight: 38,
  },
  carouselContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  carouselItem: {
    height: 320,
    borderRadius: 40,
    overflow: 'hidden',
    marginHorizontal: 12,
  },
  carouselImage: {
    width: '100%',
    height: '100%',
  },
  pagination: {
    flexDirection: 'row',
    marginTop: 12,
    gap: 10,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  categoryScroll: {
    paddingBottom: 24,
    gap: 12,
  },
  categoryBtn: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 28,
    borderWidth: 1,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '700',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  gridItem: {
    width: (width - 56) / 2,
    marginBottom: 8,
  },
  sceneCard: {
    padding: 0,
    borderRadius: 28,
    height: 220,
    overflow: 'hidden',
  },
  sceneImage: {
    width: '100%',
    height: '100%',
  },
  sceneOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 12,
    paddingTop: 30,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  sceneTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 10,
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '600',
  },
});
