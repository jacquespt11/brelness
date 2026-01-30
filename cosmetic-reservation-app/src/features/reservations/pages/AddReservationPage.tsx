// src/features/reservations/pages/AddReservationPage.tsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MultiStepReservationForm } from '../components/ReservationForm';
import { Logo, Button } from '@/shared/components/ui';
import { ArrowLeft, Sparkles, Clock, CheckCircle, Shield } from 'lucide-react';
import { ROUTES } from '@/shared/constants/routes';

/**
 * AddReservationPage (Admin facing)
 * High-end multi-step form for manual reservation creation
 */
export function AddReservationPage() {
    const navigate = useNavigate();
    const [showSuccess, setShowSuccess] = useState(false);

    // Handle Escape for easy navigation back
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape') navigate(-1);
        };
        window.addEventListener('keydown', handleEscape);
        return () => window.removeEventListener('keydown', handleEscape);
    }, [navigate]);

    const handleSuccess = () => {
        setShowSuccess(true);
        // Automatic redirection to dashboard after 3 seconds
        setTimeout(() => {
            navigate(ROUTES.ADMIN);
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 shadow-sm">
                <div className="container mx-auto px-4 lg:px-8">
                    <div className="flex items-center justify-between h-16 lg:h-20">
                        <div className="flex items-center space-x-4">
                            <motion.button
                                whileHover={{ x: -5 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => navigate(-1)}
                                className="flex items-center space-x-2 text-gray-600 dark:text-gray-400 hover:text-purple-600 transition-colors group"
                            >
                                <ArrowLeft size={20} className="group-hover:stroke-purple-500" />
                                <span className="font-medium hidden sm:inline">Retour</span>
                            </motion.button>
                            <div className="h-6 w-px bg-gray-300 dark:bg-gray-600 hidden sm:block" />
                            <Logo size="md" showText={true} />
                        </div>

                        <div className="flex items-center space-x-2">
                            <div className="hidden md:flex items-center space-x-2 px-3 py-1 bg-purple-50 dark:bg-purple-900/20 rounded-full border border-purple-100 dark:border-purple-800">
                                <Shield size={14} className="text-purple-600 dark:text-purple-400" />
                                <span className="text-xs font-semibold text-purple-700 dark:text-purple-300 uppercase tracking-wider">Interface Admin</span>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="py-8 lg:py-12">
                <div className="container mx-auto px-4 lg:px-8">
                    <AnimatePresence mode="wait">
                        {showSuccess ? (
                            <motion.div
                                key="success-modal"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="max-w-2xl mx-auto text-center py-12 bg-white dark:bg-gray-800 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-700"
                            >
                                <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <CheckCircle size={40} className="text-green-600 dark:text-green-400" />
                                </div>
                                <h1 className="text-3xl font-black text-gray-800 dark:text-white mb-4">Réservation créée !</h1>
                                <p className="text-gray-600 dark:text-gray-400 mb-8 px-8">
                                    La réservation a été enregistrée avec succès. Elle apparaîtra immédiatement dans votre tableau de bord.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-4 justify-center px-8">
                                    <Button variant="primary" onClick={() => navigate(ROUTES.ADMIN)}>
                                        Tableau de bord
                                    </Button>
                                    <Button variant="ghost" onClick={() => setShowSuccess(false)}>
                                        Nouvelle réservation
                                    </Button>
                                </div>
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: "100%" }}
                                    transition={{ duration: 3 }}
                                    className="h-1 bg-green-500 absolute bottom-0 left-0"
                                />
                            </motion.div>
                        ) : (
                            <motion.div
                                key="form-container"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="max-w-4xl mx-auto"
                            >
                                <div className="grid lg:grid-cols-3 gap-8">
                                    {/* Left: Form */}
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="mb-8">
                                            <h1 className="text-3xl lg:text-4xl font-black text-gray-800 dark:text-white mb-2">
                                                Nouvelle <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Réservation</span>
                                            </h1>
                                            <p className="text-gray-600 dark:text-gray-400">
                                                Créez une réservation manuelle pour vos clients hors-ligne ou réseaux sociaux.
                                            </p>
                                        </div>

                                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-6 lg:p-8 overflow-hidden">
                                            <MultiStepReservationForm onSuccess={handleSuccess} />
                                        </div>
                                    </div>

                                    {/* Right: Sidebar Helper */}
                                    <div className="space-y-6">
                                        <div className="bg-gradient-to-br from-purple-600 to-pink-600 rounded-3xl p-6 text-white shadow-xl">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <Sparkles size={24} />
                                                <h3 className="font-bold text-xl">Interface Rapide</h3>
                                            </div>
                                            <p className="text-purple-50 text-sm mb-6 leading-relaxed">
                                                Chaque réservation créée ici est automatiquement synchronisée avec votre inventaire et vos statistiques.
                                            </p>
                                            <ul className="space-y-3">
                                                <li className="flex items-center text-sm bg-white/10 rounded-lg p-2">
                                                    <Clock size={16} className="mr-2" />
                                                    Moins de 2 mins à remplir
                                                </li>
                                                <li className="flex items-center text-sm bg-white/10 rounded-lg p-2">
                                                    <Shield size={16} className="mr-2" />
                                                    Validation des données
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="bg-white dark:bg-gray-800 rounded-3xl p-6 border border-gray-100 dark:border-gray-700 shadow-sm">
                                            <h3 className="font-bold text-gray-800 dark:text-white mb-4">Support Direct</h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                                                En cas de problème technique lors de la saisie, contactez le support technique.
                                            </p>
                                            <Button variant="ghost" fullWidth size="sm" className="justify-start">
                                                📧 technique@brelness.com
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>
        </div>
    );
}
