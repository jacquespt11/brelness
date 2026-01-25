// src/pages/AdminDashboard.tsx
import { useState, useEffect } from 'react';
import StatsCard from '../components/admin/StatsCard';
import RecentReservations from '../components/admin/RecentReservation';
import ProductChart from '../components/admin/ProductChart';
import QuickActions from '../components/admin/QuickActions';
import type { Reservation } from '../types/reservation';

/**
 * Tableau de bord administrateur principal
 * Affiche les statistiques, graphiques et actions rapides
 */
const AdminDashboard = () => {
    // Données simulées - plus tard connectées à une API
    const [stats, setStats] = useState({
        totalReservations: 0,
        pendingReservations: 0,
        completedReservations: 0,
        totalRevenue: 0,
        monthlyGrowth: 12,
        popularProduct: 'Crème hydratante',
    });

    const [reservations, setReservations] = useState<Reservation[]>([]);
    const [chartData, setChartData] = useState({
        labels: ['Soin visage', 'Maquillage', 'Parfum', 'Soin corps', 'Cheveux'],
        values: [45, 32, 28, 22, 18]
    });

    // Charger les données (simulation)
    useEffect(() => {
        // En production, ces données viendraient d'une API
        const mockReservations: Reservation[] = [
            {
                id: 1,
                productName: 'Crème hydratante anti-âge',
                productType: 'soin_visage',
                quantity: 2,
                customerName: 'Marie Dupont',
                customerEmail: 'marie@email.com',
                deliveryDate: '2024-01-30',
                notes: 'Livraison avant 18h',
                status: 'en_attente',
                createdAt: '2024-01-24T10:30:00'
            },
            // Ajouter plus de données mock...
        ];

        setReservations(mockReservations);
        setStats({
            totalReservations: 156,
            pendingReservations: 23,
            completedReservations: 89,
            totalRevenue: 12540,
            monthlyGrowth: 12,
            popularProduct: 'Crème hydratante'
        });
    }, []);

    // Gestion des actions
    const handleViewDetails = (id: number) => {
        console.log('Voir détails réservation:', id);
        // Navigation vers la page de détails
    };

    const handleUpdateStatus = (id: number, status: string) => {
        setReservations(prev =>
            prev.map(res =>
                res.id === id ? { ...res, status } : res
            )
        );
        console.log(`Statut mis à jour pour ${id}: ${status}`);
    };

    const handleQuickAction = (action: string) => {
        console.log('Action rapide:', action);
        // Implémenter les actions selon le type
        switch (action) {
            case 'add_product':
                alert('Ajouter un produit - à implémenter');
                break;
            case 'send_email':
                alert('Envoyer email - à implémenter');
                break;
            case 'generate_report':
                alert('Générer rapport - à implémenter');
                break;
            case 'settings':
                alert('Paramètres - à implémenter');
                break;
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-800 dark:text-white">
                    Tableau de bord administrateur
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">
                    Bienvenue dans votre espace d'administration. Gérez vos réservations, produits et clients.
                </p>
            </div>

            {/* Statistiques en haut */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Réservations"
                    value={stats.totalReservations}
                    icon="📋"
                    trend={stats.monthlyGrowth}
                    color="purple"
                    subtitle="Ce mois"
                />
                <StatsCard
                    title="En attente"
                    value={stats.pendingReservations}
                    icon="⏳"
                    color="orange"
                    subtitle="À traiter"
                />
                <StatsCard
                    title="Revenu total"
                    value={`${stats.totalRevenue}€`}
                    icon="💰"
                    trend={8}
                    color="green"
                    subtitle="30 derniers jours"
                />
                <StatsCard
                    title="Produit populaire"
                    value={stats.popularProduct}
                    icon="🏆"
                    color="blue"
                    subtitle="Plus réservé"
                />
            </div>

            {/* Section principale */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Graphique */}
                <div className="lg:col-span-2">
                    <ProductChart data={chartData} />
                </div>

                {/* Actions rapides */}
                <div>
                    <QuickActions onAction={handleQuickAction} />
                </div>
            </div>

            {/* Réservations récentes */}
            <div className="lg:col-span-3">
                <RecentReservations
                    reservations={reservations}
                    onViewDetails={handleViewDetails}
                    onUpdateStatus={handleUpdateStatus}
                />
            </div>

            {/* Section inférieure */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Panneau de notifications */}
                <div className="md:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                        🔔 Notifications récentes
                    </h3>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                            <div>
                                <p className="text-sm font-medium">3 réservations en attente de confirmation</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Il y a 2 heures</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <div>
                                <p className="text-sm font-medium">Nouveau client inscrit: Jean Martin</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Il y a 5 heures</p>
                            </div>
                        </div>
                        <div className="flex items-center space-x-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <div>
                                <p className="text-sm font-medium">Stock faible: Crème hydratante (5 unités)</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">Il y a 1 jour</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Prochaines livraisons */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
                        🚚 Livraisons aujourd'hui
                    </h3>
                    <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <p className="font-medium">Marie Dupont</p>
                                <p className="text-sm text-gray-500">2 produits</p>
                            </div>
                            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-300 text-xs rounded">
                                14h-16h
                            </span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                            <div>
                                <p className="font-medium">Pierre Martin</p>
                                <p className="text-sm text-gray-500">1 produit</p>
                            </div>
                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-300 text-xs rounded">
                                16h-18h
                            </span>
                        </div>
                        <div className="text-center pt-2">
                            <button className="text-purple-600 dark:text-purple-400 text-sm hover:underline">
                                Voir le planning complet →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;