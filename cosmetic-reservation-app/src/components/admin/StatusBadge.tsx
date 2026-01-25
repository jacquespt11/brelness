// src/components/admin/StatusBadge.tsx
import React from 'react';
import { ReservationStatus } from '../../types/reservation';

interface StatusBadgeProps {
    status: ReservationStatus;
    onStatusChange?: (newStatus: ReservationStatus) => void;
    isEditable?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

/**
 * Badge de statut avec animation et édition en ligne
 */
const StatusBadge: React.FC<StatusBadgeProps> = ({
    status,
    onStatusChange,
    isEditable = false,
    size = 'md'
}) => {
    const statusConfig = {
        [ReservationStatus.PENDING]: {
            label: 'En attente',
            color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
            icon: '⏳',
            order: 1
        },
        [ReservationStatus.CONFIRMED]: {
            label: 'Confirmée',
            color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            icon: '✅',
            order: 2
        },
        [ReservationStatus.DELIVERED]: {
            label: 'Livrée',
            color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
            icon: '🚚',
            order: 3
        },
        [ReservationStatus.CANCELLED]: {
            label: 'Annulée',
            color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
            icon: '❌',
            order: 4
        }
    };

    const config = statusConfig[status];
    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base'
    };

    const handleClick = () => {
        if (isEditable && onStatusChange) {
            // Cycle through statuses in order
            const statuses = Object.values(ReservationStatus);
            const currentIndex = statuses.indexOf(status);
            const nextIndex = (currentIndex + 1) % statuses.length;
            onStatusChange(statuses[nextIndex]);
        }
    };

    return (
        <div
            onClick={handleClick}
            className={`
        ${sizeClasses[size]} 
        ${config.color} 
        rounded-full font-medium inline-flex items-center space-x-2
        ${isEditable ? 'cursor-pointer hover:opacity-90 active:scale-95 transition-all duration-200' : ''}
        ${isEditable ? 'ring-2 ring-offset-1 ring-opacity-50' : ''}
        ${isEditable ? status === ReservationStatus.PENDING ? 'ring-yellow-300' :
                    status === ReservationStatus.CONFIRMED ? 'ring-green-300' :
                        status === ReservationStatus.DELIVERED ? 'ring-blue-300' :
                            'ring-red-300' : ''}
      `}
            title={isEditable ? 'Cliquer pour changer le statut' : ''}
        >
            <span>{config.icon}</span>
            <span>{config.label}</span>
            {isEditable && (
                <span className="opacity-70">↻</span>
            )}
        </div>
    );
};

export default StatusBadge;