// src/features/admin/components/ActionNotifications/index.tsx
import React, { useEffect, useState } from 'react';
import { useReservationStore } from '@/features/reservations/store/reservationStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, RefreshCw, Trash2, Plus } from 'lucide-react';

/**
 * Notifications for recent admin actions
 */
export function ActionNotifications() {
    const recentActions = useReservationStore((state) => state.recentActions);
    const [visibleNotifications, setVisibleNotifications] = useState<typeof recentActions>([]);

    useEffect(() => {
        // Filter out FETCH actions and only show the last 3 actions
        const filteredActions = recentActions
            .filter(action => action.type !== 'FETCH')
            .slice(0, 3);

        setVisibleNotifications(filteredActions);

        // Auto-dismiss notifications after 4 seconds
        if (filteredActions.length > 0) {
            const timer = setTimeout(() => {
                setVisibleNotifications([]);
            }, 4000);

            return () => clearTimeout(timer);
        }
    }, [recentActions]);

    const getActionIcon = (type: string) => {
        switch (type) {
            case 'CREATE': return <Plus size={16} className="text-green-600 dark:text-green-400" />;
            case 'UPDATE': return <RefreshCw size={16} className="text-blue-600 dark:text-blue-400" />;
            case 'DELETE': return <Trash2 size={16} className="text-red-600 dark:text-red-400" />;
            default: return <Bell size={16} className="text-gray-600 dark:text-gray-400" />;
        }
    };

    const getActionStyles = (type: string) => {
        switch (type) {
            case 'CREATE': return 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800/50';
            case 'UPDATE': return 'bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-800/50';
            case 'DELETE': return 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800/50';
            default: return 'bg-gray-50 dark:bg-gray-800 border-gray-100 dark:border-gray-700';
        }
    };

    return (
        <div className="fixed top-24 right-4 z-50 space-y-3 pointer-events-none">
            <AnimatePresence>
                {visibleNotifications.map((action, index) => (
                    <motion.div
                        key={`${action.reservationId}-${action.timestamp}`}
                        initial={{ opacity: 0, x: 50, scale: 0.9 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 50, scale: 0.9 }}
                        transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 30,
                            delay: index * 0.1
                        }}
                        className={`p-4 rounded-2xl border ${getActionStyles(action.type)} backdrop-blur-md shadow-xl pointer-events-auto min-w-[280px]`}
                    >
                        <div className="flex items-center space-x-4">
                            <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center bg-white dark:bg-gray-800 shadow-sm border border-black/5 dark:border-white/5">
                                {getActionIcon(action.type)}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold text-gray-800 dark:text-gray-200 truncate">
                                    {action.details}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                                    {new Date(action.timestamp).toLocaleTimeString('fr-FR', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}

export default ActionNotifications;
