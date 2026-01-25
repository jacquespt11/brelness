// src/components/admin/ActionNotifications.tsx
import React, { useEffect, useState } from 'react';
import { useReservationStore } from '../../state/reservationStore';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * Notifications pour les actions récentes avec animations
 */
const ActionNotifications: React.FC = () => {
    const recentActions = useReservationStore((state) => state.recentActions);
    const clearOldActions = useReservationStore((state) => state.clearOldActions);
    const [visibleNotifications, setVisibleNotifications] = useState<typeof recentActions>([]);

    useEffect(() => {
        // Garder les notifications pendant 5 secondes
        const timer = setTimeout(() => {
            clearOldActions();
        }, 5000);

        return () => clearTimeout(timer);
    }, [recentActions, clearOldActions]);

    useEffect(() => {
        setVisibleNotifications(recentActions.slice(0, 3)); // Max 3 notifications visibles
    }, [recentActions]);

    const getActionIcon = (type: string) => {
        switch (type) {
            case 'create': return '🆕';
            case 'update': return '🔄';
            case 'delete': return '🗑️';
            default: return '📝';
        }
    };

    const getActionColor = (type: string) => {
        switch (type) {
            case 'create': return 'bg-green-500/10 border-green-500/30';
            case 'update': return 'bg-blue-500/10 border-blue-500/30';
            case 'delete': return 'bg-red-500/10 border-red-500/30';
            default: return 'bg-gray-500/10 border-gray-500/30';
        }
    };

    return (
        <div className="fixed top-24 right-4 z-50 space-y-2">
            <AnimatePresence>
                {visibleNotifications.map((action) => (
                    <motion.div
                        key={`${action.reservationId}-${action.timestamp}`}
                        initial={{ opacity: 0, x: 100, scale: 0.8 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 100, scale: 0.8 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25
                        }}
                        className={`p-3 rounded-lg border ${getActionColor(action.type)} backdrop-blur-sm shadow-lg`}
                    >
                        <div className="flex items-center space-x-3">
                            <span className="text-lg">{getActionIcon(action.type)}</span>
                            <div>
                                <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                                    {action.details}
                                </p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">
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
};

export default ActionNotifications;