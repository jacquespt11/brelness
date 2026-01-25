import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';
import Logo from '../components/ui/Logo';
import ReservationForm from '../components/ReservationForm';
import { ArrowLeft, Sparkles, Clock, CheckCircle, Shield } from 'lucide-react';

/**
 * Page de création de réservation avec interface moderne et intuitive
 * 
 * Cette page permet aux administrateurs de créer manuellement des réservations
 * avec un formulaire complet et des animations engageantes.
 */
const AddReservation = () => {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useTheme();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);

    // Effet pour gérer les touches clavier (Echap pour retour)
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                navigate(-1);
            }
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [navigate]);

    // Animation de confirmation
    const handleSuccessfulSubmit = () => {
        setIsSubmitting(true);
        setTimeout(() => {
            setShowConfirmation(true);
            setIsSubmitting(false);

            // Redirection automatique après confirmation
            setTimeout(() => {
                navigate('/home');
            }, 2000);
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Header moderne avec navigation */}
            <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        {/* Logo avec retour */}
                        <div className="flex items-center space-x-4">
                            <motion.button
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                onClick={() => navigate(-1)}
                                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors group"
                                whileHover={{ x: -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ArrowLeft className="w-5 h-5 group-hover:stroke-purple-500 transition-colors" />
                                <span className="font-medium">Retour</span>
                            </motion.button>

                            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />

                            <Logo size="md" animated={false} showText={true} />
                        </div>

                        {/* Titre de la page */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="hidden md:block text-center"
                        >
                            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                Nouvelle Réservation
                            </h1>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                Créez une réservation pour un client
                            </p>
                        </motion.div>

                        {/* Actions */}
                        <div className="flex items-center space-x-4">
                            {/* Bouton thème */}
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={toggleTheme}
                                className="relative p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
                                aria-label={theme === 'light' ? 'Activer le mode sombre' : 'Activer le mode clair'}
                            >
                                <span className="text-lg">{theme === 'light' ? '🌙' : '☀️'}</span>
                                <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                                    {theme === 'light' ? 'Mode sombre' : 'Mode clair'}
                                </span>
                            </motion.button>

                        </div>
                    </div>

                    {/* Navigation mobile */}
                    <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex justify-between items-center">
                            <div className="text-center flex-1">
                                <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                                    Nouvelle Réservation
                                </h1>
                            </div>

                        </div>
                    </div>
                </div>
            </header>

            <main className="py-8 lg:py-12">
                <div className="container mx-auto px-4 lg:px-8">
                    <AnimatePresence mode="wait">
                        {isSubmitting ? (
                            <motion.div
                                key="loading"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto"
                            >
                                <div className="w-16 h-16 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mb-6" />
                                <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                                    Traitement de votre réservation
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    Veuillez patienter quelques instants...
                                </p>
                            </motion.div>
                        ) : showConfirmation ? (
                            // Confirmation de succès
                            <motion.div
                                key="confirmation"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="max-w-2xl mx-auto"
                            >
                                <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-gray-800 dark:to-gray-900 rounded-2xl shadow-2xl overflow-hidden border border-green-200 dark:border-green-800/30">
                                    <div className="p-8 lg:p-12 text-center">
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{
                                                type: "spring",
                                                stiffness: 200,
                                                damping: 15,
                                                delay: 0.2
                                            }}
                                            className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6 shadow-lg"
                                        >
                                            <CheckCircle className="w-10 h-10 text-white" />
                                        </motion.div>

                                        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                                            Réservation créée avec succès !
                                        </h2>

                                        <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-md mx-auto">
                                            La réservation a été enregistrée et apparaîtra dans votre tableau de bord.
                                            Vous serez redirigé automatiquement.
                                        </p>

                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 2, ease: "easeInOut" }}
                                            className="h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full mb-6"
                                        />

                                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                            <button
                                                onClick={() => navigate('/admin')}
                                                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-medium rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all"
                                            >
                                                Voir le tableau de bord
                                            </button>
                                            <button
                                                onClick={() => setShowConfirmation(false)}
                                                className="px-6 py-3 border-2 border-green-600 text-green-600 dark:text-green-400 dark:border-green-400 font-medium rounded-lg hover:bg-green-50 dark:hover:bg-green-900/20 transition-all"
                                            >
                                                Créer une autre réservation
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ) : (
                            // Formulaire principal
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="max-w-4xl mx-auto"
                            >
                                {/* En-tête amélioré */}
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-8 lg:mb-12"
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                                        <div>
                                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-2">
                                                Créer une nouvelle <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">réservation</span>
                                            </h1>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Remplissez les informations ci-dessous pour créer une réservation manuelle
                                            </p>
                                        </div>

                                        <div className="flex items-center space-x-4">
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                className="hidden lg:flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-purple-500/10 to-pink-500/10 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg border border-purple-200 dark:border-purple-800"
                                            >
                                                <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                <span className="text-sm text-purple-700 dark:text-purple-300">
                                                    ~2 minutes à remplir
                                                </span>
                                            </motion.div>

                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800"
                                            >
                                                <Shield className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                                                <span className="text-sm text-blue-700 dark:text-blue-300">
                                                    Données sécurisées
                                                </span>
                                            </motion.div>
                                        </div>
                                    </div>

                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                        className="h-1 bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500 rounded-full mt-4"
                                    />
                                </motion.div>

                                {/* Indicateur de progression */}
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.3 }}
                                    className="mb-8"
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                            Progression du formulaire
                                        </span>
                                        <span className="text-sm font-bold text-purple-600 dark:text-purple-400">
                                            100%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: "100%" }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            className="h-full bg-gradient-to-r from-purple-600 to-pink-600"
                                        />
                                    </div>
                                </motion.div>

                                {/* Contenu principal */}
                                <div className="grid lg:grid-cols-3 gap-8">
                                    {/* Formulaire */}
                                    <div className="lg:col-span-2">
                                        <motion.div
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.2 }}
                                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
                                        >
                                            <div className="p-6 lg:p-8">
                                                <div className="flex items-center space-x-3 mb-6">
                                                    <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                                                        <Sparkles className="w-5 h-5 text-white" />
                                                    </div>
                                                    <div>
                                                        <h2 className="text-xl font-bold text-gray-800 dark:text-white">
                                                            Informations de réservation
                                                        </h2>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            Tous les champs marqués d'un * sont obligatoires
                                                        </p>
                                                    </div>
                                                </div>

                                                <ReservationForm onSuccess={handleSuccessfulSubmit} />
                                            </div>
                                        </motion.div>
                                    </div>

                                    {/* Sidebar avec informations */}
                                    <div className="space-y-6">
                                        {/* Carte d'aide */}
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.3 }}
                                            className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-2xl p-6 border border-blue-200 dark:border-blue-800"
                                        >
                                            <div className="flex items-start space-x-3 mb-4">
                                                <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                    <span className="text-xl">💡</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-bold text-gray-800 dark:text-white mb-1">
                                                        Conseil rapide
                                                    </h3>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Vérifiez bien le numéro de téléphone pour faciliter le contact.
                                                    </p>
                                                </div>
                                            </div>

                                            <ul className="space-y-3">
                                                <li className="flex items-center text-sm">
                                                    <div className="w-6 h-6 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mr-2">
                                                        <span className="text-green-600 dark:text-green-400 text-xs">✓</span>
                                                    </div>
                                                    <span className="text-gray-700 dark:text-gray-300">Numéro à 10 chiffres</span>
                                                </li>
                                                <li className="flex items-center text-sm">
                                                    <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mr-2">
                                                        <span className="text-blue-600 dark:text-blue-400 text-xs">!</span>
                                                    </div>
                                                    <span className="text-gray-700 dark:text-gray-300">Email pour confirmation</span>
                                                </li>
                                                <li className="flex items-center text-sm">
                                                    <div className="w-6 h-6 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mr-2">
                                                        <span className="text-purple-600 dark:text-purple-400 text-xs">⏱</span>
                                                    </div>
                                                    <span className="text-gray-700 dark:text-gray-300">Livraison sous 48h</span>
                                                </li>
                                            </ul>
                                        </motion.div>

                                        {/* Carte de contact */}
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.4 }}
                                            className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl p-6 border border-purple-200 dark:border-purple-800"
                                        >
                                            <h3 className="font-bold text-gray-800 dark:text-white mb-4">
                                                Besoin d'aide ?
                                            </h3>

                                            <div className="space-y-4">
                                                <a
                                                    href="tel:+33123456789"
                                                    className="flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 bg-green-100 dark:bg-green-900/30 rounded-lg">
                                                            <span className="text-green-600 dark:text-green-400">📞</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-800 dark:text-white">Appeler le support</p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">+33 1 23 45 67 89</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-gray-400">→</span>
                                                </a>

                                                <button
                                                    onClick={() => navigate('/catalog')}
                                                    className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow"
                                                >
                                                    <div className="flex items-center space-x-3">
                                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                                            <span className="text-blue-600 dark:text-blue-400">💄</span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-800 dark:text-white">Voir le catalogue</p>
                                                            <p className="text-sm text-gray-600 dark:text-gray-400">Tous nos produits</p>
                                                        </div>
                                                    </div>
                                                    <span className="text-gray-400">→</span>
                                                </button>
                                            </div>
                                        </motion.div>

                                        {/* Carte statistiques */}
                                        <motion.div
                                            initial={{ opacity: 0, x: 20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 }}
                                            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-700"
                                        >
                                            <h3 className="font-bold text-gray-800 dark:text-white mb-4">
                                                Vos réservations
                                            </h3>

                                            <div className="space-y-3">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600 dark:text-gray-400">Aujourd'hui</span>
                                                    <span className="font-bold text-purple-600 dark:text-purple-400">12</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600 dark:text-gray-400">Cette semaine</span>
                                                    <span className="font-bold text-pink-600 dark:text-pink-400">47</span>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-gray-600 dark:text-gray-400">Taux de confirmation</span>
                                                    <span className="font-bold text-green-600 dark:text-green-400">89%</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Footer léger */}
            <footer className="mt-12 py-6 border-t border-gray-200 dark:border-gray-700">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
                        <div className="text-gray-500 dark:text-gray-400 text-sm">
                            © {new Date().getFullYear()} Cosmetic Reservations. Tous droits réservés.
                        </div>
                        <div className="flex items-center space-x-6">
                            <Link to="/privacy" className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 transition-colors">
                                Confidentialité
                            </Link>
                            <Link to="/terms" className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 transition-colors">
                                Conditions
                            </Link>
                            <Link to="/help" className="text-sm text-gray-500 dark:text-gray-400 hover:text-purple-600 transition-colors">
                                Aide
                            </Link>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default AddReservation;