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

    getPopularProducts: () =>
        api.get('/products/popular'),

    // Admin routes
    createProduct: (data: FormData) =>
        api.post('/admin/products', data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    updateProduct: (id: string, data: FormData) =>
        api.put(`/admin/products/${id}`, data, {
            headers: { 'Content-Type': 'multipart/form-data' },
        }),

    deleteProduct: (id: string) =>
        api.delete(`/admin/products/${id}`),
};