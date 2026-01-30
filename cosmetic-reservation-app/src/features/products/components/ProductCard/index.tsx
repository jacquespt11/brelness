// src/features/products/components/ProductCard/index.tsx
import { motion } from 'framer-motion';
import { ShoppingBag, Package, Star } from 'lucide-react';
import type { Product } from '@/features/products/types/product.types';
import { Badge } from '@/shared/components/ui';
import { formatPrice } from '@/shared/utils/format';
import { cn } from '@/shared/utils/cn';

interface ProductCardProps {
    product: Product;
    onClick: () => void;
    className?: string;
}

/**
 * Product Card Component
 * Displays product information with image, price, stock, and action button
 */
export function ProductCard({ product, onClick, className }: ProductCardProps) {
    const getCategoryColor = (category: string) => {
        const colors = {
            FACE_CARE: 'purple',
            MAKEUP: 'error',
            PERFUME: 'info',
            BODY_CARE: 'success',
            HAIR_CARE: 'warning',
        };
        return (colors[category as keyof typeof colors] || 'default') as
            | 'success'
            | 'warning'
            | 'error'
            | 'info'
            | 'default'
            | 'purple';
    };

    const getCategoryIcon = (category: string) => {
        const icons = {
            FACE_CARE: '✨',
            MAKEUP: '💄',
            PERFUME: '🌸',
            BODY_CARE: '🧴',
            HAIR_CARE: '🧖‍♀️',
        };
        return icons[category as keyof typeof icons] || '📦';
    };

    const getCategoryLabel = (category: string) => {
        const labels = {
            FACE_CARE: 'Soin Visage',
            MAKEUP: 'Maquillage',
            PERFUME: 'Parfum',
            BODY_CARE: 'Soin Corps',
            HAIR_CARE: 'Soin Cheveux',
        };
        return labels[category as keyof typeof labels] || category;
    };

    const isOutOfStock = product.stock === 0;
    const isLowStock = product.stock > 0 && product.stock <= 10;

    return (
        <motion.div
            whileHover={{ y: -8 }}
            className={cn(
                'group relative bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 h-full flex flex-col',
                className
            )}
        >
            {/* Category badge */}
            <div className="absolute top-3 right-3 z-10">
                <Badge variant={getCategoryColor(product.category)} size="sm">
                    <span className="text-xs">{getCategoryIcon(product.category)}</span>
                    <span className="hidden xs:inline ml-1">
                        {getCategoryLabel(product.category)}
                    </span>
                </Badge>
            </div>

            {/* Product image */}
            <div className="h-36 sm:h-40 md:h-48 bg-gradient-to-br from-purple-400 to-pink-400 relative overflow-hidden">
                {product.imageUrl ? (
                    <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-4xl sm:text-5xl md:text-6xl text-white/80">
                            {getCategoryIcon(product.category)}
                        </span>
                    </div>
                )}

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

                {/* Stock badge */}
                <div className="absolute bottom-3 left-3">
                    <Badge
                        variant={isOutOfStock ? 'error' : isLowStock ? 'warning' : 'success'}
                        size="sm"
                    >
                        <Package className="w-3 h-3" />
                        <span className="ml-1">
                            {isOutOfStock ? 'Rupture' : `${product.stock} en stock`}
                        </span>
                    </Badge>
                </div>
            </div>

            {/* Content */}
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
                            {formatPrice(product.price)}
                        </span>
                    </div>

                    {/* Rating */}
                    <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-400 fill-current"
                            />
                        ))}
                        <span className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 ml-1">
                            (4.9)
                        </span>
                    </div>
                </div>

                {/* Action button */}
                <motion.button
                    whileHover={{ scale: isOutOfStock ? 1 : 1.02 }}
                    whileTap={{ scale: isOutOfStock ? 1 : 0.98 }}
                    onClick={onClick}
                    disabled={isOutOfStock}
                    className={cn(
                        'w-full py-2 sm:py-3 rounded-lg font-medium transition-all flex items-center justify-center space-x-2 text-sm sm:text-base',
                        isOutOfStock
                            ? 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700'
                    )}
                >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{isOutOfStock ? 'Indisponible' : 'Réserver'}</span>
                </motion.button>
            </div>

            {/* Hover border effect */}
            <div className="absolute inset-0 border-2 border-transparent group-hover:border-purple-400 dark:group-hover:border-purple-500 rounded-xl sm:rounded-2xl transition-all duration-300 pointer-events-none" />
        </motion.div>
    );
}

export default ProductCard;
