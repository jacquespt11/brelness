// src/features/home/pages/HomePage.tsx
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Smartphone, Tablet, Monitor, ChevronDown } from 'lucide-react';
import { useTheme } from '@/core/contexts';
import { useReservationStore, useReservationStats } from '@/features/reservations/store/reservationStore';
import { ProductCard } from '@/features/products/components';
import { HeroSection, StatsPreview, FeatureGrid } from '@/features/home/components';
import { Logo, Button } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants/routes';

/**
 * Home Page
 * Main landing page with hero, stats, products preview, and features
 */
export function HomePage() {
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();
    const [showSplash, setShowSplash] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const products = useReservationStore((state) => state.products);
    const stats = useReservationStats();

    // Initial loading simulation
    useEffect(() => {
        const timer = setTimeout(() => setShowSplash(false), 2000);
        const loadingTimer = setTimeout(() => setIsLoading(false), 500);

        return () => {
            clearTimeout(timer);
            clearTimeout(loadingTimer);
        };
    }, []);

    // Close mobile menu on resize
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768 && isMenuOpen) {
                setIsMenuOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isMenuOpen]);

    const handleProductClick = (productId: string) => {
        navigate(`/reserve/${productId}`);
        setIsMenuOpen(false);
    };

    // Splash screen
    if (showSplash) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-900 dark:to-gray-800 p-4">
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{
                        type: 'spring',
                        stiffness: 200,
                        damping: 15,
                    }}
                    className="text-center w-full max-w-xs sm:max-w-sm md:max-w-md"
                >
                    <Logo size="lg" animated={true} />

                    <motion.h1
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="mt-4 sm:mt-6 text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent px-4"
                    >
                        Cosmetic Reservations
                    </motion.h1>

                    <motion.p
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="mt-2 text-sm sm:text-base text-gray-600 dark:text-gray-400 px-4"
                    >
                        Votre beauté, notre priorité
                    </motion.p>

                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ delay: 0.8, duration: 1 }}
                        className="mt-6 sm:mt-8 h-1 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full mx-auto w-32 sm:w-48 md:w-64"
                    />

                    {/* Responsive indicator */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2 }}
                        className="mt-6 sm:mt-8 flex justify-center items-center space-x-4 text-xs sm:text-sm text-gray-500 dark:text-gray-400"
                    >
                        <div className="flex items-center">
                            <Smartphone className="w-4 h-4 mr-1" />
                            <span>Mobile</span>
                        </div>
                        <div className="flex items-center">
                            <Tablet className="w-4 h-4 mr-1" />
                            <span>Tablette</span>
                        </div>
                        <div className="flex items-center">
                            <Monitor className="w-4 h-4 mr-1" />
                            <span>Desktop</span>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        );
    }

    // Main page
    return (
        <AnimatePresence>
            {!isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="min-h-screen bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800"
                >
                    {/* Header */}
                    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/95 dark:bg-gray-900/95 border-b border-gray-200/50 dark:border-gray-700/50">
                        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
                            <div className="flex items-center justify-between h-14 sm:h-16 lg:h-20">
                                {/* Logo */}
                                <motion.div
                                    initial={{ x: -20, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    className="flex items-center space-x-2 sm:space-x-3"
                                >
                                    <Logo size="sm" animated={false} showText />
                                </motion.div>

                                {/* Actions */}
                                <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
                                    {/* Mobile menu button */}
                                    <motion.button
                                        whileTap={{ scale: 0.95 }}
                                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                                        className="lg:hidden p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        {isMenuOpen ? (
                                            <X className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        ) : (
                                            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                                        )}
                                    </motion.button>

                                    {/* Desktop navigation */}
                                    <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
                                        <Link
                                            to={ROUTES.HOME}
                                            className="text-sm xl:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative group"
                                        >
                                            Accueil
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300" />
                                        </Link>
                                        <Link
                                            to={ROUTES.CATALOG}
                                            className="text-sm xl:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative group"
                                        >
                                            Catalogue
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300" />
                                        </Link>
                                        <Link
                                            to={ROUTES.ADD_RESERVATION}
                                            className="text-sm xl:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors relative group"
                                        >
                                            Nouvelle Réservation
                                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 group-hover:w-full transition-all duration-300" />
                                        </Link>
                                        <Link
                                            to={ROUTES.ADMIN}
                                            className="flex items-center space-x-1 text-sm xl:text-base font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 transition-colors"
                                        >
                                            <span>🛡️</span>
                                            <span>Admin</span>
                                        </Link>
                                    </nav>

                                    {/* Theme toggle */}
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        onClick={toggleTheme}
                                        className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <span className="text-base sm:text-lg">
                                            {theme === 'light' ? '🌙' : '☀️'}
                                        </span>
                                    </motion.button>

                                    {/* CTA buttons */}
                                    <Link to={ROUTES.ADD_RESERVATION} className="lg:hidden">
                                        <Button variant="primary" size="sm">
                                            Réserver
                                        </Button>
                                    </Link>

                                    <Link to={ROUTES.ADD_RESERVATION} className="hidden lg:block">
                                        <Button variant="primary">Nouvelle Réservation</Button>
                                    </Link>
                                </div>
                            </div>

                            {/* Mobile menu dropdown */}
                            <AnimatePresence>
                                {isMenuOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2 }}
                                        className="lg:hidden overflow-hidden"
                                    >
                                        <div className="py-4 border-t border-gray-200 dark:border-gray-700">
                                            <div className="flex flex-col space-y-3">
                                                <Link
                                                    to={ROUTES.HOME}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-xl">🏠</span>
                                                        <span className="font-medium">Accueil</span>
                                                    </div>
                                                </Link>
                                                <Link
                                                    to={ROUTES.CATALOG}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-xl">💄</span>
                                                        <span className="font-medium">Catalogue</span>
                                                    </div>
                                                    <span className="text-sm text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">
                                                        {products.length} produits
                                                    </span>
                                                </Link>
                                                <Link
                                                    to={ROUTES.ADD_RESERVATION}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-xl">➕</span>
                                                        <span className="font-medium">Nouvelle réservation</span>
                                                    </div>
                                                </Link>
                                                <Link
                                                    to={ROUTES.ADMIN}
                                                    onClick={() => setIsMenuOpen(false)}
                                                    className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <span className="text-xl">🛡️</span>
                                                        <span className="font-medium">Espace admin</span>
                                                    </div>
                                                    <span className="text-sm text-gray-500">
                                                        {stats.total} réservations
                                                    </span>
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </header>

                    {/* Main content */}
                    <main className="relative overflow-hidden">
                        {/* Hero section */}
                        <HeroSection
                            title="Gérez vos réservations"
                            highlight="simplement & efficacement"
                            subtitle="Plateforme tout-en-un pour la gestion de réservations de produits cosmétiques"
                        />

                        {/* Stats */}
                        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
                            <StatsPreview stats={stats} />
                        </div>

                        {/* Products preview */}
                        <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-b from-white to-gray-50 dark:from-gray-800 dark:to-gray-900">
                            <div className="container mx-auto px-3 sm:px-4 lg:px-6">
                                <motion.div
                                    initial={{ y: 30, opacity: 0 }}
                                    whileInView={{ y: 0, opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="text-center mb-8 sm:mb-12"
                                >
                                    <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4 px-2">
                                        Nos produits{' '}
                                        <span className="text-purple-600 dark:text-purple-400">
                                            phares
                                        </span>
                                    </h2>
                                    <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
                                        Découvrez notre sélection exclusive de produits cosmétiques
                                        premium
                                    </p>
                                </motion.div>

                                {/* Products grid */}
                                <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
                                    {products.slice(0, 4).map((product, index) => (
                                        <motion.div
                                            key={product.id}
                                            initial={{ y: 50, opacity: 0 }}
                                            whileInView={{ y: 0, opacity: 1 }}
                                            viewport={{ once: true }}
                                            transition={{ delay: index * 0.1 }}
                                            className="h-full"
                                        >
                                            <ProductCard
                                                product={product}
                                                onClick={() => handleProductClick(product.id)}
                                            />
                                        </motion.div>
                                    ))}
                                </div>

                                {/* View all button */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    whileInView={{ opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="text-center mt-8 sm:mt-12"
                                >
                                    <Link to={ROUTES.CATALOG}>
                                        <Button variant="primary" size="lg">
                                            Voir tous les produits →
                                        </Button>
                                    </Link>
                                </motion.div>
                            </div>
                        </section>

                        {/* Features grid */}
                        <FeatureGrid />

                        {/* Shareable link section */}
                        <section className="py-8 sm:py-12 lg:py-16 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-purple-500/10 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-purple-900/20">
                            <div className="container mx-auto px-3 sm:px-4 lg:px-6">
                                <motion.div
                                    initial={{ scale: 0.95, opacity: 0 }}
                                    whileInView={{ scale: 1, opacity: 1 }}
                                    viewport={{ once: true }}
                                    className="max-w-3xl mx-auto bg-white dark:bg-gray-800 rounded-xl sm:rounded-2xl shadow-lg sm:shadow-2xl overflow-hidden"
                                >
                                    <div className="p-5 sm:p-6 lg:p-8 xl:p-10">
                                        <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
                                            <div className="p-3 bg-purple-100 dark:bg-purple-900 rounded-xl flex-shrink-0">
                                                <span className="text-2xl">🔗</span>
                                            </div>
                                            <div className="text-center sm:text-left">
                                                <h3 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                                    Partagez avec vos clients
                                                </h3>
                                                <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                                                    Un lien unique pour des réservations simplifiées
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4 sm:space-y-6">
                                            <div className="p-3 sm:p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                                                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                                    <code className="text-xs sm:text-sm md:text-base text-gray-800 dark:text-gray-200 break-all font-mono px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded">
                                                        {window.location.origin}/reserve
                                                    </code>
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        onClick={() =>
                                                            navigator.clipboard.writeText(
                                                                `${window.location.origin}/reserve`
                                                            )
                                                        }
                                                    >
                                                        📋 Copier
                                                    </Button>
                                                </div>
                                            </div>

                                            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                                <a
                                                    href="/reserve"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1"
                                                >
                                                    <Button variant="primary" fullWidth>
                                                        👀 Voir la page client
                                                    </Button>
                                                </a>
                                                <a
                                                    href={`https://wa.me/?text=${encodeURIComponent(
                                                        `Réservez vos produits cosmétiques ici : ${window.location.origin}/reserve`
                                                    )}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex-1"
                                                >
                                                    <Button variant="outline" fullWidth>
                                                        💬 Partager sur WhatsApp
                                                    </Button>
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            </div>
                        </section>
                    </main>

                    {/* Footer */}
                    <footer className="bg-gray-900 text-gray-300 py-8 sm:py-12">
                        <div className="container mx-auto px-3 sm:px-4 lg:px-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                                {/* Logo and description */}
                                <div>
                                    <div className="flex items-center space-x-2 sm:space-x-3 mb-4">
                                        <Logo size="sm" animated={false} />
                                        <span className="text-lg sm:text-xl font-bold text-white">
                                            Cosmetic Reservations
                                        </span>
                                    </div>
                                    <p className="text-gray-400 text-sm sm:text-base mb-4">
                                        Simplifiez la gestion de vos réservations de produits
                                        cosmétiques avec notre plateforme intuitive.
                                    </p>
                                </div>

                                {/* Quick links */}
                                <div>
                                    <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                                        Navigation
                                    </h4>
                                    <ul className="space-y-2 sm:space-y-3">
                                        <li>
                                            <Link
                                                to={ROUTES.HOME}
                                                className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                                            >
                                                Accueil
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to={ROUTES.CATALOG}
                                                className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                                            >
                                                Catalogue produits
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to={ROUTES.ADD_RESERVATION}
                                                className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                                            >
                                                Nouvelle réservation
                                            </Link>
                                        </li>
                                        <li>
                                            <Link
                                                to={ROUTES.ADMIN}
                                                className="text-gray-400 hover:text-white transition-colors text-sm sm:text-base"
                                            >
                                                Espace administrateur
                                            </Link>
                                        </li>
                                    </ul>
                                </div>

                                {/* Contact */}
                                <div>
                                    <h4 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">
                                        Contact
                                    </h4>
                                    <ul className="space-y-2 sm:space-y-3">
                                        <li className="flex items-start space-x-2">
                                            <span className="mt-1">📞</span>
                                            <span className="text-sm sm:text-base">
                                                +243 812 356 789
                                            </span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="mt-1">✉️</span>
                                            <span className="text-sm sm:text-base">
                                                contact@cosmetic-reservations.com
                                            </span>
                                        </li>
                                        <li className="flex items-start space-x-2">
                                            <span className="mt-1">🏢</span>
                                            <span className="text-sm sm:text-base">Paris, France</span>
                                        </li>
                                    </ul>
                                </div>
                            </div>

                            {/* Copyright */}
                            <div className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-800 text-center">
                                <p className="text-gray-400 text-sm sm:text-base">
                                    © {new Date().getFullYear()} Cosmetic Reservations. Tous droits
                                    réservés.
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 mt-2">
                                    Conçu avec ❤️ pour les professionnels de la beauté
                                </p>
                            </div>
                        </div>
                    </footer>
                </motion.div>
            )}
        </AnimatePresence>
    );
}

export default HomePage;
