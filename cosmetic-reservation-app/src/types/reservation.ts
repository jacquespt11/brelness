// src/types/reservation.ts
export interface Reservation {
    id: number;
    productName: string;
    productType: string;
    quantity: number;
    customerName: string;
    customerEmail: string;
    deliveryDate: string;
    notes: string;
    status: string;
    createdAt: string;
}