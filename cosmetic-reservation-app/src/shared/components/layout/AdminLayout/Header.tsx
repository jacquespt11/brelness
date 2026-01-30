// src/shared/components/layout/AdminLayout/Header.tsx
import React from 'react';
import { Menu, X, Search, Bell, Shield, Settings } from 'lucide-react';
import { motion } from 'framer-motion';

interface HeaderProps {
    isSidebarOpen: boolean;
    setIsSidebarOpen: (value: boolean) => void;
    title: string;
    subtitle?: string;
}

export function Header({ isSidebarOpen, setIsSidebarOpen, title, subtitle }: HeaderProps) {
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
                        <button className="relative p-2.5 rounded-xl text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all">
                            <Bell size={20} />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-gray-900" />
                        </button>

                        <button className="p-2.5 rounded-xl text-gray-500 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all">
                            <Settings size={20} />
                        </button>
                    </div>

                    <div className="h-8 w-px bg-gray-100 dark:bg-gray-800 mx-2" />

                    {/* Profile */}
                    <div className="flex items-center space-x-3">
                        <div className="hidden lg:block text-right">
                            <p className="text-sm font-black text-gray-800 dark:text-white leading-none">Admin</p>
                            <p className="text-[10px] font-black text-purple-600 dark:text-purple-400 uppercase tracking-widest mt-1">Super User</p>
                        </div>
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg shadow-purple-500/20">
                            <Shield size={20} />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
