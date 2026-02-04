import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable, Dimensions } from "react-native";
import { useOverlay } from "@/context/OverlayContext";
import { useTheme } from '@/context/AppTheme';
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeIn, FadeInRight, FadeOutLeft } from "react-native-reanimated";

const { width, height } = Dimensions.get("window");

const STEPS = [
  { id: 'setup', title: "Setup", instruction: "Repeat 3 times:", phrase: "“Even though I feel this stress, I deeply and completely accept myself.”", point: "Karate Chop Point" },
  { id: 'eyebrow', title: "Eyebrow", instruction: "Tap gently on the beginning of the eyebrow.", phrase: "“This stress...”", point: "Eyebrow" },
  { id: 'side_eye', title: "Side of Eye", instruction: "Tap on the bone at the side of the eye.", phrase: "“This anxiety...”", point: "Side of Eye" },
  { id: 'under_eye', title: "Under Eye", instruction: "Tap on the bone under the eye.", phrase: "“All this pressure...”", point: "Under Eye" },
  { id: 'under_nose', title: "Under Nose", instruction: "Tap between specific nose and lip point.", phrase: "“I release it now...”", point: "Under Nose" },
  { id: 'chin', title: "Chin", instruction: "Tap on the crease of the chin.", phrase: "“Letting it go...”", point: "Chin" },
  { id: 'collarbone', title: "Collarbone", instruction: "Tap specifically on the collarbone points.", phrase: "“I am safe...”", point: "Collarbone" },
  { id: 'under_arm', title: "Under Arm", instruction: "Tap about 4 inches below the armpit.", phrase: "“I am present...”", point: "Under Arm" },
  { id: 'top_head', title: "Top of Head", instruction: "Tap on the crown of the head.", phrase: "“I deeply accept myself.”", point: "Crown" },
];

export default function TappingOverlay() {
  const { closeOverlay } = useOverlay();
  const { theme } = useTheme() as any;
  const isLight = theme.mode === 'light';

  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const activeStep = STEPS[currentStepIndex];

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
      <BlurView intensity={30} style={StyleSheet.absoluteFill} tint="dark" />
      <LinearGradient
        colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.9)']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.header}>
        <Pressable onPress={closeOverlay} style={styles.closeBtn}>
          <Ionicons name="close-circle" size={32} color="#FFF" />
        </Pressable>
      </View>

      <View style={styles.content}>
        {!isFinished ? (
          <Animated.View
            key={activeStep.id}
            entering={FadeInRight.duration(400)}
            exiting={FadeOutLeft.duration(400)}
            style={styles.stepContainer}
          >
            <Text style={styles.stepCounter}>STEP {currentStepIndex + 1} / {STEPS.length}</Text>

            <View style={styles.focusCircle}>
              <Ionicons name="body" size={64} color={theme.primary} />
              <Text style={styles.pointLabel}>{activeStep.point}</Text>
            </View>

            <Text style={styles.instruction}>{activeStep.instruction}</Text>

            <View style={styles.phraseBox}>
              <Text style={styles.phrase}>{activeStep.phrase}</Text>
            </View>

            <Pressable onPress={handleNext} style={styles.nextBtn}>
              <LinearGradient
                colors={[theme.primary, theme.accent]}
                style={styles.btnGradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.btnText}>NEXT</Text>
                <Ionicons name="arrow-forward" size={24} color="#FFF" />
              </LinearGradient>
            </Pressable>
          </Animated.View>
        ) : (
          <Animated.View entering={FadeIn.duration(600)} style={styles.finishContainer}>
            <Ionicons name="checkmark-circle" size={80} color={theme.accent} />
            <Text style={styles.finishTitle}>Session Complete</Text>
            <Text style={styles.finishSub}>Take a deep breath. Notice how you feel.</Text>

            <View style={styles.finishActions}>
              <Pressable onPress={handleRestart} style={styles.secondaryBtn}>
                <Text style={styles.secondaryBtnText}>Repeat</Text>
              </Pressable>
              <Pressable onPress={closeOverlay} style={styles.primaryBtn}>
                <Text style={styles.primaryBtnText}>Done</Text>
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
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 2,
    marginBottom: 32,
  },
  focusCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    backgroundColor: 'rgba(255,255,255,0.02)',
  },
  pointLabel: {
    color: '#FFF',
    marginTop: 8,
    fontSize: 14,
    fontWeight: '600',
  },
  instruction: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 24,
  },
  phraseBox: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 24,
    borderRadius: 20,
    marginBottom: 40,
    width: '100%',
    alignItems: 'center',
  },
  phrase: {
    color: '#FFF',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 30,
  },
  nextBtn: {
    width: '100%',
    height: 60,
    borderRadius: 30,
    overflow: 'hidden',
  },
  btnGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  btnText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 1,
  },
  // Finish State
  finishContainer: {
    alignItems: 'center',
    width: '100%',
  },
  finishTitle: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 24,
    marginBottom: 12,
  },
  finishSub: {
    color: 'rgba(255,255,255,0.6)',
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
    borderColor: 'rgba(255,255,255,0.2)',
  },
  secondaryBtnText: {
    color: '#FFF',
    fontWeight: '700',
    fontSize: 16,
  },
  primaryBtn: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  primaryBtnText: {
    color: '#000',
    fontWeight: '900',
    fontSize: 16,
  },
});
