// src/core/api/endpoints.ts

/**
 * API endpoints constants
 */

export const API_ENDPOINTS = {
    // Reservations
    RESERVATIONS: '/reservations',
    RESERVATION_BY_ID: (id: string) => `/reservations/${id}`,
    RESERVATION_STATS: '/reservations/stats',

    // Products
    PRODUCTS: '/products',
    PRODUCT_BY_ID: (id: string) => `/products/${id}`,
    PRODUCT_CATEGORIES: '/products/categories',

    // Admin
    ADMIN_DASHBOARD: '/admin/dashboard',
    ADMIN_STATS: '/admin/stats',

    // Auth (for future use)
    AUTH_LOGIN: '/auth/login',
    AUTH_REGISTER: '/auth/register',
    AUTH_LOGOUT: '/auth/logout',
    AUTH_REFRESH: '/auth/refresh',
} as const;

export type ApiEndpoint = typeof API_ENDPOINTS;
