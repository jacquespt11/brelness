// src/shared/components/ui/ErrorState.tsx
import { motion } from 'framer-motion';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
    title?: string;
    message: string;
    onRetry?: () => void;
}

export function ErrorState({
    title = 'Une erreur est survenue',
    message,
    onRetry,
}: ErrorStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-16 px-4"
        >
            <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mb-6">
                <AlertCircle size={40} className="text-red-600 dark:text-red-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                {title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-6">
                {message}
            </p>
            {onRetry && (
                <Button
                    variant="ghost"
                    onClick={onRetry}
                    leftIcon={<RefreshCw size={18} />}
                    className="border-gray-200 dark:border-gray-700"
                >
                    Réessayer
                </Button>
            )}
        </motion.div>
    );
}

export default ErrorState;
