"use client";

import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(() => {
        // Pega o valor salvo no localStorage ou define como "escuro" por padrão
        if (typeof window !== "undefined") {
            return localStorage.getItem("theme") === "dark";
        }
        return true;
    });

    useEffect(() => {
        if (typeof window !== "undefined") {
            localStorage.setItem("theme", isDarkMode ? "dark" : "light");
        }
    }, [isDarkMode]);

    const toggleTheme = () => {
        setIsDarkMode((prevMode) => !prevMode);
    };

    return (
        <ThemeContext.Provider value={{ isDarkMode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

// Hook para facilitar o uso do contexto
export const useTheme = () => useContext(ThemeContext);
