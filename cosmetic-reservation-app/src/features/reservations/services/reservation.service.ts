// src/features/reservations/services/reservation.service.ts

import { apiClient, handleApiError } from '@/core/api/axios.config';
import { API_ENDPOINTS } from '@/core/api/endpoints';
import type {
    CreateReservationDTO,
    UpdateReservationDTO,
    ReservationResponseDTO,
    ReservationStatsDTO,
    ReservationQueryDTO,
} from '../types/reservation.dto';
import type { Reservation } from '../types/reservation.types';

/**
 * Reservation service
 * Handles all API calls related to reservations
 */
export const reservationService = {
    /**
     * Create a new reservation (client-facing)
     */
    create: async (data: CreateReservationDTO): Promise<Reservation> => {
        try {
            const response = await apiClient.post<ReservationResponseDTO>(
                API_ENDPOINTS.RESERVATIONS,
                data
            );
            return mapResponseToReservation(response.data);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Get all reservations (admin only)
     */
    getAll: async (query?: ReservationQueryDTO): Promise<Reservation[]> => {
        try {
            const response = await apiClient.get<ReservationResponseDTO[]>(
                API_ENDPOINTS.RESERVATIONS,
                { params: query }
            );
            return response.data.map(mapResponseToReservation);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Get a single reservation by ID
     */
    getById: async (id: string): Promise<Reservation> => {
        try {
            const response = await apiClient.get<ReservationResponseDTO>(
                API_ENDPOINTS.RESERVATION_BY_ID(id)
            );
            return mapResponseToReservation(response.data);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Update reservation status (admin only)
     */
    updateStatus: async (
        id: string,
        data: UpdateReservationDTO
    ): Promise<Reservation> => {
        try {
            const response = await apiClient.patch<ReservationResponseDTO>(
                API_ENDPOINTS.RESERVATION_BY_ID(id),
                data
            );
            return mapResponseToReservation(response.data);
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Delete a reservation (admin only)
     */
    delete: async (id: string): Promise<void> => {
        try {
            await apiClient.delete(API_ENDPOINTS.RESERVATION_BY_ID(id));
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },

    /**
     * Get reservation statistics (admin only)
     */
    getStats: async (): Promise<ReservationStatsDTO> => {
        try {
            const response = await apiClient.get<ReservationStatsDTO>(
                API_ENDPOINTS.RESERVATION_STATS
            );
            return response.data;
        } catch (error) {
            throw new Error(handleApiError(error));
        }
    },
};

/**
 * Map backend response DTO to frontend Reservation type
 */
function mapResponseToReservation(dto: ReservationResponseDTO): Reservation {
    return {
        id: dto.id,
        customerName: dto.customerName,
        customerPhone: dto.customerPhone,
        customerEmail: dto.customerEmail,
        productId: dto.product.id,
        productName: dto.product.name,
        productCategory: dto.product.category,
        productImage: dto.product.imageUrl,
        quantity: dto.quantity,
        unitPrice: dto.unitPrice,
        totalPrice: dto.totalPrice,
        status: dto.status,
        source: dto.source,
        createdAt: dto.createdAt,
        updatedAt: dto.updatedAt,
        confirmedAt: dto.confirmedAt,
        deliveredAt: dto.deliveredAt,
        preferredDeliveryDate: dto.preferredDeliveryDate,
        notes: dto.notes,
    };
}
