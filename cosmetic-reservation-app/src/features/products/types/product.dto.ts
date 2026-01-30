// src/features/products/types/product.dto.ts

import type { ProductCategory } from '@/shared/types/common.types';

/**
 * DTOs for NestJS Backend API
 */

/**
 * DTO for creating a product (admin only)
 */
export interface CreateProductDTO {
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    imageUrl?: string;
    stock: number;
}

/**
 * DTO for updating a product (admin only)
 */
export interface UpdateProductDTO {
    name?: string;
    description?: string;
    price?: number;
    category?: ProductCategory;
    imageUrl?: string;
    stock?: number;
    isActive?: boolean;
}

/**
 * Response DTO from backend
 */
export interface ProductResponseDTO {
    id: string;
    name: string;
    description: string;
    price: number;
    category: ProductCategory;
    imageUrl?: string;
    stock: number;
    isActive: boolean;
    reservationCount?: number;
    createdAt: string;
    updatedAt: string;
}

/**
 * Query params for filtering products
 */
export interface ProductQueryDTO {
    category?: ProductCategory;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
    isActive?: boolean;
    search?: string;
    page?: number;
    limit?: number;
}
