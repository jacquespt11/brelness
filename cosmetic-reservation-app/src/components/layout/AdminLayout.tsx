// src/components/layout/AdminLayout.tsx
import { useState, useEffect, type ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../../contexts/ThemeContext';
import Logo from '../ui/Logo';
import ActionNotifications from '../admin/ActionNotifications';
import {
    Home,
    Package,
    PlusCircle,
    BarChart3,
    Users,
    Settings,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    Bell,
    Search,
    Shield
} from 'lucide-react';

/**
 * Layout d'administration responsive avec sidebar réduite
 * Adapté aux mobiles, tablettes et desktop
 */
interface AdminLayoutProps {
    children: ReactNode;
}

const AdminLayout = ({ children }: AdminLayoutProps) => {
    const { theme, toggleTheme } = useTheme();
    const location = useLocation();
    const navigate = useNavigate();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const [showSearch, setShowSearch] = useState(false);
    const [notifications] = useState(3);

    // Détecter la taille de l'écran
    useEffect(() => {
        const checkMobile = () => {
            const mobile = window.innerWidth < 1024;
            setIsMobile(mobile);

            if (mobile) {
                setIsSidebarOpen(false);
                setIsSidebarCollapsed(false);
            } else {
                setIsSidebarOpen(true);
            }
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Fermer la sidebar lors de la navigation mobile
    useEffect(() => {
        if (isMobile) {
            setIsSidebarOpen(false);
        }
    }, [location, isMobile]);

    // Navigation items
    const navItems = [
        {
            path: '/admin',
            icon: <Home className="w-5 h-5" />,
            label: 'Tableau de bord',
            badge: null
        },
        {
            path: '/admin/reservations',
            icon: <Package className="w-5 h-5" />,
            label: 'Réservations',
            badge: 12
        },
        {
            path: '/admin/products',
            icon: <Package className="w-5 h-5" />,
            label: 'Produits',
            badge: null
        },
        {
            path: '/admin/customers',
            icon: <Users className="w-5 h-5" />,
            label: 'Clients',
            badge: null
        },
        {
            path: '/admin/analytics',
            icon: <BarChart3 className="w-5 h-5" />,
            label: 'Analytiques',
            badge: 'Nouveau'
        },
        {
            path: '/admin/settings',
            icon: <Settings className="w-5 h-5" />,
            label: 'Paramètres',
            badge: null
        },
    ];

    const secondaryItems = [
        {
            path: '/add',
            icon: <PlusCircle className="w-5 h-5" />,
            label: 'Nouvelle réservation'
        },
        {
            path: '/catalog',
            icon: <Package className="w-5 h-5" />,
            label: 'Catalogue'
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
            {/* Sidebar - Desktop et Mobile */}
            <motion.aside
                initial={false}
                animate={{
                    x: isSidebarOpen ? 0 : (isMobile ? -280 : 0),
                    width: isSidebarCollapsed && !isMobile ? 80 : 280
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className={`fixed lg:sticky top-0 left-0 h-screen bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-50 overflow-hidden flex flex-col ${isMobile ? 'shadow-2xl' : ''
                    }`}
            >
                {/* En-tête de la sidebar */}
                <div className="p-4 lg:p-6 border-b border-gray-200 dark:border-gray-700">
                    <div className={`flex items-center ${isSidebarCollapsed && !isMobile ? 'justify-center' : 'justify-between'}`}>
                        {!isSidebarCollapsed || isMobile ? (
                            <Link to="/admin" className="flex items-center space-x-3 group">
                                <Logo size="sm" animated={false} />
                                <div className="hidden md:block">
                                    <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent group-hover:from-purple-700 group-hover:to-pink-700 transition-all">
                                        Admin Dashboard
                                    </h1>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                        Gestion des réservations
                                    </p>
                                </div>
                            </Link>
                        ) : (
                            <div className="w-full flex justify-center">
                                <Logo size="sm" animated={false} />
                            </div>
                        )}

                        {/* Bouton de réduction (desktop seulement) */}
                        {!isMobile && (
                            <motion.button
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                className="hidden lg:flex p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            >
                                {isSidebarCollapsed ? (
                                    <ChevronRight className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                ) : (
                                    <ChevronLeft className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                                )}
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Navigation principale */}
                <nav className="flex-1 p-4 overflow-y-auto">
                    <ul className="space-y-1">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center ${isSidebarCollapsed && !isMobile ? 'justify-center' : 'justify-between'} 
                    p-3 rounded-lg transition-all duration-200 group ${location.pathname === item.path
                                            ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-600 dark:text-purple-400 border border-purple-200 dark:border-purple-800'
                                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                        }`}
                                >
                                    <div className="flex items-center space-x-3">
                                        <div className={`p-2 rounded-lg ${location.pathname === item.path
                                            ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                                            }`}>
                                            {item.icon}
                                        </div>
                                        {(!isSidebarCollapsed || isMobile) && (
                                            <span className="font-medium">{item.label}</span>
                                        )}
                                    </div>

                                    {item.badge && (!isSidebarCollapsed || isMobile) && (
                                        <span className={`px-2 py-1 text-xs rounded-full ${typeof item.badge === 'string'
                                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white'
                                            : 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400'
                                            }`}>
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Séparateur */}
                    <div className={`my-4 border-t border-gray-200 dark:border-gray-700 ${isSidebarCollapsed && !isMobile ? 'mx-2' : 'mx-4'
                        }`} />

                    {/* Navigation secondaire */}
                    <ul className="space-y-1">
                        {secondaryItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center ${isSidebarCollapsed && !isMobile ? 'justify-center' : 'space-x-3'} 
                    p-3 rounded-lg transition-colors text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700`}
                                >
                                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                                        {item.icon}
                                    </div>
                                    {(!isSidebarCollapsed || isMobile) && (
                                        <span className="text-sm">{item.label}</span>
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>

                    {/* Section inférieure */}
                    <div className={`mt-8 p-4 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl ${isSidebarCollapsed && !isMobile ? 'text-center' : ''
                        }`}>
                        {(!isSidebarCollapsed || isMobile) && (
                            <>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Support
                                    </span>
                                    <span className="text-xs text-green-600 dark:text-green-400">● En ligne</span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
                                    Assistance 24/7 disponible
                                </p>
                                <a
                                    href="tel:+33123456789"
                                    className="block w-full text-center px-3 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                                >
                                    Contacter
                                </a>
                            </>
                        )}
                    </div>
                </nav>

                {/* Footer de la sidebar */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className={`flex items-center ${isSidebarCollapsed && !isMobile ? 'justify-center' : 'justify-between'}`}>
                        {(!isSidebarCollapsed || isMobile) && (
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                            >
                                <Home className="w-4 h-4" />
                                <span>Accueil</span>
                            </button>
                        )}

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                            aria-label="Changer le thème"
                        >
                            {theme === 'light' ? (
                                <span className="text-gray-700">🌙</span>
                            ) : (
                                <span className="text-yellow-400">☀️</span>
                            )}
                        </button>
                    </div>
                </div>
            </motion.aside>

            {/* Overlay mobile */}
            <AnimatePresence>
                {isMobile && isSidebarOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                        className="lg:hidden fixed inset-0 bg-black/50 z-40"
                    />
                )}
            </AnimatePresence>

            {/* Contenu principal */}
            <div className={`transition-all duration-300 ${isMobile ? 'ml-0' : (isSidebarCollapsed ? 'lg:ml-20' : 'lg:ml-72')
                }`}>
                {/* Header principal */}
                <header className="sticky top-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50">
                    <div className="px-4 lg:px-6 py-4">
                        <div className="flex items-center justify-between">
                            {/* Bouton menu mobile */}
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                                    className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                >
                                    {isSidebarOpen ? (
                                        <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    ) : (
                                        <Menu className="w-5 h-5 text-gray-600 dark:text-gray-gray-400" />
                                    )}
                                </button>

                                <div className="hidden md:block">
                                    <h1 className="text-xl font-bold text-gray-800 dark:text-white">
                                        Tableau de bord
                                    </h1>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        Gestion des réservations cosmétiques
                                    </p>
                                </div>
                            </div>

                            {/* Actions de header */}
                            <div className="flex items-center space-x-3 lg:space-x-4">
                                {/* Recherche */}
                                <div className="relative">
                                    {showSearch ? (
                                        <motion.div
                                            initial={{ width: 0, opacity: 0 }}
                                            animate={{ width: 200, opacity: 1 }}
                                            className="absolute right-0 top-0"
                                        >
                                            <input
                                                type="text"
                                                placeholder="Rechercher..."
                                                className="w-full pl-4 pr-10 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                                                autoFocus
                                                onBlur={() => setShowSearch(false)}
                                            />
                                            <Search className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" />
                                        </motion.div>
                                    ) : (
                                        <button
                                            onClick={() => setShowSearch(true)}
                                            className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 lg:hidden"
                                        >
                                            <Search className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        </button>
                                    )}

                                    <div className="hidden lg:block relative">
                                        <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                                        <input
                                            type="text"
                                            placeholder="Rechercher réservations, clients..."
                                            className="pl-10 pr-4 py-2 bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 w-64"
                                        />
                                    </div>
                                </div>

                                {/* Notifications */}
                                <button className="relative p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700">
                                    <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                    {notifications > 0 && (
                                        <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                            {notifications}
                                        </span>
                                    )}
                                </button>

                                {/* Profil */}
                                <div className="flex items-center space-x-3">
                                    <div className="hidden md:block text-right">
                                        <p className="text-sm font-medium text-gray-800 dark:text-white">
                                            Admin Cosmetic
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            Administrateur
                                        </p>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-pink-600 flex items-center justify-center">
                                        <Shield className="w-5 h-5 text-white" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Navigation rapide mobile */}
                        <div className="lg:hidden mt-4">
                            <div className="flex items-center justify-around">
                                {navItems.slice(0, 4).map((item) => (
                                    <Link
                                        key={item.path}
                                        to={item.path}
                                        className="flex flex-col items-center text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                    >
                                        <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                                            {item.icon}
                                        </div>
                                        <span className="text-xs mt-1">{item.label.split(' ')[0]}</span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Contenu principal */}
                <main className="p-4 lg:p-6">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>

                {/* Notifications Globales */}
                <ActionNotifications />
            </div>
        </div>
    );
};

export default AdminLayout;