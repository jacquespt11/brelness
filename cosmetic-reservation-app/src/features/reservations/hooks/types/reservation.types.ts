// src/features/reservations/types/reservation.types.ts
export type ReservationStatus =
    | 'PENDING'
    | 'CONFIRMED'
    | 'CANCELLED'
    | 'DELIVERED';

export interface ReservationDTO {
    customerName: string;
    customerPhone: string;
    productId: string;
    quantity: number;
    source?: 'FACEBOOK' | 'INSTAGRAM' | 'WHATSAPP' | 'LINK_BIO';
}

export interface UpdateReservationDTO {
    status: ReservationStatus;
    notes?: string;
}

export interface Reservation {
    id: string;
    customerName: string;
    customerPhone: string;
    productId: string;
    productName: string;
    productImage?: string;
    quantity: number;
    status: ReservationStatus;
    source: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ReservationStats {
    total: number;
    pending: number;
    confirmed: number;
    cancelled: number;
    delivered: number;
    dailyAverage: number;
}