// src/features/admin/components/StatusBadge/index.tsx
import React from 'react';
import { ReservationStatus } from '@/shared/types/common.types';

interface StatusBadgeProps {
    status: string; // Using string to be compatible with common types
    onStatusChange?: (newStatus: string) => void;
    isEditable?: boolean;
    size?: 'sm' | 'md' | 'lg';
}

const STATUS_LABELS: Record<string, any> = {
    'PENDING': {
        label: 'En attente',
        color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
        icon: '⏳',
    },
    'CONFIRMED': {
        label: 'Confirmée',
        color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
        icon: '✅',
    },
    'DELIVERED': {
        label: 'Livrée',
        color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
        icon: '🚚',
    },
    'CANCELLED': {
        label: 'Annulée',
        color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        icon: '❌',
    }
};

export function StatusBadge({
    status,
    onStatusChange,
    isEditable = false,
    size = 'md'
}: StatusBadgeProps) {
    const config = STATUS_LABELS[status] || STATUS_LABELS['PENDING'];

    const sizeClasses = {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base'
    };

    const handleClick = () => {
        if (isEditable && onStatusChange) {
            const statuses = Object.keys(STATUS_LABELS);
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
                ${isEditable ? 'ring-2 ring-offset-1 ring-opacity-50 ring-purple-300' : ''}
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
}

export default StatusBadge;
