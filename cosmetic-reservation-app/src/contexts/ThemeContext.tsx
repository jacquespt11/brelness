// src/contexts/ThemeContext.tsx
import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

/*
Interface pour le type de contexte thématique
*/
interface ThemeContextType {
    theme: string;
    toggleTheme: () => void;
}

/*
Crée un contexte avec une valeur par défaut
*/
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

/**
 * Fournisseur de contexte qui entoure l'application
 * Gère l'état du thème et le persiste dans localStorage
 */
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const [theme, setTheme] = useState<string>(() => {
        const savedTheme = localStorage.getItem('cosmetic-theme');
        return savedTheme || 'light';
    });

    /**
     * Bascule entre les thèmes sombre et clair
     * Sauvegarde le choix dans localStorage
     */
    const toggleTheme = () => {
        setTheme(prevTheme => {
            const newTheme = prevTheme === 'light' ? 'dark' : 'light';
            localStorage.setItem('cosmetic-theme', newTheme);
            return newTheme;
        });
    };

    // Applique le thème au document HTML à chaque changement
    useEffect(() => {
        const root = document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

/**
 * Hook personnalisé pour utiliser le contexte du thème
 * @returns {Object} { theme, toggleTheme }
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme doit être utilisé dans ThemeProvider');
    }
    return context;
};