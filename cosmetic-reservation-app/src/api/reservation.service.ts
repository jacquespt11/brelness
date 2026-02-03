// src/api/reservation.service.ts

import { api } from './axios.config';
import {
    CreateReservationDTO,
    UpdateReservationDTO,
    ReservationResponseDTO,
    ReservationStatsDTO,
    ReservationQueryDTO
} from '../features/reservations/types/reservation.dto';
import type { ReservationStatus } from '@/shared/types/common.types';

export const reservationService = {
    // Client routes
    createReservation: (data: CreateReservationDTO) =>
        api.post<ReservationResponseDTO>('/reservations', data),

    getProductReservations: (productId: string) =>
        api.get<ReservationResponseDTO[]>(`/reservations/product/${productId}`),

    // Admin routes
    getAllReservations: (params?: ReservationQueryDTO) =>
        api.get<ReservationResponseDTO[]>('/admin/reservations', { params }),

    getReservationById: (id: string) =>
        api.get<ReservationResponseDTO>(`/admin/reservations/${id}`),

    updateReservationStatus: (id: string, data: UpdateReservationDTO) =>
        api.patch<ReservationResponseDTO>(`/admin/reservations/${id}/status`, data),

    deleteReservation: (id: string) =>
        api.delete<void>(`/admin/reservations/${id}`),

    getReservationStats: () =>
        api.get<ReservationStatsDTO>('/admin/reservations/stats'),
};