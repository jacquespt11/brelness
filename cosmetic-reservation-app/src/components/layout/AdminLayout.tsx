// src/components/layout/AdminLayout.tsx
import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

/**
 * Layout spécifique pour l'interface administrateur
 * Inclut une sidebar de navigation et un header
 */
const AdminLayout = () => {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();

    // Menu de navigation admin
    const navItems = [
        { path: '/admin', icon: '📊', label: 'Tableau de bord' },
        { path: '/admin/reservations', icon: '📋', label: 'Réservations' },
        { path: '/admin/products', icon: '💄', label: 'Produits' },
        { path: '/admin/customers', icon: '👥', label: 'Clients' },
        { path: '/admin/analytics', icon: '📈', label: 'Analytiques' },
        { path: '/admin/settings', icon: '⚙️', label: 'Paramètres' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-full w-64 bg-white dark:bg-gray-800 shadow-lg z-40">
                {/* Logo */}
                <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                            <span className="text-white text-xl">💄</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-800 dark:text-white">Cosmetic Admin</h1>
                            <p className="text-xs text-gray-500 dark:text-gray-400">Tableau de bord</p>
                        </div>
                    </div>
                </div>

                {/* Navigation */}
                <nav className="p-4">
                    <ul className="space-y-2">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${location.pathname === item.path
                                            ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <span className="text-lg">{item.icon}</span>
                                    <span className="font-medium">{item.label}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Section inférieure */}
                    <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between">
                            <Link
                                to="/"
                                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400"
                            >
                                <span>←</span>
                                <span>Retour au site</span>
                            </Link>
                            <button
                                onClick={toggleTheme}
                                className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
                                aria-label="Changer le thème"
                            >
                                {theme === 'light' ? '🌙' : '☀️'}
                            </button>
                        </div>
                    </div>
                </nav>
            </aside>

            {/* Contenu principal */}
            <main className="ml-64 p-6">
                <div className="max-w-7xl mx-auto">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;