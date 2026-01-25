// src/components/admin/DeleteConfirmationModal.tsx
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Reservation } from '../../types/reservation';

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    reservation: Reservation | null;
}

/**
 * Modal de confirmation de suppression avec animations
 */
const DeleteConfirmationModal: React.FC<DeleteConfirmationModalProps> = ({
    isOpen,
    onClose,
    onConfirm,
    reservation
}) => {
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
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            transition={{
                                type: "spring",
                                damping: 25,
                                stiffness: 300
                            }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full overflow-hidden"
                        >
                            {/* Header */}
                            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                                <div className="flex items-center space-x-3">
                                    <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-lg">
                                        <span className="text-2xl">⚠️</span>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                            Confirmer la suppression
                                        </h3>
                                        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                            Cette action est irréversible
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                {reservation && (
                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                            <div className="flex justify-between">
                                                <div>
                                                    <p className="font-medium text-gray-900 dark:text-white">
                                                        {reservation.nomClient}
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-300">
                                                        {reservation.produit}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold text-red-600 dark:text-red-400">
                                                        {(reservation.prixUnitaire * reservation.quantite).toFixed(2)}€
                                                    </p>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                                        {reservation.quantite} unité(s)
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                                            <span>📅</span>
                                            <span>
                                                Réservé le {new Date(reservation.dateCreation).toLocaleDateString('fr-FR')}
                                            </span>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                    <div className="flex items-start space-x-2">
                                        <span className="text-yellow-600 dark:text-yellow-400">💡</span>
                                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                            Conseil : Pensez plutôt à marquer comme "Annulée" si vous souhaitez conserver un historique.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50">
                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={onClose}
                                        className="px-5 py-2.5 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg font-medium transition-colors"
                                    >
                                        Annuler
                                    </button>
                                    <button
                                        onClick={handleConfirm}
                                        className="px-5 py-2.5 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-lg font-medium hover:from-red-700 hover:to-pink-700 transition-all transform hover:-translate-y-0.5 active:scale-95"
                                    >
                                        Supprimer définitivement
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};

export default DeleteConfirmationModal;