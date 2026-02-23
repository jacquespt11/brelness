// src/features/admin/pages/AdminDashboard.tsx
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReservationStore, useReservationStats } from '@/features/reservations/store/reservationStore';
import { ReservationTable, StatsDashboard } from '../components';
import {
    RefreshCw,
    PlusCircle,
    LayoutDashboard,
    ListFilter,
    Download
} from 'lucide-react';
import { Button } from '@/shared/components/ui';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

/**
 * Modern Admin Dashboard
 * Displays stats and handles reservation management
 */
export function AdminDashboard() {
    const navigate = useNavigate();
    const reservations = useReservationStore((state) => state.reservations);
    const fetchReservations = useReservationStore((state) => state.fetchReservations);
    const updateReservationStatus = useReservationStore((state) => state.updateReservationStatus);
    const deleteReservation = useReservationStore((state) => state.deleteReservation);
    const stats = useReservationStats();

    const [activeTab, setActiveTab] = useState<'overview' | 'reservations'>('overview');
    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        if (reservations.length === 0) {
            fetchReservations();
        }
    }, [fetchReservations, reservations.length]);

    const handleStatusChange = async (id: string, newStatus: string) => {
        await updateReservationStatus(id, newStatus as any);
    };

    const handleDelete = async (id: string) => {
        await deleteReservation(id);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        setTimeout(() => setIsRefreshing(false), 800);
    };

    return (
        <div className="space-y-8 pb-12">
            {/* Top Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-purple-600 rounded-xl text-white shadow-lg shadow-purple-500/20">
                            <LayoutDashboard size={20} />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-black text-gray-800 dark:text-white">
                            Vue <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Globale</span>
                        </h1>
                    </div>
                    <p className="text-gray-500 font-medium">
                        {reservations.length} réservations au total •
                        <span className="text-purple-600 dark:text-purple-400 font-bold ml-1">
                            {stats.byStatus.pending} en attente
                        </span>
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={handleRefresh}
                        isLoading={isRefreshing}
                        className="bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm"
                    >
                        <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                    </Button>
                    <Button
                        variant="primary"
                        size="md"
                        onClick={() => navigate(ROUTES.ADD_RESERVATION)}
                        className="bg-gradient-to-r from-purple-600 to-pink-600 hover:scale-105 transition-transform border-none px-6"
                    >
                        <PlusCircle size={18} className="mr-2" />
                        Nouvelle
                    </Button>
                    <Button variant="ghost" size="md" className="hidden lg:flex bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm">
                        <Download size={18} className="mr-2" />
                        Exporter
                    </Button>
                </div>
            </div>

            {/* Tab Navigation */}
            <div className="bg-white/50 dark:bg-gray-800/50 p-1.5 rounded-2xl border border-gray-100 dark:border-gray-700 inline-flex w-full sm:w-auto">
                <button
                    onClick={() => setActiveTab('overview')}
                    className={`flex-1 sm:flex-none px-8 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'overview'
                        ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-md ring-1 ring-black/5'
                        : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'
                        }`}
                >
                    Analytiques
                </button>
                <button
                    onClick={() => setActiveTab('reservations')}
                    className={`flex-1 sm:flex-none px-8 py-2.5 rounded-xl text-sm font-black transition-all ${activeTab === 'reservations'
                        ? 'bg-white dark:bg-gray-700 text-purple-600 dark:text-purple-400 shadow-md ring-1 ring-black/5'
                        : 'text-gray-500 hover:text-gray-800 dark:hover:text-white'
                        }`}
                >
                    Liste des réservations
                </button>
            </div>

            {/* Content Area */}
            <AnimatePresence mode="wait" initial={false}>
                {activeTab === 'overview' ? (
                    <motion.div
                        key="overview"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                        <StatsDashboard stats={stats} />
                    </motion.div>
                ) : (
                    <motion.div
                        key="reservations"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="space-y-6"
                    >
                        {/* List Filters Bar */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                            <div className="flex items-center space-x-2">
                                <ListFilter size={18} className="text-purple-500" />
                                <span className="font-bold text-gray-800 dark:text-white">Filtres</span>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                                    {reservations.length} résultats
                                </span>
                                <Button variant="ghost" size="sm" className="h-8">Réinitialiser</Button>
                            </div>
                        </div>

                        <ReservationTable
                            reservations={reservations}
                            onStatusChange={handleStatusChange}
                            onDelete={handleDelete}
                        />
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

export default AdminDashboard;
