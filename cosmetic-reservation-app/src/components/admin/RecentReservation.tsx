// src/components/admin/RecentReservations.tsx
import React from 'react';
import type { Reservation } from '../../types/reservation';

interface RecentReservationsProps {
    reservations: Reservation[];
    onViewDetails: (id: number) => void;
    onUpdateStatus: (id: number, status: string) => void;
}

/**
 * Composant affichant les réservations récentes
 * avec options d'actions rapides
 */
const RecentReservations: React.FC<RecentReservationsProps> = ({
    reservations,
    onViewDetails,
    onUpdateStatus,
}) => {
    // Limiter aux 5 dernières réservations
    const recentReservations = reservations.slice(0, 5);

    const getStatusBadge = (status: string) => {
        const statusConfig: Record<string, { color: string; label: string }> = {
            en_attente: { color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300', label: 'En attente' },
            confirmee: { color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300', label: 'Confirmée' },
            livree: { color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300', label: 'Livrée' },
            annulee: { color: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300', label: 'Annulée' },
        };

        const config = statusConfig[status] || { color: 'bg-gray-100 text-gray-800', label: status };

        return (
            <span className={`px-2 py-1 text-xs rounded-full ${config.color}`}>
                {config.label}
            </span>
        );
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                    Réservations récentes
                </h2>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                    {reservations.length} total
                </span>
            </div>

            {recentReservations.length === 0 ? (
                <div className="text-center py-8">
                    <div className="text-4xl mb-4">📋</div>
                    <p className="text-gray-500 dark:text-gray-400">
                        Aucune réservation pour le moment
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 dark:border-gray-700">
                                <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Client
                                </th>
                                <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Produit
                                </th>
                                <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Statut
                                </th>
                                <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Date
                                </th>
                                <th className="text-left py-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {recentReservations.map((reservation) => (
                                <tr
                                    key={reservation.id}
                                    className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                >
                                    <td className="py-4">
                                        <div>
                                            <p className="font-medium text-gray-800 dark:text-white">
                                                {reservation.customerName}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {reservation.customerEmail}
                                            </p>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <p className="text-gray-700 dark:text-gray-300">
                                            {reservation.productName}
                                        </p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                            {reservation.quantity} unité(s)
                                        </p>
                                    </td>
                                    <td className="py-4">
                                        {getStatusBadge(reservation.status)}
                                    </td>
                                    <td className="py-4 text-gray-600 dark:text-gray-400">
                                        {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                                    </td>
                                    <td className="py-4">
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => onViewDetails(reservation.id)}
                                                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                Voir
                                            </button>
                                            <select
                                                value={reservation.status}
                                                onChange={(e) => onUpdateStatus(reservation.id, e.target.value)}
                                                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-lg border-none focus:ring-2 focus:ring-purple-500"
                                            >
                                                <option value="en_attente">En attente</option>
                                                <option value="confirmee">Confirmée</option>
                                                <option value="livree">Livrée</option>
                                                <option value="annulee">Annulée</option>
                                            </select>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {reservations.length > 5 && (
                <div className="mt-6 text-center">
                    <button className="text-purple-600 dark:text-purple-400 hover:underline">
                        Voir toutes les réservations →
                    </button>
                </div>
            )}
        </div>
    );
};

export default RecentReservations;