// src/pages/Home.jsx
import React from 'react';
import { useTheme } from '../contexts/ThemeContext';

/**
 * Page d'accueil de l'application de réservation cosmétique
 * Affiche un message de bienvenue avec options de navigation
 */
const Home = () => {
    const { theme, toggleTheme } = useTheme();

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
            {/* En-tête avec navigation */}
            <header className="container mx-auto px-4 py-6">
                <div className="flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-purple-800 dark:text-purple-300">
                        💄 Cosmetic Reservations
                    </h1>

                    {/* Bouton de bascule du thème */}
                    <button
                        onClick={toggleTheme}
                        className="p-3 rounded-full bg-white dark:bg-gray-700 shadow-lg hover:shadow-xl transition-shadow"
                        aria-label={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
                    >
                        {theme === 'light' ? '🌙' : '☀️'}
                    </button>
                </div>

                <nav className="mt-8">
                    <ul className="flex space-x-6">
                        <li>
                            <a href="/" className="text-purple-700 dark:text-purple-300 font-semibold border-b-2 border-purple-500 pb-1">
                                Accueil
                            </a>
                        </li>
                        <li>
                            <a href="/add" className="text-gray-600 dark:text-gray-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                                Nouvelle Réservation
                            </a>
                        </li>

                        <li>
                            <a href="/admin" className="text-gray-600 dark:text-gray-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors">
                                🛡️ Admin
                            </a>
                        </li>
                    </ul>
                </nav>
            </header>

            {/* Contenu principal */}
            <main className="container mx-auto px-4 py-12">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-5xl font-bold text-gray-800 dark:text-white mb-6">
                        Réservez vos produits cosmétiques
                        <span className="block text-4xl text-purple-600 dark:text-purple-400 mt-2">
                            en toute simplicité
                        </span>
                    </h2>

                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
                        Gérez vos réservations de produits cosmétiques, suivez les disponibilités
                        et organisez vos livraisons avec notre plateforme intuitive.
                    </p>

                    {/* Cartes de fonctionnalités */}
                    <div className="grid md:grid-cols-3 gap-8 mt-16">
                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-4xl mb-4">📋</div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                                Gestion complète
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Créez, modifiez et suivez toutes vos réservations en temps réel
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-4xl mb-4">✨</div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                                Produits premium
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Accédez à notre catalogue exclusif de produits cosmétiques de qualité
                            </p>
                        </div>

                        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                            <div className="text-4xl mb-4">🚚</div>
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">
                                Livraison flexible
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                                Choisissez votre créneau de livraison selon vos disponibilités
                            </p>
                        </div>
                    </div>

                    {/* Bouton d'action principal */}
                    <div className="mt-16">
                        <a
                            href="/add"
                            className="inline-block bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-4 px-8 rounded-full text-lg hover:from-purple-700 hover:to-pink-700 transition-all transform hover:-translate-y-1 shadow-lg hover:shadow-xl"
                        >
                            Créer une nouvelle réservation
                        </a>
                    </div>
                </div>
            </main>

            {/* Pied de page */}
            <footer className="mt-20 py-8 border-t border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 text-center">
                    <p className="text-gray-600 dark:text-gray-400">
                        © 2025 Reservations de produit Cosmetic. Tous droits réservés.
                    </p>
                </div>
            </footer>
        </div>
    );
};

export default Home;