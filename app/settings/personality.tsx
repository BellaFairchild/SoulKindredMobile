import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Switch, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/AppTheme';
import { useAppStore } from '@/state/store';
import { COMPANION_TRAITS } from '@/utils/constants';
import Slider from '@react-native-community/slider';

export default function PersonalitySettingsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { theme } = useTheme() as any;
    const isLight = theme.mode === 'light';
    const {
        companionTraits,
        setCompanionTraits,
        companionIntensity,
        setCompanionIntensity
    } = useAppStore();

    // Local State for changes before saving
    const [selectedTraits, setSelectedTraits] = useState<string[]>(companionTraits || []);
    const [intensity, setIntensity] = useState<number>(companionIntensity || 50);

    const handleSave = () => {
        setCompanionTraits(selectedTraits);
        setCompanionIntensity(intensity);
        router.back();
    };

    const toggleTrait = (id: string) => {
        if (selectedTraits.includes(id)) {
            setSelectedTraits(prev => prev.filter(t => t !== id));
        } else {
            // Optional: Limit max traits? For now allow all.
            setSelectedTraits(prev => [...prev, id]);
        }
    };

    const renderItem = ({ item }: { item: any }) => {
        const isSelected = selectedTraits.includes(item.id);

        return (
            <TouchableOpacity
                style={[
                    styles.card,
                    {
                        backgroundColor: isSelected ? 'rgba(76, 201, 240, 0.15)' : 'rgba(255,255,255,0.03)',
                        borderColor: isSelected ? theme.primary : 'rgba(255,255,255,0.05)'
                    }
                ]}
                onPress={() => toggleTrait(item.id)}
            >
                <View style={styles.cardInfo}>
                    <Text style={[styles.name, { color: theme.text }]}>{item.name}</Text>
                    <Text style={[styles.description, { color: theme.secondary }]}>
                        {item.description}
                    </Text>
                </View>

                <View style={[
                    styles.checkbox,
                    {
                        borderColor: isSelected ? theme.primary : theme.secondary,
                        backgroundColor: isSelected ? theme.primary : 'transparent'
                    }
                ]}>
                    {isSelected && <Ionicons name="checkmark" size={16} color="#FFF" />}
                </View>
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
                <Text style={[styles.title, { color: theme.text }]}>Proprietary Personality</Text>
            </View>

            <FlatList
                data={COMPANION_TRAITS}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                extraData={selectedTraits}
                contentContainerStyle={[styles.listContent, { paddingBottom: 150 }]}
                ListHeaderComponent={() => (
                    <View style={styles.sliderContainer}>
                        <Text style={[styles.sectionTitle, { color: theme.text }]}>
                            Points Intensity: {Math.round(intensity)}%
                        </Text>
                        <Text style={{ color: theme.secondary, fontSize: 13, marginBottom: 10 }}>
                            Adjust how strongly these traits manifest.
                        </Text>
                        <Slider
                            style={{ width: '100%', height: 40 }}
                            minimumValue={0}
                            maximumValue={100}
                            value={intensity}
                            onValueChange={setIntensity} // Live update local state
                            minimumTrackTintColor={theme.primary}
                            maximumTrackTintColor={theme.secondary}
                            thumbTintColor={theme.primary}
                        />
                    </View>
                )}
            />

            {/* Save Button */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <TouchableOpacity
                    style={[styles.saveBtn, { backgroundColor: theme.primary }]}
                    onPress={handleSave}
                >
                    <Text style={styles.saveBtnText}>Save Configuration</Text>
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
    sliderContainer: {
        marginBottom: 20,
        backgroundColor: 'rgba(255,255,255,0.03)',
        padding: 16,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
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
        paddingRight: 10,
    },
    name: {
        fontSize: 17,
        fontWeight: '600',
        marginBottom: 4,
    },
    description: {
        fontSize: 13,
        lineHeight: 18,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderRadius: 6,
        borderWidth: 2,
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
