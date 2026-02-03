// src/features/reservations/types/reservation.types.ts

import type { ReservationStatus, Source } from '@/shared/types/common.types';

/**
 * Main Reservation interface
 * Single source of truth for reservation data model
 */
export interface Reservation {
    id: string;

    // Customer information
    customerName: string;
    customerPhone: string;
    customerEmail: string;

    // Product information
    productId: string;
    productName: string;
    productCategory: string;
    productImage?: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;

    // Status and tracking
    status: ReservationStatus;
    source: Source;

    // Dates (ISO strings)
    createdAt: string;
    updatedAt: string;
    confirmedAt?: string;
    deliveredAt?: string;
    preferredDeliveryDate?: string;

    // Additional info
    notes?: string;
}

/**
 * Data required to create a new reservation
 */
export interface CreateReservationData {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    productId?: string;
    productName?: string;
    productPrice: number;
    productCategory?: string;
    quantity: number;
    preferredDeliveryDate?: string;
    notes?: string;
    source?: Source;
}

/**
 * Data for updating a reservation
 */
export interface UpdateReservationData {
    status?: ReservationStatus;
    notes?: string;
    preferredDeliveryDate?: string;
}

/**
 * Reservation statistics
 * Always computed from reservation list, never stored separately
 */
export interface ReservationStats {
    total: number;
    byStatus: {
        pending: number;
        confirmed: number;
        cancelled: number;
        delivered: number;
    };
    totalRevenue: number;
    averageOrderValue: number;
    totalQuantity: number;
    pendingToday: number;
    mostPopularProduct?: {
        name: string;
        count: number;
    };
}

/**
 * Filters for reservation list
 */
export interface ReservationFilters {
    status?: ReservationStatus;
    source?: Source;
    startDate?: string;
    endDate?: string;
    productCategory?: string;
    search?: string;
}

/**
 * Recent action tracking
 */
export interface ReservationAction {
    type: 'CREATE' | 'UPDATE' | 'DELETE' | 'FETCH';
    reservationId: string;
    timestamp: number;
    details: string;
    userName?: string;
}
