// src/shared/components/layout/Header/index.tsx
import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Moon, Sun, ArrowLeft } from 'lucide-react';
import { useTheme } from '@/core/contexts/ThemeContext';
import { Logo } from '@/shared/components/ui/Logo';
import { cn } from '@/shared/utils/cn';

interface HeaderProps {
    title?: string;
    showBackButton?: boolean;
    onBackClick?: () => void;
    rightActions?: React.ReactNode;
    showLogo?: boolean;
    className?: string;
}

/**
 * Header Component
 * Fixed header with scroll animations and theme toggle
 */
export function Header({
    title = 'Brelness',
    showBackButton = false,
    onBackClick,
    rightActions,
    showLogo = true,
    className,
}: HeaderProps) {
    const { theme, toggleTheme } = useTheme();
    const [isScrolled, setIsScrolled] = useState(false);
    const { scrollY } = useScroll();

    // Background opacity animation on scroll
    const backgroundColor = useTransform(
        scrollY,
        [0, 100],
        ['rgba(255, 255, 255, 0)', 'rgba(255, 255, 255, 0.95)']
    );

    const darkBackgroundColor = useTransform(
        scrollY,
        [0, 100],
        ['rgba(17, 24, 39, 0)', 'rgba(17, 24, 39, 0.95)']
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
            className={cn(
                'fixed top-0 left-0 right-0 z-50 border-b transition-all duration-300',
                isScrolled
                    ? 'border-gray-200 dark:border-gray-700 shadow-lg'
                    : 'border-transparent',
                className
            )}
        >
            <div className="container mx-auto px-4 py-3">
                <div className="flex items-center justify-between">
                    {/* Left section */}
                    <div className="flex items-center space-x-4">
                        {showBackButton && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={onBackClick}
                                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
                                aria-label="Retour"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                            </motion.button>
                        )}

                        {showLogo ? (
                            <Logo size="sm" animated={false} showText />
                        ) : (
                            <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                                {title}
                            </h1>
                        )}
                    </div>

                    {/* Right section */}
                    <div className="flex items-center space-x-2">
                        {rightActions}

                        {/* Theme toggle button */}
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={toggleTheme}
                            className="p-2.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                            aria-label={
                                theme === 'light'
                                    ? 'Activer le mode sombre'
                                    : 'Activer le mode clair'
                            }
                        >
                            {theme === 'light' ? (
                                <Moon className="w-5 h-5 text-gray-700" />
                            ) : (
                                <Sun className="w-5 h-5 text-yellow-400" />
                            )}
                        </motion.button>

                        {/* Online indicator */}
                        <div className="relative">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute" />
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                        </div>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}

export default Header;
