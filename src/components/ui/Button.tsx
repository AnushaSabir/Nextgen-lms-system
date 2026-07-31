import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost';
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }: ButtonProps) {
  const sizeStyles = {
    sm: 'min-h-8 sm:min-h-9 px-3 py-1.5 text-xs rounded-lg',
    md: 'min-h-10 sm:min-h-11 px-3.5 sm:px-4 py-2 text-xs sm:text-sm rounded-lg sm:rounded-lg',
    lg: 'min-h-10 sm:min-h-12 px-4 sm:px-6 py-2 sm:py-3 text-sm sm:text-base rounded-lg sm:rounded-lg',
  };

  const variantStyles =
    variant === 'primary'
      ? 'border border-orange-600 bg-orange-600 text-[#0f3d1a] hover:bg-sky-500 hover:border-sky-500 active:bg-orange-700'
      : 'border border-gray-700 bg-gray-800 text-[#1a6b2e] hover:border-gray-600 hover:bg-gray-700 hover:text-[#0f3d1a] active:bg-gray-800';

  return (
    <button
      className={`inline-flex max-w-full min-w-0 items-center justify-center gap-1.5 text-center font-medium leading-snug active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-150 ${sizeStyles[size]} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
