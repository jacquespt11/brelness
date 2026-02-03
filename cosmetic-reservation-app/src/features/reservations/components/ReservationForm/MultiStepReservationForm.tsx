// src/features/reservations/components/ReservationForm/MultiStepReservationForm.tsx

import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { Button } from '@/shared/components/ui';
import { useReservationForm } from '../../hooks/useReservationForm';
import { useReservationStore } from '../../store/reservationStore';
import { useProductStore } from '@/features/products/store/productStore';
import { PersonalInfoStep } from './PersonalInfoStep';
import { ProductSelectionStep } from './ProductSelectionStep';
import { DeliveryInfoStep } from './DeliveryInfoStep';
import { ConfirmationStep } from './ConfirmationStep';
import { Check, ChevronRight, ChevronLeft } from 'lucide-react';
import type { Product } from '@/features/products/types/product.types';
import type { CreateReservationData } from '../../types/reservation.types';

interface MultiStepReservationFormProps {
    onSuccess: () => void;
}

export function MultiStepReservationForm({ onSuccess }: MultiStepReservationFormProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

    const addReservation = useReservationStore(state => state.addReservation);
    const { products, fetchProducts } = useProductStore();

    const { formData, errors, updateField, validateStep } = useReservationForm();

    const steps = [
        { title: 'Client', icon: '👤' },
        { title: 'Produit', icon: '💄' },
        { title: 'Livraison', icon: '🚚' },
        { title: 'Confirmation', icon: '✅' }
    ];

    // Fetch products on component mount
    useEffect(() => {
        const loadProducts = async () => {
            try {
                await fetchProducts();
            } catch (error) {
                console.error('Failed to load products:', error);
            }
        };

        loadProducts();
    }, [fetchProducts]);

    // Update available products when products are loaded
    useEffect(() => {
        if (products.length > 0) {
            const activeProducts = products.filter(p => p.isActive !== false);
            setAvailableProducts(activeProducts);
        }
    }, [products]);

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
        }
    };

    const handleBack = () => {
        setCurrentStep(prev => Math.max(prev - 1, 0));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validateStep(currentStep)) return;

        setIsSubmitting(true);
        try {
            // Find selected product to get its details
            const selectedProduct = availableProducts.find(p => p.id === formData.productId);

            if (!selectedProduct) {
                throw new Error('Produit sélectionné non trouvé');
            }

            // Prepare reservation data with product details
            const reservationData: CreateReservationData = {
                ...formData,
                productName: selectedProduct.name,
                productCategory: selectedProduct.category,
                productId: selectedProduct.id,
            };

            await addReservation(reservationData);
            onSuccess();
        } catch (error) {
            console.error('Failed to create reservation:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Calculate total price for summary
    const selectedProduct = availableProducts.find(p => p.id === formData.productId);
    const price = selectedProduct?.price || 0;
    const totalPrice = price * formData.quantity;

    return (
        <div className="space-y-8">
            {/* Step Indicator */}
            <div className="relative">
                <div className="flex justify-between mb-8">
                    {steps.map((step, index) => (
                        <div key={index} className="flex flex-col items-center relative z-10">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${index <= currentStep
                                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg'
                                : 'bg-gray-200 dark:bg-gray-700 text-gray-500'
                                }`}>
                                {index < currentStep ? <Check size={20} /> : <span>{step.icon}</span>}
                            </div>
                            <span className={`text-xs font-bold uppercase tracking-wider ${index <= currentStep ? 'text-purple-600 dark:text-purple-400' : 'text-gray-400'
                                }`}>
                                {step.title}
                            </span>
                        </div>
                    ))}
                </div>
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-gray-200 dark:bg-gray-700 -z-0">
                    <div
                        className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-500"
                        style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}
                    />
                </div>
            </div>

            {/* Form Content */}
            <form onSubmit={handleSubmit} className="min-h-[400px]">
                <AnimatePresence mode="wait">
                    {currentStep === 0 && (
                        <PersonalInfoStep
                            key="step-0"
                            formData={formData}
                            errors={errors}
                            onChange={(name: keyof CreateReservationData, value: any) => updateField(name, value)}
                        />
                    )}
                    {currentStep === 1 && (
                        <ProductSelectionStep
                            key="step-1"
                            formData={formData}
                            errors={errors}
                            onChange={(name: keyof CreateReservationData, value: any) => updateField(name, value)}
                            products={availableProducts}
                        />
                    )}
                    {currentStep === 2 && (
                        <DeliveryInfoStep
                            key="step-2"
                            formData={formData}
                            errors={errors}
                            onChange={(name: keyof CreateReservationData, value: any) => updateField(name, value)}
                        />
                    )}
                    {currentStep === 3 && (
                        <ConfirmationStep
                            key="step-3"
                            formData={formData}
                            selectedProduct={selectedProduct}
                            totalPrice={totalPrice}
                        />
                    )}
                </AnimatePresence>

                {/* Navigation Buttons */}
                <div className="flex justify-between mt-12 pt-6 border-t border-gray-100 dark:border-gray-700">
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={handleBack}
                        disabled={currentStep === 0 || isSubmitting}
                        className="flex items-center"
                        leftIcon={<ChevronLeft size={20} />}
                    >
                        Précédent
                    </Button>

                    {currentStep < steps.length - 1 ? (
                        <Button
                            type="button"
                            variant="primary"
                            onClick={handleNext}
                            className="flex items-center"
                            rightIcon={<ChevronRight size={20} />}
                        >
                            Suivant
                        </Button>
                    ) : (
                        <Button
                            type="submit"
                            variant="primary"
                            isLoading={isSubmitting}
                            disabled={!selectedProduct || isSubmitting}
                            leftIcon={!isSubmitting && <Check size={20} />}
                            className="bg-gradient-to-r from-green-600 to-emerald-600 border-none px-8"
                        >
                            {isSubmitting ? 'Envoi en cours...' : 'Confirmer'}
                        </Button>
                    )}
                </div>
            </form>
        </div>
    );
}