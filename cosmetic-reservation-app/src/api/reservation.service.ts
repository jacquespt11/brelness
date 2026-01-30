// src/api/reservation.service.ts
import { api } from './axios.config';
import {
    ReservationDTO,
    UpdateReservationDTO,
    ReservationStatus
} from '../features/reservations/types/reservation.types';

export const reservationService = {
    // Client routes
    createReservation: (data: ReservationDTO) =>
        api.post('/reservations', data),

    getProductReservations: (productId: string) =>
        api.get(`/reservations/product/${productId}`),

    // Admin routes
    getAllReservations: (params?: {
        status?: ReservationStatus;
        page?: number;
        limit?: number;
    }) => api.get('/admin/reservations', { params }),

    getReservationById: (id: string) =>
        api.get(`/admin/reservations/${id}`),

    updateReservationStatus: (id: string, data: UpdateReservationDTO) =>
        api.patch(`/admin/reservations/${id}/status`, data),

    deleteReservation: (id: string) =>
        api.delete(`/admin/reservations/${id}`),

    getReservationStats: () =>
        api.get('/admin/reservations/stats'),
};