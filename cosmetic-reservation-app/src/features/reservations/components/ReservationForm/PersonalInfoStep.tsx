// src/features/reservations/components/ReservationForm/PersonalInfoStep.tsx
import { Input } from '@/shared/components/ui';
import { User, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';

interface PersonalInfoStepProps {
    formData: any;
    errors: Record<string, string>;
    onChange: (name: string, value: string) => void;
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
                <Input
                    label="Nom complet *"
                    icon={<User size={18} />}
                    value={formData.customerName}
                    onChange={(e) => onChange('customerName', e.target.value)}
                    error={errors.customerName}
                    placeholder="Marie Dupont"
                    required
                />

                <Input
                    label="Téléphone *"
                    icon={<Phone size={18} />}
                    type="tel"
                    value={formData.customerPhone}
                    onChange={(e) => onChange('customerPhone', e.target.value)}
                    error={errors.customerPhone}
                    placeholder="06 12 34 56 78"
                    required
                />

                <div className="md:col-span-2">
                    <Input
                        label="Email"
                        icon={<Mail size={18} />}
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) => onChange('customerEmail', e.target.value)}
                        error={errors.customerEmail}
                        placeholder="marie@exemple.com"
                    />
                </div>
            </div>
        </motion.div>
    );
}
