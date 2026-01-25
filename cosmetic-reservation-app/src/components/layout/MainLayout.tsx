// src/components/layout/MainLayout.tsx
import React from 'react';
import { motion } from 'framer-motion';
import Header from './Header';
import Sidebar from './Sidebar';

interface MainLayoutProps {
    children: React.ReactNode;
    showSidebar?: boolean;
    showHeader?: boolean;
    headerTitle?: string;
    headerActions?: React.ReactNode;
}

/**
 * Layout principal avec animations de transition
 */
const MainLayout: React.FC<MainLayoutProps> = ({
    children,
    showSidebar = false,
    showHeader = true,
    headerTitle,
    headerActions
}) => {
    const pageVariants = {
        initial: {
            opacity: 0,
            y: 20
        },
        in: {
            opacity: 1,
            y: 0
        },
        out: {
            opacity: 0,
            y: -20
        }
    };

    const pageTransition = {
        type: "tween",
        ease: "anticipate",
        duration: 0.3
    } as const;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            {showHeader && (
                <Header
                    title={headerTitle}
                    rightActions={headerActions}
                />
            )}

            <div className="flex">
                {showSidebar && <Sidebar />}

                <main className={`flex-1 ${showHeader ? 'pt-16' : ''} ${showSidebar ? 'ml-64' : ''}`}>
                    <motion.div
                        initial="initial"
                        animate="in"
                        exit="out"
                        variants={pageVariants}
                        transition={pageTransition}
                        className="container mx-auto px-4 py-6"
                    >
                        {children}
                    </motion.div>
                </main>
            </div>
        </div>
    );
};

export default MainLayout;