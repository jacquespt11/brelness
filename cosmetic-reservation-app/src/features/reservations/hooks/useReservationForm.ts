// src/features/reservations/hooks/useReservationForm.ts

import { useState, useCallback } from 'react';
import type { CreateReservationData } from '../types/reservation.types';
import type { Source } from '@/shared/types/common.types';

export function useReservationForm(initialData?: Partial<CreateReservationData>) {
    const [formData, setFormData] = useState<CreateReservationData>({
        customerName: initialData?.customerName || '',
        customerPhone: initialData?.customerPhone || '',
        customerEmail: initialData?.customerEmail || '',
        productId: initialData?.productId || '',
        productName: initialData?.productName || '',
        productPrice: initialData?.productPrice || 0,
        productCategory: initialData?.productCategory || '',
        quantity: initialData?.quantity || 1,
        source: initialData?.source || 'DIRECT' as Source,
        notes: initialData?.notes || '',
        preferredDeliveryDate: initialData?.preferredDeliveryDate || '',
    });

    const [errors, setErrors] = useState<Record<string, string>>({});

    const updateField = useCallback((name: keyof CreateReservationData, value: any) => {
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when field is updated
        if (errors[name]) {
            setErrors(prev => {
                const newErrors = { ...prev };
                delete newErrors[name];
                return newErrors;
            });
        }
    }, [errors]);

    const validateStep = useCallback((step: number) => {
        const newErrors: Record<string, string> = {};

        if (step === 0) {
            if (!formData.customerName.trim()) newErrors.customerName = 'Le nom est requis';
            if (!formData.customerPhone.trim()) newErrors.customerPhone = 'Le numéro de téléphone est requis';
            else if (!/^[0-9]{10}$/.test(formData.customerPhone.replace(/\s/g, ''))) {
                newErrors.customerPhone = 'Numéro invalide (10 chiffres)';
            }
        }

        if (step === 1) {
            if (!formData.productId) {
                newErrors.productId = 'Veuillez sélectionner un produit';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    return {
        formData,
        errors,
        updateField,
        validateStep,
        setErrors,
    };
}