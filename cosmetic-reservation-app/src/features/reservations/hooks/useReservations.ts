// src/features/reservations/hooks/useReservations.ts
import { useState, useCallback } from 'react';
import { reservationService } from '../../../api/reservation.service';
import { Reservation, ReservationStats } from '../types/reservation.types';

export const useReservations = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<ReservationStats | null>(null);

    const fetchReservations = useCallback(async (params?: {
        status?: string;
        page?: number;
    }) => {
        setLoading(true);
        try {
            const response = await reservationService.getAllReservations(params);
            setReservations(response.data);
            setError(null);
        } catch (err) {
            setError('Erreur lors du chargement des réservations');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchStats = useCallback(async () => {
        try {
            const response = await reservationService.getReservationStats();
            setStats(response.data);
        } catch (err) {
            console.error('Erreur lors du chargement des statistiques', err);
        }
    }, []);

    return {
        reservations,
        stats,
        loading,
        error,
        fetchReservations,
        fetchStats,
        setReservations,
    };
};