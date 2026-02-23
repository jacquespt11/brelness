// src/shared/components/layout/AdminLayout/Header.tsx
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, X, Search, Bell, Shield, Settings, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNotificationStore } from '@/features/notifications/store/notificationStore';
import { useAuthStore } from '@/features/auth/store/authStore';
import { UserRole } from '@/features/auth/types/auth.types';
import { ROUTES } from '@/shared/constants/routes';

interface HeaderProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (value: boolean) => void;
    title: string;
    subtitle?: string;
}

export function Header({ isSidebarOpen, setIsSidebarOpen, title, subtitle }: HeaderProps) {
    const navigate = useNavigate();
    const { unreadCount, fetchNotifications } = useNotificationStore();
    const { user } = useAuthStore();

    // Fetch notifications count on mount and periodically
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(() => {
            fetchNotifications();
        }, 30000); // Refresh every 30 seconds

        return () => clearInterval(interval);
    }, [fetchNotifications]);

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100/50 dark:border-gray-800/50">
            <div className="px-6 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    {/* Mobile Toggle */}
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden p-2 rounded-xl bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400"
                    >
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>

                    <div className="hidden sm:block">
                        <h1 className="text-xl font-black text-gray-800 dark:text-white leading-none">
                            {title}
                        </h1>
                        {subtitle && (
                            <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mt-1">
                                {subtitle}
                            </p>
                        )}
                    </div>
                </div>

                <div className="flex items-center space-x-3 lg:space-x-6">
                    {/* Search Bar */}
                    <div className="hidden md:flex relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-purple-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            className="pl-12 pr-4 py-2.5 bg-gray-50 dark:bg-gray-800 border border-transparent focus:border-purple-200 focus:bg-white dark:focus:bg-gray-700 rounded-2xl text-sm w-64 transition-all"
                        />
                    </div>

                    <div className="flex items-center space-x-2">
                        {/* Notifications */}
                        <button
                            onClick={() => navigate('/admin/notifications')}
                            className="relative p-2.5 rounded-xl text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                        >
                            <Bell size={20} />
                            {unreadCount > 0 && (
                                <motion.span
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    className="absolute -top-1 -right-1 min-w-[20px] h-5 px-1.5 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900"
                                >
                                    {unreadCount > 99 ? '99+' : unreadCount}
                                </motion.span>
                            )}
                        </button>

                        {/* Settings */}
                        <button
                            onClick={() => navigate('/admin/settings')}
                            className="p-2.5 rounded-xl text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                        >
                            <Settings size={20} />
                        </button>

                        {/* Logout */}
                        <button
                            onClick={handleLogout}
                            className="p-2.5 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                            title="Déconnexion"
                        >
                            <LogOut size={20} />
                        </button>
                    </div>

                    <div className="h-8 w-px bg-gray-100 dark:bg-gray-800 mx-2" />

                    {/* Profile */}
                    <div className="flex items-center space-x-3">
                        <div className="hidden lg:block text-right">
                            <p className="text-sm font-black text-gray-800 dark:text-white leading-none">
                                {user?.email?.split('@')[0] || 'Admin'}
                            </p>
                            <p className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest mt-1">
                                {user?.role === UserRole.SUPER_ADMIN ? 'Super Admin' : 'Admin'}
                            </p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-purple-600 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                            <Shield size={20} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
