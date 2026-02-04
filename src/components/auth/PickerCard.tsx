import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface PickerCardProps {
    title: string;
    description?: string;
    icon?: keyof typeof Ionicons.glyphMap;
    imageUrl?: string;
    iconBgColor?: string;
    selected: boolean;
    onSelect: () => void;
    variant?: 'default' | 'compact' | 'language';
    children?: React.ReactNode;
}

export default function PickerCard({
    title,
    description,
    icon,
    imageUrl,
    iconBgColor = '#F5F5FA',
    selected,
    onSelect,
    variant = 'default',
    children
}: PickerCardProps) {
    return (
        <TouchableOpacity
            onPress={onSelect}
            style={[
                styles.container,
                selected && styles.containerSelected,
                variant === 'language' && styles.containerLanguage
            ]}
            activeOpacity={0.7}
        >
            <View style={styles.header}>
                <View style={[styles.imageContainer, { backgroundColor: iconBgColor }]}>
                    {imageUrl ? (
                        <Image source={{ uri: imageUrl }} style={styles.image} resizeMode="contain" />
                    ) : (
                        <Ionicons name={icon || 'sparkles'} size={variant === 'default' ? 24 : 20} color={selected ? '#F922FF' : '#3062C8'} />
                    )}
                </View>

                <View style={styles.textContainer}>
                    <Text style={[styles.title, selected && styles.titleSelected]}>{title}</Text>
                    {description && <Text style={styles.description}>{description}</Text>}
                </View>

                <View style={[styles.checkbox, selected && styles.checkboxSelected]}>
                    {selected && <Ionicons name="checkmark" size={16} color="#fff" />}
                </View>
            </View>
            {selected && children && (
                <View style={styles.childrenContainer}>
                    {children}
                </View>
            )}
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 32,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.05)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 10,
        elevation: 2,
    },
    containerLanguage: {
        paddingVertical: 12,
        borderRadius: 40,
    },
    containerSelected: {
        borderColor: 'rgba(249, 34, 255, 0.3)',
        backgroundColor: 'rgba(249, 34, 255, 0.02)',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    childrenContainer: {
        marginTop: 16,
        paddingTop: 16,
        borderTopWidth: 1,
        borderTopColor: 'rgba(0,0,0,0.05)',
        width: '100%',
    },
    imageContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    textContainer: {
        flex: 1,
        marginLeft: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: '900',
        color: '#000',
        marginBottom: 2,
        fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    titleSelected: {
        color: '#000',
    },
    description: {
        fontSize: 14,
        color: 'rgba(0,0,0,0.3)',
        fontWeight: '500',
    },
    checkbox: {
        width: 28,
        height: 28,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: 'rgba(0,0,0,0.1)',
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 12,
    },
    checkboxSelected: {
        backgroundColor: '#24D18B',
        borderColor: '#24D18B',
    },
});
