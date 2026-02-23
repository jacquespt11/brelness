// src/features/notifications/types/notification.types.ts

export interface Notification {
    id: string;
    type: string;
    title: string;
    message: string;
    isRead: boolean;
    metadata?: Record<string, any>;
    createdAt: string;
    updatedAt: string;
}

export interface NotificationResponse {
    data: Notification[];
    meta: {
        total: number;
        unread: number;
    };
}
