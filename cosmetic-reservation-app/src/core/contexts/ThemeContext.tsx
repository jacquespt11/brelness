// src/core/contexts/ThemeContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

/**
 * Theme context type definition
 */
interface ThemeContextType {
    theme: 'light' | 'dark';
    toggleTheme: () => void;
    setTheme: (theme: 'light' | 'dark') => void;
}

/**
 * Create theme context with undefined default
 */
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Theme Provider Component
 * Manages theme state and persists to localStorage
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
    const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
        const savedTheme = localStorage.getItem('brelness-theme');
        return (savedTheme as 'light' | 'dark') || 'light';
    });

    /**
     * Toggle between light and dark themes
     */
    const toggleTheme = () => {
        setThemeState(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('brelness-theme', newTheme);
            return newTheme;
        });
    };

    /**
     * Set theme directly
     */
    const setTheme = (newTheme: 'light' | 'dark') => {
        setThemeState(newTheme);
        localStorage.setItem('brelness-theme', newTheme);
    };

    // Apply theme to document HTML on change
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

/**
 * Custom hook to use theme context
 * @throws Error if used outside ThemeProvider
 */
export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
}
