// src/features/admin/components/ProductModal.tsx
import React, { useEffect, useState } from 'react';
import { Modal, ModalBody, ModalFooter, Button } from '@/shared/components/ui';
import { productService } from '@/features/products/services/product.service';
import { Product, CreateProductData, UpdateProductData } from '@/features/products/types/product.types';
import { Package } from 'lucide-react';

interface ProductModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: (product: Product) => void;
    /** If provided, the modal is in edit mode */
    product?: Product | null;
}

type ProductCategoryValue = 'FACIAL_CARE' | 'BODY_CARE' | 'HAIR_CARE' | 'MAKEUP' | 'PERFUME' | 'OTHER';

const CATEGORIES: { value: ProductCategoryValue; label: string }[] = [
    { value: 'FACIAL_CARE', label: '💆 Soin visage' },
    { value: 'BODY_CARE', label: '🧴 Soin corps' },
    { value: 'HAIR_CARE', label: '💇 Soin cheveux' },
    { value: 'MAKEUP', label: '💄 Maquillage' },
    { value: 'PERFUME', label: '🌸 Parfum' },
    { value: 'OTHER', label: '📦 Autre' },
];

const INITIAL_FORM = {
    name: '',
    description: '',
    price: '',
    stock: '',
    category: 'OTHER' as ProductCategoryValue,
    imageUrl: '',
};

type FormState = typeof INITIAL_FORM;
type FormErrors = Partial<Record<keyof FormState, string>>;

export function ProductModal({ isOpen, onClose, onSuccess, product }: ProductModalProps) {
    const isEdit = !!product;
    const [form, setForm] = useState<FormState>(INITIAL_FORM);
    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [serverError, setServerError] = useState<string | null>(null);

    // Populate form when editing
    useEffect(() => {
        if (product) {
            setForm({
                name: product.name,
                description: product.description,
                price: String(product.price),
                stock: String(product.stock),
                category: product.category,
                imageUrl: product.imageUrl || '',
            });
        } else {
            setForm(INITIAL_FORM);
        }
        setErrors({});
        setServerError(null);
    }, [product, isOpen]);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        if (!form.name.trim()) newErrors.name = 'Le nom est requis';
        if (!form.description.trim()) newErrors.description = 'La description est requise';
        if (!form.price || isNaN(Number(form.price)) || Number(form.price) <= 0)
            newErrors.price = 'Un prix valide est requis (> 0)';
        if (!form.stock || isNaN(Number(form.stock)) || Number(form.stock) < 0)
            newErrors.stock = 'Un stock valide est requis (≥ 0)';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormState]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;

        setIsSubmitting(true);
        setServerError(null);
        try {
            const payload = {
                name: form.name.trim(),
                description: form.description.trim(),
                price: Number(form.price),
                stock: Number(form.stock),
                category: form.category,
                ...(form.imageUrl.trim() ? { imageUrl: form.imageUrl.trim() } : {}),
            };

            let result: Product;
            if (isEdit && product) {
                result = await productService.update(product.id, payload as UpdateProductData);
            } else {
                result = await productService.create(payload as CreateProductData);
            }
            onSuccess(result);
            onClose();
        } catch (err: any) {
            setServerError(err.message || 'Une erreur est survenue.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const fieldClass = (name: keyof FormState) =>
        `w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 transition-all ${errors[name]
            ? 'border-red-400 focus:ring-red-300'
            : 'border-gray-200 dark:border-gray-600 focus:ring-purple-400 focus:border-purple-400'
        }`;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={isEdit ? '✏️ Modifier le produit' : '✨ Ajouter un produit'}
            size="lg"
        >
            <form onSubmit={handleSubmit} noValidate>
                <ModalBody>
                    <div className="space-y-5">
                        {serverError && (
                            <div className="px-4 py-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-400">
                                {serverError}
                            </div>
                        )}

                        {/* Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Nom du produit <span className="text-red-500">*</span>
                            </label>
                            <input
                                name="name"
                                value={form.name}
                                onChange={handleChange}
                                placeholder="Ex: Crème hydratante visage"
                                className={fieldClass('name')}
                            />
                            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Description <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Décrivez le produit..."
                                className={`${fieldClass('description')} resize-none`}
                            />
                            {errors.description && (
                                <p className="mt-1 text-xs text-red-500">{errors.description}</p>
                            )}
                        </div>

                        {/* Price + Stock */}
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Prix (€) <span className="text-red-500">*</span>
                                </label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 font-semibold">€</span>
                                    <input
                                        name="price"
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.price}
                                        onChange={handleChange}
                                        placeholder="0.00"
                                        className={`${fieldClass('price')} pl-8`}
                                    />
                                </div>
                                {errors.price && <p className="mt-1 text-xs text-red-500">{errors.price}</p>}
                            </div>
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                    Stock <span className="text-red-500">*</span>
                                </label>
                                <input
                                    name="stock"
                                    type="number"
                                    min="0"
                                    value={form.stock}
                                    onChange={handleChange}
                                    placeholder="0"
                                    className={fieldClass('stock')}
                                />
                                {errors.stock && <p className="mt-1 text-xs text-red-500">{errors.stock}</p>}
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                Catégorie
                            </label>
                            <select
                                name="category"
                                value={form.category}
                                onChange={handleChange}
                                className={fieldClass('category')}
                            >
                                {CATEGORIES.map((c) => (
                                    <option key={c.value} value={c.value}>
                                        {c.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Image URL (optional) */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                                URL de l'image <span className="text-gray-400 font-normal">(optionnel)</span>
                            </label>
                            <input
                                name="imageUrl"
                                value={form.imageUrl}
                                onChange={handleChange}
                                placeholder="https://..."
                                className={fieldClass('imageUrl')}
                            />
                            {form.imageUrl && (
                                <div className="mt-2 w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-600">
                                    <img
                                        src={form.imageUrl}
                                        alt="preview"
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).style.display = 'none';
                                        }}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                </ModalBody>

                <ModalFooter>
                    <Button
                        type="button"
                        variant="ghost"
                        onClick={onClose}
                        disabled={isSubmitting}
                    >
                        Annuler
                    </Button>
                    <Button
                        type="submit"
                        variant="primary"
                        isLoading={isSubmitting}
                        leftIcon={<Package className="w-4 h-4" />}
                    >
                        {isEdit ? 'Enregistrer' : 'Créer le produit'}
                    </Button>
                </ModalFooter>
            </form>
        </Modal>
    );
}
