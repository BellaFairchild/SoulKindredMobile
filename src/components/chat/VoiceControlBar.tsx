import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/AppTheme';

export const VoiceControlBar = () => {
    const { theme } = useTheme();
    const insets = useSafeAreaInsets();
    const isLight = theme.mode === 'light';

    return (
        <View style={[styles.container, { paddingBottom: insets.bottom + 10 }]}>
            <LinearGradient
                colors={isLight ? ['#F8FAFC', '#F8FAFC'] : ['#7C3AED', '#8B5CF6']}
                start={{ x: 0, y: 1 }}
                end={{ x: 1, y: 0 }}
                style={StyleSheet.absoluteFill}
            />

            <View style={styles.row}>
                <NavItem icon="headset" label="Audio" />
                <NavItem icon="chatbubbles" label="Chat" />

                {/* Main Talk Button */}
                <View style={styles.talkBtnWrapper}>
                    <LinearGradient
                        colors={[theme.secondary, theme.alert]}
                        style={styles.talkGradient}
                    >
                        <Ionicons name="mic" size={32} color="#FFF" />
                    </LinearGradient>
                    <Text style={[styles.label, { marginTop: 4, color: '#FFF' }]}>TALK</Text>
                </View>

                <NavItem icon="desktop" label="Screen" />
                <NavItem icon="person-add" label="Invite" />
            </View>
        </View>
    );
};

const NavItem = ({ icon, label }: { icon: any, label: string }) => (
    <Pressable style={styles.navItem}>
        <Ionicons name={icon} size={24} color="rgba(255,255,255,0.7)" />
        <Text style={styles.label}>{label}</Text>
    </Pressable>
);

const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingTop: 16,
        borderTopLeftRadius: 32,
        borderTopRightRadius: 32,
        // elevation: 20, // Shadow handled by native or specific gradient
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'flex-end', // Align text baselineish
        paddingHorizontal: 16,
    },
    navItem: {
        alignItems: 'center',
        padding: 8,
    },
    label: {
        color: 'rgba(255,255,255,0.7)',
        fontSize: 12,
        marginTop: 4,
        fontWeight: '600',
    },
    talkBtnWrapper: {
        alignItems: 'center',
        marginBottom: 20, // Push up
    },
    talkGradient: {
        width: 72,
        height: 72,
        borderRadius: 36,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#F922FF",
        shadowOpacity: 0.5,
        shadowRadius: 16,
        elevation: 10,
        borderWidth: 4,
        borderColor: 'rgba(255,255,255,0.2)',
    }
});
