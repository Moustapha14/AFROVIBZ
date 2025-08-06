'use client';

import { ImageIcon, Camera, X, Upload } from 'lucide-react';
import Image from 'next/image';
import React, { useRef, useState } from 'react';

import { Button } from '@/components/ui/Button';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
  maxSize?: number; // en MB
}

export default function ImageUpload({
  images,
  onImagesChange,
  maxImages = 20,
  maxSize = 5,
}: ImageUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    setUploading(true);
    const newImages: string[] = [];
    const validFiles = Array.from(files).filter(file => {
      // Vérifier le type de fichier
      if (!file.type.startsWith('image/')) {
        alert(`Le fichier ${file.name} n'est pas une image valide.`);
        return false;
      }

      // Vérifier la taille
      if (file.size > maxSize * 1024 * 1024) {
        alert(`Le fichier ${file.name} est trop volumineux. Taille maximale: ${maxSize}MB`);
        return false;
      }

      return true;
    });

    // Limiter le nombre d'images
    const remainingSlots = maxImages - images.length;
    const filesToProcess = validFiles.slice(0, remainingSlots);

    if (filesToProcess.length < validFiles.length) {
      alert(`Vous ne pouvez ajouter que ${remainingSlots} image(s) supplémentaire(s).`);
    }

    for (const file of filesToProcess) {
      try {
        const imageUrl = await convertFileToBase64(file);
        newImages.push(imageUrl);
      } catch (error) {
        console.error('Erreur lors de la conversion du fichier:', error);
        alert(`Erreur lors du traitement de ${file.name}`);
      }
    }

    onImagesChange([...images, ...newImages]);
    setUploading(false);
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  return (
    <div className='space-y-4'>
      {/* Zone de téléversement */}
      <div
        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
          isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className='space-y-4'>
          <div className='flex justify-center'>
            <Upload className='h-12 w-12 text-gray-400' />
          </div>

          <div>
            <p className='text-lg font-medium text-gray-900'>Glissez-déposez vos images ici</p>
            <p className='text-sm text-gray-500 mt-1'>ou utilisez les boutons ci-dessous</p>
          </div>

          <div className='flex flex-col sm:flex-row gap-3 justify-center'>
            <Button
              type='button'
              variant='outline'
              onClick={openFileDialog}
              disabled={uploading || images.length >= maxImages}
              className='flex items-center gap-2'
            >
              <ImageIcon className='h-4 w-4' />
              Choisir des fichiers
            </Button>

            <Button
              type='button'
              variant='outline'
              onClick={openCamera}
              disabled={uploading || images.length >= maxImages}
              className='flex items-center gap-2'
            >
              <Camera className='h-4 w-4' />
              Prendre une photo
            </Button>
          </div>

          <p className='text-xs text-gray-500'>
            Formats acceptés: JPG, PNG, GIF • Taille max: {maxSize}MB • Maximum {maxImages} images
          </p>
        </div>
      </div>

      {/* Inputs cachés */}
      <input
        ref={fileInputRef}
        type='file'
        multiple
        accept='image/*'
        onChange={e => handleFileSelect(e.target.files)}
        className='hidden'
      />

      <input
        ref={cameraInputRef}
        type='file'
        accept='image/*'
        capture='environment'
        onChange={e => handleFileSelect(e.target.files)}
        className='hidden'
      />

      {/* Prévisualisation des images */}
      {images.length > 0 && (
        <div className='space-y-3'>
          <h4 className='text-sm font-medium text-gray-700'>
            Images téléversées ({images.length}/{maxImages})
          </h4>

          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4'>
            {images.map((image, index) => (
              <div key={index} className='relative group'>
                <div className='aspect-square rounded-lg overflow-hidden bg-gray-100'>
                  <Image
                    src={image}
                    alt={`Image ${index + 1}`}
                    layout='fill'
                    objectFit='cover'
                    onError={() => {
                      // Fallback handled by Next.js Image component
                    }}
                  />
                </div>

                <button
                  type='button'
                  onClick={() => removeImage(index)}
                  className='absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity'
                >
                  <X className='h-3 w-3' />
                </button>

                <div className='absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white text-xs p-1 text-center'>
                  Image {index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Indicateur de chargement */}
      {uploading && (
        <div className='text-center py-4'>
          <div className='inline-flex items-center gap-2 text-blue-600'>
            <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600' />
            Téléversement en cours...
          </div>
        </div>
      )}
    </div>
  );
}
