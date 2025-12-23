import React from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'white';
    size?: 'sm' | 'md' | 'lg';
}

export const Button = ({
    className,
    variant = 'primary',
    size = 'md',
    ...props
}: ButtonProps) => {
    const variants = {
        primary: 'bg-brand-deep text-white hover:bg-brand-deep/90',
        secondary: 'bg-brand-pink text-brand-deep hover:bg-brand-pink/90',
        outline: 'border border-white/20 text-white hover:bg-white/10',
        ghost: 'text-white hover:bg-white/10',
        white: 'bg-white text-brand-deep hover:bg-gray-100',
    };

    const sizes = {
        sm: 'px-3 py-1.5 text-sm',
        md: 'px-5 py-2.5 text-base',
        lg: 'px-8 py-3.5 text-lg font-medium',
    };

    return (
        <button
            className={cn(
                'inline-flex items-center justify-center rounded-full transition-all active:scale-95 disabled:opacity-50',
                variants[variant],
                sizes[size],
                className
            )}
            {...props}
        />
    );
};
