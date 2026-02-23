import { create } from 'zustand';
import {
    type Reservation,
    ReservationStatus,
    type NewReservationData,
    type Product,
    type ReservationStats
} from '../types/reservation';
import { reservationService } from '../api/reservation.service';
import { productService } from '../api/product.service';
import { ReservationResponseDTO, ReservationStatsDTO } from '../features/reservations/types/reservation.dto';

// Mappeur pour transformer les DTO de l'API en modèles internes
const mapReservationDTO = (dto: ReservationResponseDTO): Reservation => ({
    id: dto.id,
    nomClient: dto.customerName,
    telephone: dto.customerPhone,
    email: dto.customerEmail,
    produit: dto.product.name,
    produitType: dto.product.category,
    quantite: dto.quantity,
    prixUnitaire: dto.unitPrice,
    statut: dto.status as ReservationStatus,
    dateCreation: dto.createdAt,
    dateLivraisonSouhaitee: dto.preferredDeliveryDate,
    dateConfirmation: dto.confirmedAt,
    notes: dto.notes,
    source: dto.source as any
});

interface Action {
    type: 'create' | 'update' | 'delete' | 'error';
    reservationId?: string;
    details: string;
    timestamp: number;
}

interface ReservationStore {
    reservations: Reservation[];
    products: Product[];
    stats: ReservationStats | null;
    recentActions: Action[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchReservations: () => Promise<void>;
    fetchProducts: () => Promise<void>;
    fetchStats: () => Promise<void>;

    addReservation: (data: NewReservationData) => Promise<Reservation>;
    createReservationFromClient: (data: NewReservationData) => Promise<Reservation>;
    updateReservationStatus: (id: string, newStatus: ReservationStatus) => Promise<void>;
    deleteReservation: (id: string) => Promise<void>;

    clearOldActions: () => void;
    addAction: (action: Omit<Action, 'timestamp'>) => void;

    // Selectors
    getProductById: (id: string) => Product | undefined;
}

export const useReservationStore = create<ReservationStore>((set, get) => ({
    reservations: [],
    products: [],
    stats: null,
    recentActions: [],
    isLoading: false,
    error: null,

    addAction: (action) => {
        set((state) => ({
            recentActions: [
                { ...action, timestamp: Date.now() },
                ...state.recentActions
            ].slice(0, 10) // Guardar solo las últimas 10
        }));
    },

    clearOldActions: () => {
        set({ recentActions: [] });
    },

    fetchReservations: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await reservationService.getAllReservations();
            set({
                reservations: response.data.map(mapReservationDTO),
                isLoading: false
            });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },

    fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await productService.getProducts();
            set({
                products: response.data, // Assumant que le backend retourne le bon format Product
                isLoading: false
            });
        } catch (err: any) {
            set({ error: err.message, isLoading: false });
        }
    },

    fetchStats: async () => {
        try {
            const response = await reservationService.getReservationStats();
            // Transformer Stats DTO en internal ReservationStats si nécessaire
            const dto = response.data;
            const stats: ReservationStats = {
                total: dto.total,
                parStatut: {
                    [ReservationStatus.PENDING]: dto.pending,
                    [ReservationStatus.CONFIRMED]: dto.confirmed,
                    [ReservationStatus.CANCELLED]: dto.cancelled,
                    [ReservationStatus.DELIVERED]: dto.delivered,
                },
                chiffreAffaires: dto.totalRevenue.toString(),
                produitLePlusPopulaire: dto.topProducts[0]?.productName || 'Aucun',
                quantiteTotale: dto.total, // ou une autre logique
                enAttenteAujourdhui: dto.pending // simple approximation
            };
            set({ stats });
        } catch (err: any) {
            console.error("Erreur lors de la récupération des statistiques", err);
        }
    },

    addReservation: async (data: NewReservationData) => {
        set({ isLoading: true });
        try {
            const product = get().products.find(p => p.id === data.productId);
            const response = await reservationService.createReservation({
                customerName: data.nomClient,
                customerPhone: data.telephone,
                customerEmail: data.email,
                productId: data.productId || '',
                quantity: data.quantite,
                productPrice: product?.price || 0,
                productName: data.produit,
                productCategory: data.produitType,
                source: 'ADMIN',
                notes: data.notes,
                preferredDeliveryDate: data.dateLivraisonSouhaitee
            });
            const newRes = mapReservationDTO(response.data);
            set((state) => ({
                reservations: [newRes, ...state.reservations],
                isLoading: false
            }));

            get().addAction({
                type: 'create',
                reservationId: newRes.id,
                details: `Nouvelle réservation pour ${newRes.nomClient}`
            });

            return newRes;
        } catch (err: any) {
            set({ isLoading: false });
            get().addAction({
                type: 'error',
                details: `Erreur lors de la création: ${err.message}`
            });
            throw err;
        }
    },

    createReservationFromClient: async (data: NewReservationData) => {
        set({ isLoading: true });
        try {
            const product = get().products.find(p => p.id === data.productId);
            const response = await reservationService.createReservation({
                customerName: data.nomClient,
                customerPhone: data.telephone,
                customerEmail: data.email,
                productId: data.productId || '',
                quantity: data.quantite,
                productPrice: product?.price || 0,
                productName: product?.name || data.produit,
                productCategory: product?.category || data.produitType,
                source: 'DIRECT',
                notes: data.notes,
                preferredDeliveryDate: data.dateLivraisonSouhaitee
            });
            const newRes = mapReservationDTO(response.data);
            set((state) => ({
                reservations: [newRes, ...state.reservations],
                isLoading: false
            }));

            // On ne notifie pas forcément les erreurs côté client ici
            // mais on pourrait enregistrer l'action
            get().addAction({
                type: 'create',
                reservationId: newRes.id,
                details: `Réservation client: ${newRes.nomClient}`
            });

            return newRes;
        } catch (err: any) {
            set({ isLoading: false, error: err.message });
            throw err;
        }
    },

    updateReservationStatus: async (id, newStatus) => {
        try {
            await reservationService.updateReservationStatus(id, { status: newStatus });
            // Rafraîchir localement ou refetch
            set((state) => ({
                reservations: state.reservations.map((res) =>
                    res.id === id ? { ...res, statut: newStatus } : res
                )
            }));

            const res = get().reservations.find(r => r.id === id);
            get().addAction({
                type: 'update',
                reservationId: id,
                details: `Statut mis à jour pour ${res?.nomClient || id}`
            });
        } catch (err: any) {
            console.error("Erreur lors de la mise à jour du statut", err);
            get().addAction({
                type: 'error',
                details: `Erreur mise à jour statut: ${err.message}`
            });
            throw err;
        }
    },

    deleteReservation: async (id) => {
        // Le backend ne semble pas avoir de DELETE d'après la liste utilisateur, 
        // mais on peut appeler update status CANCELLED par exemple.
        // On va rester sur ce qui est fourni.
        console.warn("DELETE non implémenté côté backend d'après la description.");
    },

    getProductById: (id: string) => {
        return get().products.find(p => p.id === id);
    }
}));

// Hook pour les stats - utilise maintenant l'état du store alimenté par l'API
export const useReservationStats = (): ReservationStats => {
    const stats = useReservationStore(state => state.stats);

    if (stats) return stats;

    // Valeurs par défaut si non chargé
    return {
        total: 0,
        parStatut: {},
        chiffreAffaires: '0',
        produitLePlusPopulaire: '...',
        quantiteTotale: 0,
        enAttenteAujourdhui: 0
    };
};
