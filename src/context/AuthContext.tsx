import React, { createContext, useContext, useEffect, useState } from 'react';
import { ClerkProvider, useAuth as useClerkAuth, useUser } from "@clerk/clerk-expo";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ConvexReactClient } from "convex/react";
import * as SecureStore from "expo-secure-store";

// Convex Client Setup
const convexUrl = process.env.EXPO_PUBLIC_CONVEX_URL;
const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY;

if (!convexUrl || !publishableKey) {
    console.error("Missing Convex/Clerk environment variables! Check .env");
}

const convex = new ConvexReactClient(convexUrl || "", {
    unsavedChangesWarning: false,
});

// Token Cache for Clerk (adapts SecureStore for Clerk's usage)
const tokenCache = {
    async getToken(key: string) {
        try {
            return await SecureStore.getItemAsync(key);
        } catch (error) {
            console.error("SecureStore get item error: ", error);
            return null;
        }
    },
    async saveToken(key: string, value: string) {
        try {
            return await SecureStore.setItemAsync(key, value);
        } catch (error) {
            console.error("SecureStore set item error: ", error);
            return;
        }
    },
};

// Legacy AuthContext Shape (to minimize refactoring elsewhere for now)
interface AuthContextType {
    user: any | null; // Clerk User
    loading: boolean;
    login: () => void; // Placeholder, Clerk handles UI usually
    logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Wrapper Component that provides the Context
function AuthContextWrapper({ children }: { children: React.ReactNode }) {
    const { user, isLoaded } = useUser();
    const { signOut } = useClerkAuth();

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (isLoaded) {
            setLoading(false);
        }
    }, [isLoaded]);

    const logout = async () => {
        await signOut();
    };

    // Placeholder login - usually we just redirect to a SignedOut view which has <SignIn />
    const login = () => {
        console.log("Trigger login flow logic here if needed");
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

// Main Provider
export function AuthProvider({ children }: { children: React.ReactNode }) {
    if (!publishableKey) {
        return null; // Or Error Text
    }

    return (
        <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
            <ConvexProviderWithClerk client={convex} useAuth={useClerkAuth}>
                <AuthContextWrapper>
                    {children}
                </AuthContextWrapper>
            </ConvexProviderWithClerk>
        </ClerkProvider>
    );
}

// Hook for consuming auth
export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        // Graceful fallback for components inside Clerk but outside our wrapper?
        // Usually we throw, but for migration safety:
        return { user: null, loading: true, login: () => { }, logout: async () => { } };
    }
    return context;
}



