'use client';

import Image from 'next/image';
import React, { useState } from 'react';

import { cn } from '@/lib/utils';

interface ProductImageProps {
  src: string;
  alt: string;
  fallbackText?: string;
  fallbackIcon?: string;
  className?: string;
  priority?: boolean;
  sizes?: string;
  quality?: number;
}

export function ProductImage({
  src,
  alt,
  fallbackText,
  fallbackIcon = '👗',
  className,
  priority = false,
  sizes = '(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw',
  quality = 85,
}: ProductImageProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoading, setImageLoading] = useState(true);

  const handleImageError = () => {
    console.warn(`Image failed to load: ${src}`);
    setImageError(true);
    setImageLoading(false);
  };

  const handleImageLoad = () => {
    setImageLoading(false);
  };

  // Vérifier si l'image existe
  const isValidImage = src && src !== '' && !src.includes('undefined');

  if (imageError || !isValidImage) {
    return (
      <div
        className={cn(
          'w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-200 to-gray-300 rounded-lg',
          className
        )}
      >
        {fallbackIcon ? (
          <span className='text-2xl sm:text-3xl' role='img' aria-label={alt}>
            {fallbackIcon}
          </span>
        ) : (
          <div className='text-center p-4'>
            <div className='text-gray-400 text-xs sm:text-sm font-medium'>
              {fallbackText || alt}
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={cn('relative w-full h-full overflow-hidden', className)}>
      {imageLoading && (
        <div className='absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center rounded-lg'>
          <div className='w-6 h-6 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin' />
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        fill
        className={cn(
          'object-cover transition-opacity duration-300 rounded-lg',
          imageLoading ? 'opacity-0' : 'opacity-100'
        )}
        onError={handleImageError}
        onLoad={handleImageLoad}
        priority={priority}
        sizes={sizes}
        quality={quality}
        placeholder='blur'
        blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
      />
    </div>
  );
}
