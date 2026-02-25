// src/features/home/pages/HomePage.tsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, AlertCircle, ShoppingBag, Phone } from 'lucide-react';
import { useProductStore } from '@/features/products/store/productStore';
import { useReservationStore } from '@/features/reservations/store/reservationStore';
import { Button, Input } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants/routes';

/**
 * Public Reservation Page
 * Accessible at /reserve/:productId
 */
export function HomePage() {
    const { productId } = useParams<{ productId: string }>();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        quantity: 1,
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { fetchProductById, getProductById, loading: productLoading } = useProductStore();
    const addReservation = useReservationStore(state => state.addReservation);
    const product = productId ? getProductById(productId) : null;

    // Fetch product on mount if not in store
    useEffect(() => {
        if (productId && !product && !productLoading) {
            fetchProductById(productId).catch((err) => {
                console.error('Erreur lors du chargement du produit:', err);
                setError('Produit non trouvé ou indisponible');
            });
        }
    }, [productId, product, productLoading, fetchProductById]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'quantity' ? Math.max(1, parseInt(value, 10) || 1) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!productId || !product) {
            setError('Produit non disponible');
            return;
        }

        // Validation
        if (!formData.customerName.trim()) {
            setError('Veuillez entrer votre nom');
            return;
        }

        if (!formData.customerPhone.trim()) {
            setError('Veuillez entrer votre numéro de téléphone');
            return;
        }

        if (formData.quantity < 1) {
            setError('La quantité doit être d\'au moins 1');
            return;
        }

        if (product.stock && formData.quantity > product.stock) {
            setError(`Quantité insuffisante. Stock disponible: ${product.stock}`);
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            // Use the reservation store which handles field stripping
            await addReservation({
                productId,
                customerName: formData.customerName,
                customerPhone: formData.customerPhone,
                customerEmail: formData.customerEmail,
                quantity: formData.quantity,
                productName: product.name,
                productPrice: product.price,
                productCategory: product.category,
                source: 'FACEBOOK',
            });

            // Success
            setIsSuccess(true);

            // Reset form
            setTimeout(() => {
                setFormData({
                    customerName: '',
                    customerPhone: '',
                    customerEmail: '',
                    quantity: 1,
                });
            }, 2000);

        } catch (err) {
            const errorMessage = err instanceof Error
                ? err.message
                : 'Une erreur est survenue lors de la réservation';
            setError(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Loading state
    if (productLoading && !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                    <p className="text-gray-600 dark:text-gray-400">Chargement du produit...</p>
                </div>
            </div>
        );
    }

    // Error state (product not found)
    if (error && !product) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 text-center">
                    <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Produit non trouvé</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <Link to={ROUTES.CATALOG} className="flex-1">
                            <Button variant="primary" fullWidth>
                                <ShoppingBag className="w-4 h-4 mr-2" />
                                Voir le catalogue
                            </Button>
                        </Link>
                        <Button
                            variant="outline"
                            fullWidth
                            onClick={() => window.history.back()}
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Retour
                        </Button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
            {/* Simple Header */}
            <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 dark:bg-gray-900/90 border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="container mx-auto px-4">
                    <div className="flex items-center justify-between h-16">
                        <Link
                            to={ROUTES.CATALOG}
                            className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            <span className="font-medium">Voir tous les produits</span>
                        </Link>

                        <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-500 dark:text-gray-400">Besoin d'aide?</span>
                            <a
                                href={`tel:${'0826918783'}`}
                                className="flex items-center space-x-1 text-purple-600 hover:text-purple-700"
                            >
                                <Phone className="w-4 h-4" />
                                <span className="font-medium">Appeler</span>
                            </a>
                        </div>
                    </div>
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <div className="max-w-4xl mx-auto">
                    {/* Product Details */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-8"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Product Image */}
                            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
                                {product?.imageUrl ? (
                                    <img
                                        src={product.imageUrl}
                                        alt={product.name}
                                        className="w-full h-64 md:h-80 object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-64 md:h-80 flex items-center justify-center bg-gradient-to-r from-purple-100 to-pink-100">
                                        <ShoppingBag className="h-16 w-16 text-purple-300" />
                                    </div>
                                )}
                            </div>

                            {/* Product Info */}
                            <div className="space-y-4">
                                <div>
                                    <span className="inline-block px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm font-medium mb-2">
                                        {product?.category?.replace('_', ' ')}
                                    </span>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                        {product?.name}
                                    </h1>
                                    <p className="text-gray-600 mb-4">{product?.description}</p>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold text-purple-600">
                                            {product?.price.toFixed(2)} €
                                        </span>
                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${(product?.stock ?? 0) > 0
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-red-100 text-red-800'
                                            }`}>
                                            {(product?.stock ?? 0) > 0
                                                ? `${product?.stock} disponibles`
                                                : 'Rupture de stock'
                                            }
                                        </span>
                                    </div>

                                    <div className="text-sm text-gray-500">
                                        <p>✓ Réservation simple et rapide</p>
                                        <p>✓ Aucun paiement nécessaire maintenant</p>
                                        <p>✓ Confirmation par téléphone sous 24h</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Reservation Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 md:p-8"
                    >
                        {isSuccess ? (
                            <div className="text-center py-8">
                                <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                                    Réservation envoyée avec succès ! 🎉
                                </h3>
                                <p className="text-gray-600 mb-6 max-w-md mx-auto">
                                    Merci {formData.customerName}, votre réservation pour
                                    <strong> {product?.name} </strong>
                                    a été enregistrée. Nous vous contacterons au
                                    <strong> {formData.customerPhone} </strong>
                                    dans les plus brefs délais.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                    <Link to={ROUTES.CATALOG}>
                                        <Button variant="primary">
                                            <ShoppingBag className="w-4 h-4 mr-2" />
                                            Voir d'autres produits
                                        </Button>
                                    </Link>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setIsSuccess(false);
                                            setFormData({
                                                customerName: '',
                                                customerPhone: '',
                                                customerEmail: '',
                                                quantity: 1,
                                            });
                                        }}
                                    >
                                        Faire une autre réservation
                                    </Button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                                    Réserver ce produit
                                </h2>

                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <label
                                                htmlFor="customerName"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                            >
                                                Nom complet *
                                            </label>
                                            <Input
                                                id="customerName"
                                                name="customerName"
                                                type="text"
                                                required
                                                value={formData.customerName}
                                                onChange={handleInputChange}
                                                placeholder="Votre nom"
                                                disabled={isSubmitting || product?.stock === 0}
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="customerPhone"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                            >
                                                Téléphone *
                                            </label>
                                            <Input
                                                id="customerPhone"
                                                name="customerPhone"
                                                type="tel"
                                                required
                                                value={formData.customerPhone}
                                                onChange={handleInputChange}
                                                placeholder="Votre numéro de téléphone"
                                                disabled={isSubmitting || product?.stock === 0}
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="customerEmail"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                            >
                                                Email *
                                            </label>
                                            <Input
                                                id="customerEmail"
                                                name="customerEmail"
                                                type="email"
                                                required
                                                value={formData.customerEmail}  // Mettez à jour ici
                                                onChange={handleInputChange}
                                                placeholder="Votre email"
                                                disabled={isSubmitting || product?.stock === 0}
                                                className="w-full"
                                            />
                                        </div>
                                        <div>
                                            <label
                                                htmlFor="quantity"
                                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                                            >
                                                Quantité *
                                            </label>
                                            <Input
                                                id="quantity"
                                                name="quantity"
                                                type="number"
                                                min="1"
                                                max={product?.stock || 1}
                                                required
                                                value={formData.quantity}
                                                onChange={handleInputChange}
                                                disabled={isSubmitting || product?.stock === 0}
                                                className="w-full"
                                            />
                                            {product?.stock !== undefined && product.stock > 0 && (
                                                <p className="mt-1 text-sm text-gray-500">
                                                    Quantité disponible : {product.stock}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                            <div className="flex items-center">
                                                <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
                                                <p className="text-red-700">{error}</p>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            * Champs obligatoires. Aucun paiement requis maintenant.
                                        </p>
                                        <Button
                                            type="submit"
                                            variant="primary"
                                            size="lg"
                                            disabled={
                                                isSubmitting ||
                                                !product ||
                                                (product.stock !== undefined && product.stock <= 0)
                                            }
                                            className="min-w-[200px]"
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Envoi en cours...
                                                </>
                                            ) : (
                                                'Réserver maintenant'
                                            )}
                                        </Button>
                                    </div>
                                </form>
                            </>
                        )}
                    </motion.div>

                    {/* Additional Info */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="mt-8 p-6 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div>
                                <div className="text-2xl mb-2">📞</div>
                                <h4 className="font-bold text-gray-800 dark:text-white mb-1">Confirmation rapide</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Appel sous 24h pour confirmer</p>
                            </div>
                            <div>
                                <div className="text-2xl mb-2">🛡️</div>
                                <h4 className="font-bold text-gray-800 dark:text-white mb-1">Sans engagement</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Réservation gratuite, aucun paiement</p>
                            </div>
                            <div>
                                <div className="text-2xl mb-2">🚚</div>
                                <h4 className="font-bold text-gray-800 dark:text-white mb-1">Livraison flexible</h4>
                                <p className="text-sm text-gray-600 dark:text-gray-400">Modalités convenues ensemble</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Social Sharing */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6 }}
                        className="mt-8 text-center"
                    >
                        <p className="text-gray-600 dark:text-gray-400 mb-4">Partagez cette page avec vos amis :</p>
                        <div className="flex justify-center space-x-4">
                            <a
                                href={`https://wa.me/?text=${encodeURIComponent(
                                    `Je viens de réserver "${product?.name}" sur Brelness! Réserve aussi tes produits cosmétiques ici: ${window.location.href}`
                                )}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-green-100 text-green-800 rounded-full hover:bg-green-200 transition-colors"
                            >
                                💬 WhatsApp
                            </a>
                            <a
                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-blue-100 text-blue-800 rounded-full hover:bg-blue-200 transition-colors"
                            >
                                📘 Facebook
                            </a>
                        </div>
                    </motion.div>
                </div>
            </main>

            {/* Simple Footer */}
            <footer className="mt-12 border-t border-gray-200/50 dark:border-gray-700/50 py-6">
                <div className="container mx-auto px-4">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="mb-4 md:mb-0">
                            <h3 className="font-bold text-lg text-gray-800 dark:text-white">Brelness</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400">Réservation de produits cosmétiques</p>
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            © {new Date().getFullYear()} Brelness. Tous droits réservés.
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default HomePage;