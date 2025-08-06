import React from 'react';

import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export function LoadingSpinner({ size = 'md', className, text }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center', className)}>
      <div
        className={cn(
          'border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin',
          sizeClasses[size]
        )}
      />
      {text && <p className='mt-2 text-sm text-gray-600'>{text}</p>}
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={cn('animate-pulse bg-gray-200 rounded', className)} />;
}

export function LoadingDots() {
  return (
    <div className='flex space-x-1'>
      <div
        className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
        style={{ animationDelay: '0ms' }}
      />
      <div
        className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
        style={{ animationDelay: '150ms' }}
      />
      <div
        className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
        style={{ animationDelay: '300ms' }}
      />
    </div>
  );
}
