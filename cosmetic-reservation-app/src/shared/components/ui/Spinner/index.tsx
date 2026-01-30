// src/shared/components/ui/Spinner/index.tsx
import { cn } from '@/shared/utils/cn';

export interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
}

/**
 * Spinner Component
 * Loading spinner with different sizes
 */
export function Spinner({ size = 'md', className }: SpinnerProps) {
    const sizes = {
        sm: 'w-4 h-4 border-2',
        md: 'w-8 h-8 border-2',
        lg: 'w-12 h-12 border-3',
        xl: 'w-16 h-16 border-4',
    };

    return (
        <div
            className={cn(
                'inline-block rounded-full border-purple-600 border-t-transparent animate-spin',
                sizes[size],
                className
            )}
            role="status"
            aria-label="Chargement"
        >
            <span className="sr-only">Chargement...</span>
        </div>
    );
}

export default Spinner;
