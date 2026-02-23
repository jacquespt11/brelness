import React from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Home, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/components/ui';

export const AccessDenied: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 text-center border border-red-100 dark:border-red-900/30"
            >
                <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
                    <ShieldAlert size={40} className="text-red-600 dark:text-red-400" />
                </div>

                <h1 className="text-3xl font-black text-gray-800 dark:text-white mb-4">
                    Accès <span className="text-red-600">Refusé</span>
                </h1>

                <p className="text-gray-600 dark:text-gray-400 mb-8 leading-relaxed">
                    Vous n'avez pas les permissions nécessaires pour accéder à cette page.
                    Si vous pensez qu'il s'agit d'une erreur, veuillez contacter votre administrateur.
                </p>

                <div className="space-y-3">
                    <Button
                        variant="primary"
                        fullWidth
                        onClick={() => navigate('/')}
                        className="bg-gradient-to-r from-red-600 to-pink-600"
                    >
                        <Home size={18} className="mr-2" /> Retour à l'accueil
                    </Button>

                    <Button
                        variant="ghost"
                        fullWidth
                        onClick={() => navigate(-1)}
                    >
                        <ArrowLeft size={18} className="mr-2" /> Page précédente
                    </Button>
                </div>
            </motion.div>
        </div>
    );
};

export default AccessDenied;
