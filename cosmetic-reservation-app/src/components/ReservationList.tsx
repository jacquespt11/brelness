// src/components/ReservationList.tsx
import ReservationItem from './ReservationItem';
import type { Reservation } from '../types/reservation';

interface ReservationListProps {
    reservations: Reservation[];
    onDeleteReservation: (id: number) => void;
}

/**
 * Composant qui affiche la liste des réservations
 */
const ReservationList = ({ reservations, onDeleteReservation }: ReservationListProps) => {
    if (reservations.length === 0) {
        return (
            <div className="text-center py-8">
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
        <div>
            <div className="mb-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                    Total: {reservations.length} réservation(s)
                </h3>
            </div>

            <div className="space-y-4">
                {reservations.map(reservation => (
                    <ReservationItem
                        key={reservation.id}
                        reservation={reservation}
                        onDelete={onDeleteReservation}
                    />
                ))}
            </div>
        </div>
    );
};

export default ReservationList;