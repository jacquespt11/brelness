// src/components/home/HeroSection.tsx
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface HeroSectionProps {
    stats: any;
}

const HeroSection = ({ stats }: HeroSectionProps) => {
    return (
        <section className="relative pt-12 pb-24 lg:pt-20 lg:pb-32 overflow-hidden">
            {/* Background avec effet gradient animé */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 via-pink-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" />

            {/* Effets décoratifs */}
            <div className="absolute top-0 left-0 w-64 h-64 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />

            <div className="relative container mx-auto px-4 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-12 items-center">
                    {/* Texte principal */}
                    <motion.div
                        initial={{ x: -50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                        className="text-center lg:text-left"
                    >
                        <motion.h1
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6"
                        >
                            Réservez vos produits{' '}
                            <span className="text-purple-600">
                                cosmétiques
                            </span>
                        </motion.h1>

                        <motion.p
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-2xl"
                        >
                            Gestion complète de vos réservations, suivi en temps réel, et expérience client optimisée.
                        </motion.p>

                        <motion.div
                            initial={{ y: 30, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 0.6 }}
                            className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
                        >
                            <Link
                                to="/add"
                                className="px-8 py-4 bg-purple-600 text-white font-bold rounded-full hover:bg-purple-700 transition-all transform hover:-translate-y-1 shadow-xl hover:shadow-2xl text-lg"
                            >
                                Commencer maintenant
                            </Link>

                            <Link
                                to="/catalog"
                                className="px-8 py-4 border-2 border-purple-600 text-purple-600 dark:text-purple-400 dark:border-purple-400 font-bold rounded-full hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-all"
                            >
                                Voir le catalogue
                            </Link>
                        </motion.div>
                    </motion.div>

                    {/* Illustration/Stats */}
                    <motion.div
                        initial={{ x: 50, opacity: 0 }}
                        animate={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                        className="relative"
                    >
                        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20 dark:border-gray-700/20">
                            <div className="grid grid-cols-2 gap-6">
                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-purple-100 dark:bg-purple-900/30 p-6 rounded-2xl text-center"
                                >
                                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                                        {stats?.total || 0}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-300">
                                        Réservations
                                    </div>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-blue-100 dark:bg-blue-900/30 p-6 rounded-2xl text-center"
                                >
                                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                                        {stats?.enAttente || 0}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-300">
                                        En attente
                                    </div>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-green-100 dark:bg-green-900/30 p-6 rounded-2xl text-center"
                                >
                                    <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                                        {stats?.confirmees || 0}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-300">
                                        Confirmées
                                    </div>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.05 }}
                                    className="bg-orange-100 dark:bg-orange-900/30 p-6 rounded-2xl text-center"
                                >
                                    <div className="text-3xl font-bold text-orange-600 dark:text-orange-400 mb-2">
                                        {stats?.chiffreAffaires ? `${stats.chiffreAffaires}€` : '0€'}
                                    </div>
                                    <div className="text-gray-600 dark:text-gray-gray">
                                        Chiffre d'affaires
                                    </div>
                                </motion.div>
                            </div>

                            <div className="mt-8 p-4 bg-purple-500/10 rounded-xl">
                                <p className="text-center text-gray-600 dark:text-gray-300">
                                    <span className="font-semibold">✨ Plateforme tout-en-un</span> pour la gestion de vos réservations cosmétiques
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default HeroSection;