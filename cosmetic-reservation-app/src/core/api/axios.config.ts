// src/core/api/axios.config.ts

import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/features/auth/store/authStore';
import { APP_CONFIG } from '@/shared/constants/config';

/**
 * Expert level Axios instance configuration
 * Centralized for all feature-based services
 */
export const apiClient: AxiosInstance = axios.create({
    baseURL: APP_CONFIG.api.baseUrl,
    timeout: APP_CONFIG.api.timeout,
    headers: {
        'Content-Type': 'application/json',
    },
});

/**
 * Request interceptor
 * Automatically adds authentication token from Zustand store
 */
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = useAuthStore.getState().token;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor
 * Handles global error states (401, 403, 500)
 */
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        const status = error.response?.status;
        const message = (error.response?.data as any)?.message || error.message;

        if (status === 401) {
            // Unauthorized - clear state and redirect
            useAuthStore.getState().logout();
            window.location.href = '/login';
        }

        if (status === 403) {
            console.error('Expert API Error [403]: Accès non autorisé -', message);
            // Can be handled by components to show specific UI feedback
        }

        if (status >= 500) {
            console.error('Expert API Error [500]: Erreur Serveur -', message);
        }

        return Promise.reject(error);
    }
);

/**
 * Helper function to handle API errors for services
 */
export function handleApiError(error: unknown): string {
    if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
            if (Array.isArray(error.response.data.message)) {
                return error.response.data.message.join(', ');
            }
            return error.response.data.message;
        }
        return error.message || 'Une erreur API s\'est produite';
    }
    return 'Une erreur inattendue s\'est produite';
}

export default apiClient;
