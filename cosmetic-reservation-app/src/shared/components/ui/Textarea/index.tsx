// src/shared/components/ui/Textarea/index.tsx
import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/shared/utils/cn';

export interface TextareaProps
    extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    fullWidth?: boolean;
}

/**
 * Textarea Component
 * Multi-line text input with label and error support
 */
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    (
        {
            label,
            error,
            helperText,
            fullWidth = false,
            className,
            id,
            rows = 4,
            ...props
        },
        ref
    ) => {
        const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className={cn('flex flex-col gap-1.5', fullWidth && 'w-full')}>
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                        {label}
                        {props.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                )}

                <textarea
                    ref={ref}
                    id={textareaId}
                    rows={rows}
                    className={cn(
                        'w-full px-4 py-2 rounded-lg border transition-all duration-200 resize-y',
                        'bg-white dark:bg-gray-800',
                        'text-gray-900 dark:text-white',
                        'placeholder:text-gray-400 dark:placeholder:text-gray-500',
                        'focus:outline-none focus:ring-2 focus:ring-offset-0',
                        error
                            ? 'border-red-500 focus:ring-red-500'
                            : 'border-gray-300 dark:border-gray-600 focus:ring-purple-500 focus:border-transparent',
                        props.disabled &&
                        'opacity-50 cursor-not-allowed bg-gray-100 dark:bg-gray-900',
                        className
                    )}
                    {...props}
                />

                {error && (
                    <p className="text-sm text-red-500 flex items-center gap-1">
                        <span>⚠</span>
                        {error}
                    </p>
                )}

                {helperText && !error && (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                        {helperText}
                    </p>
                )}
            </div>
        );
    }
);

Textarea.displayName = 'Textarea';

export default Textarea;
