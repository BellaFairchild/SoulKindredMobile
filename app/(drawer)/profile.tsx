import React, { useState } from 'react';
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  Pressable,
  TextInput,
  Switch,
  Dimensions,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

import { useSoulKindred } from '@/state/useSoulKindred';
import { useAuth } from '@/auth/useAuth';
import { useStreak, useAffirmations } from '@/state/selectors';
import { QuantumHeader } from '@/components/nav/QuantumHeader';
import { useTheme } from '@/context/AppTheme';
import { useAppStore } from '@/state/store';

const { width } = Dimensions.get('window');

export default function ProfileScreen() {
  const { theme } = useTheme() as any;
  const isLight = theme.mode === 'light';
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { displayName, userPhotoUrl, setUser } = useSoulKindred();
  const { user, logout } = useAuth();
  const streak = useStreak();
  const affirmations = useAffirmations();
  const level = useAppStore(state => state.level);
  const resonance = useAppStore(state => state.resonance);

  const [nickname, setNickname] = useState(displayName);
  const [notifications, setNotifications] = useState(true);

  const handleSave = () => {
    setUser({ name: nickname });
    // In a real app, you'd sync with backend here
    router.back();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.appBackground }]}>
      <LinearGradient
        colors={isLight ? theme.chatGradient : ['#0f172a', '#020617']}
        style={StyleSheet.absoluteFill}
      />

      <QuantumHeader
        left={
          <Pressable onPress={() => router.back()} style={styles.headerBtn}>
            <Ionicons name="chevron-back" size={24} color={isLight ? "#1A202C" : "#FFFFFF"} />
          </Pressable>
        }
        center={<Text style={[styles.headerTitle, { color: isLight ? "#1A202C" : "#FFFFFF" }]}>My Profile</Text>}
        right={
          <Pressable onPress={handleSave} style={styles.saveBtn}>
            <Text style={[styles.saveText, { color: theme.primary, fontFamily: theme.typography.button }]}>SAVE</Text>
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar Section */}
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <LinearGradient
              colors={[theme.primary, theme.accent]}
              style={styles.avatarGlow}
            >
              <View style={styles.avatarInner}>
                {userPhotoUrl ? (
                  <Image source={{ uri: userPhotoUrl }} style={styles.avatarImage} />
                ) : (
                  <View style={styles.avatarPlaceholder}>
                    <Text style={styles.avatarInitial}>{nickname[0] || '?'}</Text>
                  </View>
                )}
              </View>
            </LinearGradient>
            <Pressable style={styles.editBtn}>
              <LinearGradient colors={[theme.alert, theme.accent]} style={styles.editGradient}>
                <Ionicons name="camera" size={16} color="#fff" />
              </LinearGradient>
            </Pressable>
          </View>
          <Text style={[styles.userName, { color: isLight ? '#1A202C' : '#FFFFFF', fontFamily: theme.typography.h1 }]}>{nickname}</Text>
          <View style={[styles.badgeContainer, { backgroundColor: `${theme.alert}15` }]}>
            <Ionicons name="sparkles" size={14} color={theme.alert} />
            <Text style={[styles.badgeText, { color: theme.alert, fontFamily: theme.typography.h3 }]}>Premium Member</Text>
          </View>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <StatCard value={streak.toString()} label="Streak" color={theme.alert} />
          <StatCard value={level.toString()} label="Soul Level" color={theme.primary} />
          <StatCard value={resonance.toString()} label="Resonance" color={theme.secondary} />
        </View>

        {/* About You Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isLight ? theme.neutralDark : '#FFFFFF', fontFamily: theme.typography.h2 }]}>About You</Text>
          <BlurView intensity={isLight ? 40 : 10} style={[styles.sectionCard, { backgroundColor: isLight ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.03)' }]}>
            <InputRow
              label="Nickname"
              value={nickname}
              onChangeText={setNickname}
              icon="person-outline"
              subtext="This is what your companion will call you."
              theme={theme}
              isLight={isLight}
            />
            <InputRow
              label="Account Email"
              value={user?.email || ''}
              editable={false}
              icon="mail-outline"
              theme={theme}
              isLight={isLight}
            />
            <InputRow
              label="Mobile Number"
              placeholder="+1 (555) 123-4567"
              icon="call-outline"
              subtext="For emergency notifications and account security."
              theme={theme}
              isLight={isLight}
            />
            <InputRow
              label="Birthday"
              placeholder="mm/dd/yyyy"
              icon="calendar-outline"
              showArrow
              theme={theme}
              isLight={isLight}
            />
          </BlurView>
        </View>

        {/* Account & Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isLight ? theme.neutralDark : '#FFFFFF', fontFamily: theme.typography.h2 }]}>Account & Settings</Text>
          <BlurView intensity={isLight ? 40 : 10} style={[styles.sectionCard, { backgroundColor: isLight ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.03)' }]}>
            <SettingRow
              label="Subscription Plan"
              sublabel="Manage your premium access"
              icon="card-outline"
              iconBg="rgba(94, 213, 255, 0.1)"
              iconColor="#5ED5FF"
              showArrow
              theme={theme}
              isLight={isLight}
            />
            <View style={styles.divider} />
            <SettingRow
              label="Notifications"
              sublabel="Daily nudges & messages"
              icon="notifications-outline"
              iconBg="rgba(34, 197, 94, 0.1)"
              iconColor="#22C55E"
              theme={theme}
              isLight={isLight}
            >
              <Switch
                value={notifications}
                onValueChange={setNotifications}
                trackColor={{ false: isLight ? '#cbd5e1' : '#1e293b', true: '#22C55E' }}
                thumbColor={Platform.OS === 'ios' ? '#fff' : notifications ? '#fff' : isLight ? '#94a3b8' : '#475569'}
              />
            </SettingRow>
            <View style={styles.divider} />
            <SettingRow
              label="Privacy & Data"
              sublabel="Control your memory data"
              icon="shield-checkmark-outline"
              iconBg="rgba(249, 34, 255, 0.1)"
              iconColor="#F922FF"
              showArrow
              theme={theme}
              isLight={isLight}
            />
            <View style={styles.divider} />
            <SettingRow
              label="Log Out"
              onPress={logout}
              icon="log-out-outline"
              iconBg="rgba(225, 29, 72, 0.1)"
              iconColor="#E11D48"
              theme={theme}
              isLight={isLight}
            />
          </BlurView>
        </View>

        <Pressable style={styles.deleteBtn}>
          <Text style={styles.deleteText}>Delete Account</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function StatCard({ value, label, color }: { value: string; label: string; color: string }) {
  const { theme } = useTheme() as any;
  const isLight = theme.mode === 'light';
  return (
    <BlurView intensity={isLight ? 40 : 15} style={[styles.statCard, { backgroundColor: isLight ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.03)' }]}>
      <Text style={[styles.statValue, { color, fontFamily: theme.typography.h1 }]}>{value}</Text>
      <Text style={[styles.statLabel, { color: isLight ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255,255,255,0.4)', fontFamily: theme.typography.h3 }]}>{label}</Text>
    </BlurView>
  );
}

function InputRow({ label, value, placeholder, onChangeText, icon, subtext, editable = true, showArrow, theme, isLight }: any) {
  return (
    <View style={styles.inputRow}>
      <Text style={[styles.inputLabel, { color: isLight ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255,255,255,0.4)', fontFamily: theme.typography.h3 }]}>{label}</Text>
      <View style={[
        styles.inputField,
        !editable && styles.disabledInput,
        {
          backgroundColor: isLight ? 'rgba(0,0,0,0.02)' : 'rgba(255,255,255,0.03)',
          borderColor: isLight ? `${theme.accent}60` : `${theme.alert}80`,
          borderWidth: 1.5,
        }
      ]}>
        <Ionicons name={icon} size={20} color={isLight ? theme.accent : 'rgba(255,255,255,0.4)'} style={styles.inputIcon} />
        <TextInput
          style={[styles.input, { color: isLight ? theme.neutralDark : '#fff', fontFamily: theme.typography.main }]}
          value={value}
          placeholder={placeholder}
          placeholderTextColor={isLight ? "rgba(30, 41, 59, 0.3)" : "rgba(255,255,255,0.3)"}
          onChangeText={onChangeText}
          editable={editable}
        />
        {showArrow && <Ionicons name="calendar-clear-outline" size={20} color={isLight ? theme.accent : 'rgba(255,255,255,0.4)'} />}
      </View>
      {subtext && <Text style={[styles.inputSubtext, { color: isLight ? 'rgba(30, 41, 59, 0.5)' : 'rgba(255,255,255,0.3)', fontFamily: theme.typography.main }]}>{subtext}</Text>}
    </View>
  );
}

function SettingRow({ label, sublabel, icon, iconBg, iconColor, showArrow, onPress, children, theme, isLight }: any) {
  return (
    <Pressable style={styles.settingRow} onPress={onPress}>
      <View style={[styles.settingIconWrap, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>
      <View style={styles.settingTextWrap}>
        <Text style={[styles.settingLabel, { color: isLight ? theme.neutralDark : '#fff', fontFamily: theme.typography.h3 }]}>{label}</Text>
        {sublabel && <Text style={[styles.settingSublabel, { color: isLight ? 'rgba(30, 41, 59, 0.6)' : 'rgba(255,255,255,0.4)', fontFamily: theme.typography.main }]}>{sublabel}</Text>}
      </View>
      {children}
      {showArrow && <Ionicons name="chevron-forward" size={20} color={isLight ? 'rgba(30, 41, 59, 0.3)' : 'rgba(255,255,255,0.2)'} />}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBtn: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: -0.5,
  },
  saveBtn: {
    backgroundColor: 'rgba(94, 213, 255, 0.1)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  saveText: {
    color: '#5ED5FF',
    fontWeight: '900',
    fontSize: 12,
    letterSpacing: 1,
  },
  scrollContent: {
    paddingTop: 100, // accommodate Absolute QuantumHeader if needed, though QuantumHeader manages its own space if used in standard way. Here it's absolute.
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 20,
  },
  avatarGlow: {
    width: 140,
    height: 140,
    borderRadius: 70,
    padding: 3,
  },
  avatarInner: {
    flex: 1,
    borderRadius: 67,
    backgroundColor: '#0f172a',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  avatarPlaceholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1e293b',
  },
  avatarInitial: {
    color: '#fff',
    fontSize: 54,
    fontWeight: '900',
  },
  editBtn: {
    position: 'absolute',
    bottom: 0,
    right: 5,
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 3,
    borderColor: '#020617',
    overflow: 'hidden',
  },
  editGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 8,
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(249, 34, 255, 0.08)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: '#F922FF',
    fontSize: 12,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    gap: 12,
    marginBottom: 40,
  },
  statCard: {
    flex: 1,
    height: 90,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '900',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 12,
    fontWeight: '700',
    marginTop: 2,
  },
  section: {
    paddingHorizontal: 24,
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    marginBottom: 16,
    paddingLeft: 4,
  },
  sectionCard: {
    borderRadius: 28,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
    overflow: 'hidden',
    padding: 20,
    gap: 20,
  },
  inputRow: {
    gap: 8,
  },
  inputLabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    fontWeight: '700',
    paddingLeft: 4,
  },
  inputField: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 18,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
  },
  inputSubtext: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 11,
    paddingLeft: 4,
  },
  disabledInput: {
    opacity: 0.6,
  },
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  settingIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  settingTextWrap: {
    flex: 1,
  },
  settingLabel: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  settingSublabel: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginLeft: 60,
  },
  deleteBtn: {
    alignItems: 'center',
    marginTop: 10,
  },
  deleteText: {
    color: '#E11D48',
    fontSize: 14,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});
