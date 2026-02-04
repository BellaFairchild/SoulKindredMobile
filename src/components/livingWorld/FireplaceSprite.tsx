import { Animated, Easing, StyleSheet, View } from 'react-native';
import { useEffect, useRef } from 'react';

export default function FireplaceSprite() {
  const flicker = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(flicker, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
        Animated.timing(flicker, {
          toValue: 0.6,
          duration: 900,
          useNativeDriver: true,
          easing: Easing.inOut(Easing.quad),
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [flicker]);

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.flame, { opacity: flicker }]} />
      <View style={styles.base} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    gap: 6,
  },
  flame: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: '#f97316',
    shadowColor: '#f97316',
    shadowOpacity: 0.45,
    shadowRadius: 16,
  },
  base: {
    width: 80,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1e293b',
  },
});
