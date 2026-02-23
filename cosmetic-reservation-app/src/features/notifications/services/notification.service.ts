// src/features/notifications/services/notification.service.ts
import { apiClient, handleApiError } from '@/core/api/axios.config';
import type { Notification, NotificationResponse } from '../types/notification.types';

export const notificationService = {
    /**
     * Get all notifications
     */
    getAll: async (isRead?: boolean): Promise<NotificationResponse> => {
        try {
            const params = isRead !== undefined ? { isRead: isRead.toString() } : {};
            const response = await apiClient.get<NotificationResponse>('/notifications', { params });
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Mark notification as read
     */
    markAsRead: async (id: string): Promise<Notification> => {
        try {
            const response = await apiClient.patch<Notification>(`/notifications/${id}/read`);
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Mark all notifications as read
     */
    markAllAsRead: async (): Promise<{ count: number }> => {
        try {
            const response = await apiClient.patch<{ count: number }>('/notifications/read-all');
            return response.data;
        } catch (error) {
            throw handleApiError(error);
        }
    },

    /**
     * Delete a notification
     */
    delete: async (id: string): Promise<void> => {
        try {
            await apiClient.delete(`/notifications/${id}`);
        } catch (error) {
            throw handleApiError(error);
        }
    },
};
