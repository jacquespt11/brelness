import { create } from 'zustand';
import {
    type Reservation,
    ReservationStatus,
    type NewReservationData,
    type Product,
    type ReservationStats
} from '../types/reservation';
import { v4 as uuidv4 } from 'uuid';

// Mock data pour les produits (source de vérité unique)
export const MOCK_PRODUCTS: Product[] = [
    { id: 'prod_1', name: 'Crème Hydratante', description: 'Soin visage jour', price: 45.90, category: 'soin_visage', stock: 50 },
    { id: 'prod_2', name: 'Sérum Anti-âge', description: 'Concentré régénérant', price: 89.99, category: 'soin_visage', stock: 30 },
    { id: 'prod_3', name: 'Rouge à Lèvres', description: 'Mat longue tenue', price: 32.50, category: 'maquillage', stock: 100 },
    { id: 'prod_4', name: 'Parfum Élégance', description: 'Fragrance florale', price: 120.00, category: 'parfum', stock: 25 },
    { id: 'prod_5', name: 'Gel Douche Relaxant', description: 'Soin corps aux huiles essentielles', price: 28.75, category: 'soin_corps', stock: 75 },
    { id: 'prod_6', name: 'Shampoing Revitalisant', description: 'Pour cheveux abîmés', price: 35.00, category: 'soin_cheveux', stock: 40 },
];

// Interface du store - source de vérité unique
interface ReservationStore {
    reservations: Reservation[];
    recentActions: Array<{
        type: 'create' | 'update' | 'delete';
        reservationId: string;
        timestamp: number;
        details: string;
    }>;
    products: Product[]; // Ajouté pour corriger l'erreur TypeScript

    // Actions - implémentation des User Stories
    addReservation: (data: NewReservationData) => Promise<Reservation>;
    createReservationFromClient: (data: NewReservationData) => Promise<Reservation>;
    updateReservationStatus: (id: string, newStatus: ReservationStatus) => Promise<void>;
    deleteReservation: (id: string) => Promise<void>;
    clearOldActions: () => void;

    // Getters/Selectors pour les statistiques (US-05, US-06)
    getProductById: (id: string) => Product | undefined;
    getPopularProducts: (limit?: number) => Product[];
    getReservationsByStatus: (status: ReservationStatus) => Reservation[];

    // IMPORTANT: getStats() n'est PAS dans le store - utiliser le hook useReservationStats
}

export const useReservationStore = create<ReservationStore>((set, get) => ({
    reservations: [
        // Données initiales pour démonstration (US-02)
        {
            id: 'RES-ABC123',
            nomClient: 'Marie Dubois',
            telephone: '0612345678',
            email: 'marie@example.com',
            produit: 'Crème Hydratante',
            produitType: 'soin_visage',
            quantite: 2,
            prixUnitaire: 45.90,
            statut: ReservationStatus.CONFIRMED,
            dateCreation: '2024-01-15T10:30:00Z',
            source: 'online'
        },
        {
            id: 'RES-DEF456',
            nomClient: 'Sophie Martin',
            telephone: '0698765432',
            email: 'sophie@example.com',
            produit: 'Sérum Anti-âge',
            produitType: 'soin_visage',
            quantite: 1,
            prixUnitaire: 89.99,
            statut: ReservationStatus.PENDING,
            dateCreation: '2024-01-16T14:20:00Z',
            source: 'telephone'
        },
        {
            id: 'RES-GHI789',
            nomClient: 'Julie Bernard',
            telephone: '0623456789',
            email: 'julie@example.com',
            produit: 'Rouge à Lèvres',
            produitType: 'maquillage',
            quantite: 3,
            prixUnitaire: 32.50,
            statut: ReservationStatus.DELIVERED,
            dateCreation: '2024-01-14T09:15:00Z',
            source: 'boutique'
        }
    ],
    recentActions: [],
    products: MOCK_PRODUCTS, // Initialisation ajoutée

    // US-01: Créer une réservation
    addReservation: async (data) => {
        const newReservation: Reservation = {
            id: `RES-${uuidv4().slice(0, 8)}`,
            nomClient: data.nomClient.trim(),
            telephone: data.telephone.replace(/\s/g, ''),
            email: data.email.trim(),
            produit: data.produit.trim(),
            produitType: data.produitType,
            quantite: data.quantite,
            prixUnitaire: data.produitType === 'soin_visage' ? 45.90 :
                data.produitType === 'parfum' ? 89.99 :
                    data.produitType === 'maquillage' ? 32.50 :
                        data.produitType === 'soin_corps' ? 28.75 :
                            data.produitType === 'soin_cheveux' ? 35.00 : 24.50,
            statut: ReservationStatus.PENDING, // Statut par défaut
            dateCreation: new Date().toISOString(),
            dateLivraisonSouhaitee: data.dateLivraisonSouhaitee,
            notes: data.notes?.trim(),
            source: 'admin'
        };

        set((state) => ({
            reservations: [newReservation, ...state.reservations], // Ajout en tête
            recentActions: [
                {
                    type: 'create',
                    reservationId: newReservation.id,
                    timestamp: Date.now(),
                    details: `Nouvelle réservation: ${newReservation.nomClient}`
                },
                ...state.recentActions.slice(0, 4)
            ]
        }));

        return newReservation;
    },

    // US-C03: Créer une réservation depuis le client
    createReservationFromClient: async (data: NewReservationData) => {
        const newReservation: Reservation = {
            id: `WEB-${uuidv4().slice(0, 8)}`,
            nomClient: data.nomClient.trim(),
            telephone: data.telephone.replace(/\s/g, ''),
            email: data.email.trim(),
            produit: data.produit || 'Produit Inconnu',
            produitType: data.produitType || 'autre',
            quantite: data.quantite,
            prixUnitaire: 0,
            statut: ReservationStatus.PENDING, // Toujours en attente quand créé par client
            dateCreation: new Date().toISOString(),
            source: 'client_web'
        };

        // Si productId est fourni, on récupère les infos du produit
        if (data.productId) {
            const product = get().products.find(p => p.id === data.productId);
            if (product) {
                newReservation.produit = product.name;
                newReservation.prixUnitaire = product.price;
                newReservation.produitType = product.category;
            }
        }

        set((state) => ({
            reservations: [newReservation, ...state.reservations],
            recentActions: [
                {
                    type: 'create',
                    reservationId: newReservation.id,
                    timestamp: Date.now(),
                    details: `Nouvelle commande web: ${newReservation.nomClient}`
                },
                ...state.recentActions.slice(0, 4)
            ]
        }));

        return newReservation;
    },

    // US-03: Modifier le statut d'une réservation
    updateReservationStatus: async (id, newStatus) => {
        const reservation = get().reservations.find(r => r.id === id);
        if (!reservation) return;
        const oldStatus = reservation.statut;

        set((state) => ({
            reservations: state.reservations.map((res) =>
                res.id === id
                    ? {
                        ...res,
                        statut: newStatus,
                        dateConfirmation: newStatus === ReservationStatus.CONFIRMED
                            ? new Date().toISOString()
                            : res.dateConfirmation
                    }
                    : res
            ),
            recentActions: [
                {
                    type: 'update',
                    reservationId: id,
                    timestamp: Date.now(),
                    details: `Statut changé: ${oldStatus} → ${newStatus}`
                },
                ...state.recentActions.slice(0, 4)
            ]
        }));
    },

    // US-04: Supprimer une réservation
    deleteReservation: async (id) => {
        const reservation = get().reservations.find(r => r.id === id);
        if (!reservation) return;

        set((state) => ({
            reservations: state.reservations.filter((res) => res.id !== id),
            recentActions: [
                {
                    type: 'delete',
                    reservationId: id,
                    timestamp: Date.now(),
                    details: `Suppression: ${reservation.nomClient}`
                },
                ...state.recentActions.slice(0, 4)
            ]
        }));
    },

    clearOldActions: () => {
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000;
        set((state) => ({
            recentActions: state.recentActions.filter(action => action.timestamp > fiveMinutesAgo)
        }));
    },

    getProductById: (id: string) => {
        return get().products.find(p => p.id === id);
    },

    getPopularProducts: (limit = 3) => {
        return get().products.slice(0, limit);
    },

    getReservationsByStatus: (status: ReservationStatus) => {
        return get().reservations.filter(r => r.statut === status);
    }
}));

// Hook personnalisé pour les statistiques (US-05, US-06)
export const useReservationStats = (): ReservationStats => {
    const reservations = useReservationStore(state => state.reservations);

    const total = reservations.length;

    // Nombre de réservations par statut
    const parStatut = reservations.reduce((acc, curr) => {
        acc[curr.statut] = (acc[curr.statut] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    // Initialiser tous les statuts à 0 si non présents
    Object.values(ReservationStatus).forEach(status => {
        if (!parStatut[status]) parStatut[status] = 0;
    });

    // Chiffre d'affaires (réservations non annulées)
    const chiffreAffaires = reservations
        .filter(r => r.statut !== ReservationStatus.CANCELLED)
        .reduce((sum, r) => sum + (r.prixUnitaire * r.quantite), 0)
        .toFixed(2);

    // US-06: Produit le plus populaire
    const productCounts = reservations.reduce((acc, curr) => {
        acc[curr.produit] = (acc[curr.produit] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const popularProduct = Object.entries(productCounts).sort((a, b) => b[1] - a[1])[0];

    const quantiteTotale = reservations.reduce((sum, r) => sum + r.quantite, 0);

    // En attente aujourd'hui
    const enAttenteAujourdhui = reservations.filter(r => r.statut === ReservationStatus.PENDING).length;

    return {
        total,
        parStatut,
        chiffreAffaires: parseFloat(chiffreAffaires).toString(),
        produitLePlusPopulaire: popularProduct ? popularProduct[0] : 'Aucun',
        quantiteTotale,
        enAttenteAujourdhui
    };
};