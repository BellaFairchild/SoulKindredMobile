import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import Slider from '@react-native-community/slider';
import { Ionicons } from '@expo/vector-icons';

const TRAITS = [
    { id: 'empathetic', name: 'Empathetic', desc: 'Validates feelings first; mirrors emotion.' },
    { id: 'supportive', name: 'Supportive', desc: 'Encouragement and actionable next steps.' },
    { id: 'warm', name: 'Warm', desc: 'Friendly, inviting phrasing and gentle tone.' },
    { id: 'patient', name: 'Patient', desc: 'Calm repetitions; never rushing.' },
    { id: 'encouraging', name: 'Encouraging', desc: 'Highlights strengths and motivates.' },
    { id: 'dependable', name: 'Dependable', desc: 'Confirming follow-through and loyalty.' },
    { id: 'clear', name: 'Clear', desc: 'Simple, step-by-step suggestions.' },
    { id: 'resourceful', name: 'Resourceful', desc: 'Practical options and quick hacks.' },
    { id: 'respectful', name: 'Respectful', desc: 'Honors boundaries; avoids pushing.' },
    { id: 'playful', name: 'Playful', desc: 'Light levity only when appropriate.' },
];

interface Props {
    selected: string[];
    intensity: number;
    onSelect: (traits: string[]) => void;
    onIntensityChange: (val: number) => void;
}

export default function StepPersonality({ selected, intensity, onSelect, onIntensityChange }: Props) {
    const toggleTrait = (id: string) => {
        if (selected.includes(id)) {
            onSelect(selected.filter(t => t !== id));
        } else {
            if (selected.length < 5) { // Optional max limit? User said "at least 3". Let's not limit for now, or maybe 5 is sane.
                onSelect([...selected, id]);
            } else {
                // Maybe flash a warning or just don't add
                onSelect([...selected, id]); // Let's allow unlimited for now per request "at least 3"
            }
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Personality</Text>
            <Text style={styles.subtitle}>Choose at least 3 core traits.</Text>

            <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
                {TRAITS.map((trait) => {
                    const isSelected = selected.includes(trait.id);
                    return (
                        <Pressable
                            key={trait.id}
                            style={[styles.card, isSelected && styles.activeCard]}
                            onPress={() => toggleTrait(trait.id)}
                        >
                            <View style={styles.info}>
                                <Text style={[styles.name, isSelected && styles.activeName]}>
                                    {trait.name}
                                </Text>
                                <Text style={styles.desc}>{trait.desc}</Text>
                            </View>

                            <View style={[styles.checkbox, isSelected && styles.activeCheckbox]}>
                                {isSelected && <Ionicons name="checkmark" size={16} color="#fff" />}
                            </View>
                        </Pressable>
                    );
                })}
            </ScrollView>

            {/* Intensity Slider Footer */}
            <View style={styles.footer}>
                <View style={styles.sliderHeader}>
                    <Text style={styles.sliderLabel}>Expression Intensity</Text>
                    <Text style={styles.sliderValue}>{Math.round(intensity * 100)}%</Text>
                </View>
                <Slider
                    style={{ width: '100%', height: 40 }}
                    minimumValue={0}
                    maximumValue={1}
                    value={intensity}
                    onValueChange={onIntensityChange}
                    minimumTrackTintColor="#F922FF"
                    maximumTrackTintColor="rgba(255,255,255,0.2)"
                    thumbTintColor="#fff"
                />
                <View style={styles.labels}>
                    <Text style={styles.subLabel}>Subtle</Text>
                    <Text style={styles.subLabel}>Strong</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    title: { fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 8 },
    subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 24 },
    list: { gap: 12, paddingBottom: 20 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    activeCard: {
        backgroundColor: 'rgba(56, 189, 248, 0.1)',
        borderColor: '#38BDF8',
    },
    info: { flex: 1, paddingRight: 12 },
    name: { fontSize: 18, fontWeight: '700', color: '#94a3b8', marginBottom: 4 },
    activeName: { color: '#fff' },
    desc: { fontSize: 13, color: 'rgba(255,255,255,0.4)', lineHeight: 18 },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 8,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        alignItems: 'center',
        justifyContent: 'center',
    },
    activeCheckbox: {
        borderColor: '#38BDF8',
        backgroundColor: '#38BDF8',
    },
    footer: {
        paddingTop: 20,
        borderTopWidth: 1,
        borderTopColor: 'rgba(255,255,255,0.1)',
    },
    sliderHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    sliderLabel: { color: '#fff', fontWeight: '700' },
    sliderValue: { color: '#F922FF', fontWeight: '700' },
    labels: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 4 },
    subLabel: { color: 'rgba(255,255,255,0.4)', fontSize: 12 },
});
