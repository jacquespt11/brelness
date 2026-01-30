// src/features/reservations/components/ReservationForm/DeliveryInfoStep.tsx
import { Calendar, FileText } from 'lucide-react';
import { motion } from 'framer-motion';
import { Input } from '@/shared/components/ui';

interface DeliveryInfoStepProps {
    formData: any;
    errors: Record<string, string>;
    onChange: (name: string, value: string) => void;
}

export function DeliveryInfoStep({ formData, errors, onChange }: DeliveryInfoStepProps) {
    const sources = [
        { value: 'DIRECT', label: 'Direct Site' },
        { value: 'FACEBOOK', label: 'Facebook' },
        { value: 'INSTAGRAM', label: 'Instagram' },
        { value: 'WHATSAPP', label: 'WhatsApp' },
        { value: 'PHONE', label: 'Appel' },
        { value: 'STORE', label: 'Boutique' }
    ];

    return (
        <motion.div
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            className="space-y-6"
        >
            <div className="flex items-center space-x-3 mb-2">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg text-blue-600 dark:text-blue-400">
                    <Calendar size={20} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white">
                    Livraison & Source
                </h3>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Date de livraison souhaitée
                    </label>
                    <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="date"
                            value={formData.preferredDeliveryDate}
                            onChange={(e) => onChange('preferredDeliveryDate', e.target.value)}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:text-white transition-all"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                        Source de la réservation
                    </label>
                    <select
                        value={formData.source}
                        onChange={(e) => onChange('source', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:text-white transition-all"
                    >
                        {sources.map(source => (
                            <option key={source.value} value={source.value}>{source.label}</option>
                        ))}
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 flex items-center gap-2">
                        <FileText size={16} /> Notes supplémentaires
                    </label>
                    <textarea
                        value={formData.notes}
                        onChange={(e) => onChange('notes', e.target.value)}
                        rows={4}
                        placeholder="Instructions spéciales, préférences, etc..."
                        className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:text-white transition-all"
                    />
                </div>
            </div>
        </motion.div>
    );
}
