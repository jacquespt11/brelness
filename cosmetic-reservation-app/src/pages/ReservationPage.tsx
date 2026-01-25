// src/pages/ReservationPage.tsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useReservationStore } from '../state/reservationStore';

const ReservationPage = () => {
    const { productId } = useParams<{ productId?: string }>();
    const navigate = useNavigate();
    const createReservation = useReservationStore((state) => state.createReservationFromClient);
    const getProductById = useReservationStore((state) => state.getProductById);

    const [product, setProduct] = useState<any>(null);
    const [formData, setFormData] = useState({
        nomClient: '',
        telephone: '',
        quantite: 1
    });
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [error, setError] = useState<string>('');
    const [isLoading, setIsLoading] = useState(true);

    // Charger le produit
    useEffect(() => {
        const loadProduct = async () => {
            if (productId) {
                const foundProduct = getProductById(productId);
                if (foundProduct) {
                    setProduct(foundProduct);
                }
            }
            setTimeout(() => setIsLoading(false), 500);
        };
        loadProduct();
    }, [productId, getProductById]);

    const handleGoBack = () => {
        if (productId) {
            navigate('/catalog');
        } else {
            navigate('/');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.nomClient.trim()) {
            setError('Votre nom est requis');
            return;
        }
        if (!formData.telephone.trim()) {
            setError('Votre numéro de téléphone est requis');
            return;
        }

        const phoneRegex = /^[0-9]{10}$/;
        const cleanedPhone = formData.telephone.replace(/\s/g, '');
        if (!phoneRegex.test(cleanedPhone)) {
            setError('Le numéro de téléphone doit contenir 10 chiffres');
            return;
        }

        try {
            createReservation({
                ...formData,
                productId: product?.id,
                email: '',
                produit: product?.name || 'Produit cosmétique',
                produitType: product?.category || 'skincare'
            });

            setIsSubmitted(true);
            setTimeout(() => {
                setFormData({ nomClient: '', telephone: '', quantite: 1 });
                setIsSubmitted(false);
                handleGoBack();
            }, 3000);

        } catch (err) {
            setError('Une erreur est survenue. Veuillez réessayer.');
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800">
            {/* Header avec bouton retour */}
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
                            <h1 className="text-lg font-semibold text-gray-800 dark:text-white">
                                Réservation {product && `- ${product.name}`}
                            </h1>
                        </div>
                    </div>
                </div>
            </header>

            {/* Contenu principal */}
            <main className="container mx-auto px-4 py-8 max-w-2xl">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
                >
                    {isSubmitted ? (
                        <div className="text-center py-12 px-4">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6"
                            >
                                <span className="text-4xl">✅</span>
                            </motion.div>

                            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                                Réservation confirmée !
                            </h2>

                            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                                Merci <strong>{formData.nomClient}</strong>, votre réservation a bien été prise en compte.
                                Nous vous contacterons au <strong>{formData.telephone}</strong> sous 24h.
                            </p>

                            <div className="space-y-4">
                                <button
                                    onClick={handleGoBack}
                                    className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all"
                                >
                                    Retourner au catalogue
                                </button>

                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Vous allez être redirigé automatiquement...
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="p-6 md:p-8">
                            {/* En-tête */}
                            <div className="text-center mb-8">
                                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <span className="text-3xl text-white">💄</span>
                                </div>

                                <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2">
                                    Réserver {product ? product.name : 'un produit'}
                                </h2>

                                <p className="text-gray-600 dark:text-gray-300">
                                    Remplissez ce formulaire pour réserver votre produit
                                </p>
                            </div>

                            {/* Aperçu produit */}
                            {product && (
                                <div className="mb-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl border border-purple-100 dark:border-purple-800">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-pink-400 rounded-xl flex items-center justify-center flex-shrink-0">
                                            <span className="text-3xl text-white">💄</span>
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="font-bold text-gray-800 dark:text-white">{product.name}</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
                                                {product.description}
                                            </p>

                                            <div className="flex items-center justify-between mt-3">
                                                <span className="text-xl font-bold text-purple-600 dark:text-purple-400">
                                                    {product.price}€
                                                </span>

                                                <span className={`px-3 py-1 text-xs rounded-full ${product.stock > 5
                                                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                                                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                    }`}>
                                                    {product.stock > 5 ? 'Stock disponible' : 'Stock limité'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Formulaire */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {error && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                                    >
                                        <div className="flex items-center space-x-2 text-red-700 dark:text-red-300">
                                            <span>⚠️</span>
                                            <p>{error}</p>
                                        </div>
                                    </motion.div>
                                )}

                                {/* Champs du formulaire */}
                                <div className="space-y-4">
                                    {/* Nom */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Votre nom complet *
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.nomClient}
                                            onChange={(e) => setFormData(prev => ({ ...prev, nomClient: e.target.value }))}
                                            required
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white transition-all"
                                            placeholder="Ex: Marie Dupont"
                                        />
                                    </div>

                                    {/* Téléphone */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Votre numéro de téléphone *
                                        </label>
                                        <input
                                            type="tel"
                                            value={formData.telephone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, telephone: e.target.value }))}
                                            required
                                            pattern="[0-9]{10}"
                                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:text-white"
                                            placeholder="0612345678"
                                        />
                                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                            Nous vous appellerons sur ce numéro pour confirmer
                                        </p>
                                    </div>

                                    {/* Quantité */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Quantité souhaitée
                                        </label>
                                        <div className="flex items-center space-x-4">
                                            <motion.button
                                                type="button"
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    quantite: Math.max(1, prev.quantite - 1)
                                                }))}
                                                className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                <span className="text-xl">−</span>
                                            </motion.button>

                                            <div className="flex-1 text-center">
                                                <span className="text-3xl font-bold text-gray-800 dark:text-white">
                                                    {formData.quantite}
                                                </span>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    unité{formData.quantite > 1 ? 's' : ''}
                                                </p>
                                            </div>

                                            <motion.button
                                                type="button"
                                                whileTap={{ scale: 0.95 }}
                                                onClick={() => setFormData(prev => ({
                                                    ...prev,
                                                    quantite: Math.min(10, prev.quantite + 1)
                                                }))}
                                                className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                            >
                                                <span className="text-xl">+</span>
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>

                                {/* Résumé */}
                                <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                                    <div className="flex justify-between items-center">
                                        <div>
                                            <p className="text-gray-600 dark:text-gray-300">Total estimé</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {product ? `${product.price}€ × ${formData.quantite}` : 'Calcul en cours...'}
                                            </p>
                                        </div>

                                        <div className="text-right">
                                            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                                {product ? (product.price * formData.quantite).toFixed(2) : '0.00'}€
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                TTC • Confirmation par téléphone
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Boutons */}
                                <div className="pt-6 space-y-4">
                                    <motion.button
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        type="submit"
                                        className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl text-lg"
                                    >
                                        Réserver maintenant →
                                    </motion.button>

                                    <button
                                        type="button"
                                        onClick={handleGoBack}
                                        className="w-full py-3 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                                    >
                                        Annuler et retourner
                                    </button>
                                </div>

                                {/* Mentions */}
                                <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                                        En réservant, vous acceptez d'être contacté par téléphone.
                                        <br />
                                        Aucun paiement n'est requis pour l'instant.
                                    </p>
                                </div>
                            </form>
                        </div>
                    )}
                </motion.div>

                {/* Informations supplémentaires */}
                <div className="mt-8 text-center">
                    <div className="inline-flex items-center space-x-2 text-gray-600 dark:text-gray-400 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm px-4 py-2 rounded-full">
                        <span>🔒</span>
                        <span className="text-sm">Données sécurisées • Confidentialité garantée</span>
                    </div>

                    <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">
                        Questions ? Appelez-nous au <a href="tel:0123456789" className="text-purple-600 dark:text-purple-400 hover:underline">01 23 45 67 89</a>
                    </p>
                </div>
            </main>
        </div>
    );
};

export default ReservationPage;