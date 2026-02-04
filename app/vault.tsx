import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useAffirmations, useStreak } from '@/state/selectors';
import { fetchEntitlement, fetchOfferings, Offering } from '@/services/revenuecat';
import { useTheme } from '@/context/AppTheme';

export default function VaultScreen() {
  const streak = useStreak();
  const affirmations = useAffirmations();
  const { theme } = useTheme() as any;
  const isLight = theme.mode === 'light';
  const [offerings, setOfferings] = useState<Offering[]>([]);
  const [entitlement, setEntitlement] = useState('inactive');

  useEffect(() => {
    fetchOfferings().then(setOfferings);
    fetchEntitlement().then(setEntitlement);
  }, []);

  return (
    <ScrollView contentContainerStyle={[styles.container, { backgroundColor: theme.appBackground }]}>
      <Text style={[styles.title, { color: isLight ? theme.neutralDark : '#FFFFFF', fontFamily: theme.typography.h1 }]}>Vault</Text>
      <Text style={[styles.subtitle, { color: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.6)', fontFamily: theme.typography.main }]}>Progress, reflections, and entitlements.</Text>

      <View style={[styles.card, { backgroundColor: isLight ? '#FFFFFF' : 'rgba(255,255,255,0.05)', borderColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)' }]}>
        <Text style={[styles.cardTitle, { color: isLight ? theme.neutralDark : '#FFFFFF', fontFamily: theme.typography.h2 }]}>Streak</Text>
        <Text style={[styles.value, { color: isLight ? 'rgba(0,0,0,0.6)' : '#cbd5e1', fontFamily: theme.typography.main }]}>{streak} days logged</Text>
      </View>

      <View style={[styles.card, { backgroundColor: isLight ? '#FFFFFF' : 'rgba(255,255,255,0.05)', borderColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)' }]}>
        <Text style={[styles.cardTitle, { color: isLight ? theme.neutralDark : '#FFFFFF', fontFamily: theme.typography.h2 }]}>Saved affirmations</Text>
        {affirmations.map((affirmation, idx) => (
          <Text key={`${affirmation}-${idx}`} style={[styles.affirmation, { color: isLight ? 'rgba(0,0,0,0.6)' : '#cbd5e1', fontFamily: theme.typography.main }]}>
            - {affirmation}
          </Text>
        ))}
      </View>

      <View style={[styles.card, { backgroundColor: isLight ? '#FFFFFF' : 'rgba(255,255,255,0.05)', borderColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.1)' }]}>
        <Text style={[styles.cardTitle, { color: isLight ? theme.neutralDark : '#FFFFFF', fontFamily: theme.typography.h2 }]}>Access</Text>
        <Text style={[styles.value, { color: isLight ? 'rgba(0,0,0,0.6)' : '#cbd5e1', fontFamily: theme.typography.main }]}>
          Entitlement: <Text style={[styles.highlight, { fontFamily: theme.typography.h3 }]}>{entitlement}</Text>
        </Text>
        {offerings.map((offer) => (
          <View key={offer.id} style={styles.offer}>
            <Text style={[styles.offerTitle, { color: isLight ? theme.neutralDark : '#FFFFFF', fontFamily: theme.typography.h3 }]}>{offer.title}</Text>
            <Text style={[styles.offerDesc, { color: isLight ? 'rgba(0,0,0,0.6)' : '#cbd5e1', fontFamily: theme.typography.main }]}>{offer.description}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
    minHeight: '100%',
  },
  title: {
    color: '#e2e8f0',
    fontSize: 24,
    fontWeight: '800',
  },
  subtitle: {
    color: '#94a3b8',
  },
  card: {
    padding: 16,
    borderRadius: 16,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    gap: 8,
  },
  cardTitle: {
    color: '#e2e8f0',
    fontWeight: '700',
  },
  value: {
    color: '#cbd5e1',
  },
  affirmation: {
    color: '#cbd5e1',
  },
  highlight: {
    color: '#22c55e',
    fontWeight: '700',
  },
  offer: {
    marginTop: 6,
  },
  offerTitle: {
    color: '#e2e8f0',
    fontWeight: '700',
  },
  offerDesc: {
    color: '#cbd5e1',
  },
});
