import React, { useState } from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Audio } from 'expo-av';
import { ELEVEN_LABS_VOICES } from '@/constants/voices';

interface Props {
    selected: string;
    onSelect: (voiceId: string) => void;
}

export default function StepVoice({ selected, onSelect }: Props) {
    const [playing, setPlaying] = useState<string | null>(null);

    const handlePlay = async (voiceId: string) => {
        // In a real app, we'd play a sample file here.
        // For now, we simulate the "Playing" state to show UI Feedback.
        if (playing === voiceId) {
            setPlaying(null);
            return;
        }

        setPlaying(voiceId);
        setTimeout(() => setPlaying(null), 3000); // Simulate 3s clip
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Voice</Text>
            <Text style={styles.subtitle}>How should they sound?</Text>

            <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
                {ELEVEN_LABS_VOICES.map((voice) => {
                    const isActive = selected === voice.id;
                    const isPlaying = playing === voice.id;

                    return (
                        <Pressable
                            key={voice.id}
                            style={[styles.card, isActive && styles.activeCard]}
                            onPress={() => onSelect(voice.id)}
                        >
                            <Pressable
                                style={[styles.playBtn, isPlaying && styles.playingBtn]}
                                onPress={() => handlePlay(voice.id)}
                            >
                                <Ionicons
                                    name={isPlaying ? "pause" : "play"}
                                    size={20}
                                    color={isPlaying ? "#fff" : "#22C55E"}
                                />
                            </Pressable>

                            <View style={styles.info}>
                                <Text style={[styles.name, isActive && styles.activeName]}>
                                    {voice.name}
                                </Text>
                                <Text style={styles.desc}>
                                    {isPlaying ? 'Playing sample...' : 'Tap play to preview'}
                                </Text>
                            </View>

                            {isActive && (
                                <Ionicons name="checkmark-circle" size={24} color="#22C55E" />
                            )}
                        </Pressable>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    title: { fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 8 },
    subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 24 },
    list: { gap: 12, paddingBottom: 40 },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    activeCard: {
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderColor: '#22C55E',
    },
    playBtn: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    playingBtn: {
        backgroundColor: '#22C55E',
    },
    info: { flex: 1 },
    name: { fontSize: 18, fontWeight: '700', color: '#94a3b8', marginBottom: 2 },
    activeName: { color: '#fff' },
    desc: { fontSize: 12, color: 'rgba(255,255,255,0.4)' },
});
