// src/shared/components/ui/Card/index.tsx
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils/cn';

interface CardProps {
    children: React.ReactNode;
    variant?: 'default' | 'bordered' | 'elevated';
    hover?: boolean;
    className?: string;
    onClick?: () => void;
}

interface CardSectionProps {
    children: React.ReactNode;
    className?: string;
}

/**
 * Card Component
 * Container component with header, body, and footer sections
 */
export function Card({
    children,
    variant = 'default',
    hover = false,
    className,
    onClick,
}: CardProps) {
    const variants = {
        default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        bordered: 'bg-white dark:bg-gray-800 border-2 border-purple-200 dark:border-purple-800',
        elevated: 'bg-white dark:bg-gray-800 shadow-lg',
    };

    const Component = onClick ? motion.button : motion.div;

    return (
        <Component
            whileHover={hover ? { y: -4 } : undefined}
            transition={{ duration: 0.2 }}
            onClick={onClick}
            className={cn(
                'rounded-xl overflow-hidden transition-all duration-200',
                variants[variant],
                hover && 'cursor-pointer hover:shadow-xl',
                onClick && 'text-left w-full',
                className
            )}
        >
            {children}
        </Component>
    );
}

/**
 * Card Header
 */
export function CardHeader({ children, className }: CardSectionProps) {
    return (
        <div
            className={cn(
                'px-6 py-4 border-b border-gray-200 dark:border-gray-700',
                className
            )}
        >
            {children}
        </div>
    );
}

/**
 * Card Body
 */
export function CardBody({ children, className }: CardSectionProps) {
    return <div className={cn('px-6 py-4', className)}>{children}</div>;
}

/**
 * Card Footer
 */
export function CardFooter({ children, className }: CardSectionProps) {
    return (
        <div
            className={cn(
                'px-6 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50',
                className
            )}
        >
            {children}
        </div>
    );
}

export default Card;
