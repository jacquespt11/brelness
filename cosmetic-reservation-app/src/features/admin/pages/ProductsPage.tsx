// src/features/admin/pages/ProductsPage.tsx
import React, { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '@/features/products/services/product.service';
import { Product } from '@/features/products/types/product.types';
import { ProductModal } from '@/features/admin/components/ProductModal';
import { LoadingState, EmptyState, ErrorState, Button } from '@/shared/components/ui';
import {
    Package,
    PlusCircle,
    Search,
    Edit,
    Trash2,
    Tag,
    Box,
    RefreshCw,
    AlertTriangle,
} from 'lucide-react';

const CATEGORY_LABELS: Record<string, string> = {
    facial_care: 'Soin visage',
    body_care: 'Soin corps',
    hair_care: 'Soin cheveux',
    makeup: 'Maquillage',
    perfume: 'Parfum',
    other: 'Autre',
    // backend uppercase fallback
    FACIAL_CARE: 'Soin visage',
    BODY_CARE: 'Soin corps',
    HAIR_CARE: 'Soin cheveux',
    MAKEUP: 'Maquillage',
    PERFUME: 'Parfum',
    OTHER: 'Autre',
};

export function ProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    // Modal state
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    // Delete confirmation state
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const fetchProducts = async () => {
        try {
            setError(null);
            const data = await productService.getAll();
            setProducts(data);
        } catch (err: any) {
            setError(err.message || 'Erreur lors du chargement des produits');
        } finally {
            setLoading(false);
            setIsRefreshing(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await fetchProducts();
    };

    const handleAdd = () => {
        setEditingProduct(null);
        setIsModalOpen(true);
    };

    const handleEdit = (product: Product) => {
        setEditingProduct(product);
        setIsModalOpen(true);
    };

    const handleModalSuccess = (savedProduct: Product) => {
        setProducts((prev) => {
            const exists = prev.find((p) => p.id === savedProduct.id);
            if (exists) {
                return prev.map((p) => (p.id === savedProduct.id ? savedProduct : p));
            }
            return [savedProduct, ...prev];
        });
    };

    const handleDeleteConfirm = async () => {
        if (!deletingId) return;
        setIsDeleting(true);
        try {
            await productService.delete(deletingId);
            setProducts((prev) => prev.filter((p) => p.id !== deletingId));
            setDeletingId(null);
        } catch (err: any) {
            alert(err.message || 'Erreur lors de la suppression');
        } finally {
            setIsDeleting(false);
        }
    };

    const filteredProducts = useMemo(() => {
        if (!searchTerm) return products;
        const term = searchTerm.toLowerCase();
        return products.filter(
            (p) =>
                p.name.toLowerCase().includes(term) ||
                (CATEGORY_LABELS[p.category] || p.category).toLowerCase().includes(term)
        );
    }, [products, searchTerm]);

    if (loading && products.length === 0) return <LoadingState message="Chargement des produits..." />;
    if (error && products.length === 0) return <ErrorState message={error} onRetry={fetchProducts} />;

    return (
        <>
            <div className="space-y-6 pb-12">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <div className="flex items-center space-x-3 mb-2">
                            <div className="p-2 bg-purple-600 rounded-xl text-white shadow-lg shadow-purple-500/20">
                                <Package size={20} />
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-black text-gray-800 dark:text-white">
                                Gestion des{' '}
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                                    Produits
                                </span>
                            </h1>
                        </div>
                        <p className="text-gray-500 font-medium">
                            {products.length} produit{products.length > 1 ? 's' : ''} au catalogue
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <Button
                            variant="ghost"
                            size="md"
                            onClick={handleRefresh}
                            isLoading={isRefreshing}
                            className="bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm"
                        >
                            <RefreshCw size={18} className={isRefreshing ? 'animate-spin' : ''} />
                        </Button>
                        <Button
                            variant="primary"
                            leftIcon={<PlusCircle className="w-5 h-5" />}
                            onClick={handleAdd}
                        >
                            Ajouter un produit
                        </Button>
                    </div>
                </div>

                {/* Search */}
                {products.length > 0 && (
                    <div className="relative">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Rechercher un produit ou une catégorie..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 transition-all"
                        />
                    </div>
                )}

                {/* Empty state */}
                {!loading && products.length === 0 && (
                    <EmptyState
                        icon={Package}
                        title="Aucun produit"
                        description="Commencez par ajouter des produits à votre catalogue."
                        action={
                            <Button variant="primary" leftIcon={<PlusCircle className="w-5 h-5" />} onClick={handleAdd}>
                                Ajouter un produit
                            </Button>
                        }
                    />
                )}

                {/* Products Table */}
                {filteredProducts.length > 0 && (
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden">
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-gray-50 dark:bg-gray-800/50 border-b border-gray-100 dark:border-gray-700">
                                    <tr>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Produit</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Catégorie</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Prix</th>
                                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Stock</th>
                                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    <AnimatePresence>
                                        {filteredProducts.map((product, index) => (
                                            <motion.tr
                                                key={product.id}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, height: 0 }}
                                                transition={{ delay: index * 0.03 }}
                                                className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                                            >
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-12 h-12 rounded-lg bg-gray-100 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                                                            {product.imageUrl ? (
                                                                <img
                                                                    src={product.imageUrl}
                                                                    alt={product.name}
                                                                    className="w-full h-full object-cover"
                                                                    onError={(e) => {
                                                                        (e.target as HTMLImageElement).style.display = 'none';
                                                                    }}
                                                                />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                                                    <Package size={20} />
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div>
                                                            <div className="font-semibold text-gray-900 dark:text-white">{product.name}</div>
                                                            <div className="text-xs text-gray-400 truncate max-w-[180px]">{product.description}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400 gap-1">
                                                        <Tag className="w-3 h-3" />
                                                        {CATEGORY_LABELS[product.category] || product.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="font-semibold text-gray-900 dark:text-white">
                                                        {Number(product.price).toFixed(2)} €
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className={`flex items-center gap-1.5 ${product.stock < 5 ? 'text-red-600 dark:text-red-400' : product.stock < 15 ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                                                        {product.stock < 5 && <AlertTriangle className="w-3.5 h-3.5" />}
                                                        {product.stock >= 5 && <Box className="w-3.5 h-3.5" />}
                                                        <span className="font-semibold">{product.stock}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    {deletingId === product.id ? (
                                                        <div className="flex items-center justify-end gap-2">
                                                            <span className="text-xs text-gray-500">Supprimer ?</span>
                                                            <button
                                                                onClick={handleDeleteConfirm}
                                                                disabled={isDeleting}
                                                                className="px-3 py-1 text-xs bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                                                            >
                                                                {isDeleting ? '...' : 'Oui'}
                                                            </button>
                                                            <button
                                                                onClick={() => setDeletingId(null)}
                                                                className="px-3 py-1 text-xs bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 transition-colors"
                                                            >
                                                                Non
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <div className="flex items-center justify-end gap-1">
                                                            <button
                                                                onClick={() => handleEdit(product)}
                                                                className="p-2 text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20 rounded-lg transition-all"
                                                                title="Modifier"
                                                            >
                                                                <Edit className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => setDeletingId(product.id)}
                                                                className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all"
                                                                title="Supprimer"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </AnimatePresence>
                                </tbody>
                            </table>
                        </div>

                        {/* No search results */}
                        {filteredProducts.length === 0 && searchTerm && (
                            <div className="text-center py-12">
                                <p className="text-gray-500">Aucun résultat pour «{searchTerm}»</p>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="mt-2 text-sm text-purple-600 hover:underline"
                                >
                                    Effacer la recherche
                                </button>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Modal */}
            <ProductModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={handleModalSuccess}
                product={editingProduct}
            />
        </>
    );
}
