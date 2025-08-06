'use client';

import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import React, { useState, useEffect } from 'react';

import { formatPrice } from '@/lib/utils';
import { Product } from '@/types';

import { Button } from './Button';
import { ProductImage } from './ProductImage';

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
      className='fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-end sm:items-center justify-center p-0 sm:p-4'
      onClick={handleBackdropClick}
      style={{ WebkitTapHighlightColor: 'transparent' }}
    >
      <div
        className='bg-white rounded-t-2xl sm:rounded-lg max-w-2xl w-full h-[95vh] sm:h-auto sm:max-h-[85vh] overflow-hidden flex flex-col relative overscroll-contain transform-gpu'
        onClick={e => e.stopPropagation()}
        style={{ touchAction: 'manipulation' }}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-4 sm:p-3 border-b bg-white sticky top-0 z-20 shrink-0'>
          <h2 className='text-lg sm:text-base font-semibold'>Ajouter au panier</h2>
          <button
            onClick={onClose}
            type='button'
            className='min-h-[48px] min-w-[48px] p-2 hover:bg-gray-100 active:bg-gray-200 rounded-full transition-colors flex items-center justify-center touch-manipulation select-none'
            style={{ WebkitTapHighlightColor: 'transparent' }}
          >
            <X className='h-6 w-6 sm:h-5 sm:w-5' />
          </button>
        </div>

        {/* Content */}
        <div className='overflow-y-auto flex-1 overscroll-contain'>
          <div className='p-4 sm:p-6' style={{ WebkitOverflowScrolling: 'touch' }}>
            <div className='flex flex-col md:flex-row gap-6'>
              {/* Product Image */}
              <div className='w-full md:w-1/2 flex-shrink-0'>
                <div className='aspect-square bg-gray-100 rounded-lg overflow-hidden max-h-[280px] sm:max-h-none'>
                  <ProductImage
                    src={product.images[0]}
                    alt={product.name}
                    fallbackText={product.name}
                  />
                </div>
              </div>

              {/* Product Details */}
              <div className='w-full md:w-1/2 space-y-5 pb-safe sm:pb-0'>
                <div>
                  <h3 className='text-xl sm:text-lg font-semibold text-gray-900 leading-tight'>
                    {product.name}
                  </h3>
                  <p className='text-sm sm:text-xs text-gray-600 mt-2 leading-relaxed'>
                    {product.description}
                  </p>
                </div>

                {/* Price */}
                <div className='flex items-center space-x-2'>
                  <span className='text-2xl font-bold text-gray-900'>
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className='text-lg text-gray-500 line-through'>
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                </div>

                {/* Color Selection */}
                <div>
                  <h4 className='text-base sm:text-sm font-medium text-gray-900 mb-3'>Couleur</h4>
                  <div className='flex flex-wrap gap-3'>
                    {product.colors.map(color => (
                      <button
                        key={color.name}
                        onClick={() => setSelectedColor(color.name)}
                        className={`min-w-[48px] min-h-[48px] w-12 h-12 sm:min-w-[44px] sm:min-h-[44px] sm:w-11 sm:h-11 rounded-full border-2 transition-all touch-manipulation select-none ${
                          selectedColor === color.name
                            ? 'border-black scale-110 shadow-md transform-gpu'
                            : 'border-gray-300 hover:border-gray-400 active:scale-95 active:shadow-sm'
                        }`}
                        style={{
                          backgroundColor: color.hex,
                          WebkitTapHighlightColor: 'transparent',
                          touchAction: 'manipulation',
                        }}
                        title={color.name}
                        type='button'
                      />
                    ))}
                  </div>
                  {selectedColor && (
                    <p className='text-sm text-gray-600 mt-2'>
                      Couleur sélectionnée : {selectedColor}
                    </p>
                  )}
                </div>

                {/* Size Selection */}
                <div>
                  <h4 className='text-base sm:text-sm font-medium text-gray-900 mb-3'>Taille</h4>
                  <div className='grid grid-cols-3 sm:grid-cols-4 gap-3'>
                    {product.sizes.map(size => (
                      <button
                        key={size}
                        onClick={() => setSelectedSize(size)}
                        className={`min-h-[48px] sm:min-h-[44px] py-3 sm:py-2 px-4 sm:px-3 text-base sm:text-sm font-medium rounded-lg sm:rounded-md border transition-all touch-manipulation select-none ${
                          selectedSize === size
                            ? 'border-black bg-black text-white shadow-md transform-gpu'
                            : 'border-gray-300 hover:border-gray-400 active:bg-gray-100 active:shadow-sm'
                        }`}
                        style={{
                          WebkitTapHighlightColor: 'transparent',
                          touchAction: 'manipulation',
                        }}
                        type='button'
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quantity */}
                <div>
                  <h4 className='text-base sm:text-sm font-medium text-gray-900 mb-3'>Quantité</h4>
                  <div className='flex items-center justify-center space-x-4'>
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      disabled={quantity <= 1}
                      className='min-h-[48px] min-w-[48px] sm:min-h-[44px] sm:min-w-[44px] p-3 border border-gray-300 rounded-lg sm:rounded-md hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center touch-manipulation transition-colors select-none'
                      style={{
                        WebkitTapHighlightColor: 'transparent',
                        touchAction: 'manipulation',
                      }}
                      type='button'
                    >
                      <Minus className='h-5 w-5 sm:h-4 sm:w-4' />
                    </button>
                    <span className='min-w-[60px] text-center font-semibold text-lg sm:text-base'>
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      disabled={quantity >= 10}
                      className='min-h-[48px] min-w-[48px] sm:min-h-[44px] sm:min-w-[44px] p-3 border border-gray-300 rounded-lg sm:rounded-md hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center touch-manipulation transition-colors select-none'
                      style={{
                        WebkitTapHighlightColor: 'transparent',
                        touchAction: 'manipulation',
                      }}
                      type='button'
                    >
                      <Plus className='h-5 w-5 sm:h-4 sm:w-4' />
                    </button>
                  </div>
                </div>

                {/* Total */}
                <div className='border-t pt-4 mt-2'>
                  <div className='flex justify-between items-center'>
                    <span className='text-lg sm:text-base font-medium'>Total</span>
                    <span className='text-2xl sm:text-xl font-bold text-gray-900'>
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Fixed Bottom Button on Mobile */}
          <div className='sticky bottom-0 bg-white border-t p-4 sm:static sm:bg-transparent sm:border-t-0 sm:p-0 sm:mt-6 z-10 shrink-0'>
            <Button
              onClick={handleAddToCart}
              disabled={!selectedSize || !selectedColor}
              className='w-full min-h-[52px] sm:min-h-[44px] text-base sm:text-sm font-semibold touch-manipulation select-none transform-gpu'
              style={{
                WebkitTapHighlightColor: 'transparent',
                touchAction: 'manipulation',
              }}
              size='lg'
            >
              <ShoppingBag className='h-6 w-6 sm:h-5 sm:w-5 mr-2' />
              Ajouter au Panier
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
