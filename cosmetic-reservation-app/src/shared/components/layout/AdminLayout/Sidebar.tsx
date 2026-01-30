// src/shared/components/layout/AdminLayout/Sidebar.tsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Logo } from '@/shared/components/ui';
import { useTheme } from '@/core/contexts/ThemeContext';
import { ROUTES } from '@/shared/constants/routes';
import {
    Home,
    Package,
    PlusCircle,
    BarChart3,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    Search
} from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
    isMobile: boolean;
    isOpen: boolean;
}

export function Sidebar({ isCollapsed, setIsCollapsed, isMobile, isOpen }: SidebarProps) {
    const location = useLocation();
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();

    const navItems = [
        { path: ROUTES.ADMIN, icon: Home, label: 'Tableau de bord' },
        { path: ROUTES.ADMIN_RESERVATIONS, icon: Package, label: 'Réservations', badge: 12 },
        { path: ROUTES.ADMIN_PRODUCTS, icon: Package, label: 'Produits' },
        { path: '/admin/customers', icon: Users, label: 'Clients' },
        { path: '/admin/analytics', icon: BarChart3, label: 'Analytiques', badge: 'New' },
    ];

    const secondaryItems = [
        { path: ROUTES.ADD_RESERVATION, icon: PlusCircle, label: 'Nouvelle réservation' },
        { path: ROUTES.CATALOG, icon: Package, label: 'Catalogue' },
    ];

    const isFullSidebar = !isCollapsed || isMobile;

    return (
        <motion.aside
            initial={false}
            animate={{
                x: isOpen || !isMobile ? 0 : -280,
                width: isCollapsed && !isMobile ? 80 : 280
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className={cn(
                "fixed lg:sticky top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 z-50 overflow-hidden flex flex-col",
                isMobile && "shadow-2xl"
            )}
        >
            {/* Header / Logo */}
            <div className="p-6 border-b border-gray-100 dark:border-gray-800">
                <div className={cn("flex items-center", isCollapsed && !isMobile ? "justify-center" : "justify-between")}>
                    {isFullSidebar ? (
                        <Link to={ROUTES.ADMIN} className="flex items-center space-x-3 group">
                            <Logo size="sm" />
                            <div className="hidden md:block">
                                <h1 className="text-lg font-black bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Admin
                                </h1>
                                <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 dark:text-gray-500">Brelness v1.0</p>
                            </div>
                        </Link>
                    ) : (
                        <Logo size="sm" />
                    )}

                    {!isMobile && (
                        <button
                            onClick={() => setIsCollapsed(!isCollapsed)}
                            className="hidden lg:flex p-1.5 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-400 hover:text-purple-600 transition-colors border border-gray-100 dark:border-gray-700"
                        >
                            {isCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                        </button>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 overflow-y-auto space-y-8 custom-scrollbar">
                <div>
                    <p className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-2",
                        isCollapsed && !isMobile && "text-center px-0"
                    )}>
                        {isFullSidebar ? "Principal" : "•••"}
                    </p>
                    <ul className="space-y-1.5">
                        {navItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={cn(
                                        "flex items-center p-3 rounded-2xl transition-all group relative",
                                        isCollapsed && !isMobile ? "justify-center" : "justify-between",
                                        location.pathname === item.path
                                            ? "bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400"
                                            : "text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50"
                                    )}
                                >
                                    <div className="flex items-center space-x-3">
                                        <item.icon size={20} strokeWidth={location.pathname === item.path ? 2.5 : 2} />
                                        {isFullSidebar && <span className="font-bold text-sm">{item.label}</span>}
                                    </div>

                                    {item.badge && isFullSidebar && (
                                        <span className="px-2 py-0.5 text-[10px] font-black bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full uppercase tracking-wider">
                                            {item.badge}
                                        </span>
                                    )}

                                    {location.pathname === item.path && (
                                        <motion.div
                                            layoutId="active-pill"
                                            className="absolute left-0 w-1 h-6 bg-purple-600 rounded-r-full"
                                        />
                                    )}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                <div>
                    <p className={cn(
                        "text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mb-4 px-2",
                        isCollapsed && !isMobile && "text-center px-0"
                    )}>
                        {isFullSidebar ? "Raccourcis" : "•••"}
                    </p>
                    <ul className="space-y-1.5">
                        {secondaryItems.map((item) => (
                            <li key={item.path}>
                                <Link
                                    to={item.path}
                                    className={cn(
                                        "flex items-center p-3 rounded-2xl transition-all text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50",
                                        isCollapsed && !isMobile ? "justify-center" : "space-x-3"
                                    )}
                                >
                                    <item.icon size={20} />
                                    {isFullSidebar && <span className="text-sm font-bold">{item.label}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </nav>

            {/* Bottom Actions */}
            <div className="p-6 border-t border-gray-100 dark:border-gray-800 space-y-4">
                <button
                    onClick={toggleTheme}
                    className={cn(
                        "w-full flex items-center p-3 rounded-2x border border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 hover:border-purple-200 transition-all",
                        isCollapsed && !isMobile ? "justify-center" : "space-x-3"
                    )}
                >
                    <span className="text-xl">{theme === 'dark' ? '☀️' : '🌙'}</span>
                    {isFullSidebar && <span className="text-sm font-bold text-gray-600 dark:text-gray-300">Thème {theme === 'dark' ? 'Clair' : 'Sombre'}</span>}
                </button>

                <button
                    onClick={() => navigate(ROUTES.HOME)}
                    className={cn(
                        "w-full flex items-center p-3 rounded-2xl text-gray-500 hover:text-purple-600 hover:bg-purple-50 transition-all",
                        isCollapsed && !isMobile ? "justify-center" : "space-x-3"
                    )}
                >
                    <Home size={20} />
                    {isFullSidebar && <span className="text-sm font-bold">Retour Boutique</span>}
                </button>
            </div>
        </motion.aside>
    );
}
