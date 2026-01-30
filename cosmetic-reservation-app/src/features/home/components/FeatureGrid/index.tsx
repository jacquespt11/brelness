// src/features/home/components/FeatureGrid/index.tsx
import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Card, CardBody, Button } from '@/shared/components/ui';
import { ROUTES } from '@/shared/constants/routes';

const features = [
    {
        id: 1,
        title: 'Gestion Intelligente',
        description:
            'Suivez et gérez toutes vos réservations depuis un tableau de bord unique et intuitif.',
        icon: '📊',
        color: 'from-blue-500 to-cyan-500',
        path: ROUTES.ADMIN,
        cta: 'Voir le dashboard',
    },
    {
        id: 2,
        title: 'Catalogue Digital',
        description:
            'Présentez vos produits avec des fiches détaillées, photos et disponibilité en temps réel.',
        icon: '💄',
        color: 'from-purple-500 to-pink-500',
        path: ROUTES.CATALOG,
        cta: 'Explorer le catalogue',
    },
    {
        id: 3,
        title: 'Réservation Client',
        description:
            'Permettez à vos clients de réserver directement via un lien simple, sans inscription.',
        icon: '📱',
        color: 'from-green-500 to-emerald-500',
        path: ROUTES.RESERVE,
        cta: 'Voir la page client',
    },
    {
        id: 4,
        title: 'Statistiques Avancées',
        description:
            'Analysez vos performances avec des rapports détaillés et des indicateurs clés.',
        icon: '📈',
        color: 'from-orange-500 to-amber-500',
        path: ROUTES.ADMIN,
        cta: 'Voir les statistiques',
    },
    {
        id: 5,
        title: 'Notifications Automatisées',
        description:
            'Recevez des alertes pour les nouvelles réservations et les mises à jour importantes.',
        icon: '🔔',
        color: 'from-red-500 to-rose-500',
        path: ROUTES.ADMIN,
        cta: 'Configurer',
    },
    {
        id: 6,
        title: 'Gestion Multi-Canaux',
        description:
            'Centralisez les réservations venant de votre site, réseaux sociaux et boutique physique.',
        icon: '🔄',
        color: 'from-indigo-500 to-violet-500',
        path: ROUTES.ADMIN,
        cta: 'Gérer les canaux',
    },
];

const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
        },
    },
};

const itemVariants: Variants = {
    hidden: {
        y: 30,
        opacity: 0,
        scale: 0.95,
    },
    visible: {
        y: 0,
        opacity: 1,
        scale: 1,
        transition: {
            type: 'spring',
            stiffness: 100,
            damping: 15,
        },
    },
};

/**
 * Feature Grid Component
 * Display main features of the application
 */
export function FeatureGrid() {
    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8">
                {/* Section header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-100px' }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                            <span className="text-2xl">✨</span>
                        </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-4">
                        Des fonctionnalités{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                            puissantes
                        </span>
                    </h2>

                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                        Découvrez comment notre plateforme transforme votre gestion de
                        réservations
                    </p>

                    <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
                </motion.div>

                {/* Features grid */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    {features.map((feature) => (
                        <motion.div
                            key={feature.id}
                            variants={itemVariants}
                            whileHover={{ y: -8 }}
                            className="group relative"
                        >
                            {/* Decorative background effect */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

                            {/* Feature card */}
                            <Card variant="elevated" className="h-full">
                                {/* Header gradient */}
                                <div
                                    className={`h-2 bg-gradient-to-r ${feature.color}`}
                                ></div>

                                <CardBody>
                                    {/* Icon and title */}
                                    <div className="flex items-start mb-4">
                                        <div
                                            className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-md mr-4`}
                                        >
                                            <span className="text-2xl">{feature.icon}</span>
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                                {feature.title}
                                            </h3>

                                            {/* Status indicator */}
                                            <div className="inline-flex items-center px-3 py-1 rounded-full bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-xs font-medium">
                                                <div className="w-2 h-2 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                                                Disponible
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                                        {feature.description}
                                    </p>

                                    {/* Key points */}
                                    <ul className="space-y-2 mb-6">
                                        {['Automatisé', 'Temps réel', 'Sans code'].map(
                                            (point, idx) => (
                                                <li
                                                    key={idx}
                                                    className="flex items-center text-sm text-gray-500 dark:text-gray-400"
                                                >
                                                    <span className="mr-2 text-green-500">✓</span>
                                                    {point}
                                                </li>
                                            )
                                        )}
                                    </ul>

                                    {/* CTA */}
                                    <Link to={feature.path} className="block">
                                        <Button variant="primary" fullWidth>
                                            {feature.cta} →
                                        </Button>
                                    </Link>
                                </CardBody>

                                {/* Accessibility indicators */}
                                <div className="absolute top-4 right-4 flex items-center space-x-1">
                                    <span className="text-gray-400 text-xs">📱</span>
                                    <span className="text-gray-400 text-xs">💻</span>
                                </div>
                            </Card>
                        </motion.div>
                    ))}
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.5 }}
                    className="mt-16 text-center"
                >
                    <div className="inline-flex items-center space-x-4 px-6 py-4 bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700">
                        <div className="p-3 bg-gradient-to-r from-blue-100 to-cyan-100 dark:from-blue-900/30 dark:to-cyan-900/30 rounded-xl">
                            <span className="text-2xl">🚀</span>
                        </div>

                        <div className="text-left">
                            <h4 className="font-bold text-gray-800 dark:text-white">
                                Prêt à transformer votre activité ?
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Commencez gratuitement, aucune carte de crédit requise
                            </p>
                        </div>

                        <Link to={ROUTES.ADD_RESERVATION}>
                            <Button variant="primary">Essayer gratuitement</Button>
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    );
}

export default FeatureGrid;
