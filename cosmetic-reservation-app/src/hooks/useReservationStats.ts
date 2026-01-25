//hooks/useReservationStats.ts

import { useReservationStore } from '../state/reservationStore';
import { ReservationStatus } from '../types/reservation';

export const useReservationStats = () => {
    const reservations = useReservationStore((state) => state.reservations);
    const products = useReservationStore((state) => state.products);

    const activeReservations = reservations.filter(
        (r) => r.statut === ReservationStatus.CANCELLED
    ).length;

    const availableProducts = products.filter(
        (p) => p.stock > 0
    ).length;

    return {
        activeReservations,
        availableProducts,
        totalReservations: reservations.length,
        totalProducts: products.length,
    };
};