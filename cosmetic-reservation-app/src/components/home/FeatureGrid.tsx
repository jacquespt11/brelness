import React from 'react';
import { motion, type Variants } from 'framer-motion';
import { Link } from 'react-router-dom';

/**
 * Composant FeatureGrid - Grille de fonctionnalités principales
 * 
 * Affiche les principales fonctionnalités de l'application de manière visuelle
 * et engageante. Chaque carte présente une fonctionnalité clé avec une icône,
 * un titre, une description et un appel à l'action.
 * 
 * @component
 * @example
 * return (
 *   <FeatureGrid />
 * )
 */
const FeatureGrid: React.FC = () => {
    // Configuration des fonctionnalités à afficher
    const features = [
        {
            id: 1,
            title: 'Gestion Intelligente',
            description: 'Suivez et gérez toutes vos réservations depuis un tableau de bord unique et intuitif.',
            icon: '📊',
            color: 'from-blue-500 to-cyan-500',
            darkColor: 'from-blue-600 to-cyan-600',
            path: '/admin',
            cta: 'Voir le dashboard'
        },
        {
            id: 2,
            title: 'Catalogue Digital',
            description: 'Présentez vos produits avec des fiches détaillées, photos et disponibilité en temps réel.',
            icon: '💄',
            color: 'from-purple-500 to-pink-500',
            darkColor: 'from-purple-600 to-pink-600',
            path: '/catalog',
            cta: 'Explorer le catalogue'
        },
        {
            id: 3,
            title: 'Réservation Client',
            description: 'Permettez à vos clients de réserver directement via un lien simple, sans inscription.',
            icon: '📱',
            color: 'from-green-500 to-emerald-500',
            darkColor: 'from-green-600 to-emerald-600',
            path: '/reserve',
            cta: 'Voir la page client'
        },
        {
            id: 4,
            title: 'Statistiques Avancées',
            description: 'Analysez vos performances avec des rapports détaillés et des indicateurs clés.',
            icon: '📈',
            color: 'from-orange-500 to-amber-500',
            darkColor: 'from-orange-600 to-amber-600',
            path: '/admin',
            cta: 'Voir les statistiques'
        },
        {
            id: 5,
            title: 'Notifications Automatisées',
            description: 'Recevez des alertes pour les nouvelles réservations et les mises à jour importantes.',
            icon: '🔔',
            color: 'from-red-500 to-rose-500',
            darkColor: 'from-red-600 to-rose-600',
            path: '/admin',
            cta: 'Configurer les notifications'
        },
        {
            id: 6,
            title: 'Gestion Multi-Canaux',
            description: 'Centralisez les réservations venant de votre site, réseaux sociaux et boutique physique.',
            icon: '🔄',
            color: 'from-indigo-500 to-violet-500',
            darkColor: 'from-indigo-600 to-violet-600',
            path: '/admin',
            cta: 'Gérer les canaux'
        }
    ];

    // Configuration des animations
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants: Variants = {
        hidden: {
            y: 30,
            opacity: 0,
            scale: 0.95
        },
        visible: {
            y: 0,
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15
            }
        },
        hover: {
            y: -8,
            transition: {
                type: "spring",
                stiffness: 400,
                damping: 15
            }
        }
    };

    return (
        <section className="py-20 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
            <div className="container mx-auto px-4 lg:px-8">
                {/* En-tête de section avec animation */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <div className="inline-flex items-center justify-center mb-4">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                            <span className="text-2xl">✨</span>
                        </div>
                    </div>

                    <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-4">
                        Des fonctionnalités <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">puissantes</span>
                    </h2>

                    <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-8">
                        Découvrez comment notre plateforme transforme votre gestion de réservations
                        avec des outils conçus pour les professionnels de la beauté
                    </p>

                    <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full"></div>
                </motion.div>

                {/* Grille des fonctionnalités */}
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                >
                    {features.map((feature) => (
                        <motion.div
                            key={feature.id}
                            variants={itemVariants}
                            whileHover="hover"
                            className="group relative"
                        >
                            {/* Effet de fond décoratif */}
                            <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>

                            {/* Carte de fonctionnalité */}
                            <div className="relative h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-2xl transition-all duration-300">
                                {/* En-tête de carte avec dégradé */}
                                <div
                                    className={`h-2 bg-gradient-to-r ${feature.color} dark:${feature.darkColor}`}
                                ></div>

                                <div className="p-6">
                                    {/* Icône et titre */}
                                    <div className="flex items-start mb-4">
                                        <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} dark:${feature.darkColor} shadow-md mr-4`}>
                                            <span className="text-2xl">{feature.icon}</span>
                                        </div>

                                        <div className="flex-1">
                                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">
                                                {feature.title}
                                            </h3>

                                            {/* Indicateur de statut */}
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

                                    {/* Points clés */}
                                    <ul className="space-y-2 mb-6">
                                        {['Automatisé', 'Temps réel', 'Sans code'].map((point, idx) => (
                                            <li key={idx} className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                                                <span className="mr-2 text-green-500">✓</span>
                                                {point}
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Appel à l'action */}
                                    <Link
                                        to={feature.path}
                                        className={`inline-flex items-center justify-center w-full px-4 py-3 rounded-lg bg-gradient-to-r ${feature.color} dark:${feature.darkColor} text-white font-medium hover:shadow-lg transition-all transform hover:-translate-y-0.5`}
                                    >
                                        <span>{feature.cta}</span>
                                        <svg
                                            className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                            xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M14 5l7 7m0 0l-7 7m7-7H3"
                                            ></path>
                                        </svg>
                                    </Link>
                                </div>

                                {/* Indicateur d'accessibilité (mobile/desktop) */}
                                <div className="absolute top-4 right-4 flex items-center space-x-1">
                                    <span className="text-gray-400 text-xs">📱</span>
                                    <span className="text-gray-400 text-xs">💻</span>
                                </div>
                            </div>

                            {/* Effet de lueur au survol */}
                            <div className="absolute -z-10 inset-0 bg-gradient-to-r from-purple-500/20 to-pink-500/20 dark:from-purple-700/20 dark:to-pink-700/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                        </motion.div>
                    ))}
                </motion.div>

                {/* Section complémentaire */}
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

                        <Link
                            to="/add"
                            className="ml-4 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl"
                        >
                            Essayer gratuitement
                        </Link>
                    </div>
                </motion.div>

                {/* Chiffres clés */}
                <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.7 }}
                    className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
                >
                    {[
                        { value: '100+', label: 'Produits gérés', icon: '📦' },
                        { value: '24/7', label: 'Disponibilité', icon: '⏰' },
                        { value: '99%', label: 'Satisfaction', icon: '⭐' },
                        { value: '0', label: 'Code requis', icon: '👨‍💻' }
                    ].map((stat, index) => (
                        <div
                            key={index}
                            className="text-center p-6 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:bg-white dark:hover:bg-gray-800 transition-colors"
                        >
                            <div className="text-3xl mb-2">{stat.icon}</div>
                            <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">
                                {stat.value}
                            </div>
                            <div className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                                {stat.label}
                            </div>
                        </div>
                    ))}
                </motion.div>
            </div>

            {/* Éléments décoratifs */}
            <div className="absolute top-1/4 left-0 w-64 h-64 bg-purple-300/10 dark:bg-purple-700/10 rounded-full blur-3xl -translate-x-1/2"></div>
            <div className="absolute bottom-1/4 right-0 w-96 h-96 bg-pink-300/10 dark:bg-pink-700/10 rounded-full blur-3xl translate-x-1/2"></div>
        </section>
    );
};

export default FeatureGrid;