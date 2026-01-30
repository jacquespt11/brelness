// src/api/admin.service.ts
import { api } from './axios.config';

export const adminService = {
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