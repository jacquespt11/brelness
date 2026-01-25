// src/components/admin/ReservationTable.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import type { Reservation, ReservationStatus } from '../../types/reservation';
import StatusBadge from './StatusBadge';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import ActionNotifications from './ActionNotifications';

interface ReservationTableProps {
    reservations: Reservation[];
    onStatusChange: (id: string, status: ReservationStatus) => void;
    onDelete: (id: string) => void;
}

/**
 * Tableau des réservations avec animations et actions
 */
const ReservationTable: React.FC<ReservationTableProps> = ({
    reservations,
    onStatusChange,
    onDelete
}) => {
    const [deletingReservation, setDeletingReservation] = useState<Reservation | null>(null);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const handleDeleteClick = (reservation: Reservation) => {
        setDeletingReservation(reservation);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = () => {
        if (deletingReservation) {
            onDelete(deletingReservation.id);
            setDeletingReservation(null);
        }
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('fr-FR', {
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getSourceIcon = (source: string) => {
        return source === 'client_web' ? '🌐' : '👩‍💼';
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <>
            <ActionNotifications />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-3"
            >
                {reservations.map((reservation) => (
                    <motion.div
                        key={reservation.id}
                        variants={itemVariants}
                        whileHover={{ scale: 1.01 }}
                        transition={{ type: "spring", stiffness: 400, damping: 25 }}
                        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden"
                    >
                        <div className="p-4">
                            <div className="flex items-start justify-between">
                                {/* Informations client */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center space-x-3 mb-2">
                                        <h3 className="font-bold text-gray-900 dark:text-white truncate">
                                            {reservation.nomClient}
                                        </h3>
                                        <span className="text-sm text-gray-500" title="Source">
                                            {getSourceIcon(reservation.source)}
                                        </span>
                                    </div>

                                    <div className="space-y-1">
                                        <div className="flex items-center space-x-2 text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">📞</span>
                                            <a
                                                href={`tel:${reservation.telephone}`}
                                                className="text-purple-600 dark:text-purple-400 hover:underline"
                                            >
                                                {reservation.telephone}
                                            </a>
                                            {reservation.email && (
                                                <>
                                                    <span className="text-gray-400">•</span>
                                                    <span className="text-gray-600 dark:text-gray-400">
                                                        {reservation.email}
                                                    </span>
                                                </>
                                            )}
                                        </div>

                                        <div className="flex items-center space-x-2 text-sm">
                                            <span className="text-gray-600 dark:text-gray-400">💄</span>
                                            <span className="font-medium text-gray-800 dark:text-gray-200">
                                                {reservation.produit}
                                            </span>
                                            <span className="text-gray-500">•</span>
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {reservation.quantite} unité(s)
                                            </span>
                                        </div>

                                        {reservation.notes && (
                                            <div className="flex items-start space-x-2 text-sm mt-2">
                                                <span className="text-gray-500 mt-0.5">📝</span>
                                                <p className="text-gray-600 dark:text-gray-400 italic">
                                                    {reservation.notes}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Actions et informations */}
                                <div className="ml-4 flex flex-col items-end space-y-3">
                                    {/* Statut et montant */}
                                    <div className="text-right">
                                        <div className="mb-2">
                                            <StatusBadge
                                                status={reservation.statut}
                                                onStatusChange={(newStatus) => onStatusChange(reservation.id, newStatus)}
                                                isEditable={true}
                                            />
                                        </div>
                                        <div className="text-lg font-bold text-gray-900 dark:text-white">
                                            {(reservation.prixUnitaire * reservation.quantite).toFixed(2)}€
                                        </div>
                                    </div>

                                    {/* Date et actions */}
                                    <div className="flex items-center space-x-2">
                                        <span className="text-xs text-gray-500 dark:text-gray-400">
                                            {formatDate(reservation.dateCreation)}
                                        </span>
                                        <div className="flex space-x-1">
                                            <button
                                                onClick={() => handleDeleteClick(reservation)}
                                                className="p-2 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                title="Supprimer"
                                            >
                                                🗑️
                                            </button>
                                            <a
                                                href={`https://wa.me/${reservation.telephone.replace('+', '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                                                title="Envoyer un message WhatsApp"
                                            >
                                                💬
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Barre de progression pour les dates */}
                        {reservation.dateLivraisonSouhaitee && (
                            <div className="px-4 pb-3">
                                <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                                    <span>Date de réservation</span>
                                    <span>Livraison souhaitée</span>
                                </div>
                                <div className="relative h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: '30%' }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="absolute top-0 left-0 h-full bg-purple-500 rounded-full"
                                    />
                                </div>
                            </div>
                        )}
                    </motion.div>
                ))}
            </motion.div>

            {/* Modal de confirmation */}
            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                reservation={deletingReservation}
            />
        </>
    );
};

export default ReservationTable;