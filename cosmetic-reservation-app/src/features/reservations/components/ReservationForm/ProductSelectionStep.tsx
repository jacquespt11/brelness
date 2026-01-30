// src/features/reservations/components/ReservationForm/ProductSelectionStep.tsx
import { Package, Plus, Minus } from 'lucide-react';
import { motion } from 'framer-motion';
import { MOCK_PRODUCTS } from '../../store/reservationStore';

interface ProductSelectionStepProps {
    formData: any;
    errors: Record<string, string>;
    onChange: (name: string, value: any) => void;
}

export function ProductSelectionStep({ formData, errors, onChange }: ProductSelectionStepProps) {
    const productTypes = [
        { value: 'facial_care', label: 'Soin visage', icon: '✨' },
        { value: 'makeup', label: 'Maquillage', icon: '💄' },
        { value: 'perfume', label: 'Parfum', icon: '🌸' },
        { value: 'body_care', label: 'Soin corps', icon: '🧴' },
        { value: 'hair_care', label: 'Cheveux', icon: '🧖‍♀️' }
    ];

    const handleProductSelect = (product: any) => {
        onChange('productId', product.id);
        onChange('productName', product.name);
        onChange('productCategory', product.category);
    };

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

            {/* Quick Product Selection */}
            <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Produits suggérés
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                    {MOCK_PRODUCTS.filter(p => p.category === formData.productCategory).map((product) => (
                        <button
                            key={product.id}
                            type="button"
                            onClick={() => handleProductSelect(product)}
                            className={`p-3 rounded-xl border transition-all text-left flex items-center justify-between ${formData.productId === product.id
                                    ? 'border-purple-600 bg-purple-50 dark:bg-purple-900/20'
                                    : 'border-gray-200 dark:border-gray-700 hover:border-purple-300'
                                }`}
                        >
                            <div>
                                <p className="text-sm font-bold dark:text-white">{product.name}</p>
                                <p className="text-xs text-gray-500">{product.price.toFixed(2)}€</p>
                            </div>
                            {formData.productId === product.id && (
                                <span className="text-purple-600">✓</span>
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* Custom Product Name */}
            <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Saisie manuelle
                </label>
                <input
                    type="text"
                    value={formData.productName}
                    onChange={(e) => {
                        onChange('productName', e.target.value);
                        if (formData.productId) onChange('productId', '');
                    }}
                    placeholder="Nom du produit..."
                    className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:text-white"
                />
                {errors.productName && <p className="text-red-500 text-xs">{errors.productName}</p>}
            </div>

            {/* Quantity */}
            <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-gray-100 dark:border-gray-700">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Quantité</span>
                <div className="flex items-center space-x-6">
                    <button
                        type="button"
                        onClick={() => onChange('quantity', Math.max(1, formData.quantity - 1))}
                        className="w-10 h-10 rounded-full bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
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
