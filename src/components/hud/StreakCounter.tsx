import { StyleSheet, Text, View } from 'react-native';
import { useStreak } from '@/state/selectors';

export default function StreakCounter() {
  const streak = useStreak();

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Streak</Text>
      <Text style={styles.count}>{streak} days</Text>
      <Text style={styles.helper}>Keep your momentum alive.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#0f172a',
    borderColor: '#1e293b',
    borderWidth: 1,
  },
  label: {
    color: '#94a3b8',
    fontSize: 13,
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  count: {
    color: '#fbbf24',
    fontSize: 28,
    fontWeight: '700',
  },
  helper: {
    color: '#cbd5e1',
    marginTop: 4,
  },
});
