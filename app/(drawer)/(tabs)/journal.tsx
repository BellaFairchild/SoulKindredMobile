import React, { useState, useMemo } from 'react';
import {
  Text,
  View,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Dimensions,
  Image,
  Platform,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Svg, { Path, Circle } from 'react-native-svg';

import { QuantumHeader } from "@/components/nav/QuantumHeader";
import { useTheme } from '@/context/AppTheme';
import { useSoulKindred } from '@/state/useSoulKindred';
import { useStreak } from '@/state/selectors';
import { useAppStore } from '@/state/store';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM_MARGIN } from '@/constants/layout';
import { GlowCard } from '@/components/tools/GlowCard';
import { AffirmationTicker } from '@/components/tools/AffirmationTicker';
import { useVoiceRecorder } from '@/hooks/useVoiceRecorder';

const { width } = Dimensions.get('window');

const MOODS = [
  { icon: 'sad-outline', color: '#64748b' },
  { icon: 'remove-circle-outline', color: '#94a3b8' },
  { icon: 'happy-outline', color: '#A855F7' }, // Adjusted to match generic set
  { icon: 'happy-outline', color: '#F472B6' },
  { icon: 'heart-outline', color: '#EC4899' },
];

export default function JournalScreen() {
  const { theme } = useTheme() as any;
  const isLight = theme.mode === "light";
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // Voice Recorder
  const { isRecording, isProcessing, startRecording, stopRecording } = useVoiceRecorder();

  const handleMicPress = async () => {
    if (isRecording) {
      const text = await stopRecording();
      if (text) {
        setReflection(prev => prev + (prev ? ' ' : '') + text);
      }
    } else {
      await startRecording();
    }
  };

  const { displayName, rpmIconUrl } = useSoulKindred();
  const streak = useStreak();
  const addToVault = useAppStore((state) => state.addToVault);
  const logMood = useAppStore((state) => state.logMood);

  const [mood, setMood] = useState(2);
  const [reflection, setReflection] = useState('');
  const [gratitudes, setGratitudes] = useState(['', '', '']);
  const [isSaving, setIsSaving] = useState(false);

  const MOODS_DATA = useMemo(() => [
    { label: 'Sad', emoji: '😔', color: isLight ? '#94A3B8' : '#475569' },
    { label: 'Neutral', emoji: '😐', color: isLight ? '#64748B' : '#94A3B8' },
    { label: 'Calm', emoji: '🙂', color: theme.accent },
    { label: 'Happy', emoji: '😊', color: theme.primary },
    { label: 'Inspired', emoji: '✨', color: theme.alert },
  ], [isLight, theme]);

  const greeting = useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  }, []);

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  const handleSave = () => {
    if (!reflection.trim()) return;

    setIsSaving(true);

    // Log Mood History
    logMood(mood);

    // Construct Vault Item
    const selectedMood = MOODS_DATA[mood];

    addToVault({
      id: Date.now().toString(),
      type: 'journal',
      title: 'Daily Journal',
      content: reflection,
      date: new Date().toISOString(),
      mood: selectedMood.label,
      moodColor: selectedMood.color,
      tags: ['#Journal', ...gratitudes.filter(g => g.trim()).map(g => `#${g.trim().replace(/\s+/g, '')}`)]
    });

    setIsSaving(false);
    setReflection('');
    setGratitudes(['', '', '']);
    // Navigate to Vault to show result, or just back
    router.push('/(drawer)/vault');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.appBackground }]}>
      <LinearGradient
        colors={isLight ? theme.chatGradient : ['#1E293B', '#0F172A']}
        style={StyleSheet.absoluteFill}
      />

      <QuantumHeader
        left={
          <Pressable onPress={() => router.back()} style={styles.headerBtn}>
            <Ionicons name="chevron-back" size={24} color={isLight ? "#1A202C" : "#FFFFFF"} />
          </Pressable>
        }
        center={<Text style={[styles.headerTitle, { color: isLight ? "#1A202C" : "#FFFFFF" }]}>JOURNAL</Text>}
        right={
          <Pressable style={styles.headerBtn}>
            <Ionicons name="calendar-outline" size={22} color={isLight ? "#1A202C" : "#FFFFFF"} />
            <View style={[styles.notifDot, { borderColor: theme.appBackground }]} />
          </Pressable>
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 130, paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_MARGIN + insets.bottom + 40 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Daily Affirmation Ticker */}
        <AffirmationTicker />

        {/* Hero Greeting */}
        <View style={styles.hero}>
          <Text style={[styles.dateText, { color: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)', fontFamily: theme.typography.h3 }]}>{today}</Text>
          <Text style={[styles.greetingText, { color: isLight ? '#1A202C' : '#FFFFFF', fontFamily: theme.typography.h1 }]}>
            {greeting}, {displayName === 'You' ? 'Soul' : displayName}
          </Text>
          <Text style={[styles.quoteText, { color: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)', fontFamily: theme.typography.main }]}>
            "Growth begins when we start to check in with ourselves."
          </Text>
        </View>

        {/* Mood Selector */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: isLight ? '#1A202C' : '#FFFFFF', fontFamily: theme.typography.h2 }]}>How are you feeling?</Text>
            <View style={[styles.streakBadge, { borderColor: `${theme.secondary}40` }]}>
              <Text style={[styles.streakText, { color: theme.secondary, fontFamily: theme.typography.h3 }]}>Streak: {streak} Days 🔥</Text>
            </View>
          </View>
          <View style={styles.moodRow}>
            {MOODS_DATA.map((m, idx) => (
              <Pressable key={idx} onPress={() => setMood(idx)} style={styles.moodItem}>
                {idx === mood ? (
                  <LinearGradient colors={[theme.accent, theme.alert]} style={styles.moodActiveGlow}>
                    <Text style={{ fontSize: 32 }}>{m.emoji}</Text>
                  </LinearGradient>
                ) : (
                  <Text style={{ fontSize: 28, opacity: isLight ? 0.35 : 0.6 }}>{m.emoji}</Text>
                )}
              </Pressable>
            ))}
          </View>
          <Text style={[styles.subHint, { color: isLight ? 'rgba(30, 41, 59, 0.4)' : 'rgba(255,255,255,0.2)' }]}>Select an emoji to log your mood</Text>
        </View>

        {/* Insight Card */}
        <GlowCard isLight={isLight}>
          <View style={styles.insightHeader}>
            <View style={styles.avatarMini}>
              {rpmIconUrl ? (
                <Image source={{ uri: rpmIconUrl }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person-circle" size={32} color={theme.primary} />
              )}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.insightLabel, { color: theme.accent, fontFamily: theme.typography.h3 }]}>Soul Kindred Remembers:</Text>
              <Text style={[styles.insightContent, { color: isLight ? '#1A202C' : '#FFFFFF', fontFamily: theme.typography.main }]}>
                "Yesterday you mentioned feeling anxious about the presentation. Since you're feeling better today, did it go well?"
              </Text>
            </View>
          </View>
        </GlowCard>

        {/* Integrated Reflection Area */}
        <View style={styles.section}>
          <GlowCard isLight={isLight}>
            <View style={styles.cardHeader}>
              <Text style={[styles.sectionTitle, { color: isLight ? '#1A202C' : '#FFFFFF', marginBottom: 4, fontFamily: theme.typography.h2 }]}>Today's Reflection</Text>
              <Text style={[styles.sectionSub, { color: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)', fontFamily: theme.typography.main }]}>
                What was the most meaningful part of your day?
              </Text>
            </View>

            <View style={[styles.reflectionInputArea, { backgroundColor: isLight ? '#FFFFFF' : 'rgba(255,255,255,0.05)', borderRadius: 20, margin: 12 }]}>
              <TextInput
                style={[styles.reflectionInput, { color: isLight ? '#1A202C' : '#FFFFFF', padding: 16, fontFamily: theme.typography.main }]}
                placeholder="Start writing here..."
                placeholderTextColor={isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)"}
                multiline
                value={reflection}
                onChangeText={setReflection}
              />

              {/* Internal Action Buttons */}
              <View style={styles.internalActions}>
                <Pressable style={styles.internalBtn} onPress={handleMicPress}>
                  <LinearGradient
                    colors={isRecording ? ['#EF4444', '#DC2626'] : (isProcessing ? ['#F59E0B', '#D97706'] : [theme.primary, theme.accent])}
                    style={styles.sideBtnGradient}
                  >
                    <Ionicons name={isRecording ? "stop" : (isProcessing ? "ellipsis-horizontal" : "mic")} size={24} color="#fff" />
                  </LinearGradient>
                </Pressable>
                <Pressable style={styles.internalBtn} onPress={handleSave}>
                  <LinearGradient colors={[theme.alert, theme.accent]} style={styles.sideBtnGradient}>
                    {isSaving ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name="checkmark" size={24} color="#fff" />}
                  </LinearGradient>
                </Pressable>
              </View>
            </View>

            <View style={styles.cardFooter}>
              <View style={styles.tagRow}>
                <Tag label="#Work" isLight={isLight} />
                <Tag label="#Family" isLight={isLight} />
                <Tag label="#Anxiety" isLight={isLight} />
                <Pressable style={[styles.addTag, { borderColor: isLight ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.15)' }]}>
                  <Text style={[styles.addTagText, { color: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }]}>+ Add Tag</Text>
                </Pressable>
              </View>
            </View>
          </GlowCard>
        </View>

        {/* Gratitude Moment */}
        <View style={styles.section}>
          <View style={styles.gratitudeHeader}>
            <Ionicons name="sunny" size={20} color="#FBBF24" />
            <Text style={[styles.sectionTitle, { color: isLight ? '#1A202C' : '#FFFFFF' }]}>Gratitude Moment</Text>
          </View>
          <View style={styles.gratitudeList}>
            {[1, 2, 3].map((num, i) => (
              <View key={num} style={[styles.gratitudeItem, { backgroundColor: isLight ? `${theme.accent}15` : 'rgba(139, 92, 246, 0.1)' }]}>
                <Text style={[styles.gratitudeNum, { color: isLight ? 'rgba(0,0,0,0.3)' : 'rgba(255,255,255,0.3)', fontFamily: theme.typography.h3 }]}>{num}.</Text>
                <View style={[styles.gratitudeInputWrap, { backgroundColor: isLight ? '#FFFFFF' : 'rgba(255,255,255,0.05)' }]}>
                  <TextInput
                    style={[styles.gratitudeInput, { color: isLight ? '#1A202C' : '#FFFFFF', fontFamily: theme.typography.main }]}
                    placeholder="I am grateful for..."
                    placeholderTextColor={isLight ? "rgba(0,0,0,0.3)" : "rgba(255,255,255,0.3)"}
                    value={gratitudes[i]}
                    onChangeText={(val) => {
                      const newG = [...gratitudes];
                      newG[i] = val;
                      setGratitudes(newG);
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Emotional Rhythm */}
        <View style={styles.section}>
          <View style={styles.sectionHeaderRow}>
            <Text style={[styles.sectionTitle, { color: isLight ? '#1A202C' : '#FFFFFF', fontFamily: theme.typography.h2 }]}>Emotional Rhythm</Text>
            <Pressable>
              <Text style={[styles.viewReport, { color: theme.primary, fontFamily: theme.typography.main }]}>View Full Report</Text>
            </Pressable>
          </View>
          <GlowCard isLight={isLight}>
            <View style={styles.chartContentInner}>
              <View style={styles.yAxisLabels}>
                <Text style={[styles.chartAxisText, { color: isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)' }]}>High</Text>
                <Text style={[styles.chartAxisText, { color: isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)' }]}>Med</Text>
                <Text style={[styles.chartAxisText, { color: isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)' }]}>Low</Text>
              </View>
              <View style={styles.chartArea}>
                <Svg height="80" width={width - 120}>
                  <Path
                    d="M0,50 Q40,10 80,45 T160,20 T240,60"
                    fill="none"
                    stroke={theme.alert}
                    strokeWidth="3"
                  />
                  <Circle cx="80" cy="45" r="4" fill={theme.alert} />
                  <Circle cx="160" cy="20" r="4" fill={theme.primary} />
                </Svg>
                <View style={styles.xAxisLabels}>
                  {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, idx) => (
                    <Text key={`${d}-${idx}`} style={[styles.chartAxisText, { color: isLight ? 'rgba(0,0,0,0.2)' : 'rgba(255,255,255,0.2)' }]}>{d}</Text>
                  ))}
                </View>
              </View>
            </View>
          </GlowCard>
        </View>

        {/* Save CTA */}
        <Pressable style={styles.saveBtn} onPress={handleSave} disabled={isSaving}>
          <LinearGradient
            colors={isSaving ? ['#94A3B8', '#64748B'] : [theme.alert, theme.accent]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.saveGradient}
          >
            <Text style={[styles.saveText, { fontFamily: theme.typography.button }]}>
              {isSaving ? 'Saving...' : 'Save Entry'}
            </Text>
            {!isSaving && <Ionicons name="checkmark" size={20} color="#fff" />}
          </LinearGradient>
        </Pressable>
      </ScrollView>
    </View>
  );
}

function Tag({ label, isLight }: { label: string; isLight: boolean }) {
  const { theme } = useTheme() as any;
  return (
    <View style={[styles.tag, { backgroundColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }]}>
      <Text style={[styles.tagText, { color: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)', fontFamily: theme.typography.h3 }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBtn: {
    width: 44,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 3,
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 12,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#22C55E',
    borderWidth: 1.5,
    borderColor: '#020617',
  },
  scrollContent: {
    paddingHorizontal: 28, // Increased outer padding
  },
  hero: {
    alignItems: 'center',
    marginBottom: 32,
  },
  dateText: {
    fontSize: 12,
    fontWeight: '800',
    marginBottom: 8,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  greetingText: {
    fontSize: 28,
    fontWeight: '900',
    marginBottom: 12,
    letterSpacing: -0.5,
  },
  quoteText: {
    fontSize: 14,
    fontStyle: 'italic',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 20,
    letterSpacing: 0.2,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: -0.3,
  },
  sectionSub: {
    fontSize: 14,
    marginTop: -10,
    marginBottom: 20,
    lineHeight: 20,
  },
  streakBadge: {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.2)',
  },
  streakText: {
    color: '#22C55E',
    fontSize: 11,
    fontWeight: '800',
  },
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  moodItem: {
    width: 54,
    height: 54,
    alignItems: 'center',
    justifyContent: 'center',
  },
  moodActiveGlow: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#A855F7',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 10,
  },
  subHint: {
    color: 'rgba(255,255,255,0.2)',
    fontSize: 12,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  insightHeader: {
    flexDirection: 'row',
    gap: 16,
    padding: 20,
  },
  avatarMini: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
  },
  insightLabel: {
    color: '#A855F7',
    fontSize: 12,
    fontWeight: '900',
    marginBottom: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  insightContent: {
    fontSize: 14,
    lineHeight: 20,
    flexShrink: 1,
    paddingRight: 40,
    fontWeight: '500',
  },
  cardHeader: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 12,
  },
  reflectionInputArea: {
    height: 240,
    position: 'relative',
    overflow: 'hidden',
  },
  reflectionInput: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    textAlignVertical: 'top',
    fontWeight: '500',
  },
  internalActions: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    zIndex: 10,
  },
  internalBtn: {
    width: 56, // Large buttons
    height: 56,
    borderRadius: 28,
    shadowColor: '#5ED5FF',
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  cardFooter: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  tagRow: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
    marginTop: 10,
  },
  tag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  tagText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  addTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  addTagText: {
    fontSize: 11,
    fontWeight: '700',
  },
  sideBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    shadowColor: '#5ED5FF',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  sideBtnGradient: {
    flex: 1,
    borderRadius: 28, // Match button radius
    alignItems: 'center',
    justifyContent: 'center',
  },
  gratitudeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
  },
  gratitudeList: {
    gap: 12,
  },
  gratitudeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    borderRadius: 20,
    paddingHorizontal: 12,
    gap: 12,
    borderWidth: 0.8,
    borderColor: 'rgba(0,0,0,0.1)',
    ...Platform.select({
      ios: {
        shadowColor: '#8B5CF6',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  gratitudeNum: {
    fontSize: 16,
    fontWeight: '900',
    width: 20,
    textAlign: 'center',
  },
  gratitudeInputWrap: {
    flex: 1,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  gratitudeInput: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
  },
  viewReport: {
    color: '#5ED5FF',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  chartContentInner: {
    padding: 24,
    flexDirection: 'row',
    gap: 16,
  },
  yAxisLabels: {
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  chartAxisText: {
    fontSize: 10,
    fontWeight: '900',
  },
  chartArea: {
    flex: 1,
  },
  xAxisLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
    paddingHorizontal: 4,
  },
  saveBtn: {
    height: 64,
    borderRadius: 32,
    overflow: 'hidden',
    marginTop: 10,
    marginBottom: 20,
    elevation: 10,
    shadowColor: '#A855F7',
    shadowOpacity: 0.3,
    shadowRadius: 15,
  },
  saveGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  saveText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '900',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
});
