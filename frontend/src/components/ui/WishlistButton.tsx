'use client';

import { Heart } from 'lucide-react';
import React from 'react';

import { useWishlist } from '@/lib/hooks/useWishlist';
import { cn } from '@/lib/utils';
import { Product } from '@/types';

interface WishlistButtonProps {
  product: Product;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'outline' | 'ghost';
  className?: string;
  showText?: boolean;
}

export function WishlistButton({
  product,
  size = 'md',
  variant = 'default',
  className,
  showText = false,
}: WishlistButtonProps) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const isFavorited = isInWishlist(product.id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isFavorited) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }
  };

  const sizeClasses = {
    sm: 'p-1.5 text-xs',
    md: 'p-2 text-sm',
    lg: 'p-3 text-base',
  };

  const variantClasses = {
    default: 'bg-white shadow-md hover:shadow-lg',
    outline: 'border border-gray-300 bg-white hover:bg-gray-50',
    ghost: 'bg-transparent hover:bg-gray-100',
  };

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  return (
    <button
      onClick={handleToggleWishlist}
      className={cn(
        'flex items-center justify-center rounded-full transition-all duration-200',
        'focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2',
        'active:scale-95 touch-manipulation',
        sizeClasses[size],
        variantClasses[variant],
        isFavorited && 'text-red-500',
        !isFavorited && 'text-gray-600 hover:text-red-500',
        className
      )}
      aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
    >
      <Heart
        className={cn(
          iconSizes[size],
          isFavorited ? 'fill-current' : 'fill-none',
          'transition-all duration-200'
        )}
      />
      {showText && (
        <span className='ml-1.5 font-medium'>{isFavorited ? 'Retirer' : 'Favoris'}</span>
      )}
    </button>
  );
}
