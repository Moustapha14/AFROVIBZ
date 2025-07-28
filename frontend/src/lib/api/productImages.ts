import { UploadedImage } from '@/components/admin/ProductImageUpload';

export interface OptimizedImageResponse {
  id: string;
  originalName: string;
  optimizedPaths: {
    original: string;
    thumbnail: string;
    medium: string;
    large: string;
    webp: string;
    webpThumbnail: string;
    webpMedium: string;
    webpLarge: string;
  };
  metadata: {
    originalSize: number;
    optimizedSize: number;
    dimensions: { width: number; height: number };
    format: string;
    uploadDate: Date;
    checksum: string;
    displayOrder: number;
  };
  stats: {
    originalSize: number;
    optimizedSize: number;
    compressionRatio: number;
    processingTime: number;
    format: string;
  };
}

export interface UploadResponse {
  success: boolean;
  message: string;
  images?: OptimizedImageResponse[];
  errors?: string[];
}

export interface ProductImagesResponse {
  success: boolean;
  images: OptimizedImageResponse[];
}

export interface ReorderResponse {
  success: boolean;
  message: string;
}

export interface DeleteResponse {
  success: boolean;
  message: string;
}

/**
 * Service pour la gestion des images produits
 */
export class ProductImagesService {
  private static readonly API_BASE = '/api/admin/products';

  /**
   * Upload d'images pour un produit
   */
  static async uploadImages(
    productId: string,
    files: File[]
  ): Promise<UploadResponse> {
    try {
      const formData = new FormData();
      
      files.forEach(file => {
        formData.append('images', file);
      });

      const response = await fetch(`${this.API_BASE}/${productId}/images`, {
        method: 'POST',
        body: formData,
        // Pas de Content-Type, laissé au navigateur pour FormData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de l\'upload');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur upload images:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  /**
   * Récupérer les images d'un produit
   */
  static async getProductImages(productId: string): Promise<ProductImagesResponse> {
    try {
      const response = await fetch(`${this.API_BASE}/${productId}/images`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la récupération');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur récupération images:', error);
      return {
        success: false,
        images: []
      };
    }
  }

  /**
   * Réorganiser les images d'un produit
   */
  static async reorderImages(
    productId: string,
    imageOrder: string[]
  ): Promise<ReorderResponse> {
    try {
      const response = await fetch(`${this.API_BASE}/${productId}/images`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageOrder }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la réorganisation');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur réorganisation images:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  /**
   * Supprimer une image d'un produit
   */
  static async deleteImage(
    productId: string,
    imageId: string
  ): Promise<DeleteResponse> {
    try {
      const response = await fetch(`${this.API_BASE}/${productId}/images?imageId=${imageId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erreur lors de la suppression');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur suppression image:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }

  /**
   * Valide un fichier selon les spécifications
   */
  static validateFile(file: File): { isValid: boolean; error?: string } {
    // Vérifier la taille (10MB max)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return {
        isValid: false,
        error: `Fichier trop volumineux. Taille maximale : 10MB`
      };
    }

    // Vérifier le type MIME
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return {
        isValid: false,
        error: `Type de fichier non supporté. Formats acceptés : JPEG, PNG, WebP`
      };
    }

    // Vérifier l'extension
    const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
    const extension = file.name.toLowerCase().substring(file.name.lastIndexOf('.'));
    if (!allowedExtensions.includes(extension)) {
      return {
        isValid: false,
        error: `Extension non supportée. Extensions acceptées : .jpg, .jpeg, .png, .webp`
      };
    }

    return { isValid: true };
  }

  /**
   * Valide plusieurs fichiers
   */
  static validateFiles(files: File[]): { validFiles: File[]; errors: string[] } {
    const validFiles: File[] = [];
    const errors: string[] = [];

    files.forEach(file => {
      const validation = this.validateFile(file);
      if (validation.isValid) {
        validFiles.push(file);
      } else {
        errors.push(`${file.name}: ${validation.error}`);
      }
    });

    return { validFiles, errors };
  }

  /**
   * Calcule la taille totale des fichiers
   */
  static calculateTotalSize(files: File[]): number {
    return files.reduce((total, file) => total + file.size, 0);
  }

  /**
   * Formate la taille de fichier en format lisible
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
    const baseName = filename.substring(0, filename.lastIndexOf('.'));
    
    if (preferWebP) {
      return [
        `/images/products/webp/${baseName}-thumb.webp 150w`,
        `/images/products/webp/${baseName}-medium.webp 500w`,
        `/images/products/webp/${baseName}-large.webp 1200w`,
        `/images/products/webp/${baseName}.webp 1200w`
      ].join(', ');
    } else {
    return [
        `/images/products/thumbnails/${baseName}-thumb.jpg 150w`,
        `/images/products/medium/${baseName}-medium.jpg 500w`,
        `/images/products/large/${baseName}-large.jpg 1200w`,
        `/images/products/originals/${baseName}.jpg 1200w`
    ].join(', ');
    }
  }

  /**
   * Obtient l'URL optimale selon le contexte
   */
  static getOptimalImageUrl(
    optimizedPaths: OptimizedImageResponse['optimizedPaths'],
    context: 'thumbnail' | 'medium' | 'large' | 'original' = 'medium',
    preferWebP: boolean = true
  ): string {
    switch (context) {
      case 'thumbnail':
        return preferWebP ? optimizedPaths.webpThumbnail : optimizedPaths.thumbnail;
      case 'medium':
        return preferWebP ? optimizedPaths.webpMedium : optimizedPaths.medium;
      case 'large':
        return preferWebP ? optimizedPaths.webpLarge : optimizedPaths.large;
      case 'original':
        return preferWebP ? optimizedPaths.webp : optimizedPaths.original;
      default:
        return preferWebP ? optimizedPaths.webpMedium : optimizedPaths.medium;
    }
  }

  /**
   * Génère des métadonnées pour l'accessibilité
   */
  static generateAltText(filename: string, productName?: string): string {
    const baseName = filename.substring(0, filename.lastIndexOf('.'));
    const cleanName = baseName.replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
    
    if (productName) {
      return `${productName} - ${cleanName}`;
    }
    
    return cleanName;
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
      savings: `${compressionRatio.toFixed(1)}%`
    };
  }
} 