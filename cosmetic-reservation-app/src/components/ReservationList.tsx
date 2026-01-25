// src/components/ReservationList.tsx
import { useState } from 'react';
import { useReservationStore } from '../state/reservationStore';
import { ReservationStatus } from '../types/reservation';

/**
 * Composant liste des réservations connecté au store
 * Affiche les données en temps réel et permet les interactions
 */
const ReservationList = () => {
    const reservations = useReservationStore((state) => state.reservations);
    const updateReservationStatus = useReservationStore((state) => state.updateReservationStatus);
    const deleteReservation = useReservationStore((state) => state.deleteReservation);

    const [selectedStatus, setSelectedStatus] = useState<ReservationStatus | 'all'>('all');
    const [searchTerm, setSearchTerm] = useState('');

    // Filtrer les réservations
    const filteredReservations = reservations.filter(reservation => {
        if (selectedStatus !== 'all' && reservation.statut !== selectedStatus) {
            return false;
        }

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            return (
                reservation.nomClient.toLowerCase().includes(term) ||
                reservation.produit.toLowerCase().includes(term) ||
                reservation.email.toLowerCase().includes(term) ||
                reservation.telephone.includes(term)
            );
        }

        return true;
    });

    const handleStatusChange = (id: string, newStatus: ReservationStatus) => {
        updateReservationStatus(id, newStatus);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const getStatusColor = (status: ReservationStatus) => {
        const colors = {
            [ReservationStatus.PENDING]: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
            [ReservationStatus.CONFIRMED]: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            [ReservationStatus.DELIVERED]: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            [ReservationStatus.CANCELLED]: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
        };
        return colors[status];
    };

    const getStatusLabel = (status: ReservationStatus) => {
        const labels = {
            [ReservationStatus.PENDING]: 'En attente',
            [ReservationStatus.CONFIRMED]: 'Confirmée',
            [ReservationStatus.DELIVERED]: 'Livrée',
            [ReservationStatus.CANCELLED]: 'Annulée',
        };
        return labels[status];
    };

    if (reservations.length === 0) {
        return (
            <div className="text-center py-12">
                <div className="text-5xl mb-4">📋</div>
                <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300 mb-2">
                    Aucune réservation
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                    Créez votre première réservation pour commencer
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filtres */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as ReservationStatus | 'all')}
                        className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800"
                    >
                        <option value="all">Tous les statuts</option>
                        {Object.values(ReservationStatus).map(status => (
                            <option key={status} value={status}>
                                {getStatusLabel(status)}
                            </option>
                        ))}
                    </select>

                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 w-full md:w-64"
                        />
                        <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                            🔍
                        </span>
                    </div>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                    {filteredReservations.length} / {reservations.length} réservations
                </div>
            </div>

            {/* Tableau des réservations */}
            <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="w-full">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Client
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Produit
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Statut
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Montant
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-800">
                        {filteredReservations.map((reservation) => (
                            <tr
                                key={reservation.id}
                                className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                            >
                                <td className="px-6 py-4">
                                    <div>
                                        <div className="font-medium text-gray-900 dark:text-white">
                                            {reservation.nomClient}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {reservation.telephone}
                                        </div>
                                        {reservation.email && (
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {reservation.email}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {reservation.produit}
                                    </div>
                                    <div className="text-sm text-gray-500 dark:text-gray-400">
                                        {reservation.quantite} × {reservation.prixUnitaire}€
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <select
                                        value={reservation.statut}
                                        onChange={(e) => handleStatusChange(reservation.id, e.target.value as ReservationStatus)}
                                        className={`px-3 py-1 text-sm rounded-full border-none focus:ring-2 focus:ring-purple-500 ${getStatusColor(reservation.statut)}`}
                                    >
                                        {Object.values(ReservationStatus).map(status => (
                                            <option key={status} value={status}>
                                                {getStatusLabel(status)}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                                    <div>{formatDate(reservation.dateCreation)}</div>
                                    {reservation.dateLivraisonSouhaitee && (
                                        <div className="text-xs">
                                            Livraison: {formatDate(reservation.dateLivraisonSouhaitee)}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="font-medium text-gray-900 dark:text-white">
                                        {(reservation.prixUnitaire * reservation.quantite).toFixed(2)}€
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => deleteReservation(reservation.id)}
                                            className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                                            title="Supprimer"
                                        >
                                            🗑️
                                        </button>
                                        <button
                                            className="p-2 text-gray-600 hover:text-gray-800 dark:text-gray-400 dark:hover:text-gray-300"
                                            title="Voir les détails"
                                            onClick={() => console.log('Détails:', reservation)}
                                        >
                                            👁️
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Résumé */}
            <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                Les modifications sont appliquées en temps réel. Toutes les données sont sauvegardées localement.
            </div>
        </div>
    );
};

export default ReservationList;