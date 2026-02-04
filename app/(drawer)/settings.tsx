import React from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '@/auth/useAuth';

import { useRouter } from 'expo-router';
import { restorePurchases } from '@/services/revenuecat';
import { Alert } from 'react-native';

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();
  const router = useRouter();

  const handleRestore = async () => {
    const success = await restorePurchases();
    if (success) {
      Alert.alert('Success', 'Your purchases have been restored.');
    } else {
      Alert.alert('Notice', 'No active subscriptions found to restore.');
    }
  };

  const SettingItem = ({ icon, label, onPress, destructive = false }: any) => (
    <TouchableOpacity onPress={onPress}>
      <BlurView intensity={10} style={styles.item}>
        <View style={styles.itemLeft}>
          <Ionicons name={icon} size={22} color={destructive ? '#ff4d4d' : '#4CC9F0'} />
          <Text style={[styles.itemLabel, destructive && { color: '#ff4d4d' }]}>{label}</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="rgba(255,255,255,0.3)" />
      </BlurView>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0f172a', '#020617']} style={StyleSheet.absoluteFill} />

      <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
        <Text style={styles.title}>Settings</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <SettingItem icon="notifications-outline" label="Notifications" />
          <SettingItem icon="moon-outline" label="Quiet Hours" />
          <SettingItem icon="color-palette-outline" label="Theme" />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Membership</Text>
          <SettingItem icon="star-outline" label="Upgrade to Premium" onPress={() => router.push('/paywall')} />
          <SettingItem icon="card-outline" label="Manage Subscription" onPress={() => router.push('/customer-center')} />
          <SettingItem icon="refresh-outline" label="Restore Purchases" onPress={handleRestore} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Legal</Text>
          <SettingItem icon="document-text-outline" label="Privacy Policy" onPress={() => router.push('/legal/privacy')} />
          <SettingItem icon="shield-checkmark-outline" label="Terms of Service" onPress={() => router.push('/legal/terms')} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <SettingItem icon="log-out-outline" label="Sign Out" onPress={logout} destructive />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617',
  },
  header: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  title: {
    color: '#fff',
    fontSize: 34,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 32,
    gap: 12,
  },
  sectionTitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1.5,
    marginBottom: 8,
    marginLeft: 4,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 18,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  itemLabel: {
    color: '#e2e8f0',
    fontSize: 16,
    fontWeight: '600',
  },
});
