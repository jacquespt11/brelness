import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReservationStore } from '../state/reservationStore';
import {
    User,
    Phone,
    Mail,
    Package,
    Calendar,
    FileText,
    Plus,
    Minus,
    Check
} from 'lucide-react';

interface ReservationFormProps {
    onSuccess?: () => void;
}

/**
 * Composant formulaire de réservation amélioré avec animations
 * et expérience utilisateur optimisée
 */
const ReservationForm = ({ onSuccess }: ReservationFormProps) => {
    const { products, fetchProducts, isLoading: storeLoading } = useReservationStore();
    const addReservation = useReservationStore((state) => state.addReservation);

    const [formData, setFormData] = useState({
        nomClient: '',
        telephone: '',
        email: '',
        produit: '',
        productId: '',
        produitType: '',
        quantite: 1,
        dateLivraisonSouhaitee: '',
        notes: ''
    });

    React.useEffect(() => {
        fetchProducts();
    }, [fetchProducts]);

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);

    const steps = [
        { title: 'Client', icon: <User className="w-4 h-4" /> },
        { title: 'Produit', icon: <Package className="w-4 h-4" /> },
        { title: 'Livraison', icon: <Calendar className="w-4 h-4" /> },
        { title: 'Confirmation', icon: <Check className="w-4 h-4" /> }
    ];

    const validateField = (name: string, value: string) => {
        switch (name) {
            case 'nomClient':
                if (!value.trim()) return 'Le nom est requis';
                if (value.length < 2) return 'Nom trop court';
                break;
            case 'telephone':
                if (!value.trim()) return 'Le téléphone est requis';
                if (!/^[0-9]{10}$/.test(value.replace(/\s/g, ''))) return 'Numéro invalide (10 chiffres)';
                break;
            case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Email invalide';
                break;
            case 'produit':
                if (!value.trim() && !formData.productId) return 'Le produit est requis';
                break;
            case 'productId':
                if (!value) return 'Le choix d\'un produit est requis';
                break;
        }
        return '';
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;

        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? Math.max(1, Math.min(100, parseInt(value) || 1)) : value
        }));

        // Validation en temps réel
        const error = validateField(name, value);
        setErrors(prev => ({
            ...prev,
            [name]: error
        }));
    };

    const handleQuantityChange = (delta: number) => {
        const newQuantity = Math.max(1, Math.min(100, formData.quantite + delta));
        setFormData(prev => ({
            ...prev,
            quantite: newQuantity
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validation finale
        const newErrors: Record<string, string> = {};
        Object.entries(formData).forEach(([key, value]) => {
            if (['nomClient', 'telephone', 'productId'].includes(key)) {
                const error = validateField(key, value as string);
                if (error) newErrors[key] = error;
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setIsSubmitting(false);
            return;
        }

        try {
            await addReservation(formData);

            // Feedback visuel
            if (onSuccess) {
                onSuccess();
            } else {
                // Réinitialisation
                setFormData({
                    nomClient: '',
                    telephone: '',
                    email: '',
                    produit: '',
                    productId: '',
                    produitType: '',
                    quantite: 1,
                    dateLivraisonSouhaitee: '',
                    notes: ''
                });
                setErrors({});
                setCurrentStep(0);
            }
        } catch (error) {
            console.error('Erreur lors de la création:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const selectedProduct = products.find(p => p.id === formData.productId);
    const totalEstime = (selectedProduct?.price || 0) * formData.quantite;

    const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 0));

    return (
        <motion.form
            onSubmit={handleSubmit}
            className="space-y-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            {/* Indicateur d'étapes */}
            <div className="relative">
                <div className="flex justify-between mb-8">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center relative z-10">
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: index * 0.1 }}
                                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${index <= currentStep
                                    ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                    }`}
                            >
                                {step.icon}
                            </motion.div>
                            <span className={`text-sm font-medium ${index <= currentStep
                                ? 'text-purple-600 dark:text-purple-400'
                                : 'text-gray-500 dark:text-gray-400'
                                }`}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700">
                    <motion.div
                        initial={{ width: '0%' }}
                        animate={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                    />
                </div>
            </div>

            <AnimatePresence mode="wait">
                {currentStep === 0 && (
                    <motion.div
                        key="step1"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <User className="w-6 h-6 text-purple-600" />
                            Informations client
                        </h3>

                        <div className="grid md:grid-cols-2 gap-6">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <User className="w-4 h-4" />
                                    Nom complet *
                                </label>
                                <input
                                    type="text"
                                    name="nomClient"
                                    value={formData.nomClient}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${errors.nomClient
                                        ? 'border-red-500 dark:border-red-500'
                                        : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                    placeholder="Marie Dupont"
                                />
                                {errors.nomClient && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-500 text-sm mt-2"
                                    >
                                        {errors.nomClient}
                                    </motion.p>
                                )}
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <Phone className="w-4 h-4" />
                                    Téléphone *
                                </label>
                                <input
                                    type="tel"
                                    name="telephone"
                                    value={formData.telephone}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${errors.telephone
                                        ? 'border-red-500 dark:border-red-500'
                                        : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                    placeholder="06 12 34 56 78"
                                />
                                {errors.telephone && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-500 text-sm mt-2"
                                    >
                                        {errors.telephone}
                                    </motion.p>
                                )}
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.3 }}
                                className="md:col-span-2"
                            >
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                    <Mail className="w-4 h-4" />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${errors.email
                                        ? 'border-red-500 dark:border-red-500'
                                        : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                    placeholder="marie@exemple.com"
                                />
                                {errors.email && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-500 text-sm mt-2"
                                    >
                                        {errors.email}
                                    </motion.p>
                                )}
                            </motion.div>
                        </div>
                    </motion.div>
                )}

                {currentStep === 1 && (
                    <motion.div
                        key="step2"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <Package className="w-6 h-6 text-purple-600" />
                            Sélection du produit
                        </h3>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            className="space-y-4"
                        >
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Produits disponibles
                            </label>
                            {storeLoading && products.length === 0 ? (
                                <div className="flex justify-center p-8">
                                    <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 max-h-60 overflow-y-auto p-1">
                                    {products.map((product) => (
                                        <motion.button
                                            key={product.id}
                                            type="button"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => setFormData(prev => ({
                                                ...prev,
                                                productId: product.id,
                                                produit: product.name,
                                                produitType: product.category
                                            }))}
                                            className={`p-3 rounded-xl border-2 text-left transition-all ${formData.productId === product.id
                                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                                                : 'border-gray-100 dark:border-gray-800 hover:border-purple-200'
                                                }`}
                                        >
                                            <div className="font-semibold text-gray-800 dark:text-white truncate">
                                                {product.name}
                                            </div>
                                            <div className="flex justify-between items-center mt-1">
                                                <span className="text-xs text-purple-600 dark:text-purple-400 capitalize">
                                                    {product.category}
                                                </span>
                                                <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
                                                    {product.price}€
                                                </span>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                            )}
                            {errors.productId && (
                                <p className="text-red-500 text-sm">{errors.productId}</p>
                            )}
                        </motion.div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Produit *
                                </label>
                                <input
                                    type="text"
                                    name="produit"
                                    value={formData.produit}
                                    onChange={handleChange}
                                    required
                                    className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white transition-all ${errors.produit
                                        ? 'border-red-500 dark:border-red-500'
                                        : 'border-gray-300 dark:border-gray-600'
                                        }`}
                                    placeholder="Crème hydratante anti-âge"
                                />
                                {errors.produit && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-red-500 text-sm mt-2"
                                    >
                                        {errors.produit}
                                    </motion.p>
                                )}
                            </motion.div>

                            <motion.div
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.2 }}
                            >
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Quantité *
                                </label>
                                <div className="flex items-center space-x-4">
                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleQuantityChange(-1)}
                                        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600"
                                    >
                                        <Minus className="w-4 h-4" />
                                    </motion.button>

                                    <div className="flex-1 text-center">
                                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                                            {formData.quantite}
                                        </div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">
                                            unité{formData.quantite > 1 ? 's' : ''}
                                        </div>
                                    </div>

                                    <motion.button
                                        type="button"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => handleQuantityChange(1)}
                                        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600"
                                    >
                                        <Plus className="w-4 h-4" />
                                    </motion.button>
                                </div>
                            </motion.div>
                        </div>

                        {/* Estimation totale */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl border border-purple-200 dark:border-purple-800"
                        >
                            <div className="flex justify-between items-center">
                                <div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">Estimation totale</div>
                                    <div className="text-2xl font-bold text-purple-700 dark:text-purple-300">
                                        {(formData.productId ? (products.find(p => p.id === formData.productId)?.price || 0) * formData.quantite : 0).toFixed(2)}€
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {formData.quantite} × {(formData.productId ? products.find(p => p.id === formData.productId)?.price || 0 : 0).toFixed(2)}€
                                    </div>
                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                        {formData.produit || 'Aucun produit sélectionné'}
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}

                {currentStep === 2 && (
                    <motion.div
                        key="step3"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <Calendar className="w-6 h-6 text-purple-600" />
                            Informations de livraison
                        </h3>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                        >
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                Date de livraison souhaitée
                            </label>
                            <div className="relative">
                                <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="date"
                                    name="dateLivraisonSouhaitee"
                                    value={formData.dateLivraisonSouhaitee}
                                    onChange={handleChange}
                                    min={new Date().toISOString().split('T')[0]}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                />
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ y: 20, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.1 }}
                        >
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                                <FileText className="w-4 h-4" />
                                Notes supplémentaires
                            </label>
                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="Allergies, préférences particulières, instructions spéciales..."
                            />
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                                Ces informations seront visibles par votre équipe
                            </p>
                        </motion.div>
                    </motion.div>
                )}

                {currentStep === 3 && (
                    <motion.div
                        key="step4"
                        initial={{ x: 20, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        exit={{ x: -20, opacity: 0 }}
                        className="space-y-6"
                    >
                        <h3 className="text-xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                            <Check className="w-6 h-6 text-green-600" />
                            Récapitulatif
                        </h3>

                        <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 space-y-4">
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Client</h4>
                                    <p className="text-gray-800 dark:text-white">{formData.nomClient}</p>
                                    <p className="text-gray-600 dark:text-gray-400">{formData.telephone}</p>
                                    {formData.email && (
                                        <p className="text-gray-600 dark:text-gray-400">{formData.email}</p>
                                    )}
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Produit</h4>
                                    <p className="text-gray-800 dark:text-white">{formData.produit}</p>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {formData.produitType} • {formData.quantite} unité{formData.quantite > 1 ? 's' : ''}
                                    </p>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Livraison</h4>
                                    {formData.dateLivraisonSouhaitee ? (
                                        <p className="text-gray-800 dark:text-white">
                                            {new Date(formData.dateLivraisonSouhaitee).toLocaleDateString('fr-FR')}
                                        </p>
                                    ) : (
                                        <p className="text-gray-500 dark:text-gray-400">Non spécifiée</p>
                                    )}
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Total</h4>
                                    <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                                        {totalEstime.toFixed(2)}€
                                    </p>
                                </div>
                            </div>

                            {formData.notes && (
                                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <h4 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Notes</h4>
                                    <p className="text-gray-600 dark:text-gray-400 italic">{formData.notes}</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Navigation entre étapes */}
            <div className="flex justify-between pt-8 border-t border-gray-200 dark:border-gray-700">
                <motion.button
                    type="button"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    whileHover={{ x: -5 }}
                    whileTap={{ scale: 0.95 }}
                    className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors ${currentStep === 0
                        ? 'opacity-50 cursor-not-allowed'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                        }`}
                >
                    <span>←</span>
                    <span>Précédent</span>
                </motion.button>

                {currentStep < steps.length - 1 ? (
                    <motion.button
                        type="button"
                        onClick={nextStep}
                        whileHover={{ x: 5 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all"
                    >
                        <span>Suivant</span>
                        <span>→</span>
                    </motion.button>
                ) : (
                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center space-x-2 px-8 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Création en cours...</span>
                            </>
                        ) : (
                            <>
                                <Check className="w-5 h-5" />
                                <span>Confirmer la réservation</span>
                            </>
                        )}
                    </motion.button>
                )}
            </div>
        </motion.form>
    );
};

export default ReservationForm;