import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { useOverlay } from "@/context/OverlayContext";
import { useTheme } from '@/context/AppTheme';
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  FadeIn,
  FadeInUp,
  FadeOutDown,
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing
} from "react-native-reanimated";

const { width } = Dimensions.get("window");

const STEPS = [
  { id: 'head', title: "Crown & Forehead", instruction: "Soften your forehead. Release any tension in your temples.", icon: "happy-outline" },
  { id: 'jaw', title: "Jaw & Neck", instruction: "Unclench your jaw. Let your tongue rest gently.", icon: "chatbubble-ellipses-outline" },
  { id: 'shoulders', title: "Shoulders", instruction: "Drop your shoulders away from your ears. Let gravity do the work.", icon: "shirt-outline" },
  { id: 'arms', title: "Arms & Hands", instruction: "Feel the weight of your arms. Open your palms.", icon: "hand-left-outline" },
  { id: 'chest', title: "Chest & Heart", instruction: "Breathe into your chest. Feel it expand and soften.", icon: "heart-outline" },
  { id: 'stomach', title: "Stomach", instruction: "Soften your belly. Let go of any holding.", icon: "water-outline" },
  { id: 'legs', title: "Legs & Feet", instruction: "Feel your connection to the ground. Rooted and safe.", icon: "footsteps-outline" },
  { id: 'full', title: "Full Body", instruction: "Feel your entire body as one cohesive, relaxed whole.", icon: "body-outline" },
];

export default function BodyOverlay() {
  const { closeOverlay } = useOverlay();
  const { theme } = useTheme() as any;

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const activeStep = STEPS[currentStepIndex];

  // Pulsing Animation for Breath
  const scale = useSharedValue(1);

  useEffect(() => {
    scale.value = withRepeat(
      withTiming(1.1, { duration: 3000, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedCircleStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }]
  }));

  const handleNext = () => {
    if (currentStepIndex < STEPS.length - 1) {
      setCurrentStepIndex(prev => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentStepIndex(0);
    setIsFinished(false);
  };

  return (
    <View style={styles.container}>
      <BlurView intensity={40} style={StyleSheet.absoluteFill} tint="light" />
      <LinearGradient
        colors={['rgba(255,255,255,0.9)', 'rgba(230,240,255,0.95)']} // Light airy theme
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <Pressable onPress={closeOverlay} style={styles.closeBtn}>
          <Ionicons name="close-circle" size={32} color={theme.neutralDark} />
        </Pressable>
      </View>

      <View style={styles.content}>
        {!isFinished ? (
          <Animated.View
            key={activeStep.id}
            entering={FadeInUp.duration(500)}
            exiting={FadeOutDown.duration(400)}
            style={styles.stepContainer}
          >
            <Text style={[styles.stepCounter, { color: theme.secondary }]}>ZONE {currentStepIndex + 1} / {STEPS.length}</Text>

            <Animated.View style={[styles.focusCircle, animatedCircleStyle]}>
              <Ionicons name={activeStep.icon as any} size={80} color={theme.primary} />
            </Animated.View>

            <Text style={[styles.title, { color: theme.neutralDark }]}>{activeStep.title}</Text>
            <Text style={[styles.instruction, { color: theme.neutralDark }]}>{activeStep.instruction}</Text>

            <Pressable onPress={handleNext} style={styles.nextBtn}>
              <LinearGradient
                colors={[theme.primary, theme.accent]}
                style={styles.btnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.btnText}>BREATHE & NEXT</Text>
              </LinearGradient>
            </Pressable>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeIn.duration(600)} style={styles.finishContainer}>
            <Ionicons name="leaf" size={80} color={theme.primary} />
            <Text style={[styles.finishTitle, { color: theme.neutralDark }]}>Body Scan Complete</Text>
            <Text style={[styles.finishSub, { color: theme.secondary }]}>Carry this awareness with you.</Text>

            <View style={styles.finishActions}>
              <Pressable onPress={handleRestart} style={[styles.secondaryBtn, { borderColor: theme.neutralDark }]}>
                <Text style={[styles.secondaryBtnText, { color: theme.neutralDark }]}>Repeat</Text>
              </Pressable>
              <Pressable onPress={closeOverlay} style={[styles.primaryBtn, { backgroundColor: theme.neutralDark }]}>
                <Text style={styles.primaryBtnText}>Finish</Text>
              </Pressable>
            </View>
          </Animated.View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    position: 'absolute',
    top: 60,
    right: 20,
    zIndex: 1001,
  },
  closeBtn: {
    padding: 8,
  },
  content: {
    width: width,
    paddingHorizontal: 32,
    alignItems: 'center',
  },
  stepContainer: {
    width: '100%',
    alignItems: 'center',
  },
  stepCounter: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 40,
  },
  focusCircle: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: '#4CC9F0',
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 16,
    textAlign: 'center',
  },
  instruction: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 60,
    lineHeight: 28,
    opacity: 0.8,
  },
  nextBtn: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  btnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  btnText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 1,
  },
  // Finish
  finishContainer: {
    alignItems: 'center',
    width: '100%',
  },
  finishTitle: {
    fontSize: 28,
    fontWeight: '900',
    marginTop: 24,
    marginBottom: 12,
  },
  finishSub: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  finishActions: {
    flexDirection: 'row',
    gap: 16,
    width: '100%',
  },
  secondaryBtn: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  secondaryBtnText: {
    fontWeight: '700',
    fontSize: 16,
  },
  primaryBtn: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryBtnText: {
    color: '#FFF',
    fontWeight: '900',
    fontSize: 16,
  },
});
