import { motion } from 'framer-motion';

interface Category {
    id: string;
    label: string;
    icon: string;
}

interface CategoryFilterProps {
    categories: Category[];
    selectedCategory: string;
    onSelectCategory: (categoryId: string) => void;
}

const CategoryFilter = ({
    categories,
    selectedCategory,
    onSelectCategory
}: CategoryFilterProps) => {
    return (
        <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
                <motion.button
                    key={category.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onSelectCategory(category.id)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-all ${selectedCategory === category.id
                        ? 'bg-purple-600 text-white border-purple-600'
                        : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-purple-400'
                        }`}
                >
                    <span>{category.icon}</span>
                    <span className="font-medium">{category.label}</span>
                </motion.button>
            ))}
        </div>
    );
};

export default CategoryFilter;