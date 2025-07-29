import React from 'react';
import { cn } from '@/lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger' | 'success';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  children: React.ReactNode;
  fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant = 'primary', 
    size = 'md', 
    loading = false, 
    children, 
    disabled, 
    fullWidth = false,
    ...props 
  }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none active:scale-95 touch-manipulation tap-highlight-none';
    
    const variants = {
      primary: 'bg-black text-white hover:bg-gray-800 shadow-sm hover:shadow-md active:bg-gray-900',
      secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 shadow-sm hover:shadow-md active:bg-gray-300',
      outline: 'border border-gray-300 bg-transparent hover:bg-gray-50 shadow-sm hover:shadow-md active:bg-gray-100',
      ghost: 'hover:bg-gray-100 active:bg-gray-200',
      danger: 'bg-red-600 text-white hover:bg-red-700 shadow-sm hover:shadow-md active:bg-red-800',
      success: 'bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md active:bg-green-800',
    };

    const sizes = {
      xs: 'h-11 px-3 text-xs min-h-[44px] min-w-[44px]',
      sm: 'h-11 px-4 text-sm min-h-[44px] min-w-[44px]',
      md: 'h-12 px-4 py-2 text-base min-h-[48px] min-w-[48px]',
      lg: 'h-14 px-6 py-3 text-lg min-h-[56px] min-w-[56px]',
      xl: 'h-16 px-8 py-4 text-xl min-h-[64px] min-w-[64px]',
    };

    return (
      <button
        className={cn(
          baseStyles,
          variants[variant],
          sizes[size],
          fullWidth && 'w-full',
          className
        )}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
