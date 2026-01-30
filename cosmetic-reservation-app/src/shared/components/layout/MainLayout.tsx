// src/shared/components/layout/MainLayout.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { DESIGN } from '@/shared/constants/design';

interface MainLayoutProps {
    showHeader?: boolean;
    headerTitle?: string;
    headerActions?: React.ReactNode;
    showLogo?: boolean;
    className?: string;
}

/**
 * Main Layout Component
 * Simple layout with header and animated content
 */
export function MainLayout({
    showHeader = true,
    headerTitle,
    headerActions,
    showLogo = true,
    className = '',
}: MainLayoutProps) {
    return (
        <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${className}`}>
            {showHeader && (
                <Header
                    title={headerTitle}
                    rightActions={headerActions}
                    showLogo={showLogo}
                />
            )}

            <main className={showHeader ? 'pt-16' : ''}>
                <motion.div
                    initial="initial"
                    animate="animate"
                    exit="exit"
                    variants={DESIGN.animations.slideUp}
                    transition={DESIGN.transitions.default}
                    className="container mx-auto px-4 py-6"
                >
                    <Outlet />
                </motion.div>
            </main>
        </div>
    );
}

export default MainLayout;
