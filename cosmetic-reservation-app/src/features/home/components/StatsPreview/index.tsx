// src/features/home/components/StatsPreview/index.tsx
import { motion } from 'framer-motion';
import { Users, Package, TrendingUp, Clock, DollarSign, Star } from 'lucide-react';
import { Card } from '@/shared/components/ui';
import type { ReservationStats } from '@/features/reservations/types/reservation.types';

interface StatsPreviewProps {
    stats: ReservationStats;
}

/**
 * Stats Preview Component
 * Display reservation statistics in cards
 */
export function StatsPreview({ stats }: StatsPreviewProps) {
    const statCards = [
        {
            icon: <Users className="w-5 h-5 sm:w-6 sm:h-6" />,
            label: 'Réservations totales',
            value: stats.total.toString(),
            color: 'from-blue-500 to-cyan-500',
            description: 'Depuis le début',
        },
        {
            icon: <Clock className="w-5 h-5 sm:w-6 sm:h-6" />,
            label: 'En attente',
            value: stats.enAttenteAujourdhui.toString(),
            color: 'from-amber-500 to-orange-500',
            description: "Aujourd'hui",
        },
        {
            icon: <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />,
            label: "Chiffre d'affaires",
            value: `${stats.chiffreAffaires} €`,
            color: 'from-green-500 to-emerald-500',
            description: 'Total généré',
        },
        {
            icon: <Package className="w-5 h-5 sm:w-6 sm:h-6" />,
            label: 'Produit populaire',
            value: stats.produitLePlusPopulaire,
            color: 'from-purple-500 to-pink-500',
            description: 'Le plus réservé',
        },
        {
            icon: <DollarSign className="w-5 h-5 sm:w-6 sm:h-6" />,
            label: 'Quantité totale',
            value: stats.quantiteTotale.toString(),
            color: 'from-indigo-500 to-violet-500',
            description: 'Articles réservés',
        },
        {
            icon: <Star className="w-5 h-5 sm:w-6 sm:h-6" />,
            label: 'Taux de confirmation',
            value:
                stats.total > 0
                    ? `${Math.round((stats.parStatut.confirmee / stats.total) * 100)}%`
                    : '0%',
            color: 'from-rose-500 to-red-500',
            description: 'Réservations confirmées',
        },
    ];

    return (
        <div className="mb-8 sm:mb-12 lg:mb-16">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 lg:gap-6"
            >
                {statCards.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 * index }}
                        whileHover={{ y: -5 }}
                        className="group relative"
                    >
                        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 sm:p-5 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-gray-700 h-full">
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3 sm:mb-4">
                                <div
                                    className={`p-2 rounded-lg bg-gradient-to-br ${stat.color} bg-opacity-10`}
                                >
                                    <div className="text-gray-800 dark:text-gray-200">
                                        {stat.icon}
                                    </div>
                                </div>
                                <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                                    {stat.description}
                                </span>
                            </div>

                            {/* Value */}
                            <div className="mb-2">
                                <div className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white truncate">
                                    {stat.value}
                                </div>
                            </div>

                            {/* Label */}
                            <div className="flex items-center justify-between">
                                <h3 className="text-xs sm:text-sm font-medium text-gray-600 dark:text-gray-300 truncate">
                                    {stat.label}
                                </h3>
                                <div className="hidden sm:block opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                </div>
                            </div>

                            {/* Progress bar */}
                            <div className="mt-3 h-1 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: '100%' }}
                                    transition={{ delay: 0.3 + index * 0.1, duration: 1 }}
                                    className={`h-full bg-gradient-to-r ${stat.color} rounded-full`}
                                />
                            </div>
                        </div>

                        {/* Border effect on hover */}
                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-400/30 dark:group-hover:border-purple-500/30 rounded-xl transition-all duration-300 pointer-events-none" />
                    </motion.div>
                ))}
            </motion.div>

            {/* Legend */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="mt-6 sm:mt-8 text-center"
            >
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
                    Données mises à jour en temps réel • Dernière actualisation:{' '}
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
            </motion.div>
        </div>
    );
}

export default StatsPreview;
