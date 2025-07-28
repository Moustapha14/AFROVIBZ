'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { ProductImageUpload } from '@/components/admin/ProductImageUpload';
import { ProductImagesService, OptimizedImageResponse } from '@/lib/api/productImages';
import { 
  ArrowLeft, 
  Image as ImageIcon, 
  Settings, 
  BarChart3,
  Download,
  Trash2,
  Move,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

export default function ProductImagesPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading } = useAuth();
  const productId = params.id as string;

  const [images, setImages] = useState<OptimizedImageResponse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showStats, setShowStats] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'super_admin')) {
      router.push('/auth/login');
      return;
    }

    if (productId) {
      loadProductImages();
    }
  }, [user, loading, productId, router]);

  const loadProductImages = async () => {
    try {
      setIsLoading(true);
      const response = await ProductImagesService.getProductImages(productId);
      
      if (response.success) {
        setImages(response.images);
      } else {
        toast.error('Erreur lors du chargement des images');
      }
    } catch (error) {
      console.error('Erreur chargement images:', error);
      toast.error('Erreur lors du chargement des images');
    } finally {
      setIsLoading(false);
    }
  };

  const handleImagesChange = async (uploadedImages: any[]) => {
    if (uploadedImages.length === 0) return;

    setIsUploading(true);
    try {
      const files = uploadedImages.map(img => img.file);
      const response = await ProductImagesService.uploadImages(productId, files);

      if (response.success && response.images) {
        setImages(prev => [...prev, ...response.images!]);
        toast.success(response.message);
      } else {
        toast.error(response.message);
        if (response.errors) {
          response.errors.forEach(error => toast.error(error));
        }
      }
    } catch (error) {
      console.error('Erreur upload:', error);
      toast.error('Erreur lors de l\'upload');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette image ?')) {
      return;
    }

    try {
      const response = await ProductImagesService.deleteImage(productId, imageId);
      
      if (response.success) {
        setImages(prev => prev.filter(img => img.id !== imageId));
        toast.success('Image supprimée avec succès');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Erreur suppression:', error);
      toast.error('Erreur lors de la suppression');
    }
  };

  const handleReorderImages = async (newOrder: string[]) => {
    try {
      const response = await ProductImagesService.reorderImages(productId, newOrder);
      
      if (response.success) {
        // Recharger les images pour avoir le bon ordre
        await loadProductImages();
        toast.success('Ordre des images mis à jour');
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error('Erreur réorganisation:', error);
      toast.error('Erreur lors de la réorganisation');
    }
  };

  const moveImage = (fromIndex: number, toIndex: number) => {
    const newImages = [...images];
    const [movedImage] = newImages.splice(fromIndex, 1);
    newImages.splice(toIndex, 0, movedImage);
    setImages(newImages);

    // Mettre à jour l'ordre côté serveur
    const newOrder = newImages.map(img => img.id);
    handleReorderImages(newOrder);
  };

  const calculateStats = () => {
    const totalOriginalSize = images.reduce((sum, img) => sum + img.metadata.originalSize, 0);
    const totalOptimizedSize = images.reduce((sum, img) => sum + img.metadata.optimizedSize, 0);
    const totalReduction = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize) * 100;

    return {
      totalImages: images.length,
      totalOriginalSize: ProductImagesService.formatFileSize(totalOriginalSize),
      totalOptimizedSize: ProductImagesService.formatFileSize(totalOptimizedSize),
      totalReduction: Math.round(totalReduction * 100) / 100,
      savedSpace: ProductImagesService.formatFileSize(totalOriginalSize - totalOptimizedSize)
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'super_admin') {
    return null;
  }

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                onClick={() => router.back()}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Retour
              </Button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Gestion des Images Produit
                </h1>
                <p className="text-gray-600 mt-1">
                  ID Produit: {productId}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowStats(!showStats)}
                className="flex items-center gap-2"
              >
                <BarChart3 className="h-4 w-4" />
                Statistiques
              </Button>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        {showStats && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Statistiques d'Optimisation
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.totalImages}</div>
                <div className="text-sm text-gray-600">Images</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-gray-900">{stats.totalOriginalSize}</div>
                <div className="text-sm text-gray-600">Taille originale</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-green-600">{stats.totalOptimizedSize}</div>
                <div className="text-sm text-gray-600">Taille optimisée</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-purple-600">{stats.totalReduction}%</div>
                <div className="text-sm text-gray-600">Réduction</div>
              </div>
              <div className="text-center">
                <div className="text-lg font-semibold text-orange-600">{stats.savedSpace}</div>
                <div className="text-sm text-gray-600">Espace économisé</div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Zone d'Upload */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Ajouter des Images
              </h3>
              
              <ProductImageUpload
                productId={productId}
                onImagesChange={handleImagesChange}
                maxImages={10}
                maxSize={5}
              />

              {isUploading && (
                <div className="mt-4 text-center">
                  <div className="inline-flex items-center gap-2 text-blue-600">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    Optimisation en cours...
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Galerie d'Images */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Images du Produit ({images.length})
                </h3>
                {images.length > 0 && (
                  <div className="text-sm text-gray-500">
                    Glissez-déposez pour réorganiser
                  </div>
                )}
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
                  <p className="text-gray-600">Chargement des images...</p>
                </div>
              ) : images.length === 0 ? (
                <div className="text-center py-12">
                  <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Aucune image
                  </h3>
                  <p className="text-gray-500">
                    Commencez par ajouter des images à votre produit
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {images.map((image, index) => (
                    <div
                      key={image.id}
                      className="relative group border border-gray-200 rounded-lg overflow-hidden"
                    >
                      {/* Image principale */}
                      <div className="aspect-square bg-gray-100">
                        <Image
                          src={ProductImagesService.getOptimalImageUrl(image.optimizedPaths, 'medium')}
                          alt={image.originalName}
                          fill
                          className="object-cover"
                          sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, 33vw"
                        />
                      </div>

                      {/* Overlay avec actions */}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200">
                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            onClick={() => handleDeleteImage(image.id)}
                            className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            title="Supprimer"
                          >
                            <Trash2 className="h-3 w-3" />
                          </button>
                        </div>

                        {/* Boutons de réorganisation */}
                        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <div className="flex gap-1">
                            {index > 0 && (
                              <button
                                onClick={() => moveImage(index, index - 1)}
                                className="p-1 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors"
                                title="Déplacer vers la gauche"
                              >
                                <Move className="h-3 w-3 rotate-90" />
                              </button>
                            )}
                            {index < images.length - 1 && (
                              <button
                                onClick={() => moveImage(index, index + 1)}
                                className="p-1 bg-gray-700 text-white rounded-full hover:bg-gray-800 transition-colors"
                                title="Déplacer vers la droite"
                              >
                                <Move className="h-3 w-3 -rotate-90" />
                              </button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Informations de l'image */}
                      <div className="p-3">
                        <p className="text-xs text-gray-600 truncate" title={image.originalName}>
                          {image.originalName}
                        </p>
                        <div className="flex items-center justify-between mt-1">
                          <p className="text-xs text-gray-500">
                            {ProductImagesService.formatFileSize(image.metadata.optimizedSize)}
                          </p>
                          <div className="flex items-center gap-1">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            <span className="text-xs text-green-600">Optimisée</span>
                          </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {image.metadata.dimensions.width} × {image.metadata.dimensions.height}px
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 