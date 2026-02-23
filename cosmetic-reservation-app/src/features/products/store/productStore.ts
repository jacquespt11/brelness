// src/features/products/store/productStore.ts

import { create } from 'zustand';
import { productService } from '../services/product.service';
import type {
    Product,
    CreateProductData,
    UpdateProductData,
    ProductFilters,
} from '../types/product.types';

interface ProductStore {
    // State
    products: Product[];
    filteredProducts: Product[];
    categories: string[];
    selectedCategory: string;
    searchQuery: string;
    loading: boolean;
    error: string | null;
    currentPage: number;
    totalProducts: number;

    // Actions
    fetchProducts: (filters?: ProductFilters) => Promise<void>;
    fetchProductById: (id: string) => Promise<Product | null>;
    fetchCategories: () => Promise<void>;

    createProduct: (data: CreateProductData) => Promise<Product>;
    updateProduct: (id: string, data: UpdateProductData) => Promise<Product>;
    deleteProduct: (id: string) => Promise<void>;

    // Filtering
    setCategoryFilter: (category: string) => void;
    setSearchQuery: (query: string) => void;
    clearFilters: () => void;

    // Pagination
    setCurrentPage: (page: number) => void;

    // Utilities
    getProductById: (id: string) => Product | undefined;
    getProductsByCategory: (category: string) => Product[];

    // State management
    setLoading: (loading: boolean) => void;
    setError: (error: string | null) => void;
}

export const useProductStore = create<ProductStore>((set, get) => ({
    // Initial state
    products: [],
    filteredProducts: [],
    categories: [],
    selectedCategory: 'all',
    searchQuery: '',
    loading: false,
    error: null,
    currentPage: 1,
    totalProducts: 0,

    // Fetch all products from API
    fetchProducts: async (filters = {}) => {
        set({ loading: true, error: null });

        try {
            // Convert filters to query params (if needed)
            const query: any = {};
            if (filters.category) query.category = filters.category;
            if (filters.minPrice !== undefined) query.minPrice = filters.minPrice;
            if (filters.maxPrice !== undefined) query.maxPrice = filters.maxPrice;
            if (filters.inStock !== undefined) query.inStock = filters.inStock;
            if (filters.search) query.search = filters.search;

            const products = await productService.getAll(query);

            set({
                products,
                filteredProducts: products,
                loading: false,
                totalProducts: products.length,
            });

            // Update categories if not already loaded
            if (get().categories.length === 0) {
                const uniqueCategories = Array.from(
                    new Set(products.map(p => p.category).filter(Boolean))
                );
                set({ categories: uniqueCategories });
            }
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Erreur lors du chargement des produits';

            set({
                loading: false,
                error: errorMessage
            });
            throw error;
        }
    },

    // Fetch single product by ID
    fetchProductById: async (id: string) => {
        set({ loading: true, error: null });

        try {
            const product = await productService.getById(id);

            // Update products list
            set(state => {
                const productExists = state.products.some(p => p.id === id);
                const updatedProducts = productExists
                    ? state.products.map(p => p.id === id ? product : p)
                    : [product, ...state.products];

                const updatedFiltered = productExists
                    ? state.filteredProducts.map(p => p.id === id ? product : p)
                    : [product, ...state.filteredProducts];

                return {
                    products: updatedProducts,
                    filteredProducts: updatedFiltered,
                    loading: false
                };
            });

            return product;
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Erreur lors du chargement du produit';

            set({
                loading: false,
                error: errorMessage
            });
            throw error;
        }
    },

    // Fetch product categories
    fetchCategories: async () => {
        try {
            const categories = await productService.getCategories();
            set({ categories });
        } catch (error) {
            // Fallback: extract categories from products
            const { products } = get();
            if (products.length > 0) {
                const uniqueCategories = Array.from(
                    new Set(products.map(p => p.category).filter(Boolean))
                );
                set({ categories: uniqueCategories });
            }
            console.error('Erreur lors de la récupération des catégories:', error);
        }
    },

    // Create new product
    createProduct: async (data: CreateProductData) => {
        set({ loading: true, error: null });

        try {
            const newProduct = await productService.create(data);

            set(state => ({
                products: [newProduct, ...state.products],
                filteredProducts: [newProduct, ...state.filteredProducts],
                loading: false,
                totalProducts: state.totalProducts + 1,
            }));

            // Update categories
            const currentCategories = get().categories;
            if (!currentCategories.includes(newProduct.category)) {
                set(state => ({
                    categories: [...state.categories, newProduct.category],
                }));
            }

            return newProduct;
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Erreur lors de la création du produit';

            set({
                loading: false,
                error: errorMessage
            });
            throw error;
        }
    },

    // Update existing product
    updateProduct: async (id: string, data: UpdateProductData) => {
        set({ loading: true, error: null });

        try {
            const updatedProduct = await productService.update(id, data);

            set(state => ({
                products: state.products.map(p =>
                    p.id === id ? updatedProduct : p
                ),
                filteredProducts: state.filteredProducts.map(p =>
                    p.id === id ? updatedProduct : p
                ),
                loading: false,
            }));

            // Update categories if category changed
            const oldProduct = get().products.find(p => p.id === id);
            if (oldProduct && oldProduct.category !== updatedProduct.category) {
                await get().fetchCategories();
            }

            return updatedProduct;
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Erreur lors de la mise à jour du produit';

            set({
                loading: false,
                error: errorMessage
            });
            throw error;
        }
    },

    // Delete product
    deleteProduct: async (id: string) => {
        set({ loading: true, error: null });

        try {
            await productService.delete(id);

            set(state => ({
                products: state.products.filter(p => p.id !== id),
                filteredProducts: state.filteredProducts.filter(p => p.id !== id),
                loading: false,
                totalProducts: state.totalProducts - 1,
            }));

            // Re-fetch categories in case the deleted product was the last of its category
            await get().fetchCategories();
        } catch (error) {
            const errorMessage = error instanceof Error
                ? error.message
                : 'Erreur lors de la suppression du produit';

            set({
                loading: false,
                error: errorMessage
            });
            throw error;
        }
    },

    // Set category filter
    setCategoryFilter: (category: string) => {
        set({ selectedCategory: category });

        const { products, searchQuery } = get();
        let filtered = [...products];

        if (category !== 'all') {
            filtered = filtered.filter(p => p.category === category);
        }

        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(query) ||
                p.description.toLowerCase().includes(query)
            );
        }

        set({ filteredProducts: filtered });
    },

    // Set search query
    setSearchQuery: (query: string) => {
        set({ searchQuery: query });

        const { products, selectedCategory } = get();
        let filtered = [...products];

        if (selectedCategory !== 'all') {
            filtered = filtered.filter(p => p.category === selectedCategory);
        }

        if (query) {
            const search = query.toLowerCase();
            filtered = filtered.filter(p =>
                p.name.toLowerCase().includes(search) ||
                p.description.toLowerCase().includes(search)
            );
        }

        set({ filteredProducts: filtered });
    },

    // Clear all filters
    clearFilters: () => {
        set({
            selectedCategory: 'all',
            searchQuery: '',
            filteredProducts: get().products,
        });
    },

    // Set current page
    setCurrentPage: (page: number) => {
        set({ currentPage: page });
        // Refetch products for the page (if your API supports pagination)
        // For now, we'll just change the page and refetch with the current filters
        const { searchQuery, selectedCategory } = get();
        const filters: ProductFilters = {};
        if (selectedCategory !== 'all') {
            filters.category = selectedCategory as any;
        }
        if (searchQuery) {
            filters.search = searchQuery;
        }
        get().fetchProducts(filters);
    },

    // Get product by ID (synchronous)
    getProductById: (id: string) => {
        return get().products.find(p => p.id === id);
    },

    // Get products by category (synchronous)
    getProductsByCategory: (category: string) => {
        return get().products.filter(p => p.category === category);
    },

    // Set loading state
    setLoading: (loading: boolean) => {
        set({ loading });
    },

    // Set error state
    setError: (error: string | null) => {
        set({ error });
    },
}));

/**
 * Hook for popular products
 */
export const usePopularProducts = () => {
    const { products } = useProductStore();

    const popularProducts = [...products]
        .filter(p => p.isActive !== false)
        .slice(0, 8);

    return popularProducts;
};

/**
 * Hook for featured products (top 4)
 */
export const useFeaturedProducts = () => {
    const { products } = useProductStore();

    const featuredProducts = [...products]
        .filter(p => p.isActive !== false)
        .slice(0, 4);

    return featuredProducts;
};