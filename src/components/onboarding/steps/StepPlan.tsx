import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
    selected: 'free' | 'premium';
    onSelect: (plan: 'free' | 'premium') => void;
}

export default function StepPlan({ selected, onSelect }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Choose Plan</Text>
            <Text style={styles.subtitle}>Unlock the full potential.</Text>

            <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
                {/* Free Plan */}
                <Pressable
                    style={[styles.card, selected === 'free' && styles.activeCard]}
                    onPress={() => onSelect('free')}
                >
                    <View style={styles.header}>
                        <Text style={[styles.planName, selected === 'free' && styles.activeText]}>Traveler</Text>
                        <Text style={[styles.price, selected === 'free' && styles.activeText]}>Free</Text>
                    </View>
                    <View style={styles.features}>
                        <FeatureItem label="Basic Chat Companion" />
                        <FeatureItem label="Standard Voices" />
                        <FeatureItem label="Daily Check-ins" />
                    </View>
                    {selected === 'free' && (
                        <View style={styles.checkCircle}>
                            <Ionicons name="checkmark" size={20} color="#fff" />
                        </View>
                    )}
                </Pressable>

                {/* Premium Plan */}
                <Pressable
                    style={[styles.card, styles.premiumCard, selected === 'premium' && styles.activePremiumCard]}
                    onPress={() => onSelect('premium')}
                >
                    {selected === 'premium' && (
                        <LinearGradient
                            colors={['rgba(94, 213, 255, 0.2)', 'rgba(249, 34, 255, 0.2)']}
                            style={StyleSheet.absoluteFill}
                        />
                    )}

                    <View style={styles.header}>
                        <View>
                            <Text style={[styles.planName, styles.premiumText]}>Soul Kindred</Text>
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>RECOMMENDED</Text>
                            </View>
                        </View>
                        <Text style={[styles.price, styles.premiumText]}>$9.99<Text style={styles.period}>/mo</Text></Text>
                    </View>

                    <View style={styles.features}>
                        <FeatureItem label="Unlimited Chat" isPremium />
                        <FeatureItem label="Advanced AI Memory" isPremium />
                        <FeatureItem label="Premium Voices (ElevenLabs)" isPremium />
                        <FeatureItem label="Full Avatar Customization" isPremium />
                    </View>

                    {selected === 'premium' && (
                        <View style={[styles.checkCircle, { backgroundColor: '#F922FF' }]}>
                            <Ionicons name="checkmark" size={20} color="#fff" />
                        </View>
                    )}
                </Pressable>

                <Text style={styles.disclaimer}>
                    You can change or cancel your plan at any time in settings.
                </Text>
            </ScrollView>
        </View>
    );
}

function FeatureItem({ label, isPremium }: { label: string; isPremium?: boolean }) {
    return (
        <View style={styles.featureRow}>
            <Ionicons
                name="checkmark-circle-outline"
                size={20}
                color={isPremium ? '#F922FF' : 'rgba(255,255,255,0.4)'}
            />
            <Text style={[styles.featureText, isPremium && { color: '#fff' }]}>{label}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    title: { fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 8 },
    subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 24 },
    list: { gap: 16, paddingBottom: 40 },
    card: {
        padding: 24,
        backgroundColor: 'rgba(255,255,255,0.03)',
        borderRadius: 24,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
        position: 'relative',
        overflow: 'hidden',
    },
    premiumCard: {
        backgroundColor: 'rgba(249, 34, 255, 0.05)',
        borderColor: 'rgba(249, 34, 255, 0.2)',
    },
    activeCard: {
        borderColor: '#94a3b8',
        backgroundColor: 'rgba(255,255,255,0.08)',
    },
    activePremiumCard: {
        borderColor: '#F922FF',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        marginBottom: 24,
    },
    planName: { fontSize: 20, fontWeight: '700', color: '#94a3b8' },
    premiumText: { color: '#fff' },
    activeText: { color: '#fff' },
    price: { fontSize: 24, fontWeight: '900', color: '#94a3b8' },
    period: { fontSize: 14, fontWeight: '500', color: 'rgba(255,255,255,0.4)' },
    badge: {
        backgroundColor: '#F922FF',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 8,
        marginTop: 4,
        alignSelf: 'flex-start',
    },
    badgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },
    features: { gap: 12 },
    featureRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
    featureText: { fontSize: 15, color: 'rgba(255,255,255,0.6)' },
    checkCircle: {
        position: 'absolute',
        top: 24,
        right: 24,
        width: 28,
        height: 28,
        borderRadius: 14,
        backgroundColor: '#94a3b8',
        alignItems: 'center',
        justifyContent: 'center',
    },
    disclaimer: {
        textAlign: 'center',
        color: 'rgba(255,255,255,0.3)',
        fontSize: 12,
        marginTop: 16,
    },
});
