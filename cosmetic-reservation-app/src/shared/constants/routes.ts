// src/shared/constants/routes.ts

/**
 * Application routes constants
 */

export const ROUTES = {
    // Public routes
    HOME: '/',
    CATALOG: '/catalog',
    RESERVE: '/reserve',
    RESERVE_PRODUCT: (productId: string) => `/reserve/${productId}`,
    ADD_RESERVATION: '/add',

    // Admin routes
    ADMIN: '/admin',
    ADMIN_DASHBOARD: '/admin',
    ADMIN_RESERVATIONS: '/admin/reservations',
    ADMIN_PRODUCTS: '/admin/products',
    ADMIN_SETTINGS: '/admin/settings',
} as const;

export type RouteKey = keyof typeof ROUTES;
