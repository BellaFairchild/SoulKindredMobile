
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, InputAccessoryView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
// import { format } from 'date-fns';

import { QuantumHeader } from '@/components/nav/QuantumHeader';
import { useTheme } from '@/context/AppTheme';
import { GlowCard } from '@/components/tools/GlowCard';
import { useAppStore, VaultItem } from '@/state/store';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM_MARGIN } from '@/constants/layout';

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

import { useSubscription } from "@/context/SubscriptionContext";

export default function VaultScreen() {
  const { theme } = useTheme() as any;
  const isLight = theme.mode === 'light';
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<DrawerNavigationProp<any>>();
  const router = useRouter(); // Ensure router is available
  const { isPremium } = useSubscription();

  // State
  const [filter, setFilter] = useState<'all' | 'journal' | 'media'>('all');

  // Store
  const vaultItems = useAppStore((state) => state.vaultItems);

  // Filtered Items
  const filteredItems = useMemo(() => {
    if (filter === 'all') return vaultItems;
    if (filter === 'journal') return vaultItems.filter(i => i.type === 'journal');
    return vaultItems.filter(i => ['meme', 'sticker', 'audio', 'link'].includes(i.type));
  }, [vaultItems, filter]);

  // Apply Premium Limit
  const displayItems = useMemo(() => {
    if (isPremium) return filteredItems;
    // Show only last 7 items for free users
    return filteredItems.slice(0, 7);
  }, [filteredItems, isPremium]);

  console.log('Vault Debug - Filtered Items Count:', filteredItems.length);

  return (
    <View style={[styles.container, { backgroundColor: theme.appBackground }]}>
      <LinearGradient
        colors={isLight ? theme.chatGradient : ['#0F172A', '#1E293B', '#020617']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />

      <QuantumHeader
        center="Soul Vault"
        left={
          <Pressable style={{ padding: 8 }} onPress={() => navigation.openDrawer()}>
            <Ionicons name="menu" size={24} color={isLight ? theme.neutralDark : "#FFFFFF"} />
          </Pressable>
        }
        right={
          <Pressable style={{ padding: 8 }}>
            <Ionicons name="search" size={20} color={isLight ? theme.neutralDark : "#FFFFFF"} />
          </Pressable>
        }
      />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: 120, paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_MARGIN + insets.bottom + 20 }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Filter Tabs */}
        <View style={styles.filterContainer}>
          <FilterTab label="All" active={filter === 'all'} onPress={() => setFilter('all')} theme={theme} isLight={isLight} />
          <FilterTab label="Journal" active={filter === 'journal'} onPress={() => setFilter('journal')} theme={theme} isLight={isLight} />
          <FilterTab label="Media & Unlocks" active={filter === 'media'} onPress={() => setFilter('media')} theme={theme} isLight={isLight} />
        </View>

        {filteredItems.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="file-tray-outline" size={48} color={theme.disabled} />
            <Text style={[styles.emptyText, { color: theme.disabled, fontFamily: theme.typography.main }]}>
              No items found in your vault yet.
            </Text>
          </View>
        ) : (
          <View>
            <View style={styles.masonryContainer}>
              {/* Simple staggered simulation: Left Col (evens), Right Col (odds) */}
              <View style={styles.column}>
                {displayItems.filter((_, i) => i % 2 === 0).map(item => (
                  <VaultCard key={item.id} item={item} theme={theme} isLight={isLight} />
                ))}
              </View>
              <View style={styles.column}>
                {displayItems.filter((_, i) => i % 2 !== 0).map(item => (
                  <VaultCard key={item.id} item={item} theme={theme} isLight={isLight} />
                ))}
              </View>
            </View>

            {/* Premium Lock Footer */}
            {!isPremium && vaultItems.length > 7 && (
              <Pressable onPress={() => router.push('/paywall')} style={{ marginTop: 20 }}>
                <GlowCard isLight={isLight} style={{ alignItems: 'center', padding: 24 }}>
                  <Ionicons name="lock-closed" size={32} color={theme.accent} style={{ marginBottom: 12 }} />
                  <Text style={{ color: isLight ? theme.neutralDark : '#FFF', fontSize: 16, fontWeight: '800', marginBottom: 8 }}>
                    Unlock Your Full History
                  </Text>
                  <Text style={{ color: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.6)', textAlign: 'center', marginBottom: 16 }}>
                    Upgrade to Soul Kindred Premium to access your entire vault and cloud backup.
                  </Text>
                  <Text style={{ color: theme.primary, fontWeight: '700' }}>VIEW PLANS</Text>
                </GlowCard>
              </Pressable>
            )}
          </View>
        )}
      </ScrollView>
    </View >
  );
}

function FilterTab({ label, active, onPress, theme, isLight }: any) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.filterTab,
        active && { backgroundColor: theme.primary },
        !active && { backgroundColor: isLight ? 'rgba(0,0,0,0.05)' : 'rgba(255,255,255,0.05)' }
      ]}
    >
      <Text style={[
        styles.filterText,
        {
          color: active ? '#FFFFFF' : (isLight ? theme.neutralDark : theme.neutralLight),
          fontFamily: theme.typography.button,
          fontWeight: active ? '700' : '500'
        }
      ]}>
        {label}
      </Text>
    </Pressable>
  )
}

function VaultCard({ item, theme, isLight }: { item: VaultItem, theme: any, isLight: boolean }) {
  const isJournal = item.type === 'journal';
  const isMedia = item.type !== 'journal';

  return (
    <View style={{ marginBottom: 16 }}>
      <GlowCard isLight={isLight} style={{ padding: 16, marginBottom: 0 }}>
        {/* Header: Date & Mood */}
        <View style={styles.cardHeader}>
          <Text style={[styles.dateLabel, { color: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)', fontFamily: theme.typography.h3 }]}>
            {formatDate(item.date)}
          </Text>
          {item.mood && (
            <View style={[styles.moodBadge, { backgroundColor: `${item.moodColor}20` }]}>
              <Text style={[styles.moodText, { color: item.moodColor }]}>{item.mood}</Text>
            </View>
          )}
        </View>

        {/* Content */}
        {isMedia && item.mediaUrl && (
          <View style={styles.mediaContainer}>
            <Image source={{ uri: item.mediaUrl }} style={styles.mediaImage} />
            <View style={styles.mediaIcon}>
              <Ionicons name={item.type === 'audio' ? 'musical-note' : 'image'} size={16} color="#FFF" />
            </View>
          </View>
        )}

        <Text style={[styles.cardTitle, { color: isLight ? theme.neutralDark : '#FFFFFF', fontFamily: theme.typography.h2 }]}>
          {item.title}
        </Text>

        {item.content && (
          <Text
            numberOfLines={4}
            style={[styles.cardBody, { color: isLight ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)', fontFamily: theme.typography.main }]}
          >
            {item.content}
          </Text>
        )}

        {/* Footer: Tags */}
        {item.tags && item.tags.length > 0 && (
          <View style={styles.tagsRow}>
            {item.tags.slice(0, 2).map((tag, i) => (
              <Text key={i} style={[styles.hashTag, { color: theme.secondary }]}>{tag}</Text>
            ))}
          </View>
        )}
      </GlowCard>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  filterContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 8,
  },
  filterTab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  filterText: {
    fontSize: 13,
  },
  scrollContent: {
    paddingHorizontal: 16,
  },
  masonryContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  column: {
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 100,
    opacity: 0.5,
    gap: 12,
  },
  emptyText: {
    fontSize: 16,
  },
  // Card Styles
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  dateLabel: {
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  moodBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  moodText: {
    fontSize: 10,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  mediaContainer: {
    height: 120,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
    position: 'relative',
  },
  mediaImage: {
    width: '100%',
    height: '100%',
  },
  mediaIcon: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    backgroundColor: 'rgba(0,0,0,0.6)',
    padding: 6,
    borderRadius: 16,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 8,
  },
  cardBody: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  hashTag: {
    fontSize: 11,
    fontWeight: '700',
    opacity: 0.8,
  }
});
