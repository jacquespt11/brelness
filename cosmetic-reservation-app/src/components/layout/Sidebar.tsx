// src/components/layout/Sidebar.tsx
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Sidebar avec animations et sous-menus
 */
const Sidebar: React.FC = () => {
    const { theme } = useTheme();
    const [isCollapsed, setIsCollapsed] = useState(false);

    const navItems = [
        {
            path: '/admin',
            icon: '📊',
            label: 'Tableau de bord',
            exact: true
        },
        {
            path: '/admin/reservations',
            icon: '📋',
            label: 'Réservations',
            badge: 5 // Nombre dynamique à connecter
        },
        {
            path: '/admin/products',
            icon: '💄',
            label: 'Produits'
        },
        {
            path: '/admin/customers',
            icon: '👥',
            label: 'Clients'
        },
        {
            path: '/admin/analytics',
            icon: '📈',
            label: 'Analytiques'
        }
    ];

    const secondaryItems = [
        {
            path: '/admin/settings',
            icon: '⚙️',
            label: 'Paramètres'
        },
        {
            path: '/',
            icon: '←',
            label: 'Retour au site'
        }
    ];

    return (
        <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            transition={{ type: "spring", damping: 25 }}
            className={`fixed left-0 top-0 h-full ${isCollapsed ? 'w-16' : 'w-64'
                } bg-white dark:bg-gray-800 shadow-xl z-40 transition-all duration-300`}
        >
            {/* Bouton de réduction */}
            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full p-1.5 shadow-lg hover:shadow-xl transition-shadow"
            >
                <span className="text-gray-600 dark:text-gray-400">
                    {isCollapsed ? '→' : '←'}
                </span>
            </button>

            {/* Logo */}
            <div className={`p-6 border-b border-gray-200 dark:border-gray-700 ${isCollapsed ? 'text-center' : ''}`}>
                <NavLink to="/admin" className="flex items-center space-x-3">
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                        className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center"
                    >
                        <span className="text-white text-xl">💄</span>
                    </motion.div>

                    <AnimatePresence>
                        {!isCollapsed && (
                            <motion.div
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: 'auto' }}
                                exit={{ opacity: 0, width: 0 }}
                                className="overflow-hidden"
                            >
                                <div>
                                    <h1 className="text-lg font-bold text-gray-800 dark:text-white">
                                        Cosmetic Admin
                                    </h1>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Gestion des réservations
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </NavLink>
            </div>

            {/* Navigation principale */}
            <nav className="p-4">
                <ul className="space-y-1">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                end={item.exact}
                                className={({ isActive }) => `
                  flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} 
                  px-4 py-3 rounded-lg transition-all duration-200
                  ${isActive
                                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }
                `}
                            >
                                <span className="text-lg relative">
                                    {item.icon}
                                    {item.badge && (
                                        <span className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
                                    )}
                                </span>

                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="font-medium flex-1"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>

                                {item.badge && !isCollapsed && (
                                    <span className="px-2 py-1 text-xs bg-purple-600 text-white rounded-full">
                                        {item.badge}
                                    </span>
                                )}
                            </NavLink>
                        </li>
                    ))}
                </ul>

                {/* Séparateur */}
                <div className={`my-4 border-t border-gray-200 dark:border-gray-700 ${isCollapsed ? 'mx-2' : 'mx-4'}`} />

                {/* Navigation secondaire */}
                <ul className="space-y-1">
                    {secondaryItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                className={({ isActive }) => `
                  flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} 
                  px-4 py-3 rounded-lg transition-colors
                  ${isActive
                                        ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                                    }
                `}
                            >
                                <span className="text-lg">{item.icon}</span>
                                <AnimatePresence>
                                    {!isCollapsed && (
                                        <motion.span
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -10 }}
                                            className="text-sm"
                                        >
                                            {item.label}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Indicateur de thème en bas */}
            <div className={`absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700 ${isCollapsed ? 'text-center' : ''}`}>
                <div className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                    {!isCollapsed && (
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            {theme === 'light' ? 'Mode clair' : 'Mode sombre'}
                        </div>
                    )}
                    <div className={`w-2 h-2 rounded-full ${theme === 'light' ? 'bg-yellow-500' : 'bg-purple-500'}`} />
                </div>
            </div>
        </motion.aside>
    );
};

export default Sidebar;