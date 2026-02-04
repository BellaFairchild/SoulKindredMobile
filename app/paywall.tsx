import React, { useState } from 'react';
import { View, StyleSheet, Text, ActivityIndicator } from 'react-native';
import Paywall from 'react-native-purchases-ui';
import { useNavigation, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useTheme } from '@/context/AppTheme';
import { Ionicons } from '@expo/vector-icons';
import { isPremium, ENTITLEMENT_ID } from '@/services/revenuecat';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PaywallScreen() {
    const router = useRouter();
    const navigation = useNavigation();
    const { theme } = useTheme() as any;
    const insets = useSafeAreaInsets();
    const [loading, setLoading] = useState(false);

    // Callback when purchase is completed
    const onPurchaseCompleted = ({ customerInfo }: { customerInfo: any }) => {
        if (isPremium(customerInfo)) {
            console.log('Purchase successful, unlocking content...');
            router.back(); // Or navigate to a "Success" screen
        }
    };

    const onRestoreCompleted = ({ customerInfo }: { customerInfo: any }) => {
        if (isPremium(customerInfo)) {
            console.log('Restore successful');
            router.back();
        } else {
            console.log('Restore completed but no active entitlement found');
            // Optionally show an alert here
        }
    };

    return (
        <View style={[styles.container, { backgroundColor: theme.appBackground }]}>
            <StatusBar style="light" />

            <Paywall
                onPurchaseCompleted={onPurchaseCompleted}
                onRestoreCompleted={onRestoreCompleted}
                options={{
                    displayCloseButton: true,
                }}
                fontFamily={theme.typography.body}
            // You can customize colors here if the native UI allows, 
            // or rely on RevenueCat dashboard configuration
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});
