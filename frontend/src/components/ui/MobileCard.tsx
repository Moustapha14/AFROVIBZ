import React from 'react';

import { cn } from '@/lib/utils';

interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  hover?: boolean;
  interactive?: boolean;
  onClick?: () => void;
}

const MobileCard: React.FC<MobileCardProps> = ({
  children,
  className,
  variant = 'default',
  padding = 'md',
  hover = false,
  interactive = false,
  onClick,
}) => {
  const variants = {
    default: 'bg-white border border-gray-200 shadow-sm',
    elevated: 'bg-white border border-gray-200 shadow-md',
    outlined: 'bg-white border-2 border-gray-300',
    flat: 'bg-gray-50 border border-gray-200',
  };

  const paddings = {
    none: '',
    sm: 'p-3',
    md: 'p-4 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const hoverStyles = hover
    ? 'hover:shadow-lg hover:-translate-y-1 transition-all duration-200'
    : '';
  const interactiveStyles = interactive ? 'cursor-pointer active:scale-95' : '';

  return (
    <div
      className={cn(
        'rounded-lg overflow-hidden transition-all duration-200',
        variants[variant],
        paddings[padding],
        hoverStyles,
        interactiveStyles,
        className
      )}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={
        onClick
          ? e => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
      {children}
    </div>
  );
};

export { MobileCard };
