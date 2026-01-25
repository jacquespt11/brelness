// src/components/admin/StatsCard.tsx
import React from 'react';

interface StatsCardProps {
    title: string;
    value: string | number;
    icon: string;
    trend?: number;
    color: 'purple' | 'green' | 'blue' | 'orange';
    subtitle?: string;
}

/**
 * Composant carte de statistique pour le dashboard
 * Affiche une métrique avec icône et tendance
 */
const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    icon,
    trend,
    color,
    subtitle
}) => {
    const colorClasses = {
        purple: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300',
        green: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300',
        blue: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
        orange: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300',
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white">{value}</h3>
                    {subtitle && (
                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{subtitle}</p>
                    )}
                    {trend !== undefined && (
                        <div className="flex items-center mt-2">
                            <span className={`text-sm font-medium ${trend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                                }`}>
                                {trend >= 0 ? '↗' : '↘'} {Math.abs(trend)}%
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                                vs mois dernier
                            </span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
                    <span className="text-2xl">{icon}</span>
                </div>
            </div>
        </div>
    );
};

export default StatsCard;