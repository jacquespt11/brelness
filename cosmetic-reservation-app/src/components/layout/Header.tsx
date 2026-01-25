// src/components/layout/Header.tsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import { motion, useScroll, useTransform } from 'framer-motion';

interface HeaderProps {
    title?: string;
    showBackButton?: boolean;
    onBackClick?: () => void;
    rightActions?: React.ReactNode;
}

/**
 * Header fixé avec animations au scroll
 */
const Header: React.FC<HeaderProps> = ({
    title = "Cosmetic Reservations",
    showBackButton = false,
    onBackClick,
    rightActions
}) => {
    const { theme, toggleTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollY } = useScroll();

    // Animation de l'opacité du background
    const backgroundColor = useTransform(
        scrollY,
        [0, 100],
        ["rgba(255, 255, 255, 0)", "rgba(255, 255, 255, 0.95)"]
    );

    const darkBackgroundColor = useTransform(
        scrollY,
        [0, 100],
        ["rgba(17, 24, 39, 0)", "rgba(17, 24, 39, 0.95)"]
    );

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <motion.header
            style={{
                backgroundColor: theme === 'dark' ? darkBackgroundColor : backgroundColor,
                backdropFilter: 'blur(10px)',
            }}
            className={`fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300 ${isScrolled
                ? 'border-gray-200 dark:border-gray-700 shadow-lg'
                : 'border-transparent'
                }`}
        >
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Partie gauche */}
                    <div className="flex items-center space-x-4">
                        {showBackButton && (
                            <button
                                onClick={onBackClick}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <span className="text-xl">←</span>
                            </button>
                        )}

                        <div className="flex items-center space-x-3">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.5 }}
                                className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center"
                            >
                                <span className="text-white text-xl">💄</span>
                            </motion.div>
                            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                                {title}
                            </h1>
                        </div>
                    </div>

                    {/* Partie droite */}
                    <div className="flex items-center space-x-2">
                        {rightActions}

                        {/* Bouton thème */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleTheme}
                            className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
                        >
                            {theme === 'light' ? '🌙' : '☀️'}
                        </motion.button>

                        {/* Indicateur en ligne */}
                        <div className="relative">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute" />
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.header>
    );
};

export default Header;