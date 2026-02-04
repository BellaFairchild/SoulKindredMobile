import React from 'react';
import { View, StyleSheet } from 'react-native';
import { CustomerCenter } from 'react-native-purchases-ui';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/context/AppTheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

export default function CustomerCenterScreen() {
    const { theme } = useTheme() as any;
    const insets = useSafeAreaInsets();
    const router = useRouter();

    return (
        <View style={[styles.container, { backgroundColor: theme.appBackground, paddingTop: insets.top }]}>
            <StatusBar style="light" />
            <CustomerCenter
                onDismiss={() => {
                    if (router.canGoBack()) {
                        router.back();
                    } else {
                        router.replace('/(drawer)/settings');
                    }
                }}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
