// src/components/admin/QuickActions.tsx
import React from 'react';

interface QuickActionsProps {
    onAction: (action: string) => void;
}

/**
 * Composant d'actions rapides pour l'administrateur
 */
const QuickActions: React.FC<QuickActionsProps> = ({ onAction }) => {
    const actions = [
        {
            icon: '➕',
            label: 'Ajouter produit',
            description: 'Ajouter un nouveau produit cosmétique',
            color: 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300',
            action: 'add_product'
        },
        {
            icon: '📧',
            label: 'Envoyer email',
            description: 'Envoyer une newsletter aux clients',
            color: 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300',
            action: 'send_email'
        },
        {
            icon: '📊',
            label: 'Générer rapport',
            description: 'Créer un rapport mensuel',
            color: 'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300',
            action: 'generate_report'
        },
        {
            icon: '⚙️',
            label: 'Paramètres',
            description: 'Configurer les paramètres du site',
            color: 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300',
            action: 'settings'
        },
    ];

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                Actions rapides
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {actions.map((action) => (
                    <button
                        key={action.action}
                        onClick={() => onAction(action.action)}
                        className="flex items-start space-x-4 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-left"
                    >
                        <div className={`p-3 rounded-lg ${action.color}`}>
                            <span className="text-xl">{action.icon}</span>
                        </div>
                        <div>
                            <h3 className="font-medium text-gray-800 dark:text-white">
                                {action.label}
                            </h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                {action.description}
                            </p>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

export default QuickActions;