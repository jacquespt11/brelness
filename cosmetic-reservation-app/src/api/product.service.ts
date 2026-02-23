import { api } from "./axios.config";

// src/api/product.service.ts
export const productService = {
    getProducts: (params?: {
        category?: string;
        page?: number;
        limit?: number;
    }) => api.get('/products', { params }),

    getProductById: (id: string) =>
        api.get(`/products/${id}`),

    // Admin/Auth routes
    createProduct: (data: FormData) =>
        api.post('/products', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    updateProduct: (id: string, data: FormData) =>
        api.patch(`/products/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    deleteProduct: (id: string) =>
        api.delete(`/products/${id}`),
};