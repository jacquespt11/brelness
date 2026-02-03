import { create } from 'zustand';
import { reservationService } from '@/api/reservation.service';
import type { CreateReservationDTO } from '../types/reservation.dto';
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
    fetchReservations: () => Promise<void>;
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
 * Connected to real backend API
 */
export const useReservationStore = create<ReservationStore>((set, get) => ({
    reservations: [],
    filteredReservations: [],
    recentActions: [],
    filters: {},
    loading: false,
    error: null,

    // Fetch reservations from API
    fetchReservations: async () => {
        set({ loading: true, error: null });
        try {
            const response = await reservationService.getAllReservations();
            const reservations: Reservation[] = response.data.map((res) => ({
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

            set((state) => ({
                reservations,
                filteredReservations: reservations,
                loading: false,
                recentActions: [
                    {
                        type: 'FETCH',
                        timestamp: Date.now(),
                        details: `Chargement de ${reservations.length} réservations`,
                        reservationId: '', // Ajustement ici si besoin
                    },
                    ...state.recentActions.slice(0, 4),
                ],
            }));
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'Erreur de chargement',
            });
        }
    },

    // Add reservation via API
    addReservation: async (data: CreateReservationData) => {
        set({ loading: true, error: null });
        try {
            const reservationData: CreateReservationDTO = {
                ...data,
                productId: data.productId || '',
                source: data.source || 'DIRECT',
            };

            const response = await reservationService.createReservation(reservationData);
            const newReservation: Reservation = {
                id: response.data.id,
                customerName: reservationData.customerName,
                customerPhone: reservationData.customerPhone,
                customerEmail: reservationData.customerEmail,
                productId: reservationData.productId!,
                productName: reservationData.productName!,
                productCategory: reservationData.productCategory!,
                quantity: reservationData.quantity,
                unitPrice: reservationData.productPrice,
                totalPrice: reservationData.productPrice * reservationData.quantity,
                status: 'PENDING',
                source: reservationData.source!,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                preferredDeliveryDate: reservationData.preferredDeliveryDate,
                notes: reservationData.notes,
            };

            set((state) => ({
                reservations: [newReservation, ...state.reservations],
                filteredReservations: [newReservation, ...state.filteredReservations],
                loading: false,
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
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'Erreur de création',
            });
            throw error;
        }
    },

    // Update reservation status via API
    updateReservationStatus: async (id: string, status: ReservationStatus) => {
        set({ loading: true, error: null });
        try {
            await reservationService.updateReservationStatus(id, { status });

            set((state) => {
                const updatedReservations = state.reservations.map(r =>
                    r.id === id ? { ...r, status, updatedAt: new Date().toISOString() } : r
                );

                return {
                    reservations: updatedReservations,
                    filteredReservations: state.filters
                        ? updatedReservations // Filter logic would go here if we wanted to re-filter immediately
                        : updatedReservations,
                    loading: false,
                    recentActions: [
                        {
                            type: 'UPDATE',
                            reservationId: id,
                            timestamp: Date.now(),
                            details: `Statut mis à jour: ${status}`,
                        },
                        ...state.recentActions.slice(0, 4),
                    ],
                };
            });

            // Trigger filter update to ensure consistency
            get().setFilters(get().filters);
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'Erreur de mise à jour',
            });
            throw error;
        }
    },

    // Update reservation via API
    updateReservation: async (id: string, data: UpdateReservationData) => {
        // Here we reuse updateReservationStatus if only status/notes are updated
        // or we could implement a more comprehensive update if needed.
        // For now, let's satisfy the interface.
        set({ loading: true, error: null });
        try {
            await reservationService.updateReservationStatus(id, {
                status: data.status,
                notes: data.notes
            });

            set((state) => {
                const updatedReservations = state.reservations.map(r =>
                    r.id === id ? {
                        ...r,
                        ...(data.status && { status: data.status }),
                        ...(data.notes && { notes: data.notes }),
                        ...(data.preferredDeliveryDate && { preferredDeliveryDate: data.preferredDeliveryDate }),
                        updatedAt: new Date().toISOString()
                    } : r
                );

                return {
                    reservations: updatedReservations,
                    loading: false,
                    recentActions: [
                        {
                            type: 'UPDATE',
                            reservationId: id,
                            timestamp: Date.now(),
                            details: 'Mise à jour de la réservation',
                        },
                        ...state.recentActions.slice(0, 4),
                    ],
                };
            });

            get().setFilters(get().filters);
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'Erreur de mise à jour',
            });
            throw error;
        }
    },

    // Delete reservation via API
    deleteReservation: async (id: string) => {
        set({ loading: true, error: null });
        try {
            await reservationService.deleteReservation(id);

            set((state) => {
                const filtered = state.reservations.filter(r => r.id !== id);
                return {
                    reservations: filtered,
                    loading: false,
                    recentActions: [
                        {
                            type: 'DELETE',
                            reservationId: id,
                            timestamp: Date.now(),
                            details: 'Réservation supprimée',
                        },
                        ...state.recentActions.slice(0, 4),
                    ],
                };
            });

            get().setFilters(get().filters);
        } catch (error) {
            set({
                loading: false,
                error: error instanceof Error ? error.message : 'Erreur de suppression',
            });
            throw error;
        }
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
 * Now fetches from API or computes from store
 */
export function useReservationStats(): ReservationStats {
    const reservations = useReservationStore(state => state.reservations);

    // If no reservations yet, fetch them
    if (reservations.length === 0) {
        const { fetchReservations } = useReservationStore.getState();
        fetchReservations().catch(console.error);
    }

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
        .reduce((sum, r) => sum + (r.totalPrice || 0), 0);

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