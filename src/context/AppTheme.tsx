import React, { createContext, useContext, useMemo, useState } from "react";

const ThemeContext = createContext<any>(null);

// --------------------------------------------------
// 🌞 LIGHT THEME
// --------------------------------------------------
const lightTheme = {
    mode: "light",
    appBackground: "#F6F8FF",
    chatGradient: ["#FDFBFF", "#EAF8FF"],

    // Brand Colors
    primary: "#38BDF8",
    secondary: "#22D3EE",
    accent: "#8B5CF6",
    alert: "#F922FF",
    neutral: "#FFFFFF",
    neutralDark: "#1E293B",

    // Chat bubbles
    userBubbleBg: "#D8EEFF",
    userBubbleBorder: "rgba(35,150,224,0.25)",
    userBubbleText: "#123333",

    aiBubbleBg: "#FFE3FB",
    aiBubbleBorder: "rgba(255,0,251,0.18)",
    aiBubbleText: "#222222",

    // Mood glow colors
    moodColors: {
        happy: { border: "#FFD166", shadow: "rgba(255,209,102,0.6)" },
        calm: { border: "#7AF7F3", shadow: "rgba(122,247,243,0.6)" },
        sad: { border: "#8ECAE6", shadow: "rgba(142,202,230,0.6)" },
        anxious: { border: "#FF9AFB", shadow: "rgba(255,154,251,0.6)" },
        overwhelmed: { border: "#FF6B6B", shadow: "rgba(255,107,107,0.6)" },
        default: { border: "#FFFFFF", shadow: "rgba(0,0,0,0.15)" }
    },
    typography: {
        h1: "GoblinOne",
        h2: "Acme",
        h3: "CarterOne",
        main: "Georgia",
        button: "Angkor",
    }
};

const darkTheme = {
    mode: "dark",
    appBackground: "#030921", // Deep base
    chatGradient: ["#1E293B", "#0F172A"], // Using Neutral Dark gradient

    // Brand Colors
    primary: "#38BDF8",
    secondary: "#22D3EE",
    accent: "#8B5CF6",
    alert: "#F922FF",
    neutral: "#FFFFFF",
    neutralDark: "#1E293B",

    // Chat bubbles
    userBubbleBg: "rgba(56, 189, 248, 0.25)", // Using Primary
    userBubbleBorder: "rgba(56, 189, 248, 0.45)",
    userBubbleText: "#EAFBFF",

    aiBubbleBg: "rgba(139, 92, 246, 0.35)", // Using Accent
    aiBubbleBorder: "rgba(139, 92, 246, 0.45)",
    aiBubbleText: "#FFE9FF",

    // Mood glow colors
    moodColors: {
        happy: { border: "#FFD166", shadow: "rgba(255,209,102,0.8)" },
        calm: { border: "#7AF7F3", shadow: "rgba(122,247,243,0.8)" },
        sad: { border: "#8ECAE6", shadow: "rgba(142,202,230,0.8)" },
        anxious: { border: "#FF9AFB", shadow: "rgba(255,154,251,0.8)" },
        overwhelmed: { border: "#FF6B6B", shadow: "rgba(255,107,107,0.8)" },
        default: { border: "#38BDF8", shadow: "rgba(56, 189, 248, 0.5)" }
    },
    typography: {
        h1: "GoblinOne",
        h2: "Acme",
        h3: "CarterOne",
        main: "Georgia",
        button: "Angkor",
    }
};

// --------------------------------------------------
// PROVIDER
// --------------------------------------------------
export function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [theme, setTheme] = useState(lightTheme);

    const toggleTheme = () => {
        setTheme((prev) => (prev.mode === "light" ? darkTheme : lightTheme));
    };

    const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
}

// --------------------------------------------------
// HOOK
// --------------------------------------------------
export function useTheme() {
    const ctx = useContext(ThemeContext);
    if (!ctx) {
        throw new Error("useTheme must be used inside ThemeProvider");
    }
    return ctx;
}
