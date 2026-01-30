// src/features/reservations/components/ReservationSuccess/index.tsx
import { motion } from 'framer-motion';
import { Button } from '@/shared/components/ui';

interface ReservationSuccessProps {
    customerName: string;
    customerPhone: string;
    onGoBack: () => void;
}

export function ReservationSuccess({ customerName, customerPhone, onGoBack }: ReservationSuccessProps) {
    return (
        <div className="text-center py-12 px-4">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6"
            >
                <span className="text-4xl">✅</span>
            </motion.div>

            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                Réservation confirmée !
            </h2>

            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                Merci <strong>{customerName}</strong>, votre réservation a bien été prise en compte.
                Nous vous contacterons au <strong>{customerPhone}</strong> sous 24h pour finaliser.
            </p>

            <div className="space-y-4">
                <Button variant="primary" onClick={onGoBack}>
                    Retourner au catalogue
                </Button>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Vous allez être redirigé automatiquement...
                </p>
            </div>
        </div>
    );
}
