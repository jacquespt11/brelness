// src/features/notifications/store/notificationStore.ts
import { create } from 'zustand';
import { notificationService } from '../services/notification.service';
import type { Notification } from '../types/notification.types';

interface NotificationState {
    notifications: Notification[];
    unreadCount: number;
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchNotifications: (isRead?: boolean) => Promise<void>;
    markAsRead: (id: string) => Promise<void>;
    markAllAsRead: () => Promise<void>;
    deleteNotification: (id: string) => Promise<void>;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
    notifications: [],
    unreadCount: 0,
    isLoading: false,
    error: null,

    fetchNotifications: async (isRead?: boolean) => {
        set({ isLoading: true, error: null });
        try {
            const response = await notificationService.getAll(isRead);
            set({
                notifications: response.data,
                unreadCount: response.meta.unread,
                isLoading: false,
            });
        } catch (error: any) {
            set({
                error: error.message || 'Erreur lors du chargement des notifications',
                isLoading: false,
            });
        }
    },

    markAsRead: async (id: string) => {
        try {
            await notificationService.markAsRead(id);
            const { notifications } = get();
            set({
                notifications: notifications.map(n =>
                    n.id === id ? { ...n, isRead: true } : n
                ),
                unreadCount: Math.max(0, get().unreadCount - 1),
            });
        } catch (error: any) {
            set({ error: error.message || 'Erreur lors de la mise à jour' });
        }
    },

    markAllAsRead: async () => {
        try {
            await notificationService.markAllAsRead();
            const { notifications } = get();
            set({
                notifications: notifications.map(n => ({ ...n, isRead: true })),
                unreadCount: 0,
            });
        } catch (error: any) {
            set({ error: error.message || 'Erreur lors de la mise à jour' });
        }
    },

    deleteNotification: async (id: string) => {
        try {
            await notificationService.delete(id);
            const { notifications } = get();
            const deletedNotif = notifications.find(n => n.id === id);
            set({
                notifications: notifications.filter(n => n.id !== id),
                unreadCount: deletedNotif && !deletedNotif.isRead
                    ? Math.max(0, get().unreadCount - 1)
                    : get().unreadCount,
            });
        } catch (error: any) {
            set({ error: error.message || 'Erreur lors de la suppression' });
        }
    },
}));
