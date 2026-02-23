// src/features/admin/pages/ReservationsListPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useReservationStore } from '@/features/reservations/store/reservationStore';
import { ReservationTable } from '../components';
import {
    RefreshCw,
    PlusCircle,
    ListFilter,
    Download,
    Package,
    PackageOpen
} from 'lucide-react';
import { Button, LoadingState, EmptyState, ErrorState } from '@/shared/components/ui';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/routes';

/**
 * Reservations List Page
 * Dedicated page for viewing and managing all reservations
 */
export function ReservationsListPage() {
    const navigate = useNavigate();
    const reservations = useReservationStore((state) => state.reservations);
    const loading = useReservationStore((state) => state.loading);
    const error = useReservationStore((state) => state.error);
    const fetchReservations = useReservationStore((state) => state.fetchReservations);
    const updateReservationStatus = useReservationStore((state) => state.updateReservationStatus);
    const deleteReservation = useReservationStore((state) => state.deleteReservation);

    const [isRefreshing, setIsRefreshing] = useState(false);

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    const handleStatusChange = async (id: string, newStatus: string) => {
        await updateReservationStatus(id, newStatus as any);
    };

    const handleDelete = async (id: string) => {
        await deleteReservation(id);
    };

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchReservations();
        setTimeout(() => setIsRefreshing(false), 800);
    };

    // Loading state
    if (loading && reservations.length === 0) {
        return <LoadingState message="Chargement des réservations..." />;
    }

    // Error state
    if (error && reservations.length === 0) {
        return (
            <ErrorState
                message={error}
                onRetry={handleRefresh}
            />
        );
    }

    // Empty state
    if (!loading && reservations.length === 0) {
        return (
            <EmptyState
                icon={PackageOpen}
                title="Aucune réservation"
                description="Aucune réservation n'a encore été créée. Créez votre première réservation pour commencer."
                actionLabel="Nouvelle réservation"
                onAction={() => navigate(ROUTES.ADD_RESERVATION)}
            />
        );
    }

    return (
        <div className="space-y-8 pb-12">
            {/* Top Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-purple-600 rounded-xl text-white shadow-lg shadow-purple-500/20">
                            <Package size={20} />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-black text-gray-800 dark:text-white">
                            Toutes les <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Réservations</span>
                        </h1>
                    </div>
                    <p className="text-gray-500 font-medium">
                        {reservations.length} réservation{reservations.length > 1 ? 's' : ''} au total
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

            {/* List Filters Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <div className="flex items-center space-x-2">
                    <ListFilter size={18} className="text-purple-500" />
                    <span className="font-bold text-gray-800 dark:text-white">Filtres</span>
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-xs font-black text-gray-400 uppercase tracking-widest">
                        {reservations.length} résultat{reservations.length > 1 ? 's' : ''}
                    </span>
                    <Button variant="ghost" size="sm" className="h-8">Réinitialiser</Button>
                </div>
            </div>

            {/* Reservations Table */}
            <ReservationTable
                reservations={reservations}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
            />
        </div>
    );
}

export default ReservationsListPage;
