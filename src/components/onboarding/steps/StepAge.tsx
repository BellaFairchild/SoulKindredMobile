import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const AGE_RANGES = [
    { id: '14-18', label: '14 - 18' },
    { id: '18-30', label: '18 - 30' },
    { id: '30-40', label: '30 - 40' },
    { id: '50-60', label: '50 - 60' },
    { id: 'older', label: 'Older' },
];

interface Props {
    selected: string;
    onSelect: (range: string) => void;
}

export default function StepAge({ selected, onSelect }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Age Range</Text>
            <Text style={styles.subtitle}>Approximate age of your companion.</Text>

            <View style={styles.list}>
                {AGE_RANGES.map((range) => {
                    const isActive = selected === range.id;
                    return (
                        <Pressable
                            key={range.id}
                            style={[styles.card, isActive && styles.activeCard]}
                            onPress={() => onSelect(range.id)}
                        >
                            <Text style={[styles.label, isActive && styles.activeLabel]}>
                                {range.label}
                            </Text>

                            {isActive && (
                                <Ionicons name="checkmark-circle" size={24} color="#5ED5FF" />
                            )}
                        </Pressable>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    title: { fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 8 },
    subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 32 },
    list: { gap: 12 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    activeCard: {
        backgroundColor: 'rgba(94, 213, 255, 0.1)',
        borderColor: '#5ED5FF',
    },
    label: { fontSize: 18, fontWeight: '600', color: '#94a3b8' },
    activeLabel: { color: '#fff', fontWeight: '700' },
});
