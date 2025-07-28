import React from 'react';
import { cn } from '@/lib/utils';

interface MobileContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full' | 'content' | 'wide';
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  center?: boolean;
  safe?: boolean;
}

const MobileContainer: React.FC<MobileContainerProps> = ({
  children,
  className,
  maxWidth = 'content',
  padding = 'md',
  center = true,
  safe = true,
}) => {
  const maxWidths = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    full: 'max-w-full',
    content: 'max-w-7xl',
    wide: 'max-w-[1400px]',
  };

  const paddings = {
    none: '',
    sm: 'px-2 sm:px-4',
    md: 'px-4 sm:px-6 lg:px-8',
    lg: 'px-6 sm:px-8 lg:px-12',
    xl: 'px-8 sm:px-12 lg:px-16',
  };

  const safeArea = safe ? 'safe-area-padding' : '';

  return (
    <div
      className={cn(
        'w-full',
        maxWidths[maxWidth],
        paddings[padding],
        center && 'mx-auto',
        safeArea,
        className
      )}
    >
      {children}
    </div>
  );
};

export { MobileContainer }; 