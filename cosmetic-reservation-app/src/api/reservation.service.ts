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

    getReservationById: (id: string) =>
        api.get<ReservationResponseDTO>(`/reservations/${id}`),

    // Admin routes
    getAllReservations: (params?: ReservationQueryDTO) =>
        api.get<ReservationResponseDTO[]>('/reservations', { params }),

    updateReservationStatus: (id: string, data: UpdateReservationDTO) =>
        api.patch<ReservationResponseDTO>(`/reservations/${id}`, data),

    deleteReservation: (id: string) =>
        api.delete<void>(`/reservations/${id}`),

    getReservationStats: () =>
        api.get<ReservationStatsDTO>('/reservations/stats'),
};