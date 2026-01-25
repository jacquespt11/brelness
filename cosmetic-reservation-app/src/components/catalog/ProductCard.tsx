// src/components/catalog/ProductCard.tsx 
import { motion } from 'framer-motion';
import type { Product } from '../../types/reservation';
import { ShoppingBag, Package, Star } from 'lucide-react';

interface ProductCardProps {
    product: Product;
    onClick: () => void;
}

const ProductCard = ({ product, onClick }: ProductCardProps) => {
    const getCategoryColor = (category: string) => {
        const colors = {
            soin_visage: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300',
            maquillage: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300',
            parfum: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300',
            soin_corps: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
            soin_cheveux: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300',
        };
        return colors[category as keyof typeof colors] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300';
    };

    const getCategoryIcon = (category: string) => {
        const icons = {
            soin_visage: '✨',
            maquillage: '💄',
            parfum: '🌸',
            soin_corps: '🧴',
            soin_cheveux: '🧖‍♀️',
        };
        return icons[category as keyof typeof icons] || '📦';
    };

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className="group relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 h-full flex flex-col"
        >
            {/* Badge de catégorie */}
            <div className="absolute top-3 right-3 z-10">
                <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getCategoryColor(product.category)} flex items-center space-x-1`}>
                    <span className="text-xs">{getCategoryIcon(product.category)}</span>
                    <span className="hidden xs:inline">{product.category}</span>
                </span>
            </div>

            {/* Image du produit */}
            <div className="h-36 sm:h-40 md:h-48 bg-gradient-to-br from-purple-400 to-pink-400 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-4xl sm:text-5xl md:text-6xl text-white/80">
                        {getCategoryIcon(product.category)}
                    </span>
                </div>

                {/* Overlay au hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Stock badge */}
                <div className="absolute bottom-3 left-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${product.stock > 10
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        : product.stock > 0
                            ? 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-300'
                            : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
                        }`}>
                        <Package className="w-3 h-3" />
                        <span>{product.stock > 0 ? `${product.stock} en stock` : 'Rupture'}</span>
                    </span>
                </div>
            </div>

            {/* Contenu */}
            <div className="p-4 sm:p-6 flex-1 flex flex-col">
                <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                    {product.name}
                </h3>

                <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300 mb-3 sm:mb-4 flex-1 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center justify-between mb-3 sm:mb-4">
                    <div>
                        <span className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                            {product.price.toFixed(2)}€
                        </span>
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-1">
                            TTC
                        </span>
                    </div>

                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current" />
                        ))}
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-1">(4.9)</span>
                    </div>
                </div>

                {/* Bouton d'action */}
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClick}
                    disabled={product.stock === 0}
                    className={`w-full py-2 sm:py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 text-sm sm:text-base ${product.stock > 0
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                        }`}
                >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{product.stock > 0 ? 'Réserver' : 'Indisponible'}</span>
                </motion.button>
            </div>

            {/* Effet de bordure au hover */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-400 dark:group-hover:border-purple-500 rounded-xl sm:rounded-2xl transition-all duration-300 pointer-events-none" />
        </motion.div>
    );
};

export default ProductCard;