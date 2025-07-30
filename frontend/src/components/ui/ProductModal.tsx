'use client';

import React, { useState, useEffect } from 'react';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { Button } from './Button';
import { ProductImage } from './ProductImage';
import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';

interface ProductModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number, size: string, color: string) => void;
}

export function ProductModal({ product, isOpen, onClose, onAddToCart }: ProductModalProps) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedColor, setSelectedColor] = useState<string>('');
  const [quantity, setQuantity] = useState(1);

  // Gérer le scroll du body
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Réinitialiser les sélections quand le modal s'ouvre avec un nouveau produit
  useEffect(() => {
    if (isOpen && product) {
      setSelectedSize('');
      setSelectedColor('');
      setQuantity(1);
    }
  }, [isOpen, product]);

  if (!product || !isOpen) return null;

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      alert('Veuillez sélectionner une taille et une couleur');
      return;
    }
    
    onAddToCart(product, quantity, selectedSize, selectedColor);
    onClose();
    // Reset form
    setSelectedSize('');
    setSelectedColor('');
    setQuantity(1);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-end sm:items-center justify-center"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-t-2xl sm:rounded-lg max-w-2xl w-full h-[85vh] sm:h-auto sm:max-h-[90vh] overflow-hidden flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-3 xs:p-4 border-b">
          <h2 className="text-base xs:text-lg font-semibold">Ajouter au panier</h2>
          <button
            onClick={onClose}
            className="min-h-[44px] min-w-[44px] p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 overflow-y-auto flex-1">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Product Image */}
            <div className="w-full md:w-1/2 flex-shrink-0">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden max-h-[300px] sm:max-h-none">
                <ProductImage
                  src={product.images[0]}
                  alt={product.name}
                  fallbackText={product.name}
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="w-full md:w-1/2 space-y-4 pb-safe sm:pb-0">
              <div>
                <h3 className="text-lg xs:text-xl font-semibold text-gray-900">{product.name}</h3>
                <p className="text-xs xs:text-sm text-gray-600 mt-1">{product.description}</p>
              </div>

              {/* Price */}
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {formatPrice(product.price)}
                </span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-500 line-through">
                    {formatPrice(product.originalPrice)}
                  </span>
                )}
              </div>

              {/* Color Selection */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Couleur</h4>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`min-w-[44px] min-h-[44px] rounded-full border-2 transition-all ${
                        selectedColor === color.name
                          ? 'border-black scale-110'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                      type="button"
                    />
                  ))}
                </div>
                {selectedColor && (
                  <p className="text-sm text-gray-600 mt-1">Couleur sélectionnée : {selectedColor}</p>
                )}
              </div>

              {/* Size Selection */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Taille</h4>
                <div className="grid grid-cols-3 xs:grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`min-h-[44px] py-2 px-3 text-sm font-medium rounded-md border transition-colors ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      type="button"
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-2">Quantité</h4>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="min-h-[44px] min-w-[44px] p-3 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    type="button"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 10}
                    className="min-h-[44px] min-w-[44px] p-3 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    type="button"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Total */}
              <div className="border-t pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-medium">Total</span>
                  <span className="text-xl font-bold text-gray-900">
                    {formatPrice(product.price * quantity)}
                  </span>
                </div>
              </div>

              {/* Add to Cart Button */}
              <Button
                onClick={handleAddToCart}
                disabled={!selectedSize || !selectedColor}
                className="w-full"
                size="lg"
              >
                <ShoppingBag className="h-5 w-5 mr-2" />
                Ajouter au Panier
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 