// src/features/admin/components/Dashboard/StatsCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/shared/utils/cn';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    trend?: {
        value: number;
        isUp: boolean;
    };
    color: 'purple' | 'green' | 'blue' | 'orange' | 'pink';
    subtitle?: string;
    delay?: number;
}

export function StatsCard({
    title,
    value,
    icon: Icon,
    trend,
    color,
    subtitle,
    delay = 0
}: StatsCardProps) {
    const colorVariants = {
        purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 border-purple-100 dark:border-purple-800',
        green: 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 border-green-100 dark:border-green-800',
        blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-800',
        orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 border-orange-100 dark:border-orange-800',
        pink: 'bg-pink-50 dark:bg-pink-900/20 text-pink-600 dark:text-pink-400 border-pink-100 dark:border-pink-800',
    };

    const iconBgVariants = {
        purple: 'bg-purple-100 dark:bg-purple-800/50',
        green: 'bg-green-100 dark:bg-green-800/50',
        blue: 'bg-blue-100 dark:bg-blue-800/50',
        orange: 'bg-orange-100 dark:bg-orange-800/50',
        pink: 'bg-pink-100 dark:bg-pink-800/50',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5 }}
            whileHover={{ y: -5 }}
            className={cn(
                "bg-white dark:bg-gray-800 rounded-3xl p-6 shadow-sm border transition-all duration-300",
                colorVariants[color].split(' ').slice(0, 3).join(' ') // Only use background/text/border for light mode mainly or dark mode base
            )}
        >
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <p className="text-sm font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest">{title}</p>
                    <h3 className="text-3xl font-black text-gray-800 dark:text-white">{value}</h3>

                    {trend && (
                        <div className="flex items-center space-x-1.5 pt-2">
                            <span className={cn(
                                "text-xs font-black px-2 py-0.5 rounded-full flex items-center",
                                trend.isUp ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                            )}>
                                {trend.isUp ? '↗' : '↘'} {trend.value}%
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">vs mois dernier</span>
                        </div>
                    )}

                    {subtitle && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 font-medium italic mt-2">
                            "{subtitle}"
                        </p>
                    )}
                </div>

                <div className={cn(
                    "p-4 rounded-2xl transition-transform duration-500 group-hover:rotate-12",
                    iconBgVariants[color],
                    colorVariants[color].split(' ').find(c => c.startsWith('text-'))
                )}>
                    <Icon size={28} strokeWidth={2.5} />
                </div>
            </div>
        </motion.div>
    );
}
