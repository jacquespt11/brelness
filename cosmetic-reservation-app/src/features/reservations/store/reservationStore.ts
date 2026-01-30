// src/features/reservations/store/reservationStore.ts

import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type {
    Reservation,
    CreateReservationData,
    UpdateReservationData,
    ReservationStats,
    ReservationFilters,
    ReservationAction,
} from '../types/reservation.types';
import type { ReservationStatus } from '@/shared/types/common.types';

/**
 * Mock products data (temporary until backend is ready)
 */
export const MOCK_PRODUCTS = [
    {
        id: 'prod_1',
        name: 'Crème Hydratante',
        description: 'Soin visage jour',
        price: 45.90,
        category: 'facial_care' as const,
        stock: 50,
        isActive: true,
    },
    {
        id: 'prod_2',
        name: 'Sérum Anti-âge',
        description: 'Concentré régénérant',
        price: 89.99,
        category: 'facial_care' as const,
        stock: 30,
        isActive: true,
    },
    {
        id: 'prod_3',
        name: 'Rouge à Lèvres',
        description: 'Mat longue tenue',
        price: 32.50,
        category: 'makeup' as const,
        stock: 100,
        isActive: true,
    },
    {
        id: 'prod_4',
        name: 'Parfum Élégance',
        description: 'Fragrance florale',
        price: 120.00,
        category: 'perfume' as const,
        stock: 25,
        isActive: true,
    },
    {
        id: 'prod_5',
        name: 'Gel Douche Relaxant',
        description: 'Soin corps aux huiles essentielles',
        price: 28.75,
        category: 'body_care' as const,
        stock: 75,
        isActive: true,
    },
    {
        id: 'prod_6',
        name: 'Shampoing Revitalisant',
        description: 'Pour cheveux abîmés',
        price: 35.00,
        category: 'hair_care' as const,
        stock: 40,
        isActive: true,
    },
];

/**
 * Reservation store interface
 */
interface ReservationStore {
    // State
    reservations: Reservation[];
    filteredReservations: Reservation[];
    recentActions: ReservationAction[];
    filters: ReservationFilters;
    loading: boolean;
    error: string | null;

    // Actions
    addReservation: (data: CreateReservationData) => Promise<Reservation>;
    updateReservationStatus: (id: string, status: ReservationStatus) => Promise<void>;
    updateReservation: (id: string, data: UpdateReservationData) => Promise<void>;
    deleteReservation: (id: string) => Promise<void>;

    // Filters
    setFilters: (filters: ReservationFilters) => void;
    clearFilters: () => void;

    // Utilities
    getReservationById: (id: string) => Reservation | undefined;
    getReservationsByStatus: (status: ReservationStatus) => Reservation[];
    clearOldActions: () => void;
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

/**
 * Unified Reservation Store
 * Combines functionality from both old stores
 */
export const useReservationStore = create<ReservationStore>((set, get) => ({
    // Initial state
    reservations: [
        // Mock data for demonstration
        {
            id: 'RES-ABC123',
            customerName: 'Marie Dubois',
            customerPhone: '0612345678',
            customerEmail: 'marie@example.com',
            productId: 'prod_1',
            productName: 'Crème Hydratante',
            productCategory: 'facial_care',
            quantity: 2,
            unitPrice: 45.90,
            totalPrice: 91.80,
            status: 'CONFIRMED',
            source: 'DIRECT',
            createdAt: '2024-01-15T10:30:00Z',
            updatedAt: '2024-01-15T10:30:00Z',
            confirmedAt: '2024-01-15T11:00:00Z',
        },
        {
            id: 'RES-DEF456',
            customerName: 'Sophie Martin',
            customerPhone: '0698765432',
            customerEmail: 'sophie@example.com',
            productId: 'prod_2',
            productName: 'Sérum Anti-âge',
            productCategory: 'facial_care',
            quantity: 1,
            unitPrice: 89.99,
            totalPrice: 89.99,
            status: 'PENDING',
            source: 'PHONE',
            createdAt: '2024-01-16T14:20:00Z',
            updatedAt: '2024-01-16T14:20:00Z',
        },
        {
            id: 'RES-GHI789',
            customerName: 'Julie Bernard',
            customerPhone: '0623456789',
            customerEmail: 'julie@example.com',
            productId: 'prod_3',
            productName: 'Rouge à Lèvres',
            productCategory: 'makeup',
            quantity: 3,
            unitPrice: 32.50,
            totalPrice: 97.50,
            status: 'DELIVERED',
            source: 'STORE',
            createdAt: '2024-01-14T09:15:00Z',
            updatedAt: '2024-01-14T09:15:00Z',
            deliveredAt: '2024-01-15T16:00:00Z',
        },
    ],
    filteredReservations: [],
    recentActions: [],
    filters: {},
    loading: false,
    error: null,

    // Add reservation
    addReservation: async (data: CreateReservationData) => {
        const product = MOCK_PRODUCTS.find(p => p.id === data.productId);

        const newReservation: Reservation = {
            id: `RES-${uuidv4().slice(0, 8).toUpperCase()}`,
            customerName: data.customerName.trim(),
            customerPhone: data.customerPhone.replace(/\s/g, ''),
            customerEmail: data.customerEmail.trim(),
            productId: data.productId || '',
            productName: product?.name || data.productName || 'Produit Inconnu',
            productCategory: product?.category || data.productCategory || 'other',
            quantity: data.quantity,
            unitPrice: product?.price || 0,
            totalPrice: (product?.price || 0) * data.quantity,
            status: 'PENDING',
            source: data.source || 'DIRECT',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            preferredDeliveryDate: data.preferredDeliveryDate,
            notes: data.notes?.trim(),
        };

        set((state) => ({
            reservations: [newReservation, ...state.reservations],
            filteredReservations: [newReservation, ...state.filteredReservations],
            recentActions: [
                {
                    type: 'CREATE',
                    reservationId: newReservation.id,
                    timestamp: Date.now(),
                    details: `Nouvelle réservation: ${newReservation.customerName}`,
                },
                ...state.recentActions.slice(0, 4),
            ],
        }));

        return newReservation;
    },

    // Update reservation status
    updateReservationStatus: async (id: string, status: ReservationStatus) => {
        const reservation = get().reservations.find(r => r.id === id);
        if (!reservation) return;

        const oldStatus = reservation.status;
        const now = new Date().toISOString();

        set((state) => ({
            reservations: state.reservations.map((res) =>
                res.id === id
                    ? {
                        ...res,
                        status,
                        updatedAt: now,
                        confirmedAt: status === 'CONFIRMED' ? now : res.confirmedAt,
                        deliveredAt: status === 'DELIVERED' ? now : res.deliveredAt,
                    }
                    : res
            ),
            filteredReservations: state.filteredReservations.map((res) =>
                res.id === id
                    ? {
                        ...res,
                        status,
                        updatedAt: now,
                        confirmedAt: status === 'CONFIRMED' ? now : res.confirmedAt,
                        deliveredAt: status === 'DELIVERED' ? now : res.deliveredAt,
                    }
                    : res
            ),
            recentActions: [
                {
                    type: 'UPDATE',
                    reservationId: id,
                    timestamp: Date.now(),
                    details: `Statut changé: ${oldStatus} → ${status}`,
                },
                ...state.recentActions.slice(0, 4),
            ],
        }));
    },

    // Update reservation
    updateReservation: async (id: string, data: UpdateReservationData) => {
        set((state) => ({
            reservations: state.reservations.map((res) =>
                res.id === id
                    ? { ...res, ...data, updatedAt: new Date().toISOString() }
                    : res
            ),
            filteredReservations: state.filteredReservations.map((res) =>
                res.id === id
                    ? { ...res, ...data, updatedAt: new Date().toISOString() }
                    : res
            ),
        }));
    },

    // Delete reservation
    deleteReservation: async (id: string) => {
        const reservation = get().reservations.find(r => r.id === id);
        if (!reservation) return;

        set((state) => ({
            reservations: state.reservations.filter((res) => res.id !== id),
            filteredReservations: state.filteredReservations.filter((res) => res.id !== id),
            recentActions: [
                {
                    type: 'DELETE',
                    reservationId: id,
                    timestamp: Date.now(),
                    details: `Suppression: ${reservation.customerName}`,
                },
                ...state.recentActions.slice(0, 4),
            ],
        }));
    },

    // Set filters
    setFilters: (filters: ReservationFilters) => {
        set({ filters });

        const { reservations } = get();
        let filtered = [...reservations];

        if (filters.status) {
            filtered = filtered.filter(r => r.status === filters.status);
        }

        if (filters.source) {
            filtered = filtered.filter(r => r.source === filters.source);
        }

        if (filters.productCategory) {
            filtered = filtered.filter(r => r.productCategory === filters.productCategory);
        }

        if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(
                r =>
                    r.customerName.toLowerCase().includes(search) ||
                    r.customerPhone.includes(search) ||
                    r.productName.toLowerCase().includes(search)
            );
        }

        if (filters.startDate) {
            filtered = filtered.filter(r => new Date(r.createdAt) >= new Date(filters.startDate!));
        }

        if (filters.endDate) {
            filtered = filtered.filter(r => new Date(r.createdAt) <= new Date(filters.endDate!));
        }

        set({ filteredReservations: filtered });
    },

    // Clear filters
    clearFilters: () => {
        set((state) => ({
            filters: {},
            filteredReservations: state.reservations,
        }));
    },

    // Get reservation by ID
    getReservationById: (id: string) => {
        return get().reservations.find(r => r.id === id);
    },

    // Get reservations by status
    getReservationsByStatus: (status: ReservationStatus) => {
        return get().reservations.filter(r => r.status === status);
    },

    // Clear old actions (older than 5 minutes)
    clearOldActions: () => {
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        set((state) => ({
            recentActions: state.recentActions.filter(action => action.timestamp > fiveMinutesAgo),
        }));
    },

    // Set loading
    setLoading: (loading: boolean) => {
        set({ loading });
    },

    // Set error
    setError: (error: string | null) => {
        set({ error });
    },
}));

/**
 * Hook to compute reservation statistics
 * Always derived from current state, never stored
 */
export function useReservationStats(): ReservationStats {
    const reservations = useReservationStore(state => state.reservations);

    const total = reservations.length;

    // Count by status
    const byStatus = {
        pending: reservations.filter(r => r.status === 'PENDING').length,
        confirmed: reservations.filter(r => r.status === 'CONFIRMED').length,
        cancelled: reservations.filter(r => r.status === 'CANCELLED').length,
        delivered: reservations.filter(r => r.status === 'DELIVERED').length,
    };

    // Total revenue (excluding cancelled)
    const totalRevenue = reservations
        .filter(r => r.status !== 'CANCELLED')
        .reduce((sum, r) => sum + r.totalPrice, 0);

    // Average order value
    const averageOrderValue = total > 0 ? totalRevenue / total : 0;

    // Total quantity
    const totalQuantity = reservations.reduce((sum, r) => sum + r.quantity, 0);

    // Pending today
    const today = new Date().toISOString().split('T')[0];
    const pendingToday = reservations.filter(
        r => r.status === 'PENDING' && r.createdAt.startsWith(today)
    ).length;

    // Most popular product
    const productCounts = reservations.reduce((acc, curr) => {
        acc[curr.productName] = (acc[curr.productName] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const mostPopularProduct = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0];

    return {
        total,
        byStatus,
        totalRevenue,
        averageOrderValue,
        totalQuantity,
        pendingToday,
        mostPopularProduct: mostPopularProduct
            ? { name: mostPopularProduct[0], count: mostPopularProduct[1] }
            : undefined,
    };
}
