import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, Pressable, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter, useNavigation } from 'expo-router';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import Svg, { Path, Circle, Defs, LinearGradient as SvgGradient, Stop } from 'react-native-svg';

import { QuantumHeader } from '@/components/nav/QuantumHeader';
import { useTheme } from '@/context/AppTheme';
import { GlowCard } from '@/components/tools/GlowCard';
import { useStreak } from '@/state/selectors';
import { useOverlay } from '@/context/OverlayContext';
import { TAB_BAR_HEIGHT, TAB_BAR_BOTTOM_MARGIN } from '@/constants/layout';

const { width } = Dimensions.get('window');

import { useAppStore } from '@/state/store';

// Helper to generate SVG path from data points
const generateSmoothPath = (data: number[], width: number, height: number) => {
    if (data.length < 2) return "";

    const points = data.map((val, i) => {
        const x = (i / (data.length - 1)) * width;
        const y = height - (val / 4) * height; // Scale 0-4 value to height
        return [x, y];
    });

    // Simple line for now (catmull-rom or bezier would be smoother, but keeping it simple)
    // Let's do a basic cubic bezier approximation
    let d = `M ${points[0][0]},${points[0][1]}`;

    for (let i = 0; i < points.length - 1; i++) {
        const [x0, y0] = points[i];
        const [x1, y1] = points[i + 1];

        // Control points for smooth curve
        const cp1x = x0 + (x1 - x0) / 2;
        const cp1y = y0;
        const cp2x = x1 - (x1 - x0) / 2;
        const cp2y = y1;

        d += ` C ${cp1x},${cp1y} ${cp2x},${cp2y} ${x1},${y1}`;
    }

    return d;
};

export default function InsightsScreen() {
    const { theme } = useTheme() as any;
    const isLight = theme.mode === 'light';
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const navigation = useNavigation<DrawerNavigationProp<any>>();
    const streak = useStreak();
    const { showOverlay } = useOverlay();

    // Store Data
    const moodHistory = useAppStore((state) => state.moodHistory);
    const vaultItems = useAppStore((state) => state.vaultItems);

    // Filter for unlocks (non-journal items, or use all recent for now)
    const recentUnlocks = useMemo(() => {
        // Prioritize media items (stickers, audio, memes)
        const media = vaultItems.filter(i => ['meme', 'sticker', 'audio', 'link'].includes(i.type));
        // Take top 5
        return media.length > 0 ? media.slice(0, 5) : vaultItems.slice(0, 5);
    }, [vaultItems]);

    // Chart Data
    const chartPath = useMemo(() => {
        // Get last 7 values
        const data = moodHistory.slice(-7).map(m => m.value);
        // Default to middle if no data
        if (data.length === 0) return generateSmoothPath([2, 2, 2, 2, 2, 2, 2], 260, 60);

        // Pad with previous values if less than 7
        while (data.length < 7) {
            data.unshift(data.length > 0 ? data[0] : 2);
        }

        return generateSmoothPath(data, 260, 60); // ViewBox width, height margin adjusted
    }, [moodHistory]);

    return (
        <View style={[styles.container, { backgroundColor: theme.appBackground }]}>
            <LinearGradient
                colors={isLight ? theme.chatGradient : ['#0F172A', '#1E293B', '#020617']}
                style={StyleSheet.absoluteFill}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
            />

            <QuantumHeader
                center="Insights"
                left={
                    <Pressable style={{ padding: 8 }} onPress={() => navigation.openDrawer()}>
                        <Ionicons name="menu" size={24} color={isLight ? theme.neutralDark : "#FFFFFF"} />
                    </Pressable>
                }
            />

            <ScrollView
                contentContainerStyle={[
                    styles.scrollContent,
                    { paddingTop: 120, paddingBottom: TAB_BAR_HEIGHT + TAB_BAR_BOTTOM_MARGIN + insets.bottom + 20 }
                ]}
                showsVerticalScrollIndicator={false}
            >
                {/* Hero Summary */}
                <View style={styles.heroSummary}>
                    <Text style={[styles.heroTitle, { color: isLight ? theme.neutralDark : '#FFFFFF', fontFamily: theme.typography.h1 }]}>
                        Weekly Mindful Check
                    </Text>
                    <Text style={[styles.heroSubtitle, { color: isLight ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.6)', fontFamily: theme.typography.main }]}>
                        Your emotional rhythm is {moodHistory.length < 3 ? 'stabilizing' : 'flowing'}.
                    </Text>
                </View>

                {/* Widget 1: Emotional Rhythm Chart */}
                <GlowCard isLight={isLight} gradientColors={[theme.primary, theme.accent]}>
                    <View style={styles.cardHeader}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                            <Ionicons name="pulse" size={20} color={theme.accent} />
                            <Text style={[styles.cardTitle, { color: isLight ? theme.neutralDark : '#FFFFFF', fontFamily: theme.typography.h2 }]}>
                                Emotional Rhythm
                            </Text>
                        </View>
                        <Text style={[styles.cardAction, { color: theme.primary, fontFamily: theme.typography.button }]}>7 Days</Text>
                    </View>

                    <View style={styles.chartContainer}>
                        {/* Y-Axis Labels */}
                        <View style={styles.yAxis}>
                            <Text style={[styles.axisText, { color: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.3)' }]}>High</Text>
                            <Text style={[styles.axisText, { color: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.3)' }]}>Avg</Text>
                            <Text style={[styles.axisText, { color: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.3)' }]}>Low</Text>
                        </View>

                        {/* Chart Area */}
                        <View style={styles.graphArea}>
                            <Svg height="100" width="100%" viewBox="0 0 260 100">
                                <Defs>
                                    <SvgGradient id="grad" x1="0" y1="0" x2="100%" y2="0">
                                        <Stop offset="0" stopColor={theme.alert} stopOpacity="1" />
                                        <Stop offset="100%" stopColor={theme.primary} stopOpacity="1" />
                                    </SvgGradient>
                                </Defs>
                                {/* Dynamic Curve */}
                                <Path
                                    d={`M0,100 ${chartPath}`}
                                // Hack: prepend/update path logic if needed, but 'chartPath' is full path now
                                />
                                <Path
                                    d={chartPath}
                                    fill="none"
                                    stroke="url(#grad)"
                                    strokeWidth="4"
                                    strokeLinecap="round"
                                />
                            </Svg>
                        </View>
                    </View>

                    {/* X-Axis Labels */}
                    <View style={styles.xAxis}>
                        {['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Day 5', 'Day 6', 'Today'].map((day, i) => (
                            <Text key={i} style={[styles.axisDay, { fontSize: 8, color: isLight ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.4)' }]}>{day}</Text>
                        ))}
                    </View>
                </GlowCard>

                {/* Widget 2: Stats Grid */}
                <View style={styles.statsGrid}>
                    {/* Streak Card */}
                    <View style={{ flex: 1 }}>
                        <GlowCard isLight={isLight} style={{ marginBottom: 0 }}>
                            <View style={styles.statContent}>
                                <Ionicons name="flame" size={28} color="#F59E0B" />
                                <View>
                                    <Text style={[styles.statValue, { color: isLight ? theme.neutralDark : '#FFFFFF', fontFamily: theme.typography.h1 }]}>
                                        {streak}
                                    </Text>
                                    <Text style={[styles.statLabel, { color: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)', fontFamily: theme.typography.h3 }]}>
                                        Day Streak
                                    </Text>
                                </View>
                            </View>
                        </GlowCard>
                    </View>

                    {/* Mindful Minutes Card */}
                    <View style={{ flex: 1 }}>
                        <GlowCard isLight={isLight} style={{ marginBottom: 0 }} gradientColors={[theme.accent, '#22D3EE']}>
                            <View style={styles.statContent}>
                                <Ionicons name="hourglass" size={28} color="#22D3EE" />
                                <View>
                                    <Text style={[styles.statValue, { color: isLight ? theme.neutralDark : '#FFFFFF', fontFamily: theme.typography.h1 }]}>
                                        42m
                                    </Text>
                                    <Text style={[styles.statLabel, { color: isLight ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)', fontFamily: theme.typography.h3 }]}>
                                        Mindful
                                    </Text>
                                </View>
                            </View>
                        </GlowCard>
                    </View>
                </View>

                {/* Widget 3: Recent Unlocks carousel */}
                <View style={styles.sectionHeader}>
                    <Text style={[styles.sectionTitle, { color: isLight ? theme.neutralDark : '#FFFFFF', fontFamily: theme.typography.h2 }]}>
                        Recent Unlocks
                    </Text>
                    <Pressable onPress={() => navigation.navigate("vault")}>
                        <Text style={[styles.seeAll, { color: theme.secondary, fontFamily: theme.typography.button }]}>See Vault</Text>
                    </Pressable>
                </View>

                {recentUnlocks.length > 0 ? (
                    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.carousel} style={{ marginHorizontal: -24 }}>
                        {recentUnlocks.map((item, idx) => (
                            <View key={item.id} style={[
                                styles.unlockCard,
                                {
                                    backgroundColor: isLight ? '#FFFFFF' : 'rgba(30, 41, 59, 0.6)',
                                    marginLeft: idx === 0 ? 24 : 0,
                                    marginRight: 12
                                }
                            ]}>
                                {item.mediaUrl ? (
                                    <Image source={{ uri: item.mediaUrl }} style={styles.unlockImage} />
                                ) : (
                                    <View style={[styles.unlockImage, { backgroundColor: item.moodColor || theme.primary, alignItems: 'center', justifyContent: 'center' }]}>
                                        <Ionicons name="journal" size={32} color="white" />
                                    </View>
                                )}
                                <LinearGradient colors={['transparent', 'rgba(0,0,0,0.8)']} style={styles.unlockOverlay} />
                                <View style={styles.unlockInfo}>
                                    <Ionicons name={item.type === 'audio' ? 'musical-notes' : (item.type === 'journal' ? 'pencil' : 'sparkles')} size={14} color="#fff" />
                                    <Text numberOfLines={1} style={[styles.unlockLabel, { fontFamily: theme.typography.h3, maxWidth: 100 }]}>{item.title}</Text>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                ) : (
                    <View style={{ padding: 24, alignItems: 'center' }}>
                        <Text style={{ color: theme.disabled }}>No unlocks yet. Keep journaling!</Text>
                    </View>
                )}

                {/* Widget 4: Quick Actions */}
                <View style={[styles.sectionHeader, { marginTop: 24 }]}>
                    <Text style={[styles.sectionTitle, { color: isLight ? theme.neutralDark : '#FFFFFF', fontFamily: theme.typography.h2 }]}>
                        Quick Actions
                    </Text>
                </View>

                <View style={styles.actionGrid}>
                    <Pressable style={{ flex: 1 }} onPress={() => router.push('/(drawer)/(tabs)/journal')}>
                        <GlowCard isLight={isLight} gradientColors={['#F472B6', '#C084FC']}>
                            <View style={styles.actionBtnContent}>
                                <Ionicons name="pencil" size={32} color="#FFFFFF" />
                                <Text style={[styles.actionBtnText, { fontFamily: theme.typography.button }]}>Log Mood</Text>
                            </View>
                        </GlowCard>
                    </Pressable>

                    <Pressable style={{ flex: 1 }} onPress={() => showOverlay('breath')}>
                        <GlowCard isLight={isLight} gradientColors={['#22D3EE', '#38BDF8']}>
                            <View style={styles.actionBtnContent}>
                                <Ionicons name="leaf" size={32} color="#FFFFFF" />
                                <Text style={[styles.actionBtnText, { fontFamily: theme.typography.button }]}>Breathe</Text>
                            </View>
                        </GlowCard>
                    </Pressable>

                    <Pressable style={{ flex: 1 }} onPress={() => showOverlay('burn')}>
                        <GlowCard isLight={isLight} gradientColors={['#EF4444', '#B91C1C']}>
                            <View style={styles.actionBtnContent}>
                                <Ionicons name="flame" size={32} color="#FFFFFF" />
                                <Text style={[styles.actionBtnText, { fontFamily: theme.typography.button }]}>Burn Worry</Text>
                            </View>
                        </GlowCard>
                    </Pressable>
                </View>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 24,
    },
    heroSummary: {
        marginBottom: 24,
    },
    heroTitle: {
        fontSize: 28,
        fontWeight: '900',
        marginBottom: 8,
    },
    heroSubtitle: {
        fontSize: 16,
        fontWeight: '500',
    },
    // Chart Styles
    cardHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        paddingHorizontal: 8,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: '800',
    },
    cardAction: {
        fontSize: 12,
        fontWeight: '700',
    },
    chartContainer: {
        flexDirection: 'row',
        height: 120,
        alignItems: 'center',
    },
    yAxis: {
        height: '100%',
        justifyContent: 'space-between',
        paddingVertical: 10,
        marginRight: 10,
    },
    axisText: {
        fontSize: 10,
        fontWeight: '700',
        textAlign: 'right',
    },
    graphArea: {
        flex: 1,
        height: '100%',
        justifyContent: 'center',
        paddingVertical: 10
    },
    xAxis: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 4,
        paddingLeft: 30, // Offset for Y-axis
        paddingRight: 10,
    },
    axisDay: {
        fontSize: 10,
        fontWeight: '700',
    },
    // Grid Stats
    statsGrid: {
        flexDirection: 'row',
        gap: 16,
    },
    statContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 4,
        paddingHorizontal: 4,
    },
    statValue: {
        fontSize: 24,
        fontWeight: '900',
        lineHeight: 28,
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 0.5,
    },
    // Recent Unlocks
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 4,
        marginBottom: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '900',
    },
    seeAll: {
        fontSize: 12,
        fontWeight: '700',
    },
    carousel: {
        paddingRight: 24,
    },
    unlockCard: {
        width: 140,
        height: 140,
        borderRadius: 20,
        overflow: 'hidden',
        position: 'relative',
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    unlockImage: {
        width: '100%',
        height: '100%',
    },
    unlockOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    unlockInfo: {
        position: 'absolute',
        bottom: 12,
        left: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
    },
    unlockLabel: {
        color: '#fff',
        fontSize: 12,
        fontWeight: '700',
    },
    // Action Grid
    actionGrid: {
        flexDirection: 'row',
        gap: 16,
    },
    actionBtnContent: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 12,
        gap: 8,
    },
    actionBtnText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '800',
        textTransform: 'uppercase',
        letterSpacing: 1,
    }
});
