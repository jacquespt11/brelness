// src/features/reservations/components/ReservationForm/PersonalInfoStep.tsx

import { motion } from 'framer-motion';
import { User, Phone, Mail } from 'lucide-react';
import type { CreateReservationData } from '../../types/reservation.types';

interface PersonalInfoStepProps {
    formData: CreateReservationData;
    errors: Record<string, string>;
    onChange: (name: keyof CreateReservationData, value: string) => void;
}

export function PersonalInfoStep({ formData, errors, onChange }: PersonalInfoStepProps) {
    return (
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-6"
        >
            <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/30 rounded-lg text-purple-600 dark:text-purple-400">
                    <User size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Informations client
                </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {/* Nom complet */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Nom complet *
                    </label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={formData.customerName}
                            onChange={(e) => onChange('customerName', e.target.value)}
                            placeholder="Marie Dupont"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:text-white transition-all"
                        />
                    </div>
                    {errors.customerName && <p className="text-red-500 text-xs mt-1">{errors.customerName}</p>}
                </div>

                {/* Téléphone */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Téléphone *
                    </label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="tel"
                            value={formData.customerPhone}
                            onChange={(e) => onChange('customerPhone', e.target.value)}
                            placeholder="06 12 34 56 78"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:text-white transition-all"
                        />
                    </div>
                    {errors.customerPhone && <p className="text-red-500 text-xs mt-1">{errors.customerPhone}</p>}
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Email
                    </label>
                    <div className="relative">
                        <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="email"
                            value={formData.customerEmail}
                            onChange={(e) => onChange('customerEmail', e.target.value)}
                            placeholder="marie@exemple.com"
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:text-white transition-all"
                        />
                    </div>
                    {errors.customerEmail && <p className="text-red-500 text-xs mt-1">{errors.customerEmail}</p>}
                </div>
            </div>
        </motion.div>
    );
}