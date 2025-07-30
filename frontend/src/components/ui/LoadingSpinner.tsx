import React from 'react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  text?: string;
  color?: 'primary' | 'white' | 'gray';
}

export function LoadingSpinner({ 
  size = 'md', 
  className, 
  text,
  color = 'primary' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  const colorClasses = {
    primary: 'border-gray-300 border-t-black',
    white: 'border-gray-400 border-t-white',
    gray: 'border-gray-200 border-t-gray-400',
  };

  return (
    <div className={cn("flex flex-col items-center justify-center", className)}>
      <div 
        className={cn(
          "border-2 rounded-full animate-spin",
          sizeClasses[size],
          colorClasses[color]
        )}
        role="status"
        aria-label="Chargement en cours"
      >
        <span className="sr-only">Chargement...</span>
      </div>
      {text && (
        <p className="mt-2 text-sm sm:text-base text-gray-600 font-medium text-center">
          {text}
        </p>
      )}
    </div>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("animate-pulse bg-gray-200 rounded", className)} />
  );
}

export function LoadingDots() {
  return (
    <div className="flex space-x-1">
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
    </div>
  );
}

// Composant pour les états de chargement de page complète - Mobile First
interface LoadingPageProps {
  message?: string;
  className?: string;
}

export function LoadingPage({ 
  message = "Chargement en cours...", 
  className 
}: LoadingPageProps) {
  return (
    <div className={cn(
      "flex flex-col items-center justify-center min-h-[200px] sm:min-h-[300px] space-y-4 px-4",
      className
    )}>
      <LoadingSpinner size="lg" />
      <p className="text-sm sm:text-base text-gray-600 font-medium text-center">
        {message}
      </p>
    </div>
  );
}

// Skeleton pour les cartes de produits - Mobile First
export function ProductCardSkeleton() {
  return (
    <div className="bg-white rounded-lg shadow-sm animate-pulse">
      <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
      <div className="p-3 sm:p-4 space-y-3">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    </div>
  );
}

// Skeleton pour les listes - Mobile First
export function ListItemSkeleton() {
  return (
    <div className="flex items-center space-x-3 p-3 sm:p-4 animate-pulse">
      <div className="h-12 w-12 bg-gray-200 rounded-full flex-shrink-0"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      </div>
    </div>
  );
}
