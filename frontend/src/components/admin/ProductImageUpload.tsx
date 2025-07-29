'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/Button';
import { 
  Upload, 
  X, 
  Image as ImageIcon, 
  Camera, 
  Trash2,
  Move,
  CheckCircle,
  AlertCircle,
  Loader2,
  Eye,
  Settings,
  BarChart3,
  RotateCcw,
  Crop,
  Maximize2,
  Download
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { ProductImagesService } from '@/lib/api/productImages';

export interface UploadedImage {
  id: string;
  file: File;
  preview: string;
  status: 'uploading' | 'success' | 'error' | 'processing';
  progress: number;
  error?: string;
  optimizedPaths?: {
    original: string;
    thumbnail: string;
    medium: string;
    large: string;
    webp: string;
    webpThumbnail: string;
    webpMedium: string;
    webpLarge: string;
  };
  metadata?: {
    originalSize: number;
    optimizedSize: number;
    dimensions: { width: number; height: number };
    format: string;
    uploadDate: Date;
    checksum: string;
    displayOrder: number;
  };
  stats?: {
    originalSize: number;
    optimizedSize: number;
    compressionRatio: number;
    processingTime: number;
    format: string;
  };
}

interface ProductImageUploadProps {
  productId: string;
  onImagesChange: (images: UploadedImage[]) => void;
  maxImages?: number;
  maxSize?: number; // en MB
  className?: string;
  existingImages?: UploadedImage[];
}

export function ProductImageUpload({
  productId,
  onImagesChange,
  maxImages = 8,
  maxSize = 10,
  className = '',
  existingImages = []
}: ProductImageUploadProps) {
  const [images, setImages] = useState<UploadedImage[]>(existingImages);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);
  const [isReordering, setIsReordering] = useState(false);

  // Mettre à jour les images parent quand elles changent
  useEffect(() => {
    onImagesChange(images);
  }, [images, onImagesChange]);

  // Configuration Dropzone
  const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
    // Gérer les fichiers rejetés
    rejectedFiles.forEach(({ file, errors }) => {
      errors.forEach((error: any) => {
        toast.error(`${file.name}: ${error.message}`);
      });
    });

    // Vérifier la limite d'images
    if (images.length + acceptedFiles.length > maxImages) {
      toast.error(`Maximum ${maxImages} images autorisées`);
      return;
    }

    // Valider les fichiers
    const validation = ProductImagesService.validateFiles(acceptedFiles);
    if (validation.errors.length > 0) {
      validation.errors.forEach(error => toast.error(error));
      return;
    }

    // Ajouter les nouveaux fichiers
    const newImages: UploadedImage[] = validation.validFiles.map(file => ({
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      file,
      preview: URL.createObjectURL(file),
      status: 'uploading',
      progress: 0
    }));

    setImages(prev => [...prev, ...newImages]);

    // Upload réel vers l'API
    uploadImagesToServer(validation.validFiles, newImages);
  }, [images, maxImages, productId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.webp']
    },
    maxSize: maxSize * 1024 * 1024,
    multiple: true,
    disabled: isUploading || images.length >= maxImages,
    noClick: false,
    noKeyboard: false,
    onDragEnter: () => setDragActive(true),
    onDragLeave: () => setDragActive(false),
    onDragOver: () => setDragActive(true)
  });

  // Upload vers le serveur
  const uploadImagesToServer = async (files: File[], newImages: UploadedImage[]) => {
    setIsUploading(true);
    
    try {
      const response = await ProductImagesService.uploadImages(productId, files);
      
      if (response.success && response.images) {
        // Mettre à jour les images avec les données du serveur
        setImages(prev => {
          const updatedImages = [...prev];
          
          response.images!.forEach((serverImage, index) => {
            const localImageIndex = updatedImages.findIndex(img => img.id === newImages[index].id);
            if (localImageIndex !== -1) {
              updatedImages[localImageIndex] = {
                ...updatedImages[localImageIndex],
                status: 'success' as const,
      progress: 100,
                optimizedPaths: serverImage.optimizedPaths,
                metadata: serverImage.metadata,
                stats: serverImage.stats
              };
            }
          });
          
          return updatedImages;
        });

        toast.success(response.message);
      } else {
        // Marquer les images comme en erreur
        setImages(prev => {
          const updatedImages = [...prev];
          newImages.forEach(newImage => {
            const index = updatedImages.findIndex(img => img.id === newImage.id);
            if (index !== -1) {
              updatedImages[index] = {
                ...updatedImages[index],
                status: 'error' as const,
                error: response.message
              };
            }
          });
          return updatedImages;
        });

        toast.error(response.message);
        if (response.errors) {
          response.errors.forEach(error => toast.error(error));
        }
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      
      // Marquer toutes les nouvelles images comme en erreur
      setImages(prev => {
        const updatedImages = [...prev];
        newImages.forEach(newImage => {
          const index = updatedImages.findIndex(img => img.id === newImage.id);
          if (index !== -1) {
            updatedImages[index] = {
              ...updatedImages[index],
              status: 'error' as const,
              error: 'Erreur lors de l\'upload'
            };
          }
        });
        return updatedImages;
    });

      toast.error('Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);
    }
  };

  // Supprimer une image
  const removeImage = (imageId: string) => {
    const image = images.find(img => img.id === imageId);
    if (!image) return;

    // Si l'image a été uploadée avec succès, la supprimer du serveur
    if (image.status === 'success' && image.metadata) {
      ProductImagesService.deleteImage(productId, image.id)
        .then(response => {
          if (response.success) {
            toast.success('Image supprimée avec succès');
          } else {
            toast.error(response.message);
          }
        })
        .catch(error => {
          console.error('Erreur suppression:', error);
          toast.error('Erreur lors de la suppression');
        });
    }

    // Nettoyer la prévisualisation
    if (image.preview) {
      URL.revokeObjectURL(image.preview);
    }

    setImages(prev => prev.filter(img => img.id !== imageId));
  };

  // Réorganiser les images
  const moveImage = (fromIndex: number, toIndex: number) => {
    if (fromIndex === toIndex) return;

    setImages(prev => {
      const newImages = [...prev];
      const [movedImage] = newImages.splice(fromIndex, 1);
      newImages.splice(toIndex, 0, movedImage);
      return newImages;
    });
  };

  // Sauvegarder l'ordre
  const saveOrder = async () => {
    const successImages = images.filter(img => img.status === 'success');
    if (successImages.length === 0) return;

    try {
              const imageOrder = successImages.map(img => img.id);
      const response = await ProductImagesService.reorderImages(productId, imageOrder);
      
      if (response.success) {
        toast.success('Ordre des images sauvegardé');
        setIsReordering(false);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Erreur sauvegarde ordre:', error);
      toast.error('Erreur lors de la sauvegarde de l\'ordre');
    }
  };

  // Ouvrir la caméra (si supportée)
  const openCamera = () => {
    try {
      if (typeof window !== 'undefined' && 'navigator' in window && 'mediaDevices' in navigator) {
        // Implémentation de la capture photo
        toast('Fonctionnalité caméra en cours de développement');
      } else {
        toast.error('Caméra non supportée sur ce navigateur');
      }
    } catch (error) {
      toast.error('Caméra non supportée sur ce navigateur');
    }
  };

  // Calculer les statistiques
  const calculateStats = () => {
    const successImages = images.filter(img => img.status === 'success');
    if (successImages.length === 0) return null;

    const totalOriginalSize = successImages.reduce((sum, img) => sum + (img.stats?.originalSize || 0), 0);
    const totalOptimizedSize = successImages.reduce((sum, img) => sum + (img.stats?.optimizedSize || 0), 0);
    const avgCompressionRatio = successImages.reduce((sum, img) => sum + (img.stats?.compressionRatio || 0), 0) / successImages.length;

    return {
      totalImages: successImages.length,
      totalOriginalSize: ProductImagesService.formatFileSize(totalOriginalSize),
      totalOptimizedSize: ProductImagesService.formatFileSize(totalOptimizedSize),
      avgCompressionRatio: avgCompressionRatio.toFixed(1),
      spaceSaved: ProductImagesService.formatFileSize(totalOriginalSize - totalOptimizedSize)
    };
  };

  const stats = calculateStats();

  return (
    <div className={`space-y-6 ${className}`}>
      {/* En-tête avec statistiques */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Images du produit</h3>
          <p className="text-sm text-gray-500">
            {images.length} / {maxImages} images • Max {maxSize}MB par fichier
          </p>
        </div>
        
        <div className="flex items-center space-x-2">
          {stats && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowStats(!showStats)}
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Statistiques
            </Button>
          )}
          
          {images.filter(img => img.status === 'success').length > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsReordering(!isReordering)}
            >
              <Move className="h-4 w-4 mr-2" />
              Réorganiser
            </Button>
          )}
        </div>
      </div>

      {/* Statistiques */}
      {showStats && stats && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Statistiques d'optimisation</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <p className="text-blue-600">Images</p>
              <p className="font-semibold text-blue-900">{stats.totalImages}</p>
            </div>
            <div>
              <p className="text-blue-600">Taille originale</p>
              <p className="font-semibold text-blue-900">{stats.totalOriginalSize}</p>
            </div>
            <div>
              <p className="text-blue-600">Taille optimisée</p>
              <p className="font-semibold text-blue-900">{stats.totalOptimizedSize}</p>
            </div>
            <div>
              <p className="text-blue-600">Espace économisé</p>
              <p className="font-semibold text-blue-900">{stats.spaceSaved}</p>
            </div>
          </div>
        </div>
      )}

      {/* Zone de drop */}
      {images.length < maxImages && (
      <div
        {...getRootProps()}
        className={`
            border-2 border-dashed rounded-lg p-8 text-center transition-colors
            ${isDragActive || dragActive
              ? 'border-black bg-black/5'
            : 'border-gray-300 hover:border-gray-400'
          }
            ${isUploading ? 'opacity-50 pointer-events-none' : ''}
        `}
      >
        
        <div className="space-y-4">
            <div className="flex justify-center">
              <div className={`
                p-3 rounded-full
                ${isDragActive || dragActive ? 'bg-black text-white' : 'bg-gray-100 text-gray-600'}
              `}>
                <Upload className="h-6 w-6" />
              </div>
          </div>
          
          <div>
              <p className="text-lg font-medium text-gray-900">
                {isDragActive ? 'Déposez les images ici' : 'Glissez-déposez vos images'}
              </p>
              <p className="text-sm text-gray-500 mt-1">
              ou cliquez pour sélectionner des fichiers
            </p>
            </div>
            
                         <div className="flex justify-center">
              <Button
                variant="outline"
                 size="sm"
                 onClick={openCamera}
                 disabled={isUploading}
               >
                 <Camera className="h-4 w-4 mr-2" />
                 Caméra
              </Button>
             </div>
            
            <div className="text-xs text-gray-400">
              Formats acceptés: JPEG, PNG, WebP • Max {maxSize}MB par fichier
            </div>
          </div>
        </div>
      )}

      {/* Grille d'images */}
      {images.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image, index) => (
              <div
                key={image.id}
                className={`
                  relative group bg-white border rounded-lg overflow-hidden
                  ${isReordering ? 'cursor-move' : ''}
                  ${selectedImage === image.id ? 'ring-2 ring-black' : ''}
                `}
              >
                {/* Image */}
                <div className="aspect-square relative">
                  <Image
                    src={image.preview}
                    alt={image.file.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                  />
                  
                  {/* Overlay avec actions */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors">
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedImage(image.id)}
                          className="p-3 bg-white/90 rounded-full hover:bg-white transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                        >
                          <Eye className="h-4 w-4 text-gray-700" />
                        </button>
                        
                      <button
                        onClick={() => removeImage(image.id)}
                          className="p-3 bg-red-500/90 rounded-full hover:bg-red-500 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
                      >
                          <Trash2 className="h-4 w-4 text-white" />
                      </button>
                      </div>
                    </div>
                  </div>

                  {/* Indicateur de statut */}
                  <div className="absolute top-2 right-2">
                    {image.status === 'uploading' && (
                      <div className="bg-blue-500 text-white rounded-full p-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                      </div>
                    )}
                    {image.status === 'success' && (
                      <div className="bg-green-500 text-white rounded-full p-1">
                        <CheckCircle className="h-3 w-3" />
                      </div>
                    )}
                    {image.status === 'error' && (
                      <div className="bg-red-500 text-white rounded-full p-1">
                        <AlertCircle className="h-3 w-3" />
                      </div>
                    )}
                  </div>

                  {/* Barre de progression */}
                  {image.status === 'uploading' && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${image.progress}%` }}
                      />
                    </div>
                  )}
                </div>

                {/* Informations */}
                <div className="p-3">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {image.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {ProductImagesService.formatFileSize(image.file.size)}
                  </p>
                  
                  {image.error && (
                    <p className="text-xs text-red-500 mt-1">
                      {image.error}
                    </p>
                  )}
                  
                  {image.stats && (
                    <p className="text-xs text-green-600 mt-1">
                      Optimisé: {image.stats.compressionRatio.toFixed(1)}% de réduction
                    </p>
                  )}
                </div>

                {/* Boutons de réorganisation */}
                {isReordering && (
                  <div className="absolute top-2 left-2 flex space-x-1">
                    {index > 0 && (
                      <button
                        onClick={() => moveImage(index, index - 1)}
                        className="p-1 bg-white/90 rounded hover:bg-white transition-colors"
                      >
                        <Move className="h-3 w-3 text-gray-700 rotate-90" />
                      </button>
                    )}
                    {index < images.length - 1 && (
                      <button
                        onClick={() => moveImage(index, index + 1)}
                        className="p-1 bg-white/90 rounded hover:bg-white transition-colors"
                      >
                        <Move className="h-3 w-3 text-gray-700 -rotate-90" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Actions de réorganisation */}
          {isReordering && (
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsReordering(false)}
              >
                <X className="h-4 w-4 mr-2" />
                Annuler
              </Button>
              
              <Button
                size="sm"
                onClick={saveOrder}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Sauvegarder l'ordre
              </Button>
            </div>
          )}
        </div>
      )}

      {/* État vide */}
      {images.length === 0 && !isUploading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-4">
            <ImageIcon className="h-12 w-12 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune image</h3>
          <p className="text-gray-500">Ajoutez des images pour votre produit</p>
        </div>
      )}
    </div>
  );
}
