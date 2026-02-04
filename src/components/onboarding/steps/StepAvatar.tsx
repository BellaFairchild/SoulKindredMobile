import React from 'react';
import { View, Text, Pressable, StyleSheet, TextInput, Linking } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface Props {
    glbUrl: string;
    avatarId: string; // Not really used in UI but kept for state
    onUpdate: (data: { glbUrl: string; avatarId: string }) => void;
}

export default function StepAvatar({ glbUrl, onUpdate }: Props) {
    const handleOpenEditor = () => {
        Linking.openURL("https://soulkindred.readyplayer.me/avatar");
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Appearance</Text>
            <Text style={styles.subtitle}>Create your unique companion.</Text>

            <View style={styles.card}>
                <View style={styles.iconBox}>
                    <Ionicons name="shirt" size={32} color="#F922FF" />
                </View>
                <Text style={styles.cardTitle}>ReadyPlayerMe</Text>
                <Text style={styles.cardDesc}>
                    Design your companion using our visual editor. Copy the GLB URL when finished.
                </Text>

                <Pressable onPress={handleOpenEditor} style={styles.createBtn}>
                    <LinearGradient
                        colors={['#F922FF', '#5ED5FF']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientBtn}
                    >
                        <Text style={styles.createBtnText}>Open Avatar Creator</Text>
                        <Ionicons name="open-outline" size={18} color="#fff" style={{ marginLeft: 8 }} />
                    </LinearGradient>
                </Pressable>
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Paste Avatar URL</Text>
                <TextInput
                    style={styles.input}
                    value={glbUrl}
                    onChangeText={(text) => onUpdate({ glbUrl: text, avatarId: 'custom' })}
                    placeholder="https://models.readyplayer.me/..."
                    placeholderTextColor="rgba(255,255,255,0.3)"
                    autoCapitalize="none"
                />
                <Text style={styles.hint}>
                    Currently using default avatar if empty.
                </Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    title: { fontSize: 28, fontWeight: '900', color: '#fff', marginBottom: 8 },
    subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 24 },
    card: {
        padding: 24,
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 24,
        alignItems: 'center',
        marginBottom: 32,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.05)',
    },
    iconBox: {
        width: 64,
        height: 64,
        borderRadius: 32,
        backgroundColor: 'rgba(249, 34, 255, 0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    cardTitle: { fontSize: 20, fontWeight: '700', color: '#fff', marginBottom: 8 },
    cardDesc: {
        fontSize: 14,
        color: 'rgba(255,255,255,0.6)',
        textAlign: 'center',
        marginBottom: 24,
        lineHeight: 20
    },
    createBtn: {
        width: '100%',
        height: 50,
        borderRadius: 25,
        overflow: 'hidden',
    },
    gradientBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    createBtnText: {
        color: '#fff',
        fontWeight: '700',
        fontSize: 16,
    },
    inputContainer: { gap: 8 },
    label: {
        color: '#94a3b8',
        fontSize: 12,
        fontWeight: '700',
        textTransform: 'uppercase',
        letterSpacing: 1
    },
    input: {
        backgroundColor: '#0f172a',
        borderWidth: 1,
        borderColor: '#1e293b',
        borderRadius: 12,
        padding: 16,
        color: '#fff',
        fontSize: 14,
    },
    hint: {
        fontSize: 12,
        color: 'rgba(255,255,255,0.3)',
    },
});
