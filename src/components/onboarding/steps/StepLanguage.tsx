import React from 'react';
import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const LANGUAGES = [
    { id: 'en', name: 'English', flag: '🇺🇸' },
    { id: 'es', name: 'Spanish', flag: '🇪🇸' },
    { id: 'fr', name: 'French', flag: '🇫🇷' },
    { id: 'de', name: 'German', flag: '🇩🇪' },
    { id: 'it', name: 'Italian', flag: '🇮🇹' },
    { id: 'pt', name: 'Portuguese', flag: '🇵🇹' },
    { id: 'hi', name: 'Hindi', flag: '🇮🇳' },
    { id: 'ja', name: 'Japanese', flag: '🇯🇵' },
];

interface Props {
    selected: string;
    onSelect: (lang: string) => void;
}

export default function StepLanguage({ selected, onSelect }: Props) {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Spoken Language</Text>
            <Text style={styles.subtitle}>Which language should your companion speak?</Text>

            <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
                {LANGUAGES.map((lang) => (
                    <Pressable
                        key={lang.id}
                        style={[styles.card, selected === lang.id && styles.activeCard]}
                        onPress={() => onSelect(lang.id)}
                    >
                        <View style={styles.row}>
                            <Text style={styles.flag}>{lang.flag}</Text>
                            <Text style={[styles.name, selected === lang.id && styles.activeText]}>{lang.name}</Text>
                        </View>
                        {selected === lang.id && (
                            <Ionicons name="checkmark-circle" size={24} color="#5ED5FF" />
                        )}
                    </Pressable>
                ))}
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
    row: { flexDirection: 'row', alignItems: 'center', gap: 16 },
    flag: { fontSize: 24 },
    name: { fontSize: 18, color: '#94a3b8', fontWeight: '600' },
    activeText: { color: '#fff' },
});
