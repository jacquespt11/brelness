// src/components/ReservationItem.tsx
import type { Reservation } from '../types/reservation';

interface ReservationItemProps {
    reservation: Reservation;
    onDelete: (id: string) => void;
}

/**
 * Composant qui affiche une réservation individuelle
 */
const ReservationItem: React.FC<ReservationItemProps> = ({ reservation, onDelete }) => {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR');
    };

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 mb-4 border-l-4 border-purple-500">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                        {reservation.produit}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="px-2 py-1 text-xs bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200 rounded">
                            {reservation.produitType}
                        </span>
                        <span className="px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded">
                            Qté: {reservation.quantite}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded ${reservation.statut === 'en_attente'
                            ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                            : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                            }`}>
                            {reservation.statut}
                        </span>
                    </div>
                </div>

                <button
                    onClick={() => onDelete(reservation.id)}
                    className="text-red-500 hover:text-red-700 p-1"
                    aria-label="Supprimer la réservation"
                >
                    🗑️
                </button>
            </div>

            <div className="mt-3 text-gray-600 dark:text-gray-300">
                <div className="flex items-center gap-2">
                    <span className="font-medium">Client:</span>
                    <span>{reservation.nomClient}</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                    <span className="font-medium">Email:</span>
                    <span>{reservation.email}</span>
                </div>
                {reservation.dateLivraisonSouhaitee && (
                    <div className="flex items-center gap-2 mt-1">
                        <span className="font-medium">Livraison:</span>
                        <span>{formatDate(reservation.dateLivraisonSouhaitee)}</span>
                    </div>
                )}
                {reservation.notes && (
                    <div className="mt-2">
                        <span className="font-medium">Notes:</span>
                        <p className="text-sm mt-1">{reservation.notes}</p>
                    </div>
                )}
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    Créé le {formatDate(reservation.dateCreation)}
                </div>
            </div>
        </div>
    );
};

export default ReservationItem;