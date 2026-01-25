// src/components/StatsDashboard.tsx
import { useReservationStats } from '../state/reservationStore';
import { ReservationStatus } from '../types/reservation';

/**
 * Composant qui affiche les statistiques en temps réel
 * Toutes les données sont calculées à partir du store central
 */
const StatsDashboard = () => {
    const stats = useReservationStats();

    const statCards = [
        {
            title: 'Total Réservations',
            value: stats.total,
            icon: '📋',
            color: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300',
            description: `Dont ${stats.parStatut[ReservationStatus.PENDING]} en attente`
        },
        {
            title: 'Chiffre d\'Affaires',
            value: `${stats.chiffreAffaires}€`,
            icon: '💰',
            color: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300',
            description: 'Hors réservations annulées'
        },
        {
            title: 'Produit Populaire',
            value: stats.produitLePlusPopulaire,
            icon: '🏆',
            color: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
            description: 'Le plus réservé'
        },
        {
            title: 'Livraisons Aujourd\'hui',
            value: stats.enAttenteAujourdhui,
            icon: '🚚',
            color: 'bg-orange-100 dark:bg-orange-900 text-orange-600 dark:text-orange-300',
            description: 'À préparer'
        }
    ];

    const statusDistribution = [
        { status: ReservationStatus.PENDING, label: 'En attente', color: 'bg-yellow-500' },
        { status: ReservationStatus.CONFIRMED, label: 'Confirmées', color: 'bg-green-500' },
        { status: ReservationStatus.DELIVERED, label: 'Livrées', color: 'bg-blue-500' },
        { status: ReservationStatus.CANCELLED, label: 'Annulées', color: 'bg-red-500' }
    ];

    return (
        <div className="space-y-6">
            {/* Cartes de statistiques */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((card) => (
                    <div
                        key={card.title}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                                    {card.title}
                                </p>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-white">
                                    {card.value}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                    {card.description}
                                </p>
                            </div>
                            <div className={`p-3 rounded-lg ${card.color}`}>
                                <span className="text-2xl">{card.icon}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Distribution par statut */}
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                    Répartition par statut
                </h3>

                <div className="space-y-4">
                    {statusDistribution.map((item) => {
                        const count = stats.parStatut[item.status];
                        const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;

                        return (
                            <div key={item.status} className="space-y-2">
                                <div className="flex justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            {item.label}
                                        </span>
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {count} ({percentage.toFixed(1)}%)
                                    </div>
                                </div>
                                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <div
                                        className={`h-full ${item.color} rounded-full transition-all duration-500`}
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Résumé */}
                <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {statusDistribution.map((item) => (
                            <div key={item.status} className="text-center">
                                <div className={`inline-block p-2 rounded-lg ${item.color.replace('bg-', 'bg-')}`}>
                                    <span className="text-white text-sm font-bold">
                                        {stats.parStatut[item.status]}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                    {item.label}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Indicateur de performance */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                            Performance du jour
                        </h3>
                        <p className="text-gray-600 dark:text-gray-300 mt-1">
                            {stats.quantiteTotale} produits réservés au total
                        </p>
                    </div>
                    <div className="text-right">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {stats.total}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            réservations actives
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StatsDashboard;