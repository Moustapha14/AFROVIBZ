import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

import sharp from 'sharp';

/**
 * Utilitaires d'optimisation d'images haute performance
 * Support WebP/AVIF avec fallback JPEG
 */

export interface ImageOptimizationConfig {
  src?: string;
  alt?: string;
  width?: number;
  height?: number;
  quality?: number;
  priority?: boolean;
  sizes?: string;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  format?: string;
  removeExif?: boolean;
  compressionLevel?: number;
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
export const OPTIMIZED_BLUR_DATA_URL =
  'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==';

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
export const getQualityForBreakpoint = (
  breakpoint: keyof typeof RESPONSIVE_BREAKPOINTS
): number => {
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
export const getOptimizedImageConfig = (
  config: Partial<ImageOptimizationConfig>
): ImageOptimizationConfig => {
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
    alt:
      src
        .split('/')
        .pop()
        ?.replace(/\.[^/.]+$/, '') || 'Image',
    width: 1920,
    height: 1080,
  };
};

export interface OptimizedImageSizes {
  original: string;
  thumbnail: string;
  medium: string;
  large: string;
  webp: string;
  webpThumbnail: string;
  webpMedium: string;
  webpLarge: string;
}

export interface ImageMetadata {
  id: string;
  originalName: string;
  originalSize: number;
  optimizedSize: number;
  dimensions: { width: number; height: number };
  format: string;
  uploadDate: Date;
  productId: string;
  checksum: string;
  altText?: string;
  displayOrder: number;
}

export interface OptimizationStats {
  originalSize: number;
  optimizedSize: number;
  compressionRatio: number;
  processingTime: number;
  format: string;
}

export class ImageOptimizer {
  // Configuration selon les spécifications
  private static readonly THUMBNAIL_SIZE = 150;
  private static readonly MEDIUM_SIZE = 500;
  private static readonly LARGE_SIZE = 1200;
  private static readonly QUALITY = 85;
  private static readonly WEBP_QUALITY = 80;
  private static readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  private static readonly MIN_DIMENSIONS = 800;
  private static readonly ALLOWED_FORMATS = ['jpeg', 'jpg', 'png', 'webp'];

  /**
   * Optimise une image avec toutes les tailles nécessaires selon les spécifications
   */
  static async optimizeImage(
    inputPath: string,
    productId: string,
    filename: string,
    config: ImageOptimizationConfig = {}
  ): Promise<{ paths: OptimizedImageSizes; metadata: ImageMetadata; stats: OptimizationStats }> {
    const startTime = Date.now();

    const {
      quality = this.QUALITY,
      format = 'webp',
      removeExif = true,
      compressionLevel = 6,
    } = config;

    // Créer les dossiers de sortie
    const baseDir = path.join(process.cwd(), 'public', 'images', 'products');
    const dirs = ['originals', 'thumbnails', 'medium', 'large', 'webp'];

    for (const dir of dirs) {
      await fs.mkdir(path.join(baseDir, dir), { recursive: true });
    }

    // Lire l'image originale
    const image = sharp(inputPath);

    // Obtenir les métadonnées originales
    const originalMetadata = await image.metadata();
    const originalStats = await fs.stat(inputPath);

    // Validation des dimensions minimales
    if (
      (originalMetadata.width || 0) < this.MIN_DIMENSIONS ||
      (originalMetadata.height || 0) < this.MIN_DIMENSIONS
    ) {
      throw new Error(
        `Dimensions minimales requises: ${this.MIN_DIMENSIONS}x${this.MIN_DIMENSIONS}px`
      );
    }

    // Générer un ID unique et un nom de fichier sécurisé
    const imageId = crypto.randomUUID();
    const timestamp = Date.now();
    const safeFilename = this.generateSafeFilename(filename, productId, timestamp);
    const baseName = path.parse(safeFilename).name;

    // Supprimer les métadonnées EXIF si demandé
    if (removeExif) {
      image.withMetadata({});
    }

    // Définir les chemins de sortie selon la nouvelle structure
    const paths: OptimizedImageSizes = {
      original: path.join(baseDir, 'originals', `${baseName}.jpg`),
      thumbnail: path.join(baseDir, 'thumbnails', `${baseName}-thumb.jpg`),
      medium: path.join(baseDir, 'medium', `${baseName}-medium.jpg`),
      large: path.join(baseDir, 'large', `${baseName}-large.jpg`),
      webp: path.join(baseDir, 'webp', `${baseName}.webp`),
      webpThumbnail: path.join(baseDir, 'webp', `${baseName}-thumb.webp`),
      webpMedium: path.join(baseDir, 'webp', `${baseName}-medium.webp`),
      webpLarge: path.join(baseDir, 'webp', `${baseName}-large.webp`),
    };

    // Créer un clone de l'image pour chaque version
    const imageClone = sharp(inputPath);

    // Optimiser l'image originale (JPEG haute qualité)
    await image
      .resize(this.LARGE_SIZE, this.LARGE_SIZE, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({
        quality: 90,
        progressive: true,
        mozjpeg: true,
      })
      .toFile(paths.original);

    // Thumbnail JPEG (150x150px crop center)
    await imageClone
      .resize(this.THUMBNAIL_SIZE, this.THUMBNAIL_SIZE, {
        fit: 'cover',
        position: 'center',
      })
      .jpeg({
        quality: 80,
        progressive: true,
      })
      .toFile(paths.thumbnail);

    // Version medium JPEG (500x500px)
    await imageClone
      .resize(this.MEDIUM_SIZE, this.MEDIUM_SIZE, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({
        quality,
        progressive: true,
      })
      .toFile(paths.medium);

    // Version large JPEG (1200x1200px)
    await imageClone
      .resize(this.LARGE_SIZE, this.LARGE_SIZE, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .jpeg({
        quality,
        progressive: true,
      })
      .toFile(paths.large);

    // Versions WebP optimisées
    await imageClone
      .resize(this.LARGE_SIZE, this.LARGE_SIZE, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: this.WEBP_QUALITY,
        effort: compressionLevel,
      })
      .toFile(paths.webp);

    await imageClone
      .resize(this.THUMBNAIL_SIZE, this.THUMBNAIL_SIZE, {
        fit: 'cover',
        position: 'center',
      })
      .webp({
        quality: 75,
        effort: compressionLevel,
      })
      .toFile(paths.webpThumbnail);

    await imageClone
      .resize(this.MEDIUM_SIZE, this.MEDIUM_SIZE, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: this.WEBP_QUALITY,
        effort: compressionLevel,
      })
      .toFile(paths.webpMedium);

    await imageClone
      .resize(this.LARGE_SIZE, this.LARGE_SIZE, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({
        quality: this.WEBP_QUALITY,
        effort: compressionLevel,
      })
      .toFile(paths.webpLarge);

    // Calculer les statistiques d'optimisation
    const optimizedStats = await fs.stat(paths.medium);
    const processingTime = Date.now() - startTime;

    const stats: OptimizationStats = {
      originalSize: originalStats.size,
      optimizedSize: optimizedStats.size,
      compressionRatio: ((originalStats.size - optimizedStats.size) / originalStats.size) * 100,
      processingTime,
      format: 'webp',
    };

    // Générer le checksum pour l'intégrité
    const checksum = await this.generateChecksum(paths.original);

    const metadata: ImageMetadata = {
      id: imageId,
      originalName: filename,
      originalSize: originalStats.size,
      optimizedSize: optimizedStats.size,
      dimensions: {
        width: originalMetadata.width || 0,
        height: originalMetadata.height || 0,
      },
      format: originalMetadata.format || 'unknown',
      uploadDate: new Date(),
      productId,
      checksum,
      displayOrder: 0,
    };

    return { paths, metadata, stats };
  }

  /**
   * Valide une image selon les spécifications
   */
  static async validateImage(filePath: string): Promise<{
    isValid: boolean;
    error?: string;
    metadata?: sharp.Metadata;
    suggestions?: string[];
  }> {
    try {
      const metadata = await sharp(filePath).metadata();
      const stats = await fs.stat(filePath);
      const suggestions: string[] = [];

      // Vérifier la taille du fichier
      if (stats.size > this.MAX_FILE_SIZE) {
        return {
          isValid: false,
          error: `Fichier trop volumineux (${this.formatFileSize(stats.size)}). Maximum: ${this.formatFileSize(this.MAX_FILE_SIZE)}`,
        };
      }

      // Vérifier le format
      if (!metadata.format || !this.ALLOWED_FORMATS.includes(metadata.format)) {
        return {
          isValid: false,
          error: `Format non supporté: ${metadata.format}. Formats acceptés: ${this.ALLOWED_FORMATS.join(', ')}`,
        };
      }

      // Vérifier les dimensions minimales
      if (
        (metadata.width || 0) < this.MIN_DIMENSIONS ||
        (metadata.height || 0) < this.MIN_DIMENSIONS
      ) {
        return {
          isValid: false,
          error: `Dimensions insuffisantes: ${metadata.width}x${metadata.height}px. Minimum: ${this.MIN_DIMENSIONS}x${this.MIN_DIMENSIONS}px`,
        };
      }

      // Suggestions d'amélioration
      if (metadata.width && metadata.height) {
        const ratio = metadata.width / metadata.height;
        if (ratio < 0.8 || ratio > 1.2) {
          suggestions.push('Ratio recommandé: 1:1 (carré) ou 4:3 pour un meilleur rendu');
        }
      }

      if (stats.size > 5 * 1024 * 1024) {
        // 5MB
        suggestions.push("Fichier volumineux. L'optimisation automatique réduira la taille");
      }

      return {
        isValid: true,
        metadata,
        suggestions,
      };
    } catch (error) {
      return {
        isValid: false,
        error: `Erreur lors de la validation: ${error instanceof Error ? error.message : 'Erreur inconnue'}`,
      };
    }
  }

  /**
   * Génère un nom de fichier sécurisé selon les spécifications
   */
  static generateSafeFilename(originalName: string, productId: string, timestamp: number): string {
    const ext = path.extname(originalName).toLowerCase();
    const baseName = path.parse(originalName).name;

    // Nettoyer le nom de fichier
    const cleanName = baseName
      .replace(/[^a-zA-Z0-9-_]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase();

    // Format: product-{id}-{timestamp}-{index}.{ext}
    return `product-${productId}-${timestamp}-${cleanName}${ext}`;
  }

  /**
   * Supprime toutes les versions d'une image
   */
  static async deleteImageVersions(paths: OptimizedImageSizes): Promise<void> {
    const filesToDelete = Object.values(paths);

    for (const filePath of filesToDelete) {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.warn(`Impossible de supprimer ${filePath}:`, error);
      }
    }
  }

  /**
   * Calcule les statistiques d'optimisation
   */
  static calculateOptimizationStats(originalSize: number, optimizedSize: number) {
    const compressionRatio = ((originalSize - optimizedSize) / originalSize) * 100;
    const sizeReduction = originalSize - optimizedSize;

    return {
      originalSize: this.formatFileSize(originalSize),
      optimizedSize: this.formatFileSize(optimizedSize),
      compressionRatio: compressionRatio.toFixed(1),
      sizeReduction: this.formatFileSize(sizeReduction),
      savings: `${compressionRatio.toFixed(1)}%`,
    };
  }

  /**
   * Formate la taille de fichier en format lisible
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';

    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  /**
   * Génère un checksum SHA-256 pour l'intégrité
   */
  static async generateChecksum(filePath: string): Promise<string> {
    const fileBuffer = await fs.readFile(filePath);
    return crypto.createHash('sha256').update(fileBuffer).digest('hex');
  }

  /**
   * Vérifie l'intégrité d'une image
   */
  static async verifyChecksum(filePath: string, expectedChecksum: string): Promise<boolean> {
    try {
      const actualChecksum = await this.generateChecksum(filePath);
      return actualChecksum === expectedChecksum;
    } catch (error) {
      return false;
    }
  }

  /**
   * Génère un srcset pour les images responsives
   */
  static generateSrcSet(
    basePath: string,
    productId: string,
    filename: string,
    preferWebP: boolean = true
  ): string {
    const baseName = path.parse(filename).name;

    if (preferWebP) {
      return [
        `/images/products/webp/${baseName}-thumb.webp 150w`,
        `/images/products/webp/${baseName}-medium.webp 500w`,
        `/images/products/webp/${baseName}-large.webp 1200w`,
        `/images/products/webp/${baseName}.webp 1200w`,
      ].join(', ');
    } else {
      return [
        `/images/products/thumbnails/${baseName}-thumb.jpg 150w`,
        `/images/products/medium/${baseName}-medium.jpg 500w`,
        `/images/products/large/${baseName}-large.jpg 1200w`,
        `/images/products/originals/${baseName}.jpg 1200w`,
      ].join(', ');
    }
  }

  /**
   * Obtient l'URL optimale selon le contexte
   */
  static getOptimalImageUrl(
    paths: OptimizedImageSizes,
    context: 'thumbnail' | 'medium' | 'large' | 'original' = 'medium',
    preferWebP: boolean = true
  ): string {
    const basePath = '/images/products';

    switch (context) {
      case 'thumbnail':
        return preferWebP ? paths.webpThumbnail : paths.thumbnail;
      case 'medium':
        return preferWebP ? paths.webpMedium : paths.medium;
      case 'large':
        return preferWebP ? paths.webpLarge : paths.large;
      case 'original':
        return preferWebP ? paths.webp : paths.original;
      default:
        return preferWebP ? paths.webpMedium : paths.medium;
    }
  }

  /**
   * Nettoie les fichiers temporaires
   */
  static async cleanupTempFiles(tempFiles: string[]): Promise<void> {
    for (const filePath of tempFiles) {
      try {
        await fs.unlink(filePath);
      } catch (error) {
        console.warn(`Impossible de supprimer le fichier temporaire ${filePath}:`, error);
      }
    }
  }
}
