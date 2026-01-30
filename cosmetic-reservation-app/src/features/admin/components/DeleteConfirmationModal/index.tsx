// src/features/admin/components/DeleteConfirmationModal/index.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Reservation } from '@/features/reservations/types/reservation.types';
import { Button } from '@/shared/components/ui';
import { AlertTriangle, Info } from 'lucide-react';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    reservation: Reservation | null;
}

/**
 * Animated deletion confirmation modal
 */
export function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    reservation
}: DeleteConfirmationModalProps) {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Overlay */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-[60] p-4 pointer-events-none">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 300
                            }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden pointer-events-auto border border-gray-100 dark:border-gray-700"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2.5 bg-red-100 dark:bg-red-900/30 rounded-xl text-red-600 dark:text-red-400">
                                        <AlertTriangle size={24} />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            Confirmer la suppression
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                                            Cette action est irréversible
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {reservation && (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-gray-100 dark:border-gray-700">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <p className="font-bold text-gray-900 dark:text-white">
                                                        {reservation.customerName}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
                                                        {reservation.productName}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-purple-600 dark:text-purple-400">
                                                        {reservation.totalPrice.toFixed(2)}€
                                                    </p>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400">
                                                        Qté: {reservation.quantity}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2 text-sm text-gray-500 dark:text-gray-400 px-1">
                                            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Créée le :</span>
                                            <span>
                                                {new Date(reservation.createdAt).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 p-4 bg-amber-50 dark:bg-amber-900/10 rounded-xl border border-amber-100 dark:border-amber-900/20">
                                    <div className="flex items-start space-x-3">
                                        <Info size={18} className="text-amber-600 dark:text-amber-400 mt-0.5" />
                                        <p className="text-sm text-amber-800 dark:text-amber-300">
                                            <strong>Conseil :</strong> Pensez plutôt à marquer comme <strong>"Annulée"</strong> si vous souhaitez conserver un historique dans vos statistiques.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-900/10 flex flex-col sm:flex-row gap-3">
                                <Button
                                    variant="ghost"
                                    onClick={onClose}
                                    fullWidth
                                >
                                    Fermer
                                </Button>
                                <Button
                                    variant="primary"
                                    onClick={handleConfirm}
                                    fullWidth
                                    className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 text-white shadow-lg shadow-red-200 dark:shadow-none border-none"
                                >
                                    Supprimer
                                </Button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
}

export default DeleteConfirmationModal;
