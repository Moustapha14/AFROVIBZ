'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { X, Plus, Trash2, Upload } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ImageUpload from './ImageUpload';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  product?: Product | null;
  mode: 'add' | 'edit';
}

interface FormData {
  name: string;
  description: string;
  price: string;
  originalPrice: string;
  category: string;
  stock: string;
  images: string[];
  colors: Array<{ name: string; hex: string; stock: string }>;
  sizes: string[];
  tags: string[];
  isActive: boolean;
}

const initialFormData: FormData = {
  name: '',
  description: '',
  price: '',
  originalPrice: '',
  category: 'femmes',
  stock: '',
  images: [''],
  colors: [{ name: '', hex: '#000000', stock: '' }],
  sizes: [''],
  tags: [''],
  isActive: true,
};

const categories = [
  { value: 'femmes', label: 'Femmes' },
  { value: 'hommes', label: 'Hommes' },
  { value: 'enfants', label: 'Enfants' },
  { value: 'accessoires', label: 'Accessoires' },
  { value: 'tech', label: 'Tech' },
];

export default function ProductModal({ isOpen, onClose, onSave, product, mode }: ProductModalProps) {
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  useEffect(() => {
    if (isOpen && product && mode === 'edit') {
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        originalPrice: product.originalPrice?.toString() || '',
        category: product.category,
        stock: product.stock.toString(),
        images: product.images.length > 0 ? product.images : [''],
        colors: product.colors.length > 0 ? product.colors.map(c => ({ ...c, stock: c.stock.toString() })) : [{ name: '', hex: '#000000', stock: '' }],
        sizes: product.sizes.length > 0 ? product.sizes : [''],
        tags: product.tags.length > 0 ? product.tags : [''],
        isActive: product.isActive,
      });
    } else if (isOpen && mode === 'add') {
      setFormData(initialFormData);
    }
  }, [isOpen, product, mode]);

  const validateForm = (): boolean => {
    const newErrors: Partial<FormData> = {};

    if (!formData.name.trim()) newErrors.name = 'Le nom du produit est requis';
    if (!formData.description.trim()) newErrors.description = 'La description est requise';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Le prix doit être supérieur à 0';
    if (!formData.stock || parseInt(formData.stock) < 0) newErrors.stock = 'Le stock doit être positif';
    if (!formData.category) newErrors.category = 'La catégorie est requise';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Veuillez corriger les erreurs dans le formulaire');
      return;
    }

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price: parseFloat(formData.price),
      originalPrice: formData.originalPrice ? parseFloat(formData.originalPrice) : undefined,
      category: formData.category,
      stock: parseInt(formData.stock),
      images: formData.images.filter(img => img.trim()),
      colors: formData.colors
        .filter(color => color.name.trim() && color.hex)
        .map(color => ({
          name: color.name.trim(),
          hex: color.hex,
          stock: parseInt(color.stock) || 0,
        })),
      sizes: formData.sizes.filter(size => size.trim()),
      tags: formData.tags.filter(tag => tag.trim()),
      isActive: formData.isActive,
      rating: 0, // Nouveau produit commence avec 0 étoiles
      reviews: 0, // Nouveau produit commence avec 0 avis
    };

    onSave(productData);
    onClose();
    toast.success(mode === 'add' ? 'Produit ajouté avec succès' : 'Produit modifié avec succès');
  };

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const addArrayItem = (field: 'images' | 'colors' | 'sizes' | 'tags') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], field === 'colors' ? { name: '', hex: '#000000', stock: '' } : '']
    }));
  };

  const removeArrayItem = (field: 'images' | 'colors' | 'sizes' | 'tags', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const updateArrayItem = (field: 'images' | 'colors' | 'sizes' | 'tags', index: number, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-semibold text-gray-900">
            {mode === 'add' ? 'Ajouter un produit' : 'Modifier le produit'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nom du produit *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Nom du produit"
                error={errors.name}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Catégorie *
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Description détaillée du produit"
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>

          {/* Pricing */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix (FCFA) *
              </label>
              <Input
                type="number"
                value={formData.price}
                onChange={(e) => handleInputChange('price', e.target.value)}
                placeholder="0"
                error={errors.price}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Prix original (FCFA)
              </label>
              <Input
                type="number"
                value={formData.originalPrice}
                onChange={(e) => handleInputChange('originalPrice', e.target.value)}
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Stock *
              </label>
              <Input
                type="number"
                value={formData.stock}
                onChange={(e) => handleInputChange('stock', e.target.value)}
                placeholder="0"
                error={errors.stock}
              />
            </div>
          </div>

          {/* Images */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Images du produit
            </label>
            
            {/* Option pour téléverser des images */}
            <div className="mb-4">
              <ImageUpload
                images={formData.images.filter(img => img.startsWith('data:'))}
                onImagesChange={(uploadedImages) => {
                  // Remplacer les images téléversées par les nouvelles
                  const urlImages = formData.images.filter(img => !img.startsWith('data:'));
                  setFormData(prev => ({
                    ...prev,
                    images: [...urlImages, ...uploadedImages]
                  }));
                }}
                maxImages={20}
                maxSize={5}
              />
            </div>

            {/* Option pour ajouter des URLs d'images */}
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Ou ajoutez des URLs d'images :</p>
              {formData.images.filter(img => !img.startsWith('data:')).map((image, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    value={image}
                    onChange={(e) => {
                      const urlImages = formData.images.filter(img => !img.startsWith('data:'));
                      urlImages[index] = e.target.value;
                      const uploadedImages = formData.images.filter(img => img.startsWith('data:'));
                      setFormData(prev => ({
                        ...prev,
                        images: [...urlImages, ...uploadedImages]
                      }));
                    }}
                    placeholder="URL de l'image"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const urlImages = formData.images.filter(img => !img.startsWith('data:'));
                      urlImages.splice(index, 1);
                      const uploadedImages = formData.images.filter(img => img.startsWith('data:'));
                      setFormData(prev => ({
                        ...prev,
                        images: [...urlImages, ...uploadedImages]
                      }));
                    }}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const urlImages = formData.images.filter(img => !img.startsWith('data:'));
                  const uploadedImages = formData.images.filter(img => img.startsWith('data:'));
                  setFormData(prev => ({
                    ...prev,
                    images: [...urlImages, '', ...uploadedImages]
                  }));
                }}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <Plus className="h-4 w-4" />
                Ajouter une URL d'image
              </button>
            </div>
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Couleurs et stock
            </label>
            {formData.colors.map((color, index) => (
              <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-2 mb-2">
                <Input
                  value={color.name}
                  onChange={(e) => updateArrayItem('colors', index, { ...color, name: e.target.value })}
                  placeholder="Nom de la couleur"
                />
                <Input
                  type="color"
                  value={color.hex}
                  onChange={(e) => updateArrayItem('colors', index, { ...color, hex: e.target.value })}
                  className="h-10"
                />
                <Input
                  type="number"
                  value={color.stock}
                  onChange={(e) => updateArrayItem('colors', index, { ...color, stock: e.target.value })}
                  placeholder="Stock"
                />
                {formData.colors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeArrayItem('colors', index)}
                    className="px-3 py-2 text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() => addArrayItem('colors')}
              className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
            >
              <Plus className="h-4 w-4" />
              Ajouter une couleur
            </button>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tailles disponibles
            </label>
            <div className="flex flex-wrap gap-2">
              {formData.sizes.map((size, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={size}
                    onChange={(e) => updateArrayItem('sizes', index, e.target.value)}
                    placeholder="Taille"
                    className="w-20"
                  />
                  {formData.sizes.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('sizes', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('sizes')}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </button>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tags
            </label>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    value={tag}
                    onChange={(e) => updateArrayItem('tags', index, e.target.value)}
                    placeholder="Tag"
                    className="w-32"
                  />
                  {formData.tags.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeArrayItem('tags', index)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={() => addArrayItem('tags')}
                className="flex items-center gap-2 text-sm text-blue-600 hover:text-blue-800"
              >
                <Plus className="h-4 w-4" />
                Ajouter
              </button>
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => handleInputChange('isActive', e.target.checked)}
                className="rounded border-gray-300 text-black focus:ring-black"
              />
              <span className="ml-2 text-sm text-gray-700">Produit actif</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Annuler
            </Button>
            <Button type="submit">
              {mode === 'add' ? 'Ajouter le produit' : 'Modifier le produit'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
} 