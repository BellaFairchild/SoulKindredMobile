import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated as RNAnimated, Easing, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAppStore } from '@/state/store';

export default function WelcomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // Animations
  const fadeAnim = useRef(new RNAnimated.Value(0)).current;
  const scaleAnim = useRef(new RNAnimated.Value(0.8)).current;
  const ring1Scale = useRef(new RNAnimated.Value(1)).current;
  const ring1Opacity = useRef(new RNAnimated.Value(0.8)).current;

  useEffect(() => {
    // Entry Animation
    RNAnimated.parallel([
      RNAnimated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      RNAnimated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      })
    ]).start();

    // Pulsing Ring Animation
    const pulse = RNAnimated.loop(
      RNAnimated.parallel([
        RNAnimated.timing(ring1Scale, {
          toValue: 3,
          duration: 3000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        }),
        RNAnimated.timing(ring1Opacity, {
          toValue: 0,
          duration: 3000,
          easing: Easing.out(Easing.ease),
          useNativeDriver: true,
        })
      ])
    );
    pulse.start();

    return () => pulse.stop();
  }, []);

  const handleConnect = () => {
    // Navigate to Identity Setup
    router.push('/settings/identity');
    // Note: In a real flow, we'd have a specific onboarding/setup.tsx
    // For now, we reuse the settings screens, but let's assume we want a wizard feel.
    // Actually, let's just complete onboarding here for the MVP "Cinematic" feel
    // and let them customize later, OR route them through the settings.

    // Let's route to a "Setup" intermediate if we want, or just straight to friend
    // But the user requested "Cinematic Flow".

    // Let's assume hitting "Connect" finalizes the "First Meeting"
    useAppStore.getState().completeOnboarding();
    router.replace('/(drawer)/(tabs)');
  };

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#0f172a', '#1e1b4b', '#020617']}
        style={StyleSheet.absoluteFill}
      />

      <View style={styles.content}>

        {/* Visual Centerpiece */}
        <View style={styles.orbContainer}>
          <RNAnimated.View
            style={[
              styles.ring,
              {
                transform: [{ scale: ring1Scale }],
                opacity: ring1Opacity
              }
            ]}
          />
          <RNAnimated.View
            style={[
              styles.orb,
              {
                opacity: fadeAnim,
                transform: [{ scale: scaleAnim }]
              }
            ]}
          >
            <Ionicons name="sparkles" size={64} color="#FFF" />
          </RNAnimated.View>
        </View>

        {/* Text Content */}
        <RNAnimated.View style={{ opacity: fadeAnim, alignItems: 'center' }}>
          <Text style={styles.title}>Soul Kindred</Text>
          <Text style={styles.subtitle}>Your companion is waiting...</Text>
        </RNAnimated.View>

      </View>

      {/* Bottom Button */}
      <RNAnimated.View
        style={[
          styles.footer,
          {
            paddingBottom: insets.bottom + 40,
            opacity: fadeAnim
          }
        ]}
      >
        <TouchableOpacity style={styles.button} onPress={handleConnect}>
          <Text style={styles.buttonText}>Connect</Text>
          <Ionicons name="arrow-forward" size={20} color="#0f172a" />
        </TouchableOpacity>
      </RNAnimated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orbContainer: {
    width: 120,
    height: 120,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 60,
  },
  orb: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#6366f1', // Indigo-500
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: "#6366f1",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 40,
    elevation: 10,
  },
  ring: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#a5b4fc', // Indigo-300
  },
  title: {
    fontSize: 32,
    fontWeight: '200',
    color: '#FFF',
    letterSpacing: 2,
    marginBottom: 16,
    fontFamily: 'System',
  },
  subtitle: {
    fontSize: 16,
    color: '#94a3b8', // Slate-400
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 40,
  },
  button: {
    backgroundColor: '#FFF',
    height: 64,
    borderRadius: 32,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: "#FFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonText: {
    color: '#0f172a',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    textTransform: 'uppercase',
  }
});
