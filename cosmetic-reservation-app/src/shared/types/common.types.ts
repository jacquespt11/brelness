// src/shared/types/common.types.ts

/**
 * Common types used across the application
 */

export type Source =
    | 'FACEBOOK'
    | 'INSTAGRAM'
    | 'WHATSAPP'
    | 'LINK_BIO'
    | 'DIRECT'
    | 'ADMIN'
    | 'PHONE'
    | 'STORE';

export type ReservationStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'CANCELLED'
    | 'DELIVERED';

export type ProductCategory =
    | 'facial_care'
    | 'body_care'
    | 'hair_care'
    | 'makeup'
    | 'perfume'
    | 'other';

/**
 * API Response wrapper
 */
export interface ApiResponse<T> {
    data: T;
    message?: string;
    success: boolean;
}

/**
 * Pagination metadata
 */
export interface PaginationMeta {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
}

/**
 * Paginated response
 */
export interface PaginatedResponse<T> {
    data: T[];
    meta: PaginationMeta;
}

/**
 * Filter options
 */
export interface FilterOptions {
    search?: string;
    status?: ReservationStatus;
    category?: ProductCategory;
    startDate?: string;
    endDate?: string;
}
