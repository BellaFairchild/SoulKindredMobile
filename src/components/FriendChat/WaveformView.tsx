import { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';

export default function WaveformView() {
  const bars = useRef(Array.from({ length: 12 }, () => new Animated.Value(0.3))).current;

  useEffect(() => {
    const animations = bars.map((bar, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(bar, {
            toValue: 1,
            duration: 400 + index * 20,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.quad),
          }),
          Animated.timing(bar, {
            toValue: 0.2,
            duration: 400 + index * 20,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.quad),
          }),
        ]),
      ),
    );
    animations.forEach((anim) => anim.start());
    return () => animations.forEach((anim) => anim.stop());
  }, [bars]);

  return (
    <View style={styles.row}>
      {bars.map((value, idx) => (
        <Animated.View
          key={`bar-${idx}`}
          style={[
            styles.bar,
            {
              opacity: value,
              transform: [{ scaleY: value }],
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    height: 36,
  },
  bar: {
    width: 6,
    height: 18,
    borderRadius: 3,
    backgroundColor: '#22c55e',
  },
});
