// src/shared/constants/config.ts

/**
 * Application configuration constants
 */

export const APP_CONFIG = {
    name: 'Brelness',
    description: 'Gestion de réservations de produits cosmétiques',
    version: '1.0.0',

    // API configuration
    api: {
        baseUrl: (import.meta as any).env.VITE_API_BASE_URL || 'http://localhost:3000/api',
        timeout: 30000, // 30 seconds
    },

    // Pagination
    pagination: {
        defaultLimit: 10,
        maxLimit: 100,
    },

    // Form validation
    validation: {
        minNameLength: 2,
        maxNameLength: 100,
        minQuantity: 1,
        maxQuantity: 999,
        phoneLength: 10,
    },

    // UI
    ui: {
        animationDuration: 300,
        toastDuration: 3000,
        debounceDelay: 300,
    },

    // Features flags
    features: {
        enableNotifications: true,
        enableAnalytics: false,
        enableDarkMode: true,
    },
} as const;

export type AppConfig = typeof APP_CONFIG;
