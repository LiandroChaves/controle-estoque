"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme");
            setIsDarkMode(savedTheme === "dark");
        }
    }, []);

    useEffect(() => {
        if (isDarkMode !== null) {
            localStorage.setItem("theme", isDarkMode ? "dark" : "light");
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {isDarkMode !== null ? children : null}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => useContext(ThemeContext);
