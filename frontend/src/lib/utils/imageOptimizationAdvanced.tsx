import React from 'react';

/**
 * Utilitaires d'optimisation d'images avancés pour AFROVIBZ
 */

export interface ImageOptimizationConfig {
  quality: number;
  format: 'webp' | 'avif' | 'jpeg' | 'png';
  width: number;
  height?: number;
  fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
  position?:
    | 'top'
    | 'right top'
    | 'right'
    | 'right bottom'
    | 'bottom'
    | 'left bottom'
    | 'left'
    | 'left top'
    | 'center';
  background?: string;
  blur?: number;
  sharpen?: number;
}

export interface ResponsiveImageConfig {
  mobile: ImageOptimizationConfig;
  tablet: ImageOptimizationConfig;
  desktop: ImageOptimizationConfig;
  large: ImageOptimizationConfig;
}

// Configuration par défaut pour les images responsives
export const DEFAULT_RESPONSIVE_CONFIG: ResponsiveImageConfig = {
  mobile: {
    quality: 80,
    format: 'webp',
    width: 640,
    fit: 'cover',
  },
  tablet: {
    quality: 85,
    format: 'webp',
    width: 1024,
    fit: 'cover',
  },
  desktop: {
    quality: 90,
    format: 'webp',
    width: 1920,
    fit: 'cover',
  },
  large: {
    quality: 95,
    format: 'avif',
    width: 2560,
    fit: 'cover',
  },
};

// Configuration pour les images de produits
export const PRODUCT_IMAGE_CONFIG: ResponsiveImageConfig = {
  mobile: {
    quality: 85,
    format: 'webp',
    width: 400,
    height: 400,
    fit: 'cover',
  },
  tablet: {
    quality: 90,
    format: 'webp',
    width: 600,
    height: 600,
    fit: 'cover',
  },
  desktop: {
    quality: 95,
    format: 'webp',
    width: 800,
    height: 800,
    fit: 'cover',
  },
  large: {
    quality: 98,
    format: 'avif',
    width: 1200,
    height: 1200,
    fit: 'cover',
  },
};

// Configuration pour les images de bannière
export const BANNER_IMAGE_CONFIG: ResponsiveImageConfig = {
  mobile: {
    quality: 80,
    format: 'webp',
    width: 640,
    height: 300,
    fit: 'cover',
  },
  tablet: {
    quality: 85,
    format: 'webp',
    width: 1024,
    height: 400,
    fit: 'cover',
  },
  desktop: {
    quality: 90,
    format: 'webp',
    width: 1920,
    height: 600,
    fit: 'cover',
  },
  large: {
    quality: 95,
    format: 'avif',
    width: 2560,
    height: 800,
    fit: 'cover',
  },
};

/**
 * Génère les URLs d'images optimisées pour différentes tailles d'écran
 */
export function generateResponsiveImageUrls(
  baseUrl: string,
  config: ResponsiveImageConfig = DEFAULT_RESPONSIVE_CONFIG
): {
  mobile: string;
  tablet: string;
  desktop: string;
  large: string;
  srcSet: string;
  sizes: string;
} {
  const mobileUrl = generateOptimizedImageUrl(baseUrl, config.mobile);
  const tabletUrl = generateOptimizedImageUrl(baseUrl, config.tablet);
  const desktopUrl = generateOptimizedImageUrl(baseUrl, config.desktop);
  const largeUrl = generateOptimizedImageUrl(baseUrl, config.large);

  const srcSet = [
    `${mobileUrl} ${config.mobile.width}w`,
    `${tabletUrl} ${config.tablet.width}w`,
    `${desktopUrl} ${config.desktop.width}w`,
    `${largeUrl} ${config.large.width}w`,
  ].join(', ');

  const sizes = [
    `(max-width: 640px) ${config.mobile.width}px`,
    `(max-width: 1024px) ${config.tablet.width}px`,
    `(max-width: 1920px) ${config.desktop.width}px`,
    `${config.large.width}px`,
  ].join(', ');

  return {
    mobile: mobileUrl,
    tablet: tabletUrl,
    desktop: desktopUrl,
    large: largeUrl,
    srcSet,
    sizes,
  };
}

/**
 * Génère une URL d'image optimisée avec les paramètres donnés
 */
export function generateOptimizedImageUrl(
  baseUrl: string,
  config: ImageOptimizationConfig
): string {
  const params = new URLSearchParams();

  // Paramètres de base
  params.set('q', config.quality.toString());
  params.set('f', config.format);
  params.set('w', config.width.toString());

  if (config.height) {
    params.set('h', config.height.toString());
  }

  if (config.fit) {
    params.set('fit', config.fit);
  }

  if (config.position) {
    params.set('p', config.position);
  }

  if (config.background) {
    params.set('bg', config.background);
  }

  if (config.blur) {
    params.set('blur', config.blur.toString());
  }

  if (config.sharpen) {
    params.set('sharpen', config.sharpen.toString());
  }

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Détecte automatiquement le format d'image optimal selon le navigateur
 */
export function getOptimalImageFormat(): 'webp' | 'avif' | 'jpeg' {
  if (typeof window === 'undefined') {
    return 'webp'; // Fallback pour SSR
  }

  // Vérifier le support AVIF
  const avifSupported =
    document.createElement('canvas').toDataURL('image/avif').indexOf('data:image/avif') === 0;

  if (avifSupported) {
    return 'avif';
  }

  // Vérifier le support WebP
  const webpSupported =
    document.createElement('canvas').toDataURL('image/webp').indexOf('data:image/webp') === 0;

  if (webpSupported) {
    return 'webp';
  }

  return 'jpeg';
}

/**
 * Calcule la qualité optimale selon la taille d'écran et la connexion
 */
export function getOptimalQuality(
  screenWidth: number,
  connectionType?: 'slow-2g' | '2g' | '3g' | '4g'
): number {
  let baseQuality = 90;

  // Ajuster selon la taille d'écran
  if (screenWidth <= 640) {
    baseQuality = 80;
  } else if (screenWidth <= 1024) {
    baseQuality = 85;
  } else if (screenWidth <= 1920) {
    baseQuality = 90;
  } else {
    baseQuality = 95;
  }

  // Ajuster selon le type de connexion
  if (connectionType === 'slow-2g' || connectionType === '2g') {
    baseQuality = Math.max(60, baseQuality - 30);
  } else if (connectionType === '3g') {
    baseQuality = Math.max(70, baseQuality - 15);
  }

  return baseQuality;
}

/**
 * Génère un placeholder blur pour les images
 */
export function generateBlurPlaceholder(width: number, height: number): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  // Créer un motif de placeholder
  const blockSize = 20;
  for (let x = 0; x < width; x += blockSize) {
    for (let y = 0; y < height; y += blockSize) {
      const color = (x + y) % (blockSize * 2) === 0 ? '#f3f4f6' : '#e5e7eb';
      ctx.fillStyle = color;
      ctx.fillRect(x, y, blockSize, blockSize);
    }
  }

  return canvas.toDataURL('image/jpeg', 0.1);
}

/**
 * Hook pour l'optimisation d'images avec lazy loading
 */
export function useImageOptimization(
  src: string,
  config: ResponsiveImageConfig = DEFAULT_RESPONSIVE_CONFIG
) {
  const [isLoaded, setIsLoaded] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [currentSrc, setCurrentSrc] = React.useState<string>('');

  React.useEffect(() => {
    if (!src) return;

    const responsiveUrls = generateResponsiveImageUrls(src, config);
    setCurrentSrc(responsiveUrls.mobile);

    // Précharger l'image optimale
    const img = new Image();
    img.onload = () => {
      setIsLoaded(true);
      setError(null);
    };
    img.onerror = () => {
      setError("Erreur de chargement de l'image");
    };
    img.src = responsiveUrls.mobile;
  }, [src, config]);

  return {
    isLoaded,
    error,
    currentSrc,
    responsiveUrls: generateResponsiveImageUrls(src, config),
  };
}

/**
 * Composant d'image optimisée avec lazy loading
 */
export function OptimizedImage({
  src,
  alt,
  config = DEFAULT_RESPONSIVE_CONFIG,
  className = '',
  priority = false,
  ...props
}: {
  src: string;
  alt: string;
  config?: ResponsiveImageConfig;
  className?: string;
  priority?: boolean;
} & React.ImgHTMLAttributes<HTMLImageElement>) {
  const { isLoaded, error, responsiveUrls } = useImageOptimization(src, config);
  const [isInView, setIsInView] = React.useState(priority);

  React.useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    const img = document.createElement('img');
    observer.observe(img);

    return () => observer.disconnect();
  }, [priority]);

  if (error) {
    return (
      <div className={`bg-gray-200 flex items-center justify-center ${className}`}>
        <span className='text-gray-500 text-sm'>Erreur de chargement</span>
      </div>
    );
  }

  return (
    <img
      src={isInView ? responsiveUrls.mobile : ''}
      alt={alt}
      className={`transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'} ${className}`}
      srcSet={responsiveUrls.srcSet}
      sizes={responsiveUrls.sizes}
      loading={priority ? 'eager' : 'lazy'}
      {...props}
    />
  );
}
