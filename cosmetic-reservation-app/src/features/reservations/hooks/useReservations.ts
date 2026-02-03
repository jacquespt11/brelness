// src/features/reservations/hooks/useReservations.ts
import { useState, useCallback } from 'react';
import { reservationService } from '../../../api/reservation.service';
import type { Reservation, ReservationStats } from '../types/reservation.types';
import type { ReservationQueryDTO } from '../types/reservation.dto';

export const useReservations = () => {
    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState<ReservationStats | null>(null);

    const fetchReservations = useCallback(async (params?: ReservationQueryDTO) => {
        setLoading(true);
        try {
            const response = await reservationService.getAllReservations(params);
            const mappedReservations: Reservation[] = response.data.map(res => ({
                id: res.id,
                customerName: res.customerName,
                customerPhone: res.customerPhone,
                customerEmail: res.customerEmail,
                productId: res.product.id,
                productName: res.product.name,
                productCategory: res.product.category,
                productImage: res.product.imageUrl,
                quantity: res.quantity,
                unitPrice: res.unitPrice,
                totalPrice: res.totalPrice,
                status: res.status,
                source: res.source,
                createdAt: res.createdAt,
                updatedAt: res.updatedAt,
                confirmedAt: res.confirmedAt,
                deliveredAt: res.deliveredAt,
                preferredDeliveryDate: res.preferredDeliveryDate,
                notes: res.notes,
            }));
            setReservations(mappedReservations);
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
            const data = response.data;
            const mappedStats: ReservationStats = {
                total: data.total,
                byStatus: {
                    pending: data.pending,
                    confirmed: data.confirmed,
                    cancelled: data.cancelled,
                    delivered: data.delivered,
                },
                totalRevenue: data.totalRevenue,
                averageOrderValue: data.averageOrderValue,
                totalQuantity: 0, // Not provided by DTO, could be calculated or ignored
                pendingToday: 0, // Not provided by DTO
                mostPopularProduct: data.topProducts.length > 0 ? {
                    name: data.topProducts[0].productName,
                    count: data.topProducts[0].count,
                } : undefined,
            };
            setStats(mappedStats);
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