import React from 'react';
import { View, Text, Pressable, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const SCENES = [
    {
        id: 'cabin',
        name: 'Cozy Cabin',
        desc: 'Warm fireplace and rustic comfort.',
        gradient: ['#78350f', '#451a03']
    },
    {
        id: 'beach',
        name: 'Beach Bungalow',
        desc: 'Ocean breeze and sunset vibes.',
        gradient: ['#0ea5e9', '#0369a1']
    },
    {
        id: 'firepit',
        name: 'Backyard Firepit',
        desc: 'Evening chill under the stars.',
        gradient: ['#0f172a', '#1e293b']
    },
];

interface Props {
    selected: string;
    onSelect: (scene: string) => void;
}

export default function StepScene({ selected, onSelect }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Your Sanctuary</Text>
            <Text style={styles.subtitle}>Where would you like to meet?</Text>

            <View style={styles.list}>
                {SCENES.map((scene) => {
                    const isActive = selected === scene.id;
                    return (
                        <Pressable
                            key={scene.id}
                            style={[styles.card, isActive && styles.activeCard]}
                            onPress={() => onSelect(scene.id)}
                        >
                            <LinearGradient
                                colors={scene.gradient as any}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 1 }}
                                style={styles.preview}
                            >
                                <Ionicons name="image" size={32} color="rgba(255,255,255,0.4)" />
                            </LinearGradient>

                            <View style={styles.info}>
                                <Text style={[styles.name, isActive && styles.activeName]}>
                                    {scene.name}
                                </Text>
                                <Text style={styles.desc}>{scene.desc}</Text>
                            </View>

                            {isActive && (
                                <View style={[styles.radio, styles.activeRadio]} />
                            )}
                            {!isActive && (
                                <View style={styles.radio} />
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
    subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 24 },
    list: { gap: 16 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 12,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    activeCard: {
        backgroundColor: 'rgba(255,255,255,0.08)',
        borderColor: '#fff',
    },
    preview: {
        width: 64,
        height: 64,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    info: { flex: 1 },
    name: { fontSize: 18, fontWeight: '700', color: '#94a3b8', marginBottom: 4 },
    activeName: { color: '#fff' },
    desc: { fontSize: 13, color: 'rgba(255,255,255,0.4)' },
    radio: {
        width: 24,
        height: 24,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.2)',
        marginRight: 8,
    },
    activeRadio: {
        borderColor: '#fff',
        backgroundColor: '#fff',
    },
});
