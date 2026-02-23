// src/features/reservations/components/ReservationForm/ConfirmationStep.tsx

import { Check, Calendar, FileText, ShoppingBag, User, Package } from 'lucide-react';
import { motion } from 'framer-motion';
import type { CreateReservationData } from '../../types/reservation.types';
import type { Product } from '@/features/products/types/product.types';

interface ConfirmationStepProps {
    formData: CreateReservationData;
    selectedProduct?: Product;
    totalPrice: number;
}

export function ConfirmationStep({ formData, selectedProduct, totalPrice }: ConfirmationStepProps) {
    // Calculate unit price
    const unitPrice = selectedProduct?.price || 0;
    const calculatedTotalPrice = unitPrice * formData.quantity;

    return (
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-6"
        >
            <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg text-green-600 dark:text-green-400">
                    <Check size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Confirmation
                </h3>
            </div>

            <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Customer Info */}
                    <div className="space-y-2">
                        <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <User size={12} className="mr-1" /> Client
                        </div>
                        <p className="font-bold text-gray-800 dark:text-white">{formData.customerName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{formData.customerPhone}</p>
                        {formData.customerEmail && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">{formData.customerEmail}</p>
                        )}
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                        <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <ShoppingBag size={12} className="mr-1" /> Produit
                        </div>
                        {selectedProduct ? (
                            <>
                                <p className="font-bold text-gray-800 dark:text-white">{selectedProduct.name}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {formData.quantity} unité{formData.quantity > 1 ? 's' : ''} • {unitPrice.toFixed(2)}€/unité
                                </p>
                            </>
                        ) : formData.productName ? (
                            <>
                                <p className="font-bold text-gray-800 dark:text-white">{formData.productName}</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                    Catégorie: {(() => {
                                        switch (formData.productCategory) {
                                            case 'FACIAL_CARE': return 'Soin visage';
                                            case 'BODY_CARE': return 'Soin corps';
                                            case 'HAIR_CARE': return 'Soin cheveux';
                                            case 'MAKEUP': return 'Maquillage';
                                            case 'PERFUME': return 'Parfum';
                                            default: return formData.productCategory;
                                        }
                                    })()}
                                </p>
                            </>
                        ) : (
                            <p className="text-sm text-red-500">Produit non spécifié</p>
                        )}
                    </div>

                    {/* Pricing */}
                    <div className="space-y-2">
                        <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <Package size={12} className="mr-1" /> Prix
                        </div>
                        <div className="space-y-1">
                            {selectedProduct && (
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 dark:text-gray-400">
                                        {formData.quantity} × {unitPrice.toFixed(2)}€
                                    </span>
                                    <span className="font-medium">{(unitPrice * formData.quantity).toFixed(2)}€</span>
                                </div>
                            )}
                            <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                                <span className="text-gray-800 dark:text-white">Total</span>
                                <span className="text-purple-600 dark:text-purple-400">
                                    {calculatedTotalPrice.toFixed(2)}€
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery & Source Info */}
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <Calendar size={12} className="mr-1" /> Livraison
                            </div>
                            <p className="text-sm text-gray-800 dark:text-white">
                                {formData.preferredDeliveryDate
                                    ? new Date(formData.preferredDeliveryDate).toLocaleDateString('fr-FR')
                                    : 'Non spécifiée'}
                            </p>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                                <FileText size={12} className="mr-1" /> Source
                            </div>
                            <p className="text-sm text-gray-800 dark:text-white">
                                {(() => {
                                    switch (formData.source) {
                                        case 'FACEBOOK': return 'Facebook';
                                        case 'INSTAGRAM': return 'Instagram';
                                        case 'WHATSAPP': return 'WhatsApp';
                                        case 'PHONE': return 'Téléphone';
                                        case 'STORE': return 'Boutique';
                                        default: return 'Site web';
                                    }
                                })()}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Notes */}
                {formData.notes && (
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2">
                        <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <FileText size={12} className="mr-1" /> Notes
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                            "{formData.notes}"
                        </p>
                    </div>
                )}
            </div>

            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10 rounded-xl border border-green-100 dark:border-green-900/30">
                <p className="text-sm text-green-700 dark:text-green-300 flex items-center">
                    <Check size={16} className="mr-2" />
                    Prêt à enregistrer cette réservation ?
                </p>
                <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    La réservation sera enregistrée avec le statut "En attente"
                </p>
            </div>
        </motion.div>
    );
}