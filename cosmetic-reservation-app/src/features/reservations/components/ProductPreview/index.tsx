// src/features/reservations/components/ProductPreview/index.tsx
import { Badge } from '@/shared/components/ui';
import type { Product } from '@/features/products/types/product.types';

interface ProductPreviewProps {
    product: Product;
}

export function ProductPreview({ product }: ProductPreviewProps) {
    const isLowStock = product.stock <= 5;

    return (
        <div className="mb-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-100 dark:border-purple-800">
            <div className="flex items-center space-x-4">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                    <span className="text-3xl text-white">💄</span>
                </div>

                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-800 dark:text-white truncate">{product.name}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2 leading-tight">
                        {product.description}
                    </p>

                    <div className="flex items-center justify-between mt-3">
                        <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                            {product.price.toFixed(2)}€
                        </span>

                        <Badge variant={isLowStock ? 'warning' : 'success'}>
                            {isLowStock ? 'Stock limité' : 'Stock disponible'}
                        </Badge>
                    </div>
                </div>
            </div>
        </div>
    );
}
