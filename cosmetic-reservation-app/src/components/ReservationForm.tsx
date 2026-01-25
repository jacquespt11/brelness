// src/components/ReservationForm.tsx
import { useState, type ChangeEvent, type FormEvent } from 'react';
import type { Reservation } from '../types/reservation';

interface ReservationFormProps {
    onAddReservation: (reservation: Reservation) => void;
}

/**
 * Composant formulaire pour créer une nouvelle réservation
 * Gère la saisie des informations produit et client
 */
const ReservationForm = ({ onAddReservation }: ReservationFormProps) => {
    // État initial du formulaire
    const [formData, setFormData] = useState({
        productName: '',
        productType: 'soin_visage' as const,
        quantity: 1,
        customerName: '',
        customerEmail: '',
        deliveryDate: '',
        notes: ''
    });

    // Types de produits cosmétiques disponibles
    const productTypes = [
        { value: 'soin_visage', label: 'Soin visage' },
        { value: 'maquillage', label: 'Maquillage' },
        { value: 'parfum', label: 'Parfum' },
        { value: 'soin_corps', label: 'Soin corps' },
        { value: 'cheveux', label: 'Produits cheveux' }
    ] as const;

    /**
     * Gère le changement dans les champs du formulaire
     * @param e - Événement de changement
     */
    const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) || 1 : value
        }));
    };

    /**
     * Soumet le formulaire et valide les données
     * @param e - Événement de soumission
     */
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();

        // Validation simple
        if (!formData.productName.trim() || !formData.customerName.trim() || !formData.customerEmail.trim()) {
            alert('Veuillez remplir tous les champs obligatoires');
            return;
        }

        // Crée une nouvelle réservation avec ID unique
        const newReservation: Reservation = {
            ...formData,
            id: Date.now(), // ID unique basé sur le timestamp
            status: 'en_attente',
            createdAt: new Date().toISOString()
        };

        // Passe la réservation au composant parent
        onAddReservation(newReservation);

        // Réinitialise le formulaire
        setFormData({
            productName: '',
            productType: 'soin_visage',
            quantity: 1,
            customerName: '',
            customerEmail: '',
            deliveryDate: '',
            notes: ''
        });

        alert('Réservation créée avec succès !');
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6">
                📝 Nouvelle réservation
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Section informations produit */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Informations produit
                    </h3>

                    {/* Nom du produit */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Nom du produit *
                        </label>
                        <input
                            type="text"
                            name="productName"
                            value={formData.productName}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="Ex: Crème hydratante anti-âge"
                        />
                    </div>

                    {/* Type de produit et quantité */}
                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Type de produit
                            </label>
                            <select
                                name="productType"
                                value={formData.productType}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            >
                                {productTypes.map(type => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Quantité
                            </label>
                            <input
                                type="number"
                                name="quantity"
                                min="1"
                                max="10"
                                value={formData.quantity}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                {/* Section informations client */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Informations client
                    </h3>

                    <div className="grid md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Nom complet *
                            </label>
                            <input
                                type="text"
                                name="customerName"
                                value={formData.customerName}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="Ex: Marie Dupont"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Email *
                            </label>
                            <input
                                type="email"
                                name="customerEmail"
                                value={formData.customerEmail}
                                onChange={handleChange}
                                required
                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                                placeholder="exemple@email.com"
                            />
                        </div>
                    </div>
                </div>

                {/* Section livraison */}
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                        Livraison
                    </h3>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Date de livraison souhaitée
                        </label>
                        <input
                            type="date"
                            name="deliveryDate"
                            value={formData.deliveryDate}
                            onChange={handleChange}
                            min={new Date().toISOString().split('T')[0]}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                            Notes supplémentaires
                        </label>
                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            rows={3}
                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                            placeholder="Allergies, préférences particulières..."
                        />
                    </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex justify-end space-x-4 pt-6">
                    <button
                        type="button"
                        onClick={() => setFormData({
                            productName: '',
                            productType: 'soin_visage',
                            quantity: 1,
                            customerName: '',
                            customerEmail: '',
                            deliveryDate: '',
                            notes: ''
                        })}
                        className="px-6 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                        Réinitialiser
                    </button>
                    <button
                        type="submit"
                        className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-medium hover:from-purple-700 hover:to-pink-700 transition-all transform hover:-translate-y-0.5"
                    >
                        Créer la réservation
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReservationForm;