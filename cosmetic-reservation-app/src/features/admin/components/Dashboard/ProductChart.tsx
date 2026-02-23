// src/features/admin/components/Dashboard/ProductChart.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Package, Award, ArrowRight } from 'lucide-react';

interface ProductChartProps {
    data: {
        labels: string[];
        values: number[];
    };
    delay?: number;
}

export function ProductChart({ data, delay = 0 }: ProductChartProps) {
    const maxValue = Math.max(...data.values, 1);
    const colors = [
        'bg-purple-500',
        'bg-pink-500',
        'bg-blue-500',
        'bg-green-500',
        'bg-orange-500'
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay, duration: 0.6 }}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 lg:p-8 border border-gray-100 dark:border-gray-700 flex flex-col h-full"
        >
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-xl font-black text-gray-800 dark:text-white flex items-center gap-2">
                        <Package className="text-purple-500" />
                        Popularité <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Produits</span>
                    </h2>
                    <p className="text-sm text-gray-500 font-medium">Répartition par volume de réservation</p>
                </div>
                <div className="p-2 bg-purple-50 dark:bg-purple-900/20 rounded-xl">
                    <Award size={20} className="text-purple-600 dark:text-purple-400" />
                </div>
            </div>

            <div className="flex-1 space-y-6">
                {data.labels.map((label, index) => {
                    const percentage = (data.values[index] / maxValue) * 100;

                    return (
                        <div key={`${label}-${index}`} className="group">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-gray-700 dark:text-gray-300 group-hover:text-purple-600 transition-colors">
                                    {label}
                                </span>
                                <span className="text-xs font-black bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full text-gray-600 dark:text-gray-400">
                                    {data.values[index]}
                                </span>
                            </div>
                            <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <motion.div
                                    key={`bar-${label}-${index}`}
                                    initial={{ width: 0 }}
                                    animate={{ width: `${percentage}%` }}
                                    exit={{ width: 0 }}
                                    transition={{ duration: 1, delay: delay + 0.3 + (index * 0.1), ease: "circOut" }}
                                    className={`h-full ${colors[index % colors.length]} rounded-full shadow-lg shadow-current/20`}
                                />
                            </div>
                        </div>
                    );
                })}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl text-center">
                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Top Vente</p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white truncate">
                        {data.labels[data.values.indexOf(Math.max(...data.values))] || 'N/A'}
                    </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900/30 rounded-2xl text-center">
                    <p className="text-[10px] uppercase font-black tracking-widest text-gray-400 mb-1">Total Unités</p>
                    <p className="text-lg font-black text-purple-600 dark:text-purple-400">
                        {data.values.reduce((a, b) => a + b, 0)}
                    </p>
                </div>
            </div>
        </motion.div>
    );
}

export default ProductChart;
