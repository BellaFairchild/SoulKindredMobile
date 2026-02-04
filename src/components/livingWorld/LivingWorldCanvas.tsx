import { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { moodToColor } from '@/utils/mood';
import { useMood } from '@/state/selectors';

type Props = {
  children: ReactNode;
};

export default function LivingWorldCanvas({ children }: Props) {
  const mood = useMood();
  const accent = moodToColor(mood);

  return (
    <View style={[styles.container, { borderColor: accent }]}>
      {children}
      <View style={[styles.glow, { backgroundColor: accent }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    overflow: 'hidden',
    backgroundColor: '#0b1220',
  },
  glow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 140,
    opacity: 0.08,
    bottom: -120,
    right: -80,
  },
});
