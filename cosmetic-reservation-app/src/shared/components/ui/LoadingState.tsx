// src/shared/components/ui/LoadingState.tsx
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
    message?: string;
    size?: 'sm' | 'md' | 'lg';
}

export function LoadingState({ message = 'Chargement...', size = 'md' }: LoadingStateProps) {
    const sizes = {
        sm: 'w-6 h-6',
        md: 'w-12 h-12',
        lg: 'w-16 h-16',
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
        >
            <Loader2 className={`${sizes[size]} text-purple-600 dark:text-purple-400 animate-spin mb-4`} />
            <p className="text-gray-600 dark:text-gray-400 font-medium">{message}</p>
        </motion.div>
    );
}

export default LoadingState;
