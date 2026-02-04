import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const GENDERS = [
    { id: 'male', name: 'Male', icon: 'male' },
    { id: 'female', name: 'Female', icon: 'female' },
    { id: 'nonbinary', name: 'Non-binary', icon: 'male-female' },
];

interface Props {
    selected: string;
    onSelect: (gender: string) => void;
}

export default function StepGender({ selected, onSelect }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Identity</Text>
            <Text style={styles.subtitle}>How does your companion identify?</Text>

            <View style={styles.list}>
                {GENDERS.map((g) => {
                    const isActive = selected === g.id;
                    return (
                        <Pressable
                            key={g.id}
                            style={[styles.card, isActive && styles.activeCard]}
                            onPress={() => onSelect(g.id)}
                        >
                            <View style={[styles.iconBox, isActive && styles.activeIconBox]}>
                                <Ionicons
                                    name={g.icon as any}
                                    size={32}
                                    color={isActive ? '#F922FF' : 'rgba(255,255,255,0.4)'}
                                />
                            </View>
                            <Text style={[styles.name, isActive && styles.activeName]}>{g.name}</Text>

                            {isActive && (
                                <View style={styles.check}>
                                    <Ionicons name="checkmark-circle" size={24} color="#F922FF" />
                                </View>
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
    list: { gap: 16 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 20,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    activeCard: {
        backgroundColor: 'rgba(249, 34, 255, 0.1)',
        borderColor: '#F922FF',
    },
    iconBox: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255,255,255,0.05)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 20,
    },
    activeIconBox: {
        backgroundColor: 'rgba(249, 34, 255, 0.2)',
    },
    name: { fontSize: 18, fontWeight: '700', color: '#94a3b8', flex: 1 },
    activeName: { color: '#fff' },
    check: { marginLeft: 16 },
});
