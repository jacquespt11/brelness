// src/features/admin/components/ReservationTable/index.tsx
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Reservation } from '@/features/reservations/types/reservation.types';
import { StatusBadge } from '../StatusBadge';
import { DeleteConfirmationModal } from '../DeleteConfirmationModal';
import { ActionNotifications } from '../ActionNotifications';
import { Phone, Mail, ShoppingBag, MessageSquare, Trash2, Globe, User } from 'lucide-react';

interface ReservationTableProps {
    reservations: Reservation[];
    onStatusChange: (id: string, status: string) => void;
    onDelete: (id: string) => void;
}

/**
 * Animated reservation table for admin management
 */
export function ReservationTable({
    reservations,
    onStatusChange,
    onDelete
}: ReservationTableProps) {
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

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 15 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="relative">
            <ActionNotifications />

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="space-y-4"
            >
                {reservations.map((reservation) => (
                    <motion.div
                        key={reservation.id}
                        variants={itemVariants}
                        layout
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow group"
                    >
                        <div className="p-5 lg:p-6">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                                {/* Customer Info */}
                                <div className="flex-1 min-w-0 space-y-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                                            <User size={20} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900 dark:text-white truncate text-lg">
                                                {reservation.customerName}
                                            </h3>
                                            <div className="flex items-center space-x-2 text-xs text-gray-500 uppercase font-bold tracking-wider mt-0.5">
                                                <Globe size={12} className="text-gray-400" />
                                                <span>{reservation.source}</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="grid sm:grid-cols-2 gap-4 pt-1">
                                        <div className="flex items-center space-x-3 text-sm">
                                            <div className="p-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                <Phone size={14} className="text-gray-500" />
                                            </div>
                                            <a
                                                href={`tel:${reservation.customerPhone}`}
                                                className="text-purple-600 dark:text-purple-400 hover:underline font-medium"
                                            >
                                                {reservation.customerPhone}
                                            </a>
                                        </div>
                                        {reservation.customerEmail && (
                                            <div className="flex items-center space-x-3 text-sm">
                                                <div className="p-1.5 bg-gray-50 dark:bg-gray-700 rounded-lg">
                                                    <Mail size={14} className="text-gray-500" />
                                                </div>
                                                <span className="text-gray-600 dark:text-gray-400 truncate">
                                                    {reservation.customerEmail}
                                                </span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex items-start space-x-3 pt-2">
                                        <div className="p-1.5 bg-pink-50 dark:bg-pink-900/30 rounded-lg flex-shrink-0">
                                            <ShoppingBag size={14} className="text-pink-600 dark:text-pink-400" />
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-800 dark:text-gray-200">
                                                {reservation.productName}
                                            </p>
                                            <p className="text-sm text-gray-500">
                                                Quantité: <span className="font-bold text-gray-700 dark:text-gray-300">{reservation.quantity}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Status & Actions */}
                                <div className="lg:w-64 flex flex-col items-end space-y-4 pt-4 lg:pt-0 border-t lg:border-t-0 border-gray-100 dark:border-gray-700">
                                    <div className="flex flex-col items-end w-full">
                                        <StatusBadge
                                            status={reservation.status}
                                            onStatusChange={(newStatus) => onStatusChange(reservation.id, newStatus)}
                                            isEditable={true}
                                        />
                                        <div className="mt-2 text-2xl font-black text-gray-900 dark:text-white">
                                            {reservation.totalPrice.toFixed(2)}€
                                        </div>
                                    </div>

                                    <div className="flex items-center justify-between w-full lg:justify-end gap-4">
                                        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                                            {formatDate(reservation.createdAt)}
                                        </span>
                                        <div className="flex space-x-2">
                                            <button
                                                onClick={() => handleDeleteClick(reservation)}
                                                className="p-2.5 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                                                title="Supprimer"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                            <a
                                                href={`https://wa.me/${reservation.customerPhone.replace(/[\s+]/g, '')}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="p-2.5 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-xl transition-all"
                                                title="WhatsApp"
                                            >
                                                <MessageSquare size={18} />
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Timeline Visualizer */}
                            {reservation.preferredDeliveryDate && (
                                <div className="mt-6 pt-4 border-t border-gray-50 dark:border-gray-700">
                                    <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-gray-400 mb-2">
                                        <span>Enregistrée</span>
                                        <span>Livraison souhaitée ({new Date(reservation.preferredDeliveryDate).toLocaleDateString()})</span>
                                    </div>
                                    <div className="relative h-1.5 bg-gray-100 dark:bg-gray-700/50 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: '45%' }}
                                            transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
                                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                                        />
                                    </div>
                                </div>
                            )}
                        </div>
                    </motion.div>
                ))}
            </motion.div>

            <DeleteConfirmationModal
                isOpen={isDeleteModalOpen}
                onClose={() => setIsDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                reservation={deletingReservation}
            />
        </div>
    );
}

export default ReservationTable;
