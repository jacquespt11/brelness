// src/features/products/types/product.types.ts

import type { ProductCategory } from '@/shared/types/common.types';

/**
 * Main Product interface
 */
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    imageUrl?: string;
    stock: number;
    isActive: boolean;
    createdAt?: string;
    updatedAt?: string;
}

/**
 * Data for creating a product
 */
export interface CreateProductData {
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    imageUrl?: string;
    stock: number;
}

/**
 * Data for updating a product
 */
export interface UpdateProductData {
    name?: string;
    description?: string;
    price?: number;
    category?: ProductCategory;
    imageUrl?: string;
    stock?: number;
    isActive?: boolean;
}

/**
 * Product filters
 */
export interface ProductFilters {
    category?: ProductCategory;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    search?: string;
}

/**
 * Product statistics
 */
export interface ProductStats {
    totalProducts: number;
    byCategory: Record<ProductCategory, number>;
    lowStockProducts: Product[];
    outOfStockProducts: Product[];
}