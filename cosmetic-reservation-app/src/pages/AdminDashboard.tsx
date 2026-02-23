import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReservationStore, useReservationStats } from '../state/reservationStore';
import ReservationTable from '../components/admin/ReservationTable';
import StatsDashboard from '../components/admin/StatsDashboard';
import { ReservationStatus } from '../types/reservation';
import {
    Calendar,
    Users,
    TrendingUp,
    Package,
    BarChart3,
    Filter,
    Download,
    RefreshCw,
    PlusCircle
} from 'lucide-react';

const AdminDashboard = () => {
    const {
        reservations,
        isLoading,
        fetchReservations,
        fetchStats,
        updateReservationStatus
    } = useReservationStore();

    const stats = useReservationStats();

    const [activeTab, setActiveTab] = useState<'overview' | 'reservations'>('overview');
    const [timeFilter, setTimeFilter] = useState('today');

    useEffect(() => {
        fetchReservations();
        fetchStats();
    }, [fetchReservations, fetchStats]);

    const handleStatusChange = async (id: string, newStatus: ReservationStatus) => {
        await updateReservationStatus(id, newStatus);
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Êtes-vous sûr de vouloir supprimer cette réservation ?')) {
            // await deleteReservation(id); // Non implémenté côté API description
            console.warn("Delete not implemented in API");
        }
    };

    const handleRefresh = async () => {
        await Promise.all([fetchReservations(), fetchStats()]);
    };

    // Statistiques rapides
    const quickStats = useMemo(() => [
        {
            title: 'Réservations du jour',
            value: reservations.filter(r =>
                new Date(r.dateCreation).toDateString() === new Date().toDateString()
            ).length,
            icon: <Calendar className="w-5 h-5" />,
            color: 'from-blue-500 to-cyan-500',
            change: '+12%',
            trend: 'up'
        },
        {
            title: 'Clients actifs',
            value: new Set(reservations.map(r => r.email)).size,
            icon: <Users className="w-5 h-5" />,
            color: 'from-purple-500 to-pink-500',
            change: '+8%',
            trend: 'up'
        },
        {
            title: 'Chiffre d\'affaires',
            value: `${parseFloat(stats.chiffreAffaires).toLocaleString('fr-FR')} €`,
            icon: <TrendingUp className="w-5 h-5" />,
            color: 'from-green-500 to-emerald-500',
            change: '+24%',
            trend: 'up'
        },
        {
            title: 'Taux de conversion',
            value: `${((reservations.filter(r => r.statut === ReservationStatus.CONFIRMED).length / Math.max(reservations.length, 1)) * 100).toFixed(1)}%`,
            icon: <BarChart3 className="w-5 h-5" />,
            color: 'from-orange-500 to-amber-500',
            change: '+5%',
            trend: 'up'
        }
    ], [reservations, stats]);

    return (
        <div className="space-y-4 lg:space-y-6">
            {/* En-tête avec filtres */}
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                        Tableau de bord
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1 lg:mt-2">
                        {reservations.length} réservation(s) • {reservations.filter(r => r.statut === ReservationStatus.PENDING).length} en attente
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    {/* Filtre temporel */}
                    <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
                        {['today', 'week', 'month', 'year'].map((period) => (
                            <button
                                key={period}
                                onClick={() => setTimeFilter(period)}
                                className={`px-3 py-1.5 text-sm rounded-md transition-colors ${timeFilter === period
                                    ? 'bg-white dark:bg-gray-700 text-gray-800 dark:text-white shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300'
                                    }`}
                            >
                                {period === 'today' ? 'Aujourd\'hui' :
                                    period === 'week' ? 'Semaine' :
                                        period === 'month' ? 'Mois' : 'Année'}
                            </button>
                        ))}
                    </div>

                    {/* Bouton rafraîchir */}
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleRefresh}
                        disabled={isRefreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                    >
                        <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
                        <span className="hidden sm:inline">Rafraîchir</span>
                    </motion.button>

                    {/* Bouton export */}
                    <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
                        <Download className="w-4 h-4" />
                        <span className="hidden sm:inline">Exporter</span>
                    </button>
                </div>
            </div>

            {/* Statistiques rapides */}
            <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
                {quickStats.map((stat, index) => (
                    <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ y: -5 }}
                        className="bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-lg hover:shadow-xl transition-all"
                    >
                        <div className="flex items-start justify-between mb-4">
                            <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.color} bg-opacity-10`}>
                                {stat.icon}
                            </div>
                            <div className={`text-sm font-medium px-2 py-1 rounded-full ${stat.trend === 'up'
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                                : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                                }`}>
                                {stat.change}
                            </div>
                        </div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-1">
                            {stat.value}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {stat.title}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Onglets */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
                <div className="border-b border-gray-200 dark:border-gray-700">
                    <div className="flex flex-col sm:flex-row">
                        <button
                            onClick={() => setActiveTab('overview')}
                            className={`flex-1 px-6 py-4 text-sm lg:text-base font-medium transition-colors ${activeTab === 'overview'
                                ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-600 dark:text-purple-400 border-b-2 border-purple-500'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <BarChart3 className="w-4 h-4 lg:w-5 lg:h-5" />
                                <span>Vue d'ensemble</span>
                            </div>
                        </button>
                        <button
                            onClick={() => setActiveTab('reservations')}
                            className={`flex-1 px-6 py-4 text-sm lg:text-base font-medium transition-colors ${activeTab === 'reservations'
                                ? 'bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 text-purple-600 dark:text-purple-400 border-b-2 border-purple-500'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            <div className="flex items-center justify-center gap-2">
                                <Package className="w-4 h-4 lg:w-5 lg:h-5" />
                                <span>Toutes les réservations</span>
                                <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-400 rounded-full">
                                    {reservations.length}
                                </span>
                            </div>
                        </button>
                    </div>
                </div>

                {/* Contenu des onglets */}
                <div className="p-4 lg:p-6">
                    <AnimatePresence mode="wait">
                        {activeTab === 'overview' ? (
                            <motion.div
                                key="overview"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                {/* Graphiques et statistiques */}
                                <StatsDashboard stats={stats} />

                                {/* Réservations récentes */}
                                <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-4 lg:p-6">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                        <div>
                                            <h3 className="text-lg lg:text-xl font-bold text-gray-800 dark:text-white">
                                                Réservations récentes
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                Dernières réservations créées
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => setActiveTab('reservations')}
                                            className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                                        >
                                            Voir tout →
                                        </button>
                                    </div>

                                    {reservations.length > 0 ? (
                                        <div className="overflow-x-auto">
                                            <ReservationTable
                                                reservations={reservations.slice(0, 5)}
                                                onStatusChange={handleStatusChange}
                                                onDelete={handleDelete}
                                            />
                                        </div>
                                    ) : (
                                        <div className="text-center py-8">
                                            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                            <h4 className="text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                Aucune réservation
                                            </h4>
                                            <p className="text-gray-500 dark:text-gray-400">
                                                Les réservations apparaîtront ici automatiquement
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        ) : (
                            <motion.div
                                key="reservations"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="space-y-6"
                            >
                                {/* En-tête réservations */}
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                    <div>
                                        <h3 className="text-lg lg:text-xl font-bold text-gray-800 dark:text-white">
                                            Toutes les réservations
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Gérez l'ensemble des réservations clients
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <button className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700">
                                            <Filter className="w-4 h-4" />
                                            <span>Filtrer</span>
                                        </button>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {reservations.length} résultat(s)
                                        </div>
                                    </div>
                                </div>

                                {/* Tableau des réservations */}
                                {reservations.length > 0 ? (
                                    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                                        <ReservationTable
                                            reservations={reservations}
                                            onStatusChange={handleStatusChange}
                                            onDelete={handleDelete}
                                        />
                                    </div>
                                ) : (
                                    <div className="text-center py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl">
                                        <Package className="w-16 h-16 text-gray-400 mx-auto mb-6" />
                                        <h4 className="text-xl font-medium text-gray-700 dark:text-gray-300 mb-3">
                                            Aucune réservation trouvée
                                        </h4>
                                        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                            Commencez par créer votre première réservation en cliquant sur le bouton ci-dessous.
                                        </p>
                                        <a
                                            href="/add"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                                        >
                                            <PlusCircle className="w-5 h-5" />
                                            <span>Créer une réservation</span>
                                        </a>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;