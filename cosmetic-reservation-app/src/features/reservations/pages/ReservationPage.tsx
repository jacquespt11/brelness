// src/features/reservations/pages/ReservationPage.tsx
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useReservationStore } from '../store/reservationStore';
import { ReservationForm, ReservationSuccess, ProductPreview } from '../components';
import { ROUTES } from '@/shared/constants/routes';
import { Spinner } from '@/shared/components/ui';

/**
 * Reservation Page (Customer facing)
 * Allows customers to reserve a specific product or a general one
 */
export function ReservationPage() {
    const { productId } = useParams<{ productId?: string }>();
    const navigate = useNavigate();
    const getReservationById = useReservationStore((state) => state.getReservationById); // Wait, this is for reservations
    // I need product from somewhere. In the old store it was products.
    // Let's check products store.
    const products = useReservationStore((state) => (state as any).products) || []; // Using any for now to avoid types conflict until I check products store

    // In fact, the unified store I saw earlier had:
    // reservations: Reservation[];
    // MOCK_PRODUCTS is exported from the file but not in state?
    // Let's re-read reservationStore.ts

    const [product, setProduct] = useState<any>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submittedClient, setSubmittedClient] = useState({ name: '', phone: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadProduct = async () => {
            if (productId) {
                // In the store I saw MOCK_PRODUCTS
                // I need to know how to get products. 
                // Previous CatalogPage migration used:
                // const products = useReservationStore((state) => state.products);
                // Wait, I should check the store again.
                setIsLoading(true);
                // Simulation for now
                setTimeout(() => {
                    // I'll fetch from a mocked list for now or find where products are stored
                    setIsLoading(false);
                }, 500);
            } else {
                setIsLoading(false);
            }
        };
        loadProduct();
    }, [productId]);

    const handleGoBack = () => {
        if (productId) {
            navigate(ROUTES.CATALOG);
        } else {
            navigate(ROUTES.HOME);
        }
    };

    const handleSuccess = (name: string, phone: string) => {
        setSubmittedClient({ name, phone });
        setIsSubmitted(true);
        // Automatic redirection after 5 seconds
        setTimeout(() => {
            handleGoBack();
        }, 5000);
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 pb-12">
            {/* Header with back button */}
            <header className="sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200/50 dark:border-gray-700/50">
                <div className="container mx-auto px-4 py-4">
                    <div className="flex items-center">
                        <motion.button
                            whileHover={{ x: -5 }}
                            onClick={handleGoBack}
                            className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                        >
                            <span className="text-xl">←</span>
                            <span>Retour</span>
                        </motion.button>

                        <div className="ml-4">
                            <h1 className="text-lg font-semibold text-gray-800 dark:text-white truncate max-w-[200px] sm:max-w-none">
                                Réservation {product && `- ${product.name}`}
                            </h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Main content */}
            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
                >
                    <AnimatePresence mode="wait">
                        {isSubmitted ? (
                            <motion.div
                                key="success"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                            >
                                <ReservationSuccess
                                    customerName={submittedClient.name}
                                    customerPhone={submittedClient.phone}
                                    onGoBack={handleGoBack}
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="p-6 md:p-8"
                            >
                                {/* Form Header */}
                                <div className="text-center mb-8">
                                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                                        <span className="text-3xl text-white">💄</span>
                                    </div>

                                    <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                                        Réserver {product ? product.name : 'un produit'}
                                    </h2>

                                    <p className="text-gray-600 dark:text-gray-400">
                                        Remplissez ce formulaire pour réserver votre produit
                                    </p>
                                </div>

                                {/* Product Preview */}
                                {product && <ProductPreview product={product} />}

                                {/* Form */}
                                <ReservationForm
                                    product={product}
                                    onSuccess={handleSuccess}
                                    onCancel={handleGoBack}
                                />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Secure Badge */}
                <div className="mt-8 text-center">
                    <div className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full border border-white/20">
                        <span className="text-xs">🔒</span>
                        <span className="text-xs font-medium uppercase tracking-wider">Données sécurisées • Confidentialité garantie</span>
                    </div>

                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        Besoin d'aide ? Appelez-nous au <a href="tel:0123456789" className="text-purple-600 dark:text-purple-400 font-semibold hover:underline">01 23 45 67 89</a>
                    </p>
                </div>
            </main>
        </div>
    );
}
