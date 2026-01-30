// src/features/reservations/components/ReservationForm/ConfirmationStep.tsx
import { Check, Calendar, FileText, ShoppingBag, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface ConfirmationStepProps {
    formData: any;
    totalPrice: number;
}

export function ConfirmationStep({ formData, totalPrice }: ConfirmationStepProps) {
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
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                        <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <ShoppingBag size={12} className="mr-1" /> Produit
                        </div>
                        <p className="font-bold text-gray-800 dark:text-white">{formData.productName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            {formData.quantity} unité{formData.quantity > 1 ? 's' : ''} • {totalPrice.toFixed(2)}€ total
                        </p>
                    </div>

                    {/* Delivery Info */}
                    <div className="space-y-2">
                        <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <Calendar size={12} className="mr-1" /> Livraison souhaitée
                        </div>
                        <p className="text-sm text-gray-800 dark:text-white">
                            {formData.preferredDeliveryDate
                                ? new Date(formData.preferredDeliveryDate).toLocaleDateString('fr-FR')
                                : 'Non spécifiée'}
                        </p>
                    </div>

                    {/* Source Info */}
                    <div className="space-y-2">
                        <div className="flex items-center text-xs font-bold text-gray-400 uppercase tracking-wider">
                            <FileText size={12} className="mr-1" /> Source
                        </div>
                        <p className="text-sm text-gray-800 dark:text-white">{formData.source}</p>
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
            </div>
        </motion.div>
    );
}
