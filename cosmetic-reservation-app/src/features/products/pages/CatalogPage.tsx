// src/features/products/pages/CatalogPage.tsx
import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Filter, Home, X } from 'lucide-react';
import { useProductStore } from '@/features/products/store/productStore';
import { ProductCard, CategoryFilter, type Category } from '@/features/products/components';
import { Logo, Button, Input } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants/routes';
import { cn } from '@/shared/utils/cn';
import type { Product } from '@/features/products/types/product.types';

/**
 * Catalog Page
 * Browse and filter products catalog
 */
export function CatalogPage() {
    const navigate = useNavigate();
    const products = useProductStore((state) => state.products);
    const loading = useProductStore((state) => state.loading);
    const fetchProducts = useProductStore((state) => state.fetchProducts);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 200]);
    const [showFilters, setShowFilters] = useState(false);

    // Fetch real products from the API on mount
    useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    // Category mapping
    const categoryMap: Record<string, { label: string; icon: string }> = {
        FACIAL_CARE: { label: 'Soin visage', icon: '✨' },
        MAKEUP: { label: 'Maquillage', icon: '💄' },
        PERFUME: { label: 'Parfums', icon: '🌸' },
        BODY_CARE: { label: 'Soin corps', icon: '🧴' },
        HAIR_CARE: { label: 'Soin cheveux', icon: '🧖‍♀️' },
        OTHER: { label: 'Autre', icon: '📦' },
    };

    // Calculate categories from products
    const categories: Category[] = useMemo(() => {
        const uniqueCategories = Array.from(
            new Set(products.map((product) => product.category))
        );

        return [
            { id: 'all', label: 'Tous les produits', icon: '🌟', count: products.length },
            ...uniqueCategories.map((category: string) => ({
                id: category,
                label: categoryMap[category]?.label || category,
                icon: categoryMap[category]?.icon || '🌟',
                count: products.filter((p: Product) => p.category === category).length,
            })),
        ];
    }, [products]);

    // Price statistics
    const priceStats = useMemo(() => {
        if (products.length === 0) return { min: 0, max: 100 };
        const prices = products.map((p: Product) => p.price);
        return {
            min: Math.floor(Math.min(...prices)),
            max: Math.ceil(Math.max(...prices)),
        };
    }, [products]);

    // Filter products
    const filteredProducts = useMemo(
        () =>
            products.filter((product: Product) => {
                const matchesCategory =
                    selectedCategory === 'all' || product.category === selectedCategory;
                const matchesSearch =
                    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesPrice =
                    product.price >= priceRange[0] && product.price <= priceRange[1];
                return matchesCategory && matchesSearch && matchesPrice;
            }),
        [products, selectedCategory, searchQuery, priceRange]
    );

    // Statistics
    const stats = useMemo(
        () => ({
            totalProducts: products.length,
            filteredProducts: filteredProducts.length,
            averagePrice:
                filteredProducts.length > 0
                    ? (
                        filteredProducts.reduce((sum: number, p: Product) => sum + p.price, 0) /
                        filteredProducts.length
                    ).toFixed(2)
                    : '0.00',
        }),
        [products, filteredProducts]
    );

    const handleProductClick = (productId: string) => {
        navigate(`/reserve/${productId}`);
    };

    const handleResetFilters = () => {
        setSelectedCategory('all');
        setSearchQuery('');
        setPriceRange([priceStats.min, priceStats.max]);
    };

    // Loading state while fetching from API
    if (loading && products.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-14 w-14 border-b-2 border-purple-600 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 font-medium">Chargement du catalogue...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Left section */}
                        <div className="flex items-center space-x-6">
                            
                            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 hidden md:block" />

                        </div>

                        {/* Mobile title */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="md:hidden text-center flex-1"
                        >
                            <h1 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Catalogue
                            </h1>
                        </motion.div>

                        {/* Right actions */}
                        <div className="flex items-center space-x-4">
                            <Button
                                variant="primary"
                                size="sm"
                                leftIcon={<Home className="w-4 h-4" />}
                                onClick={() => navigate(ROUTES.HOME)}
                                className="hidden md:flex"
                            >
                                Accueil
                            </Button>

                            <button
                                onClick={() => setShowFilters(!showFilters)}
                                className="md:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700"
                            >
                                <Filter className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                            </button>
                        </div>
                    </div>
                </div>
            </header>

            <main className="py-8">
                <div className="container mx-auto px-4 lg:px-8">
                    {/* Page header */}
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        className="mb-8 lg:mb-12"
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-4">
                                Découvrez notre{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                                    catalogue
                                </span>
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Explorez notre sélection exclusive de produits cosmétiques premium.
                            </p>
                        </div>

                        {/* Search bar */}
                        <div className="max-w-2xl mx-auto mb-8">
                            <div className="relative group">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 group-hover:text-purple-500 transition-colors" />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Rechercher un produit..."
                                    className="w-full pl-12 pr-12 py-4 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white shadow-lg hover:shadow-xl transition-all"
                                />
                                {searchQuery && (
                                    <button
                                        onClick={() => setSearchQuery('')}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                                    >
                                        <X className="w-5 h-5" />
                                    </button>
                                )}
                            </div>
                        </div>
                    </motion.div>

                    <div className="grid lg:grid-cols-4 gap-8">
                        {/* Filters sidebar */}
                        <motion.aside
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            className={cn('lg:block', showFilters ? 'block' : 'hidden')}
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-6 sticky top-24">
                                {/* Filter header */}
                                <div className="flex items-center justify-between mb-6">
                                    <h2 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2">
                                        <Filter className="w-5 h-5 text-purple-600" />
                                        Filtres
                                    </h2>
                                    <button
                                        onClick={handleResetFilters}
                                        className="text-sm text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
                                    >
                                        Réinitialiser
                                    </button>
                                </div>

                                {/* Categories */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Catégories
                                    </h3>
                                    <div className="space-y-2">
                                        {categories.map((category) => (
                                            <button
                                                key={category.id}
                                                onClick={() => setSelectedCategory(category.id)}
                                                className={cn(
                                                    'flex items-center w-full p-3 rounded-lg transition-all',
                                                    selectedCategory === category.id
                                                        ? 'bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300'
                                                        : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'
                                                )}
                                            >
                                                <span className="mr-3 text-lg">{category.icon}</span>
                                                <span className="font-medium flex-1 text-left">
                                                    {category.label}
                                                </span>
                                                <span className="text-sm opacity-70">{category.count}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Price range */}
                                <div className="mb-6">
                                    <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                        Prix : {priceRange[0]}€ - {priceRange[1]}€
                                    </h3>
                                    <div className="px-2 space-y-2">
                                        <input
                                            type="range"
                                            min={priceStats.min}
                                            max={priceStats.max}
                                            value={priceRange[0]}
                                            onChange={(e) =>
                                                setPriceRange([parseInt(e.target.value), priceRange[1]])
                                            }
                                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                        />
                                        <input
                                            type="range"
                                            min={priceStats.min}
                                            max={priceStats.max}
                                            value={priceRange[1]}
                                            onChange={(e) =>
                                                setPriceRange([priceRange[0], parseInt(e.target.value)])
                                            }
                                            className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-600"
                                        />
                                    </div>
                                    <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mt-2">
                                        <span>{priceStats.min}€</span>
                                        <span>{priceStats.max}€</span>
                                    </div>
                                </div>

                                {/* Statistics */}
                                <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        Vue d'ensemble
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Produits totaux
                                            </span>
                                            <span className="font-bold">{stats.totalProducts}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Produits filtrés
                                            </span>
                                            <span className="font-bold text-purple-600 dark:text-purple-400">
                                                {stats.filteredProducts}
                                            </span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Prix moyen
                                            </span>
                                            <span className="font-bold">{stats.averagePrice}€</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.aside>

                        {/* Main content */}
                        <div className="lg:col-span-3">
                            {/* Results header */}
                            <div className="mb-8">
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                                            Nos produits
                                        </h2>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {filteredProducts.length} produit
                                            {filteredProducts.length !== 1 ? 's' : ''} trouvé
                                            {filteredProducts.length !== 1 ? 's' : ''}
                                        </p>
                                    </div>

                                    <button
                                        onClick={() => setShowFilters(!showFilters)}
                                        className="lg:hidden flex items-center space-x-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg"
                                    >
                                        <Filter className="w-4 h-4" />
                                        <span>Filtres</span>
                                    </button>
                                </div>

                                {/* Mobile category filter */}
                                <div className="lg:hidden mb-6">
                                    <CategoryFilter
                                        categories={categories}
                                        selectedCategory={selectedCategory}
                                        onSelectCategory={setSelectedCategory}
                                    />
                                </div>
                            </div>

                            {/* Products grid */}
                            {filteredProducts.length === 0 ? (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-center py-16 bg-white dark:bg-gray-800 rounded-2xl shadow-lg"
                                >
                                    <div className="text-6xl mb-4">🔍</div>
                                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                                        Aucun produit trouvé
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md mx-auto">
                                        Aucun produit ne correspond à vos critères de recherche.
                                    </p>
                                    <Button variant="primary" onClick={handleResetFilters}>
                                        Réinitialiser les filtres
                                    </Button>
                                </motion.div>
                            ) : (
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                                    {filteredProducts.map((product: Product, index: number) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ y: 50, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <ProductCard
                                                product={product}
                                                onClick={() => handleProductClick(product.id)}
                                            />
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* CTA Section */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.7 }}
                        className="mt-16 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-purple-900/20 rounded-2xl p-8 lg:p-12"
                    >
                        <div className="max-w-3xl mx-auto text-center">
                            <h3 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-4">
                                Vous ne trouvez pas ce que vous cherchez ?
                            </h3>
                            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                                Notre équipe d'experts est disponible pour vous aider à trouver le
                                produit parfait.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button
                                    variant="primary"
                                    onClick={() => navigate(ROUTES.ADD_RESERVATION)}
                                >
                                    Demander un produit spécifique
                                </Button>
                                <Button variant="outline" onClick={() => (window.location.href = 'tel:0123456789')}>
                                    📞 Nous contacter
                                </Button>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>
        </div>
    );
}

export default CatalogPage;
