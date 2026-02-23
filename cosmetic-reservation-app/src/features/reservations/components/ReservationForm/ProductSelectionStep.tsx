// src/features/reservations/components/ReservationForm/ProductSelectionStep.tsx

import { Package, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import type { CreateReservationData } from '../../types/reservation.types';
import type { Product } from '@/features/products/types/product.types';

interface ProductSelectionStepProps {
    formData: CreateReservationData;
    errors: Record<string, string>;
    onChange: (name: keyof CreateReservationData, value: any) => void;
    products: Product[];
}

export function ProductSelectionStep({
    formData,
    errors,
    onChange,
    products
}: ProductSelectionStepProps) {
    const handleProductSelect = (product: Product) => {
        onChange('productId', product.id);
        onChange('productName', product.name);
        onChange('productCategory', product.category);
    };

    const productTypes = [
        { value: 'FACIAL_CARE', label: 'Soin visage', icon: '✨' },
        { value: 'BODY_CARE', label: 'Soin corps', icon: '🧴' },
        { value: 'HAIR_CARE', label: 'Soin cheveux', icon: '🧖‍♀️' },
        { value: 'MAKEUP', label: 'Maquillage', icon: '💄' },
        { value: 'PERFUME', label: 'Parfums', icon: '🌸' },
        { value: 'OTHER', label: 'Autre', icon: '📦' }
    ];

    // Filter products by selected category
    const filteredProducts = formData.productCategory
        ? products.filter(p => p.category === formData.productCategory)
        : products;

    return (
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-8"
        >
            <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-pink-100 dark:bg-pink-900/30 rounded-lg text-pink-600 dark:text-pink-400">
                    <Package size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Sélection du produit
                </h3>
            </div>

            {/* Product Category Selection */}
            <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Catégorie
                </label>
                <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
                    {productTypes.map((type) => (
                        <button
                            key={type.value}
                            type="button"
                            onClick={() => onChange('productCategory', type.value)}
                            className={`p-3 rounded-xl border-2 transition-all flex flex-col items-center justify-center ${formData.productCategory === type.value
                                ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                                : 'border-gray-100 dark:border-gray-800 hover:border-purple-300'
                                }`}
                        >
                            <span className="text-xl mb-1">{type.icon}</span>
                            <span className="text-xs font-medium dark:text-white text-center">{type.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Product Selection */}
            <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Produits disponibles
                </label>
                {filteredProducts.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                        <Package className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-500">Aucun produit disponible dans cette catégorie</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                        {filteredProducts.map((product) => (
                            <button
                                key={product.id}
                                type="button"
                                onClick={() => handleProductSelect(product)}
                                className={`p-4 rounded-xl border transition-all text-left ${formData.productId === product.id
                                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                                    }`}
                            >
                                <div className="flex items-center space-x-3">
                                    {product.imageUrl ? (
                                        <img
                                            src={product.imageUrl}
                                            alt={product.name}
                                            className="w-12 h-12 rounded-lg object-cover"
                                        />
                                    ) : (
                                        <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 flex items-center justify-center">
                                            <Package className="w-6 h-6 text-purple-400" />
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <p className="text-sm font-bold dark:text-white truncate">{product.name}</p>
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-xs text-gray-500">{product.price.toFixed(2)}€</p>
                                            <p className={`text-xs px-2 py-1 rounded-full ${product.stock > 5
                                                ? 'bg-green-100 text-green-800'
                                                : product.stock > 0
                                                    ? 'bg-yellow-100 text-yellow-800'
                                                    : 'bg-red-100 text-red-800'
                                                }`}>
                                                {product.stock > 0 ? `${product.stock} dispo` : 'Rupture'}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                {formData.productId === product.id && (
                                    <div className="mt-3 text-center">
                                        <span className="inline-flex items-center text-sm text-purple-600 font-medium">
                                            ✓ Sélectionné
                                        </span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </div>
                )}
                {errors.productId && <p className="text-red-500 text-xs mt-2">{errors.productId}</p>}
            </div>

            {/* Selected Product Details */}
            {formData.productId && (
                <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                    <div className="flex items-center justify-between mb-3">
                        <span className="font-semibold text-gray-700 dark:text-gray-300">Produit sélectionné</span>
                        <button
                            type="button"
                            onClick={() => {
                                onChange('productId', '');
                                onChange('productName', '');
                            }}
                            className="text-sm text-red-500 hover:text-red-600"
                        >
                            Changer
                        </button>
                    </div>
                    <div className="flex items-center space-x-3">
                        <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-pink-100 rounded-lg flex items-center justify-center">
                            <Package className="w-8 h-8 text-purple-400" />
                        </div>
                        <div className="flex-1">
                            <p className="font-bold text-gray-800 dark:text-white">{formData.productName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Catégorie: {formData.productCategory}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* Quantity */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <div>
                    <span className="font-semibold text-gray-700 dark:text-gray-300 block mb-1">Quantité</span>
                    <p className="text-sm text-gray-500">Sélectionnez la quantité souhaitée</p>
                </div>
                <div className="flex items-center space-x-6">
                    <button
                        type="button"
                        onClick={() => onChange('quantity', Math.max(1, formData.quantity - 1))}
                        className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
                        disabled={formData.quantity <= 1}
                    >
                        <Minus size={18} />
                    </button>
                    <span className="text-2xl font-black text-purple-600 dark:text-purple-400 w-8 text-center">
                        {formData.quantity}
                    </span>
                    <button
                        type="button"
                        onClick={() => onChange('quantity', formData.quantity + 1)}
                        className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                    >
                        <Plus size={18} />
                    </button>
                </div>
            </div>
        </motion.div>
    );
}