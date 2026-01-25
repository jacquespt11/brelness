// src/components/admin/ProductChart.tsx
import React from 'react';

interface ProductChartProps {
    data: {
        labels: string[];
        values: number[];
    };
}

/**
 * Composant graphique montrant la répartition des produits
 * Simple graphique en barres avec Tailwind
 */
const ProductChart: React.FC<ProductChartProps> = ({ data }) => {
    const maxValue = Math.max(...data.values);
    const colors = ['bg-purple-500', 'bg-pink-500', 'bg-blue-500', 'bg-green-500', 'bg-orange-500'];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                Popularité des produits
            </h2>

            <div className="space-y-4">
                {data.labels.map((label, index) => {
                    const percentage = maxValue > 0 ? (data.values[index] / maxValue) * 100 : 0;

                    return (
                        <div key={label} className="space-y-2">
                            <div className="flex justify-between">
                                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                    {label}
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                    {data.values[index]} réservations
                                </span>
                            </div>
                            <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className={`h-full ${colors[index % colors.length]} rounded-full transition-all duration-500`}
                                    style={{ width: `${percentage}%` }}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Produit le plus populaire</p>
                        <p className="font-bold text-gray-800 dark:text-white">
                            {data.labels[data.values.indexOf(Math.max(...data.values))]}
                        </p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <p className="text-sm text-gray-500 dark:text-gray-400">Total réservations</p>
                        <p className="font-bold text-gray-800 dark:text-white">
                            {data.values.reduce((a, b) => a + b, 0)}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductChart;