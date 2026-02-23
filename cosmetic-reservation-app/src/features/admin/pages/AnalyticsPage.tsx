// src/features/admin/pages/AnalyticsPage.tsx
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, TrendingUp, PieChart, Activity, DollarSign, Package, CheckCircle, XCircle, Truck, RefreshCw } from 'lucide-react';
import { reservationService } from '@/features/reservations/services/reservation.service';
import { ReservationStatsDTO } from '@/features/reservations/types/reservation.dto';
import { LoadingState, ErrorState, Button, EmptyState } from '@/shared/components/ui';

export function AnalyticsPage() {
    const [stats, setStats] = useState<ReservationStatsDTO | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchStats = async () => {
        try {
            setError(null);
            const data = await reservationService.getStats();
            setStats(data);
        } catch (err: any) {
            setError(err.message || 'Erreur lors du chargement des statistiques');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchStats();
    };

    if (loading) return <LoadingState message="Chargement des analyses..." />;
    if (error) return <ErrorState message={error} onRetry={fetchStats} />;
    if (!stats) return <EmptyState icon={BarChart3} title="Aucune donnée" description="Impossible de récupérer les statistiques." />;

    const statCards = [
        { label: 'Revenu Total', value: `${stats.totalRevenue.toFixed(2)} €`, icon: DollarSign, color: 'text-green-600', bg: 'bg-green-100 dark:bg-green-900/20' },
        { label: 'Réservations Total', value: stats.total, icon: Package, color: 'text-blue-600', bg: 'bg-blue-100 dark:bg-blue-900/20' },
        { label: 'En attente', value: stats.pending, icon: Activity, color: 'text-yellow-600', bg: 'bg-yellow-100 dark:bg-yellow-900/20' },
        { label: 'Confirmées', value: stats.confirmed, icon: CheckCircle, color: 'text-purple-600', bg: 'bg-purple-100 dark:bg-purple-900/20' },
        { label: 'Livrées', value: stats.delivered, icon: Truck, color: 'text-teal-600', bg: 'bg-teal-100 dark:bg-teal-900/20' },
        { label: 'Annulées', value: stats.cancelled, icon: XCircle, color: 'text-red-600', bg: 'bg-red-100 dark:bg-red-900/20' },
    ];

    return (
        <div className="space-y-8 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-emerald-600 rounded-xl text-white shadow-lg shadow-emerald-500/20">
                            <BarChart3 size={20} />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-black text-gray-800 dark:text-white">
                            Analytiques <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600">Globales</span>
                        </h1>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    size="md"
                    onClick={handleRefresh}
                    isLoading={isRefreshing}
                    className="bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm"
                >
                    <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                </Button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {statCards.map((card, index) => (
                    <motion.div
                        key={card.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <div className={`p-3 rounded-xl ${card.bg}`}>
                                <card.icon size={24} className={card.color} />
                            </div>
                            {/* <span className="text-xs font-bold text-green-500 bg-green-50 dark:bg-green-900/20 px-2 py-1 rounded-full">+12%</span> */}
                        </div>
                        <h3 className="text-2xl font-black text-gray-800 dark:text-white mb-1">{card.value}</h3>
                        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide">{card.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Placeholder for Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center min-h-[300px] text-center"
                >
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <TrendingUp className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Graphique des Ventes</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Disponible prochainement</p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="p-8 bg-white dark:bg-gray-800 rounded-3xl border border-gray-100 dark:border-gray-700 shadow-sm flex flex-col items-center justify-center min-h-[300px] text-center"
                >
                    <div className="w-16 h-16 bg-gray-50 dark:bg-gray-700 rounded-full flex items-center justify-center mb-4">
                        <PieChart className="text-gray-400" size={32} />
                    </div>
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white">Répartition par Catégorie</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Disponible prochainement</p>
                </motion.div>
            </div>
        </div>
    );
}

export default AnalyticsPage;
