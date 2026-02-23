// src/features/notifications/pages/NotificationsPage.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNotificationStore } from '../store/notificationStore';
import { LoadingState, EmptyState, ErrorState, Button } from '@/shared/components/ui';
import {
    Bell,
    BellOff,
    Check,
    CheckCheck,
    Trash2,
    Filter,
} from 'lucide-react';

/**
 * Notifications Page
 * Full-featured notifications management with filters and actions
 */
export function NotificationsPage() {
    const {
        notifications,
        unreadCount,
        isLoading,
        error,
        fetchNotifications,
        markAsRead,
        markAllAsRead,
        deleteNotification,
    } = useNotificationStore();

    const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');

    useEffect(() => {
        const isReadFilter = filter === 'all' ? undefined : filter === 'read';
        fetchNotifications(isReadFilter);
    }, [filter, fetchNotifications]);

    const handleMarkAsRead = async (id: string) => {
        await markAsRead(id);
    };

    const handleMarkAllAsRead = async () => {
        await markAllAsRead();
    };

    const handleDelete = async (id: string) => {
        await deleteNotification(id);
    };

    const getNotificationIcon = (type: string) => {
        if (type.includes('CREATED')) return '🎉';
        if (type.includes('STATUS_CHANGED')) return '🔄';
        if (type.includes('CANCELLED')) return '❌';
        return '📢';
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'À l\'instant';
        if (diffMins < 60) return `Il y a ${diffMins} min`;
        if (diffHours < 24) return `Il y a ${diffHours}h`;
        if (diffDays < 7) return `Il y a ${diffDays}j`;
        return date.toLocaleDateString('fr-FR');
    };

    // Render states
    if (isLoading && notifications.length === 0) {
        return <LoadingState message="Chargement des notifications..." />;
    }

    if (error && notifications.length === 0) {
        return (
            <ErrorState
                message={error}
                onRetry={() => fetchNotifications()}
            />
        );
    }

    if (notifications.length === 0) {
        return (
            <EmptyState
                icon={BellOff}
                title="Aucune notification"
                description="Vous n'avez pas encore de notifications. Les nouvelles réservations et changements de statut apparaîtront ici."
            />
        );
    }

    return (
        <div className="space-y-6 pb-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <div className="flex items-center space-x-3 mb-2">
                        <div className="p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-500/20">
                            <Bell size={20} />
                        </div>
                        <h1 className="text-3xl lg:text-4xl font-black text-gray-800 dark:text-white">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Notifications</span>
                        </h1>
                    </div>
                    <p className="text-gray-500 font-medium">
                        {unreadCount > 0 ? `${unreadCount} non lue${unreadCount > 1 ? 's' : ''}` : 'Tout est à jour'}
                    </p>
                </div>

                {unreadCount > 0 && (
                    <Button
                        variant="ghost"
                        size="md"
                        onClick={handleMarkAllAsRead}
                        leftIcon={<CheckCheck size={18} />}
                        className="bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700 shadow-sm"
                    >
                        Tout marquer comme lu
                    </Button>
                )}
            </div>

            {/* Filters */}
            <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 shadow-sm">
                <Filter size={18} className="text-indigo-500" />
                <div className="flex gap-2">
                    {(['all', 'unread', 'read'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-lg font-bold text-sm transition-all ${filter === f
                                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md'
                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                                }`}
                        >
                            {f === 'all' ? 'Toutes' : f === 'unread' ? 'Non lues' : 'Lues'}
                        </button>
                    ))}
                </div>
                <span className="ml-auto text-xs font-black text-gray-400 uppercase tracking-widest">
                    {notifications.length} résultat{notifications.length > 1 ? 's' : ''}
                </span>
            </div>

            {/* Notifications List */}
            <div className="space-y-3">
                {notifications.map((notification, index) => (
                    <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-5 rounded-2xl border transition-all ${notification.isRead
                                ? 'bg-white dark:bg-gray-800 border-gray-100 dark:border-gray-700'
                                : 'bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-100 dark:border-indigo-800 shadow-md'
                            }`}
                    >
                        <div className="flex items-start gap-4">
                            {/* Icon */}
                            <div className="flex-shrink-0 w-12 h-12 rounded-full bg-white dark:bg-gray-700 flex items-center justify-center text-2xl shadow-sm">
                                {getNotificationIcon(notification.type)}
                            </div>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                                <div className="flex items-start justify-between gap-4 mb-2">
                                    <h3 className="font-bold text-gray-800 dark:text-white">
                                        {notification.title}
                                    </h3>
                                    <span className="text-xs text-gray-500 dark:text-gray-400 whitespace-nowrap">
                                        {formatDate(notification.createdAt)}
                                    </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                    {notification.message}
                                </p>

                                {/* Actions */}
                                <div className="flex items-center gap-2">
                                    {!notification.isRead && (
                                        <button
                                            onClick={() => handleMarkAsRead(notification.id)}
                                            className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 dark:hover:bg-indigo-900/30 rounded-lg transition-colors"
                                        >
                                            <Check size={14} />
                                            Marquer comme lu
                                        </button>
                                    )}
                                    <button
                                        onClick={() => handleDelete(notification.id)}
                                        className="flex items-center gap-1 px-3 py-1 text-xs font-bold text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                                    >
                                        <Trash2 size={14} />
                                        Supprimer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
}

export default NotificationsPage;
