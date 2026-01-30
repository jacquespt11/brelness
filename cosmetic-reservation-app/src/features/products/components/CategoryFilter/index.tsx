// src/features/products/components/CategoryFilter/index.tsx
import { motion } from 'framer-motion';
import { cn } from '@/shared/utils/cn';

export interface Category {
    id: string;
    label: string;
    icon: string;
    count?: number;
}

interface CategoryFilterProps {
    categories: Category[];
    selectedCategory: string;
    onSelectCategory: (categoryId: string) => void;
    className?: string;
}

/**
 * Category Filter Component
 * Horizontal scrollable category filter with icons
 */
export function CategoryFilter({
    categories,
    selectedCategory,
    onSelectCategory,
    className,
}: CategoryFilterProps) {
    return (
        <div className={cn('flex flex-wrap gap-2', className)}>
            {categories.map((category) => (
                <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelectCategory(category.id)}
                    className={cn(
                        'flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all font-medium',
                        selectedCategory === category.id
                            ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                            : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-purple-400'
                    )}
                >
                    <span>{category.icon}</span>
                    <span>{category.label}</span>
                    {category.count !== undefined && (
                        <span
                            className={cn(
                                'text-xs px-1.5 py-0.5 rounded-full',
                                selectedCategory === category.id
                                    ? 'bg-white/20'
                                    : 'bg-gray-200 dark:bg-gray-600'
                            )}
                        >
                            {category.count}
                        </span>
                    )}
                </motion.button>
            ))}
        </div>
    );
}

export default CategoryFilter;
