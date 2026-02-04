import Purchases, { PurchasesPackage, CustomerInfo, LOG_LEVEL } from 'react-native-purchases';
import { Platform } from 'react-native';

// Keys should be in .env: EXPO_PUBLIC_RC_IOS, EXPO_PUBLIC_RC_ANDROID
const API_KEY_IOS = process.env.EXPO_PUBLIC_RC_IOS || '';
const API_KEY_ANDROID = process.env.EXPO_PUBLIC_RC_ANDROID || '';

// The entitlement ID from RevenueCat dashboard
export const ENTITLEMENT_ID = 'Soul Kindred Premium';

type EntitlementStatus = 'active' | 'inactive';

// Initialize the SDK
export const initRevenueCat = async () => {
  try {
    if (Platform.OS === 'ios' && API_KEY_IOS) {
      await Purchases.configure({ apiKey: API_KEY_IOS });
    } else if (Platform.OS === 'android' && API_KEY_ANDROID) {
      await Purchases.configure({ apiKey: API_KEY_ANDROID });
    } else {
      console.warn('RevenueCat API keys not found via initRevenueCat.');
      return;
    }

    // Set log level for debugging
    await Purchases.setLogLevel(LOG_LEVEL.DEBUG);
  } catch (error: any) {
    if (error.message?.includes("Invalid API key") || error.message?.includes("native store is not available")) {
      console.warn("RevenueCat Initialization Skipped: Running in Expo Go without Test Store key.");
      // App continues in "Free" mode gracefully
    } else {
      console.error("RevenueCat Init Error:", error);
    }
  }
};

export const fetchOfferings = async (): Promise<PurchasesPackage[]> => {
  try {
    const offerings = await Purchases.getOfferings();
    if (offerings.current && offerings.current.availablePackages.length > 0) {
      return offerings.current.availablePackages;
    }
  } catch (e) {
    console.error('Error fetching offerings:', e);
  }
  return [];
};

export const getCustomerInfo = async (): Promise<CustomerInfo | null> => {
  try {
    return await Purchases.getCustomerInfo();
  } catch (e) {
    console.error('Error getting customer info:', e);
    return null;
  }
};

export const purchasePackage = async (pack: PurchasesPackage): Promise<boolean> => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pack);
    return isPremium(customerInfo);
  } catch (e: any) {
    if (!e.userCancelled) {
      console.error('Error purchasing package:', e);
    }
    return false;
  }
};

export const restorePurchases = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    return isPremium(customerInfo);
  } catch (e) {
    console.error('Error restoring purchases:', e);
    return false;
  }
};

// Helper status check
export const isPremium = (info: CustomerInfo | null): boolean => {
  if (!info) return false;
  const entitlement = info.entitlements.active[ENTITLEMENT_ID];
  return !!entitlement; // true if active
};

export type { PurchasesPackage, CustomerInfo, EntitlementStatus };
