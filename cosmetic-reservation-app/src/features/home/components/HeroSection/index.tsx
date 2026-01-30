// src/features/home/components/HeroSection/index.tsx
import { motion } from 'framer-motion';
import { Logo } from '@/shared/components/ui';

interface HeroSectionProps {
    title: string;
    subtitle: string;
    highlight: string;
}

/**
 * Hero Section Component
 * Main landing section with title and tagline
 */
export function HeroSection({ title, subtitle, highlight }: HeroSectionProps) {
    return (
        <section className="pt-6 sm:pt-8 lg:pt-12 pb-8 sm:pb-12 lg:pb-16 px-3 sm:px-4 lg:px-6">
            <div className="container mx-auto">
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    className="text-center mb-8 sm:mb-12 lg:mb-16"
                >
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4 lg:mb-6 leading-tight">
                        {title}
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                            {highlight}
                        </span>
                    </h1>
                    <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-3 sm:px-4">
                        {subtitle}
                    </p>
                </motion.div>
            </div>
        </section>
    );
}

export default HeroSection;
