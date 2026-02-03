// src/features/reservations/types/reservation.dto.ts

import type { ReservationStatus, Source } from '@/shared/types/common.types';

/**
 * DTOs for NestJS Backend API
 * These match the expected backend contract
 */

/**
 * DTO for creating a reservation from client
 */
export interface CreateReservationDTO {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    productId: string;
    quantity: number;
    productName?: string;
    productPrice: number;
    productCategory?: string;
    preferredDeliveryDate?: string;
    notes?: string;
    source: Source;
}

/**
 * DTO for updating a reservation (admin only)
 */
export interface UpdateReservationDTO {
    status?: ReservationStatus;
    notes?: string;
}

/**
 * Response DTO from backend
 */
export interface ReservationResponseDTO {
    id: string;
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    product: {
        id: string;
        name: string;
        category: string;
        price: number;
        imageUrl?: string;
    };
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    status: ReservationStatus;
    source: Source;
    createdAt: string;
    updatedAt: string;
    confirmedAt?: string;
    deliveredAt?: string;
    preferredDeliveryDate?: string;
    notes?: string;
}

/**
 * Stats response DTO
 */
export interface ReservationStatsDTO {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    delivered: number;
    totalRevenue: number;
    averageOrderValue: number;
    dailyAverage: number;
    topProducts: Array<{
        productId: string;
        productName: string;
        count: number;
        revenue: number;
    }>;
}

/**
 * Query params for filtering reservations
 */
export interface ReservationQueryDTO {
    status?: ReservationStatus;
    source?: Source;
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    search?: string;
}
