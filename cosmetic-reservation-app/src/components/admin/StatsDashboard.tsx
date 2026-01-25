import { motion } from 'framer-motion';
import type { ReservationStats } from '../../types/reservation';
import { TrendingUp, PieChart, BarChart3, Calendar, Users } from 'lucide-react';

interface StatsDashboardProps {
    stats: ReservationStats;
}

const StatsDashboard = ({ stats }: StatsDashboardProps) => {
    const chartData = [
        { label: 'En attente', value: stats.parStatut.en_attente, color: 'bg-amber-500' },
        { label: 'Confirmées', value: stats.parStatut.confirmee, color: 'bg-green-500' },
        { label: 'Livrées', value: stats.parStatut.livree, color: 'bg-blue-500' },
        { label: 'Annulées', value: stats.parStatut.annulee, color: 'bg-red-500' },
    ];

    const total = chartData.reduce((sum, item) => sum + item.value, 0);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
            {/* Graphique de répartition */}
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-4 lg:p-6 shadow-lg"
            >
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h3 className="text-lg font-bold text-gray-800 dark:text-white">
                            Répartition des réservations
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Par statut
                        </p>
                    </div>
                    <PieChart className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>

                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Diagramme */}
                    <div className="flex-1">
                        <div className="h-48 lg:h-64 flex items-center justify-center">
                            <div className="relative w-32 h-32 lg:w-40 lg:h-40">
                                {chartData.map((item, index) => {
                                    const percentage = total > 0 ? (item.value / total) * 100 : 0;
                                    const radius = 60;
                                    const circumference = 2 * Math.PI * radius;
                                    const strokeDasharray = `${(percentage / 100) * circumference} ${circumference}`;

                                    return (
                                        <circle
                                            key={item.label}
                                            cx="50%"
                                            cy="50%"
                                            r={radius}
                                            fill="transparent"
                                            stroke={item.color.replace('bg-', '')}
                                            strokeWidth="30"
                                            strokeDasharray={strokeDasharray}
                                            strokeDashoffset={index === 0 ? 0 : -((chartData.slice(0, index).reduce((sum, d) => sum + d.value, 0) / total) * circumference)}
                                            className="transition-all duration-1000"
                                            transform="rotate(-90 80 80)"
                                        />
                                    );
                                })}
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <div className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white">
                                            {total}
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            Total
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Légende */}
                    <div className="flex-1">
                        <div className="space-y-4">
                            {chartData.map((item) => (
                                <div key={item.label} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <div className={`w-3 h-3 rounded-full ${item.color}`} />
                                        <span className="text-sm text-gray-700 dark:text-gray-300">
                                            {item.label}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-gray-800 dark:text-white">
                                            {item.value}
                                        </div>
                                        <div className="text-xs text-gray-500 dark:text-gray-400">
                                            {total > 0 ? ((item.value / total) * 100).toFixed(1) : 0}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Statistiques secondaires */}
            <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="space-y-4 lg:space-y-6"
            >
                {/* Produit populaire */}
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl p-4 lg:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="font-bold text-gray-800 dark:text-white">
                                Produit populaire
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Le plus réservé
                            </p>
                        </div>
                        <BarChart3 className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        {stats.produitLePlusPopulaire}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span>+15% ce mois</span>
                    </div>
                </div>

                {/* Chiffre d'affaires */}
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl p-4 lg:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="font-bold text-gray-800 dark:text-white">
                                Chiffre d'affaires
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Total généré
                            </p>
                        </div>
                        <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        {stats.chiffreAffaires} €
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span>+24% vs mois dernier</span>
                    </div>
                </div>

                {/* Clients actifs */}
                <div className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-xl p-4 lg:p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h4 className="font-bold text-gray-800 dark:text-white">
                                Clients actifs
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Ce mois
                            </p>
                        </div>
                        <Users className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                        {stats.quantiteTotale}
                    </div>
                    <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                        <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                        <span>+8 nouveaux clients</span>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default StatsDashboard;