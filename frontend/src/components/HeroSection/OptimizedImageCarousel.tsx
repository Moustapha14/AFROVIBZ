'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { getResponsiveSizes, OPTIMIZED_BLUR_DATA_URL, preloadCriticalImages } from '@/lib/utils/heroImageOptimization';

interface HeroImage {
  src: string;
  alt: string;
  priority?: boolean;
  sizes?: string;
}

const heroImages: HeroImage[] = [
  {
    src: '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (1).jpeg',
    alt: 'Robe Africaine Élégante - Mode traditionnelle moderne',
    priority: true,
  },
  {
    src: '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (2).jpeg',
    alt: 'Boubou Traditionnel - Vêtement africain authentique',
    priority: true,
  },
  {
    src: '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (3).jpeg',
    alt: 'Tenue Enfant Moderne - Style africain pour enfants',
  },
  {
    src: '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (4).jpeg',
    alt: 'Accessoires Élégants - Compléments de mode africaine',
  },
  {
    src: '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (5).jpeg',
    alt: 'Smartphone Premium - Technologie moderne',
  },
  {
    src: '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (6).jpeg',
    alt: 'Collection Spéciale - Édition limitée',
  },
  {
    src: '/images/products/sac-hexagonal.jpg',
    alt: 'Sac Hexagonal Élégant - Accessoire de mode',
  },
  {
    src: '/images/products/sac-noir.jpg',
    alt: 'Sac Noir Moderne - Style contemporain',
  },
  {
    src: '/images/products/sac-blanc.jpg',
    alt: 'Sac Blanc Poignée Dorée - Élégance raffinée',
  },
  {
    src: '/images/products/sac-rouge.jpg',
    alt: 'Sac Rouge Charme Cerise - Couleur vibrante',
  },
  {
    src: '/images/products/sac-rose.jpg',
    alt: 'Sac Rose Élégant - Féminité moderne',
  },
  {
    src: '/images/products/sac-vert.jpg',
    alt: 'Sac Vert Naturel - Style écologique',
  },
];



export default function OptimizedImageCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Optimisation des sizes pour différents breakpoints
  const responsiveSizes = useMemo(() => getResponsiveSizes(), []);

  // Gestion du carrousel avec useCallback pour optimiser les performances
  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % heroImages.length);
  }, []);

  // Gestion des erreurs de chargement
  const handleImageError = useCallback((index: number) => {
    console.warn(`Erreur de chargement de l'image ${index}: ${heroImages[index].src}`);
    setError(`Impossible de charger l'image ${index + 1}`);
  }, []);

  // Gestion du chargement réussi
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setError(null);
  }, []);

  useEffect(() => {
    const interval = setInterval(nextImage, 5000); // 5 secondes pour une meilleure UX
    return () => clearInterval(interval);
  }, [nextImage]);

  // Préchargement des images prioritaires
  useEffect(() => {
    const preloadImages = heroImages
      .filter(img => img.priority)
      .slice(0, 3)
      .map(img => img.src);
    
    preloadCriticalImages(preloadImages);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {/* Indicateur de chargement */}
      {isLoading && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 animate-pulse" />
      )}

      {/* Gestion d'erreur */}
      {error && (
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 flex items-center justify-center">
          <div className="text-white text-center">
            <p className="text-sm opacity-75">{error}</p>
          </div>
        </div>
      )}

      {/* Carrousel d'images */}
      {heroImages.map((image, index) => (
        <div
          key={`${image.src}-${index}`}
          className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${
            index === currentIndex 
              ? 'opacity-100 scale-100' 
              : 'opacity-0 scale-105'
          }`}
        >
          <Image
            src={image.src}
            alt={image.alt}
            fill
            className="object-cover object-center"
            priority={image.priority || false}
            quality={90}
            sizes={responsiveSizes}
            placeholder="blur"
            blurDataURL={OPTIMIZED_BLUR_DATA_URL}
            onLoad={handleImageLoad}
            onError={() => handleImageError(index)}
            loading={image.priority ? 'eager' : 'lazy'}
            fetchPriority={image.priority ? 'high' : 'auto'}
          />
          
          {/* Overlay gradient optimisé */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/40 via-orange-500/40 to-red-500/40" />
          <div className="absolute inset-0 bg-black/30" />
        </div>
      ))}

      {/* Indicateurs de progression - Supprimés selon la demande utilisateur */}
    </div>
  );
} 