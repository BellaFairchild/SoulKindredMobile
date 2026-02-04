import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useTheme } from '@/context/AppTheme';
import { useAppStore } from '@/state/store';

const AGE_OPTIONS = ['Young Adult', 'Adult', 'Middle Aged', 'Wise Elder', 'Timeless'];
const GENDER_OPTIONS = ['Female', 'Male', 'Non-binary', 'Fluid'];

export default function IdentitySettingsScreen() {
    const insets = useSafeAreaInsets();
    const router = useRouter();
    const { theme } = useTheme() as any;
    const isLight = theme.mode === 'light';
    const {
        companionName, setCompanionName,
        companionAge, setCompanionAge,
        companionGender, setCompanionGender
    } = useAppStore();

    // Local state
    const [name, setName] = useState(companionName);
    const [age, setAge] = useState(companionAge);
    const [gender, setGender] = useState(companionGender);

    const handleSave = () => {
        setCompanionName(name);
        setCompanionAge(age);
        setCompanionGender(gender);
        router.back();
    };

    const SelectableChip = ({ label, selected, onSelect }: any) => (
        <TouchableOpacity
            onPress={onSelect}
            style={[
                styles.chip,
                {
                    backgroundColor: selected ? theme.primary : 'rgba(255,255,255,0.05)',
                    borderColor: selected ? theme.primary : 'rgba(255,255,255,0.1)'
                }
            ]}
        >
            <Text style={{ color: selected ? '#FFF' : theme.text, fontWeight: '600' }}>{label}</Text>
        </TouchableOpacity>
    );

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
                <Text style={[styles.title, { color: theme.text }]}>Companion Identity</Text>
            </View>

            <ScrollView contentContainerStyle={styles.content}>

                {/* Name Input */}
                <View style={styles.section}>
                    <Text style={[styles.label, { color: theme.secondary }]}>NAME</Text>
                    <TextInput
                        style={[styles.input, { color: theme.text, backgroundColor: isLight ? 'rgba(0,0,0,0.03)' : 'rgba(255,255,255,0.05)' }]}
                        value={name}
                        onChangeText={setName}
                        placeholder="e.g. Athena"
                        placeholderTextColor={theme.secondary}
                    />
                </View>

                {/* Age Selection */}
                <View style={styles.section}>
                    <Text style={[styles.label, { color: theme.secondary }]}>AGE RANGE</Text>
                    <View style={styles.chipContainer}>
                        {AGE_OPTIONS.map((opt) => (
                            <SelectableChip
                                key={opt}
                                label={opt}
                                selected={age === opt}
                                onSelect={() => setAge(opt)}
                            />
                        ))}
                    </View>
                </View>

                {/* Gender Selection */}
                <View style={styles.section}>
                    <Text style={[styles.label, { color: theme.secondary }]}>GENDER IDENTITY</Text>
                    <View style={styles.chipContainer}>
                        {GENDER_OPTIONS.map((opt) => (
                            <SelectableChip
                                key={opt}
                                label={opt}
                                selected={gender === opt}
                                onSelect={() => setGender(opt)}
                            />
                        ))}
                    </View>
                </View>

            </ScrollView>

            {/* Save Button */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 20 }]}>
                <TouchableOpacity
                    style={[styles.saveBtn, { backgroundColor: theme.primary }]}
                    onPress={handleSave}
                >
                    <Text style={styles.saveBtnText}>Save Identity</Text>
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
    content: {
        padding: 24,
    },
    section: {
        marginBottom: 32,
    },
    label: {
        fontSize: 12,
        fontWeight: '700',
        marginBottom: 12,
        letterSpacing: 1,
    },
    input: {
        height: 56,
        borderRadius: 16,
        paddingHorizontal: 20,
        fontSize: 18,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.1)',
    },
    chipContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    chip: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 24,
        borderWidth: 1,
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
