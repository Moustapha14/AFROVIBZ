/**
 * Utilitaires d'optimisation d'images haute performance pour le carrousel hero
 * Support WebP/AVIF avec fallback JPEG
 */

export interface HeroImageConfig {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
}

// Configuration des breakpoints responsive
export const RESPONSIVE_BREAKPOINTS = {
  mobile: 320,
  mobileLarge: 480,
  tablet: 768,
  tabletLarge: 1024,
  desktop: 1280,
  desktopLarge: 1440,
  wide: 1920,
  ultraWide: 2560,
} as const;

// Sizes responsive optimisés
export const getResponsiveSizes = (): string => {
  return [
    `(max-width: ${RESPONSIVE_BREAKPOINTS.mobile}px) ${RESPONSIVE_BREAKPOINTS.mobile}px`,
    `(max-width: ${RESPONSIVE_BREAKPOINTS.mobileLarge}px) ${RESPONSIVE_BREAKPOINTS.mobileLarge}px`,
    `(max-width: ${RESPONSIVE_BREAKPOINTS.tablet}px) ${RESPONSIVE_BREAKPOINTS.tablet}px`,
    `(max-width: ${RESPONSIVE_BREAKPOINTS.tabletLarge}px) ${RESPONSIVE_BREAKPOINTS.tabletLarge}px`,
    `(max-width: ${RESPONSIVE_BREAKPOINTS.desktop}px) ${RESPONSIVE_BREAKPOINTS.desktop}px`,
    `(max-width: ${RESPONSIVE_BREAKPOINTS.desktopLarge}px) ${RESPONSIVE_BREAKPOINTS.desktopLarge}px`,
    `(max-width: ${RESPONSIVE_BREAKPOINTS.wide}px) ${RESPONSIVE_BREAKPOINTS.wide}px`,
    `${RESPONSIVE_BREAKPOINTS.ultraWide}px`,
  ].join(', ');
};

// Placeholder blur optimisé
export const OPTIMIZED_BLUR_DATA_URL = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

// Détection du support des formats modernes
export const supportsModernFormats = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;
  
  // Test WebP
  const webpSupported = canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
  
  // Test AVIF (approximatif)
  const avifSupported = 'createImageBitmap' in window;
  
  return webpSupported || avifSupported;
};

// Optimisation de la qualité par breakpoint
export const getQualityForBreakpoint = (breakpoint: keyof typeof RESPONSIVE_BREAKPOINTS): number => {
  const qualityMap = {
    mobile: 75,
    mobileLarge: 80,
    tablet: 85,
    tabletLarge: 88,
    desktop: 90,
    desktopLarge: 92,
    wide: 95,
    ultraWide: 98,
  };
  
  return qualityMap[breakpoint] || 90;
};

// Configuration d'image optimisée par défaut
export const getOptimizedImageConfig = (config: Partial<HeroImageConfig>): HeroImageConfig => {
  return {
    src: config.src || '',
    alt: config.alt || 'Image',
    quality: 90,
    priority: false,
    sizes: getResponsiveSizes(),
    placeholder: 'blur',
    blurDataURL: OPTIMIZED_BLUR_DATA_URL,
    ...config,
  };
};

// Préchargement d'images critiques
export const preloadCriticalImages = (images: string[]): void => {
  if (typeof window === 'undefined') return;
  
  images.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    link.fetchPriority = 'high';
    document.head.appendChild(link);
  });
};

// Gestion d'erreur d'image avec fallback
export const handleImageError = (src: string, fallbackSrc?: string): string => {
  console.warn(`Erreur de chargement de l'image: ${src}`);
  return fallbackSrc || '/images/placeholder.jpg';
};

// Optimisation des métadonnées d'image
export const getImageMetadata = (src: string) => {
  return {
    src,
    alt: src.split('/').pop()?.replace(/\.[^/.]+$/, '') || 'Image',
    width: 1920,
    height: 1080,
  };
}; 