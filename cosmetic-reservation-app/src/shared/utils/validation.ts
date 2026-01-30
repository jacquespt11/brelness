// src/shared/utils/validation.ts

/**
 * Validation utilities for forms
 */

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Validate French phone number
 */
export function isValidPhoneNumber(phone: string): boolean {
    // Remove all non-digit characters
    const cleaned = phone.replace(/\D/g, '');

    // French phone numbers are 10 digits starting with 0
    return /^0[1-9]\d{8}$/.test(cleaned);
}

/**
 * Validate required field
 */
export function isRequired(value: string): boolean {
    return value.trim().length > 0;
}

/**
 * Validate minimum length
 */
export function hasMinLength(value: string, minLength: number): boolean {
    return value.trim().length >= minLength;
}

/**
 * Validate maximum length
 */
export function hasMaxLength(value: string, maxLength: number): boolean {
    return value.trim().length <= maxLength;
}

/**
 * Validate number range
 */
export function isInRange(value: number, min: number, max: number): boolean {
    return value >= min && value <= max;
}

/**
 * Validate positive number
 */
export function isPositiveNumber(value: number): boolean {
    return value > 0;
}

/**
 * Get validation error message
 */
export function getValidationError(
    field: string,
    value: string | number,
    rules: {
        required?: boolean;
        email?: boolean;
        phone?: boolean;
        minLength?: number;
        maxLength?: number;
        min?: number;
        max?: number;
        positive?: boolean;
    }
): string | null {
    if (rules.required && typeof value === 'string' && !isRequired(value)) {
        return `${field} est requis`;
    }

    if (typeof value === 'string') {
        if (rules.email && !isValidEmail(value)) {
            return 'Email invalide';
        }

        if (rules.phone && !isValidPhoneNumber(value)) {
            return 'Numéro de téléphone invalide';
        }

        if (rules.minLength && !hasMinLength(value, rules.minLength)) {
            return `${field} doit contenir au moins ${rules.minLength} caractères`;
        }

        if (rules.maxLength && !hasMaxLength(value, rules.maxLength)) {
            return `${field} ne peut pas dépasser ${rules.maxLength} caractères`;
        }
    }

    if (typeof value === 'number') {
        if (rules.positive && !isPositiveNumber(value)) {
            return `${field} doit être positif`;
        }

        if (rules.min !== undefined && rules.max !== undefined && !isInRange(value, rules.min, rules.max)) {
            return `${field} doit être entre ${rules.min} et ${rules.max}`;
        }
    }

    return null;
}
