// src/features/products/services/product.service.ts

import { apiClient, handleApiError } from '@/core/api/axios.config';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type {
    CreateProductDTO,
    UpdateProductDTO,
    ProductResponseDTO,
    ProductQueryDTO,
} from '../types/product.dto';
import type { Product } from '../types/product.types';

/**
 * Product service
 * Handles all API calls related to products
 */
export const productService = {
    /**
     * Get all products
     */
    getAll: async (query?: ProductQueryDTO): Promise<Product[]> => {
        try {
            const response = await apiClient.get<ProductResponseDTO[]>(
                API_ENDPOINTS.PRODUCTS,
                { params: query }
            );
            return response.data.map(mapResponseToProduct);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Get a single product by ID
     */
    getById: async (id: string): Promise<Product> => {
        try {
            const response = await apiClient.get<ProductResponseDTO>(
                API_ENDPOINTS.PRODUCT_BY_ID(id)
            );
            return mapResponseToProduct(response.data);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Create a new product (admin only)
     */
    create: async (data: CreateProductDTO): Promise<Product> => {
        try {
            const response = await apiClient.post<ProductResponseDTO>(
                API_ENDPOINTS.PRODUCTS,
                data
            );
            return mapResponseToProduct(response.data);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Update a product (admin only)
     */
    update: async (id: string, data: UpdateProductDTO): Promise<Product> => {
        try {
            const response = await apiClient.patch<ProductResponseDTO>(
                API_ENDPOINTS.PRODUCT_BY_ID(id),
                data
            );
            return mapResponseToProduct(response.data);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Delete a product (admin only)
     */
    delete: async (id: string): Promise<void> => {
        try {
            await apiClient.delete(API_ENDPOINTS.PRODUCT_BY_ID(id));
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Get product categories
     */
    getCategories: async (): Promise<string[]> => {
        try {
            const response = await apiClient.get<string[]>(
                API_ENDPOINTS.PRODUCT_CATEGORIES
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};

/**
 * Map backend response DTO to frontend Product type
 */
function mapResponseToProduct(dto: ProductResponseDTO): Product {
    return {
        id: dto.id,
        name: dto.name,
        description: dto.description,
        price: dto.price,
        category: dto.category,
        imageUrl: dto.imageUrl,
        stock: dto.stock,
        isActive: dto.isActive,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
    };
}
