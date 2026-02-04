import { useEffect, useRef, useState } from 'react';
import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useAffirmations } from '@/state/selectors';

type AffirmationsTickerProps = {
  affirmations?: string[];
  onAdd?: (text: string) => void;
};

const rotation = ['15deg', '-10deg', '8deg', '-6deg'];

export default function AffirmationsTicker({ affirmations, onAdd }: AffirmationsTickerProps) {
  const stored = useAffirmations();
  const items = affirmations?.length ? affirmations : stored;
  const [index, setIndex] = useState(0);
  const fade = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const interval = setInterval(() => {
      Animated.sequence([
        Animated.timing(fade, { toValue: 0, duration: 200, useNativeDriver: true }),
        Animated.timing(fade, { toValue: 1, duration: 200, useNativeDriver: true }),
      ]).start();
      setIndex((prev) => (prev + 1) % items.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [fade, items.length]);

  const handleAdd = () => {
    const next = 'You are right where you need to be.';
    onAdd?.(next);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.card,
          {
            opacity: fade,
            transform: [
              { rotate: rotation[index % rotation.length] },
              { translateY: 2 },
            ],
          },
        ]}
      >
        <Text style={styles.label}>Affirmation</Text>
        <Text style={styles.text}>{items[index]}</Text>
      </Animated.View>
      {onAdd && (
        <TouchableOpacity onPress={handleAdd} style={styles.addButton}>
          <Text style={styles.addText}>+</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#0f172a',
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 6 },
  },
  label: {
    color: '#94a3b8',
    marginBottom: 4,
    fontSize: 12,
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  text: {
    color: '#f8fafc',
    fontSize: 16,
    lineHeight: 22,
  },
  addButton: {
    position: 'absolute',
    right: 12,
    top: -10,
    height: 32,
    width: 32,
    borderRadius: 16,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22c55e',
    shadowOpacity: 0.4,
    shadowRadius: 8,
  },
  addText: {
    color: '#0f172a',
    fontSize: 20,
    fontWeight: '700',
  },
});
