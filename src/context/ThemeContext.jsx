// src/context/ThemeContext.jsx
import React, { createContext, useContext, useMemo, useState } from "react";
import { darkTheme, lightTheme } from "../styles/themes";

const ThemeContext = createContext({
  theme: darkTheme,
  mode: "dark",
  setMode: () => {}
});

export function ThemeProvider({ children }) {
  const [mode, setMode] = useState("dark");

  const value = useMemo(
    () => ({
      theme: mode === "dark" ? darkTheme : lightTheme,
      mode,
      setMode
    }),
    [mode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  return useContext(ThemeContext);
}

export default ThemeContext;
