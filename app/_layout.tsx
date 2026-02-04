import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Slot, useNavigationContainerRef } from 'expo-router';
import { View, Text } from 'react-native';
import { isRunningInExpoGo } from 'expo';
import * as Sentry from '@sentry/react-native';

// Sentry Configuration
const navigationIntegration = Sentry.reactNavigationIntegration({
    enableTimeToInitialDisplay: !isRunningInExpoGo(),
});

Sentry.init({
    dsn: 'https://93c9833d264cf2beff6fa702f39b8519@o4510812324495360.ingest.us.sentry.io/4510812325412864',
    debug: __DEV__,
    tracesSampleRate: 1.0,
    integrations: [
        navigationIntegration,
        Sentry.mobileReplayIntegration(),
    ],
    enableNativeFramesTracking: !isRunningInExpoGo(),
});

// Prevent auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => { });

import { ThemeProvider } from '@/context/AppTheme';
import { useFonts } from 'expo-font';
import { GoblinOne_400Regular } from '@expo-google-fonts/goblin-one';
import { Acme_400Regular } from '@expo-google-fonts/acme';
import { CarterOne_400Regular } from '@expo-google-fonts/carter-one';
import { Lora_400Regular } from '@expo-google-fonts/lora';
import { Angkor_400Regular } from '@expo-google-fonts/angkor';

import { AuthProvider } from '@/context/AuthContext';
import { OverlayProvider } from '@/context/OverlayContext';
import OverlayHost from '@/components/overlays/OverlayHost';
import { initRevenueCat } from '@/services/revenuecat';
import { SubscriptionProvider } from '@/context/SubscriptionContext';

function RootLayout() {
    console.log("RootLayout: FULL RESTORE - MOUNTING");

    // Capture Navigation for Sentry
    const ref = useNavigationContainerRef();
    useEffect(() => {
        if (ref) {
            navigationIntegration.registerNavigationContainer(ref);
        }
    }, [ref]);

    const [fontsLoaded, fontError] = useFonts({
        GoblinOne: GoblinOne_400Regular,
        Acme: Acme_400Regular,
        CarterOne: CarterOne_400Regular,
        Georgia: Lora_400Regular,
        Angkor: Angkor_400Regular,
    });

    useEffect(() => {
        if (fontsLoaded || fontError) {
            console.log("RootLayout: Fonts loaded/error, hiding Splash");
            SplashScreen.hideAsync();
        }
    }, [fontsLoaded, fontError]);

    if (!fontsLoaded && !fontError) {
        return (
            <View style={{ flex: 1, backgroundColor: '#030921', justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: 'white' }}>Loading Fonts...</Text>
            </View>
        );
    }

    return (
        <SafeAreaProvider>
            <ThemeProvider>
                <OverlayProvider>
                    <OverlayHost />
                    <AuthProvider>
                        <SubscriptionProvider>
                            <View style={{ flex: 1, backgroundColor: '#030921' }}>
                                <Slot />
                            </View>
                        </SubscriptionProvider>
                    </AuthProvider>
                </OverlayProvider>
            </ThemeProvider>
        </SafeAreaProvider>
    );
}

export default Sentry.wrap(RootLayout);
