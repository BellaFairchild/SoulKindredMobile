import React from 'react';
import { useLocalSearchParams, Stack, Redirect } from 'expo-router';
import { View, Text, ActivityIndicator } from 'react-native';
import { ProfileSettingsScreen, ProfileSettingsScreenProps } from '@/features/profile/ProfileSettingsScreen';

// Type Guard for runtime validation
function isValidSection(section: unknown): section is ProfileSettingsScreenProps['section'] {
    return (
        typeof section === 'string' &&
        ['account', 'notifications', 'privacy', 'general'].includes(section)
    );
}

export default function ProfileSettingsRoute() {
    const { section } = useLocalSearchParams();

    // Handle loading or undefined state
    if (!section) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#030921' }}>
                <ActivityIndicator size="large" color="#4ade80" />
            </View>
        );
    }

    // Strict Validation
    // If param is array (e.g. /settings/account/more), take first, or fail.
    const sectionStr = Array.isArray(section) ? section[0] : section;

    if (!isValidSection(sectionStr)) {
        // Fallback to general or 404
        // For now, redirect to general if invalid
        return <Redirect href="/profile/settings/general" />;
    }

    return (
        <>
            <Stack.Screen
                options={{
                    title: sectionStr.charAt(0).toUpperCase() + sectionStr.slice(1),
                    headerStyle: { backgroundColor: '#030921' },
                    headerTintColor: '#fff',
                }}
            />
            <ProfileSettingsScreen section={sectionStr} />
        </>
    );
}
