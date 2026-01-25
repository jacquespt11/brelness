// src/types/reservation.ts

/**
 * Type énuméré pour les statuts de réservation
 * Garantit la cohérence des données dans toute l'application
 */
export const ReservationStatus = {
    PENDING: 'en_attente',
    CONFIRMED: 'confirmee',
    CANCELLED: 'annulee',
    DELIVERED: 'livree'
} as const;

export type ReservationStatus = (typeof ReservationStatus)[keyof typeof ReservationStatus];

/**
 * Interface principale représentant une réservation
 * Source unique de vérité pour le modèle métier
 */
export interface Reservation {
    // Identifiant unique (généré côté client pour l'instant)
    id: string;

    // Informations client (métier essentiel)
    nomClient: string;
    telephone: string;
    email: string;

    // Informations produit
    produit: string;
    produitType: string;
    quantite: number;
    prixUnitaire: number;

    // État de la réservation
    statut: ReservationStatus;

    // Dates importantes (format ISO pour la manipulation)
    dateCreation: string; // ISO string
    dateLivraisonSouhaitee?: string; // ISO string (optionnelle)
    dateConfirmation?: string; // ISO string (optionnelle)

    // Métadonnées
    notes?: string;
    source: 'online' | 'telephone' | 'boutique' | 'admin' | 'client_web';
}

/**
 * Statistiques calculées à partir de la liste de réservations
 * Toujours dérivées de l'état, jamais stockées séparément
 */
export interface ReservationStats {
    total: number;
    parStatut: Record<string, number>;
    chiffreAffaires: string;
    produitLePlusPopulaire: string;
    quantiteTotale: number;
    enAttenteAujourdhui: number;
}

/**
 * Filtres pour la liste des réservations
 */
export interface ReservationFilters {
    statut?: ReservationStatus;
    dateDebut?: string;
    dateFin?: string;
    produitType?: string;
}

/**
 * Données nécessaires pour créer une nouvelle réservation
 * Validation séparée du modèle complet
 */
export interface NewReservationData {
    nomClient: string;
    telephone: string;
    email: string;
    produit: string;
    produitType: string;
    quantite: number;
    dateLivraisonSouhaitee?: string;
    notes?: string;
    productId?: string;
}

/**
 * Interface pour la structure de données des produits
 */
export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    imageUrl?: string;
    stock: number;
}

/**
 * Interface pour la structure de données des clients
 */
export interface Customer {
    id: string;
    name: string;
    email: string;
    phone: string;
}