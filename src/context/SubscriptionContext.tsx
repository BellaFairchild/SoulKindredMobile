import React, { createContext, useContext, useEffect, useState } from 'react';
import Purchases, { CustomerInfo } from 'react-native-purchases';
import { isPremium, initRevenueCat } from '@/services/revenuecat';

type SubscriptionContextType = {
    isPremium: boolean;
    isLoading: boolean;
    refresh: () => Promise<void>;
};

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: React.ReactNode }) {
    const [premium, setPremium] = useState(false);
    const [loading, setLoading] = useState(true);

    const updateState = (info: CustomerInfo) => {
        const active = isPremium(info);
        setPremium(active);
        setLoading(false);
    };

    const refresh = async () => {
        try {
            const info = await Purchases.getCustomerInfo();
            updateState(info);
        } catch (e) {
            console.warn('Failed to refresh subscription status', e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const init = async () => {
            // Ensure SDK is initialized first!
            await initRevenueCat();
            refresh();
        };
        init();

        // Listen for updates (purchases, restores, etc.)
        const listener = (info: CustomerInfo) => {
            console.log('Customer Info Updated:', info);
            updateState(info);
        };

        Purchases.addCustomerInfoUpdateListener(listener);

        return () => {
            // Cleanup listener if supported/needed, though usually global
            // React Native Purchases SDK handles listener removal differently in newer versions or
            // it might not expose a direct remove method for the anonymous function easily without storing reference.
            // But typically for App-level context, this is fine.
        };
    }, []);

    return (
        <SubscriptionContext.Provider value={{ isPremium: premium, isLoading: loading, refresh }}>
            {children}
        </SubscriptionContext.Provider>
    );
}

export function useSubscription() {
    const context = useContext(SubscriptionContext);
    if (!context) {
        throw new Error('useSubscription must be used within a SubscriptionProvider');
    }
    return context;
}
