// src/core/api/axios.config.ts

import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { APP_CONFIG } from '@/shared/constants/config';

/**
 * Axios instance configuration
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
 * Adds authentication token to requests
 */
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Get token from localStorage (will be replaced with proper auth later)
        const token = localStorage.getItem('auth_token');

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
 * Handles errors globally
 */
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    (error: AxiosError) => {
        // Handle different error status codes
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // Unauthorized - clear token and redirect to login
                    localStorage.removeItem('auth_token');
                    // TODO: Redirect to login page
                    console.error('Unauthorized - please login');
                    break;

                case 403:
                    // Forbidden
                    console.error('Access forbidden');
                    break;

                case 404:
                    // Not found
                    console.error('Resource not found');
                    break;

                case 500:
                    // Server error
                    console.error('Server error - please try again later');
                    break;

                default:
                    console.error('An error occurred:', error.message);
            }
        } else if (error.request) {
            // Request made but no response received
            console.error('Network error - please check your connection');
        } else {
            // Something else happened
            console.error('Error:', error.message);
        }

        return Promise.reject(error);
    }
);

/**
 * Helper function to handle API errors
 */
export function handleApiError(error: unknown): string {
    if (axios.isAxiosError(error)) {
        if (error.response?.data?.message) {
            return error.response.data.message;
        }
        if (error.message) {
            return error.message;
        }
    }
    return 'Une erreur inattendue s\'est produite';
}
