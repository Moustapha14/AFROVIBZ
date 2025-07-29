'use client';

import React, { useState } from 'react';
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-2 xs:p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[95vh] xs:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-3 xs:p-4 border-b">
          <h2 className="text-base xs:text-lg font-semibold">Ajouter au panier</h2>
          <button
            onClick={onClose}
            className="p-3 hover:bg-gray-100 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="h-4 w-4 xs:h-5 xs:w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-3 xs:p-4">
          <div className="flex flex-col md:flex-row gap-4 xs:gap-6">
            {/* Product Image */}
            <div className="w-full md:w-1/2">
              <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                <ProductImage
                  src={product.images[0]}
                  alt={product.name}
                  fallbackText={product.name}
                />
              </div>
            </div>

            {/* Product Details */}
            <div className="w-full md:w-1/2 space-y-3 xs:space-y-4">
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
                <div className="flex space-x-2">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        selectedColor === color.name
                          ? 'border-black scale-110'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
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
                <div className="grid grid-cols-4 gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-3 text-sm font-medium rounded-md border transition-colors ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
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
                    className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 10}
                    className="p-3 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px] min-w-[44px] flex items-center justify-center"
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
