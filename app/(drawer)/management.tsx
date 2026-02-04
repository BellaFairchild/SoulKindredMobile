import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { requestMicPermission, ensureAudioSession } from '@/utils/permissions';
import { APP_NAME } from '@/utils/constants';

export default function DrawerScreen() {
  const [micGranted, setMicGranted] = useState<boolean | null>(null);

  const handleAudio = async () => {
    const granted = await requestMicPermission();
    await ensureAudioSession();
    setMicGranted(granted);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>App management</Text>
      <Text style={styles.subtitle}>{APP_NAME} settings and quick checks.</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Permissions</Text>
        <TouchableOpacity style={styles.button} onPress={handleAudio}>
          <Text style={styles.buttonLabel}>Request microphone</Text>
        </TouchableOpacity>
        {micGranted !== null && (
          <Text style={styles.status}>
            Microphone: {micGranted ? 'granted' : 'not granted'}
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    gap: 12,
    backgroundColor: '#0b1220',
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
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#22c55e',
    alignItems: 'center',
  },
  buttonLabel: {
    color: '#0b1220',
    fontWeight: '700',
  },
  status: {
    color: '#cbd5e1',
  },
});
