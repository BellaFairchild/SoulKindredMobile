import React, { createContext, useContext, useState, ReactNode } from 'react';

type OverlayType = 'breath' | 'tapping' | 'body' | 'daily_drop' | 'burn' | 'levelup' | null;

interface OverlayContextType {
    activeOverlay: OverlayType;
    showOverlay: (type: OverlayType) => void;
    closeOverlay: () => void;
}

const OverlayContext = createContext<OverlayContextType | undefined>(undefined);

export function OverlayProvider({ children }: { children: ReactNode }) {
    const [activeOverlay, setActiveOverlay] = useState<OverlayType>(null);

    const showOverlay = (type: OverlayType) => setActiveOverlay(type);
    const closeOverlay = () => setActiveOverlay(null);

    return (
        <OverlayContext.Provider value={{ activeOverlay, showOverlay, closeOverlay }}>
            {children}
        </OverlayContext.Provider>
    );
}

export function useOverlay() {
    const context = useContext(OverlayContext);
    if (context === undefined) {
        throw new Error('useOverlay must be used within an OverlayProvider');
    }
    return context;
}
