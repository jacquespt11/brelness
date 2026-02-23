// src/features/reservations/components/ReservationForm/index.tsx
import React, { useState } from 'react';
import { motion as motionBase, AnimatePresence as AnimatePresenceBase } from 'framer-motion';
import { Button, Input } from '@/shared/components/ui';
import { useReservationStore } from '../../store/reservationStore';
import type { Product } from '@/features/products/types/product.types';

interface ReservationFormProps {
    product: Product | null;
    onSuccess: (clientName: string, phone: string) => void;
    onCancel: () => void;
}

export function ReservationForm({ product, onSuccess, onCancel }: ReservationFormProps) {
    const addReservation = useReservationStore((state) => state.addReservation);
    const [formData, setFormData] = useState({
        customerName: '',
        customerPhone: '',
        quantity: 1
    });
    const [error, setError] = useState<string>('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsSubmitting(true);

        if (!formData.customerName.trim()) {
            setError('Votre nom est requis');
            setIsSubmitting(false);
            return;
        }
        if (!formData.customerPhone.trim()) {
            setError('Votre numéro de téléphone est requis');
            setIsSubmitting(false);
            return;
        }

        const phoneRegex = /^[0-9]{10}$/;
        const cleanedPhone = formData.customerPhone.replace(/\s/g, '');
        if (!phoneRegex.test(cleanedPhone)) {
            setError('Le numéro de téléphone doit contenir 10 chiffres');
            setIsSubmitting(false);
            return;
        }

        try {
            await addReservation({
                customerName: formData.customerName,
                customerPhone: cleanedPhone,
                productId: product?.id || '',
                productName: product?.name || '',
                productPrice: product?.price || 0,
                productCategory: product?.category || 'OTHER',
                quantity: formData.quantity,
                source: 'DIRECT',
            });

            onSuccess(formData.customerName, formData.customerPhone);
        } catch (err) {
            setError('Une erreur est survenue. Veuillez réessayer.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <AnimatePresenceBase>
                {error && (
                    <motionBase.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                    >
                        <div className="flex items-center space-x-2 text-red-700 dark:text-red-300">
                            <span>⚠️</span>
                            <p className="text-sm">{error}</p>
                        </div>
                    </motionBase.div>
                )}
            </AnimatePresenceBase>

            <div className="space-y-4">
                <Input
                    label="Votre nom complet *"
                    value={formData.customerName}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                    placeholder="Ex: Marie Dupont"
                    required
                />

                <Input
                    label="Votre numéro de téléphone *"
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                    placeholder="0612345678"
                    required
                    helperText="Nous vous appellerons sur ce numéro pour confirmer"
                />

                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Quantité souhaitée
                    </label>
                    <div className="flex items-center space-x-4">
                        <motionBase.button
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFormData(prev => ({
                                ...prev,
                                quantity: Math.max(1, prev.quantity - 1)
                            }))}
                            className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <span className="text-xl">−</span>
                        </motionBase.button>

                        <div className="flex-1 text-center">
                            <span className="text-3xl font-bold text-gray-800 dark:text-white">
                                {formData.quantity}
                            </span>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                unité{formData.quantity > 1 ? 's' : ''}
                            </p>
                        </div>

                        <motionBase.button
                            type="button"
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setFormData(prev => ({
                                ...prev,
                                quantity: Math.min(10, prev.quantity + 1)
                            }))}
                            className="p-3 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                        >
                            <span className="text-xl">+</span>
                        </motionBase.button>
                    </div>
                </div>
            </div>

            {/* Total Summary */}
            <div className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-xl">
                <div className="flex justify-between items-center">
                    <div>
                        <p className="text-sm text-gray-600 dark:text-gray-300">Total estimé</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            {product ? `${product.price}€ × ${formData.quantity}` : 'Calcul en cours...'}
                        </p>
                    </div>

                    <div className="text-right">
                        <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {product ? (product.price * formData.quantity).toFixed(2) : '0.00'}€
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                            TTC • Confirmation par téléphone
                        </p>
                    </div>
                </div>
            </div>

            <div className="pt-6 space-y-3">
                <Button
                    type="submit"
                    variant="primary"
                    fullWidth
                    size="lg"
                    isLoading={isSubmitting}
                >
                    Réserver maintenant →
                </Button>

                <Button
                    type="button"
                    variant="ghost"
                    fullWidth
                    onClick={onCancel}
                    disabled={isSubmitting}
                >
                    Annuler et retourner
                </Button>
            </div>

            <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                    En réservant, vous acceptez d'être contacté par téléphone.
                    <br />
                    Aucun paiement n'est requis pour l'instant.
                </p>
            </div>
        </form>
    );
}
