import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/AppTheme';
import { useAppStore } from '@/state/store';
import { useTextToSpeech } from '@/hooks/useTextToSpeech';
import { elevenLabsService } from '@/services/elevenlabs';

// Fallback if fetch fails
import { COMPANION_VOICES as FALLBACK_VOICES } from '@/utils/constants';

const getFlag = (accent: string) => {
    const a = accent.toLowerCase().trim();
    if (a.includes('american') || a.includes('usa')) return '🇺🇸';
    if (a.includes('british') || a.includes('uk')) return '🇬🇧';
    if (a.includes('australian')) return '🇦🇺';
    if (a.includes('irish')) return '🇮🇪';
    if (a.includes('indian')) return '🇮🇳';
    if (a.includes('italian')) return '🇮🇹';
    if (a.includes('german')) return '🇩🇪';
    if (a.includes('spanish')) return '🇪🇸';
    if (a.includes('mexican')) return '🇲🇽';
    if (a.includes('canadian')) return '🇨🇦';
    return '🏳️'; // Default
};

export default function VoiceSettingsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { theme } = useTheme() as any;
    const isLight = theme.mode === 'light';
    const { companionVoiceId, setCompanionVoiceId } = useAppStore();
    const { speak, stop, isSpeaking } = useTextToSpeech();

    const [voices, setVoices] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [playingVoiceId, setPlayingVoiceId] = useState<string | null>(null);
    const [selectedId, setSelectedId] = useState<string | null>(companionVoiceId);

    useEffect(() => {
        loadVoices();
        return () => {
            stop(); // Cleanup
        };
    }, []);

    useEffect(() => {
        if (!isSpeaking) {
            setPlayingVoiceId(null);
        }
    }, [isSpeaking]);

    const loadVoices = async () => {
        setIsLoading(true);
        const fetched = await elevenLabsService.getVoices();
        if (fetched && fetched.length > 0) {
            // Sort: Put "Awx8TeMHHpDzbm42nIB6" first
            const sorted = fetched.sort((a: any, b: any) => {
                if (a.voice_id === 'Awx8TeMHHpDzbm42nIB6') return -1;
                if (b.voice_id === 'Awx8TeMHHpDzbm42nIB6') return 1;
                if (a.voice_id === '21m00Tcm4TlvDq8ikWAM') return -1;
                if (b.voice_id === '21m00Tcm4TlvDq8ikWAM') return 1;
                return a.name.localeCompare(b.name);
            });
            setVoices(sorted);
        } else {
            setVoices(FALLBACK_VOICES.map(v => ({ voice_id: v.id, ...v })));
        }
        setIsLoading(false);
    };

    const handlePreview = async (voiceId: string, name: string) => {
        if (playingVoiceId === voiceId) {
            stop();
            setPlayingVoiceId(null);
        } else {
            setPlayingVoiceId(voiceId);
            await speak(`Hello, I am ${name}. I am ready to listen.`, voiceId);
        }
    };

    const handleSelect = (id: string) => {
        setSelectedId(id);
    };

    const handleSave = () => {
        if (selectedId) {
            setCompanionVoiceId(selectedId);
            router.back();
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        // SDK uses 'voice_id', our constant used 'id'. Handle both.
        const id = item.voice_id || item.id;
        const isSelected = selectedId === id;
        const isPlaying = playingVoiceId === id;

        // Attempt to guess gender/tags if available in 'labels'
        const gender = item.labels?.gender || item.gender || 'Artificial';
        const accent = item.labels?.accent || '';
        const flag = accent ? getFlag(accent) : '';

        return (
            <TouchableOpacity
                style={[
                    styles.card,
                    {
                        backgroundColor: isSelected ? 'rgba(76, 201, 240, 0.15)' : 'rgba(255,255,255,0.03)',
                        borderColor: isSelected ? theme.primary : 'rgba(255,255,255,0.05)'
                    }
                ]}
                onPress={() => handleSelect(id)}
            >
                <View style={[styles.cardInfo, { flexDirection: 'row', alignItems: 'center' }]}>
                    <View style={{ flex: 1 }}>
                        <Text style={[styles.voiceName, { color: theme.text }]}>
                            {flag} {item.name}
                        </Text>
                        <Text style={[styles.voiceGender, { color: theme.secondary }]}>
                            {gender} {accent ? `• ${accent}` : ''}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={[styles.playBtn, { backgroundColor: isPlaying ? theme.accent : 'rgba(255,255,255,0.1)' }]}
                    onPress={(e) => {
                        e.stopPropagation();
                        handlePreview(id, item.name);
                    }}
                >
                    {isPlaying ? (
                        <ActivityIndicator size="small" color="#fff" />
                    ) : (
                        <Ionicons name="play" size={18} color="#fff" />
                    )}
                </TouchableOpacity>

                {isSelected && (
                    <View style={styles.checkIcon}>
                        <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                    </View>
                )}
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.appBackground }]}>
            <LinearGradient
                colors={isLight ? [theme.appBackground, '#F1F5F9'] : [theme.appBackground, '#020617']}
                style={StyleSheet.absoluteFill}
            />

            {/* Header */}
            <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
                <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                    <Ionicons name="chevron-back" size={24} color={theme.text} />
                </TouchableOpacity>
                <Text style={[styles.title, { color: theme.text }]}>Companion Voice</Text>
            </View>

            {/* List */}
            {isLoading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.primary} />
                    <Text style={{ color: theme.secondary, marginTop: 16 }}>Loading voices...</Text>
                </View>
            ) : (
                <FlatList
                    data={voices}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.voice_id || item.id}
                    contentContainerStyle={[styles.listContent, { paddingBottom: 100 }]} // Add padding for Fab
                />
            )}

            {/* Save Button */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <TouchableOpacity
                    style={[styles.saveBtn, { backgroundColor: theme.primary, opacity: selectedId ? 1 : 0.5 }]}
                    onPress={handleSave}
                    disabled={!selectedId}
                >
                    <Text style={styles.saveBtnText}>Save Changes</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    backBtn: {
        padding: 8,
        marginRight: 10,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
    },
    listContent: {
        padding: 20,
        gap: 12,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
    },
    cardInfo: {
        flex: 1,
    },
    voiceName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    voiceGender: {
        fontSize: 13,
    },
    playBtn: {
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 12,
    },
    checkIcon: {
        marginLeft: 4,
    },
    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    saveBtn: {
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,
        elevation: 8,
    },
    saveBtnText: {
        color: '#FFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});
