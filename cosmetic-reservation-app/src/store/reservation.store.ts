// src/store/reservation.store.ts
import { create } from 'zustand';
import { Reservation } from '../features/reservations/types/reservation.types';
import { Product } from '../types/reservation';
import { ReservationStatus } from '../shared/types/common.types'

interface ReservationStore {
    reservations: Reservation[];
    filteredReservations: Reservation[];
    selectedStatus: ReservationStatus | 'ALL';
    loading: boolean;
    error: string | null;

    // Actions
    setReservations: (reservations: Reservation[]) => void;
    addReservation: (reservation: Reservation) => void;
    updateReservation: (id: string, updates: Partial<Reservation>) => void;
    deleteReservation: (id: string) => void;
    filterByStatus: (status: ReservationStatus | 'ALL') => void;
    searchReservations: (query: string) => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useReservationStore = create<ReservationStore>((set, get) => ({
    reservations: [],
    filteredReservations: [],
    selectedStatus: 'ALL',
    loading: false,
    error: null,

    setReservations: (reservations) =>
        set({ reservations, filteredReservations: reservations }),

    addReservation: (reservation) =>
        set((state) => ({
            reservations: [reservation, ...state.reservations],
            filteredReservations: [reservation, ...state.filteredReservations],
        })),

    updateReservation: (id, updates) =>
        set((state) => {
            const updated = state.reservations.map((res) =>
                res.id === id ? { ...res, ...updates } : res
            );
            return {
                reservations: updated,
                filteredReservations: updated.filter((res) =>
                    state.selectedStatus === 'ALL' || res.status === state.selectedStatus
                ),
            };
        }),

    deleteReservation: (id) =>
        set((state) => ({
            reservations: state.reservations.filter((res) => res.id !== id),
            filteredReservations: state.filteredReservations.filter((res) => res.id !== id),
        })),

    filterByStatus: (status) =>
        set((state) => ({
            selectedStatus: status,
            filteredReservations: status === 'ALL'
                ? state.reservations
                : state.reservations.filter((res) => res.status === status),
        })),

    searchReservations: (query) =>
        set((state) => ({
            filteredReservations: state.reservations.filter(
                (res) =>
                    res.customerName.toLowerCase().includes(query.toLowerCase()) ||
                    res.customerPhone.includes(query) ||
                    res.productName.toLowerCase().includes(query.toLowerCase())
            ),
        })),

    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),
}));