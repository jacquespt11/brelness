// src/features/admin/components/Dashboard/StatsDashboard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import type { ReservationStats } from '@/features/reservations/types/reservation.types';
import { StatsCard } from './StatsCard';
import { ProductChart } from './ProductChart';
import { PieChart, TrendingUp, DollarSign, Package, Users } from 'lucide-react';

interface StatsDashboardProps {
    stats: ReservationStats;
}

export function StatsDashboard({ stats }: StatsDashboardProps) {
    const statusData = [
        { label: 'Attente', value: stats.byStatus.pending, color: 'bg-amber-500', colorHex: '#f59e0b' },
        { label: 'Confirmées', value: stats.byStatus.confirmed, color: 'bg-green-500', colorHex: '#10b981' },
        { label: 'Livrées', value: stats.byStatus.delivered, color: 'bg-blue-500', colorHex: '#3b82f6' },
        { label: 'Annulées', value: stats.byStatus.cancelled, color: 'bg-red-500', colorHex: '#ef4444' },
    ];

    const total = stats.total || 1;

    // Simulated data for the bar chart if not enough stats
    const productData = stats.mostPopularProduct ? {
        labels: [stats.mostPopularProduct.name, 'Autres soins', 'Maquillage', 'Parfums'],
        values: [stats.mostPopularProduct.count, 12, 8, 5]
    } : {
        labels: ['Soin Visage', 'Maquillage', 'Parfums', 'Corps'],
        values: [15, 10, 8, 4]
    };

    return (
        <div className="space-y-6">
            {/* Top Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Revenue Total"
                    value={`${stats.totalRevenue.toLocaleString()}€`}
                    icon={DollarSign}
                    color="purple"
                    trend={{ value: 24, isUp: true }}
                    delay={0}
                />
                <StatsCard
                    title="Réservations"
                    value={stats.total}
                    icon={Package}
                    color="blue"
                    trend={{ value: 12, isUp: true }}
                    delay={0.1}
                />
                <StatsCard
                    title="Ventes (Unités)"
                    value={stats.totalQuantity}
                    icon={TrendingUp}
                    color="green"
                    trend={{ value: 8, isUp: true }}
                    delay={0.2}
                />
                <StatsCard
                    title="Panier Moyen"
                    value={`${stats.averageOrderValue.toFixed(2)}€`}
                    icon={Users}
                    color="orange"
                    trend={{ value: 5, isUp: false }}
                    delay={0.3}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Status Distribution */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-3xl p-6 lg:p-8 shadow-xl border border-gray-100 dark:border-gray-700"
                >
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                                <PieChart className="text-purple-500" />
                                État des <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Réservations</span>
                            </h2>
                            <p className="text-sm text-gray-500 font-medium">Répartition par statut de commande</p>
                        </div>
                    </div>

                    <div className="flex flex-col md:flex-row items-center gap-12">
                        {/* Custom SVG Donut Chart */}
                        <div className="relative w-48 h-48 flex-shrink-0">
                            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                                {statusData.map((item, index) => {
                                    const percentage = (item.value / total) * 100;
                                    const circumference = 2 * Math.PI * 40;
                                    const offset = statusData.slice(0, index).reduce((sum, d) => sum + (d.value / total) * circumference, 0);

                                    return (
                                        <motion.circle
                                            key={item.label}
                                            cx="50"
                                            cy="50"
                                            r="40"
                                            fill="transparent"
                                            stroke={item.colorHex}
                                            strokeWidth="12"
                                            strokeDasharray={`${(percentage / 100) * circumference} ${circumference}`}
                                            strokeDashoffset={-offset}
                                            initial={{ strokeDasharray: `0 ${circumference}` }}
                                            animate={{ strokeDasharray: `${(percentage / 100) * circumference} ${circumference}` }}
                                            transition={{ duration: 1.5, delay: 0.8, ease: "circOut" }}
                                            className="transition-all"
                                        />
                                    );
                                })}
                            </svg>
                            <div className="absolute inset-0 flex flex-col items-center justify-center">
                                <span className="text-3xl font-black text-gray-800 dark:text-white">{stats.total}</span>
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Total</span>
                            </div>
                        </div>

                        {/* Legend */}
                        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                            {statusData.map((item) => (
                                <div key={item.label} className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-white/5 flex items-center justify-between group hover:border-purple-200 transition-colors">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-3 h-3 rounded-full ${item.color} shadow-lg shadow-current/40`} />
                                        <span className="text-sm font-bold text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-white transition-colors">
                                            {item.label}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-gray-800 dark:text-white">{item.value}</p>
                                        <p className="text-[10px] text-gray-400 font-bold">{((item.value / total) * 100).toFixed(1)}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </motion.div>

                {/* Popular Products */}
                <ProductChart data={productData} delay={0.5} />
            </div>
        </div>
    );
}
