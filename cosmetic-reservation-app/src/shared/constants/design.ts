// src/shared/constants/design.ts

/**
 * Design system constants
 * Colors, animations, breakpoints, etc.
 */

export const DESIGN = {
    // Colors
    colors: {
        primary: {
            light: '#ec4899',
            DEFAULT: '#db2777',
            dark: '#be185d',
        },
        secondary: {
            light: '#a855f7',
            DEFAULT: '#9333ea',
            dark: '#7e22ce',
        },
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444',
        info: '#3b82f6',
    },

    // Gradients
    // Gradients (now using solid colors as requested)
    gradients: {
        primary: 'bg-purple-600',
        secondary: 'bg-blue-600',
        success: 'bg-green-500',
        danger: 'bg-red-500',
    },

    // Animations
    animations: {
        fadeIn: {
            initial: { opacity: 0 },
            animate: { opacity: 1 },
            exit: { opacity: 0 },
        },
        slideUp: {
            initial: { opacity: 0, y: 20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -20 },
        },
        slideDown: {
            initial: { opacity: 0, y: -20 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: 20 },
        },
        scaleIn: {
            initial: { opacity: 0, scale: 0.9 },
            animate: { opacity: 1, scale: 1 },
            exit: { opacity: 0, scale: 0.9 },
        },
    },

    // Transitions
    transitions: {
        default: { duration: 0.3, ease: 'easeInOut' },
        fast: { duration: 0.15, ease: 'easeInOut' },
        slow: { duration: 0.5, ease: 'easeInOut' },
        spring: { type: 'spring', stiffness: 300, damping: 30 },
    },

    // Breakpoints (matches Tailwind)
    breakpoints: {
        sm: 640,
        md: 768,
        lg: 1024,
        xl: 1280,
        '2xl': 1536,
    },

    // Shadows
    shadows: {
        sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
        DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
        lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
        xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    },

    // Border radius
    radius: {
        sm: '0.25rem',
        DEFAULT: '0.5rem',
        md: '0.75rem',
        lg: '1rem',
        xl: '1.5rem',
        full: '9999px',
    },
} as const;

export type DesignSystem = typeof DESIGN;
