'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Star, 
  Heart, 
  Share2, 
  Truck, 
  Shield, 
  RotateCcw,
  Minus,
  Plus,
  ShoppingBag
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

// Données temporaires pour la démo
const product = {
  id: '1',
  name: 'Robe Africaine Élégante',
  description: 'Une robe africaine élégante et moderne, parfaite pour toutes les occasions. Fabriquée avec des tissus de qualité premium et des motifs traditionnels africains. Cette robe met en valeur la beauté et l\'élégance africaine.',
  price: 25000,
  originalPrice: 35000,
  images: [
    '/images/product-1.jpg',
    '/images/product-1-2.jpg',
    '/images/product-1-3.jpg',
    '/images/product-1-4.jpg',
  ],
  rating: 4.5,
  reviews: 128,
  category: 'femmes',
  colors: [
    { name: 'Rouge', hex: '#DC2626', stock: 15 },
    { name: 'Bleu', hex: '#2563EB', stock: 8 },
    { name: 'Vert', hex: '#059669', stock: 12 },
  ],
  sizes: [
    { name: 'S', stock: 10 },
    { name: 'M', stock: 15 },
    { name: 'L', stock: 8 },
    { name: 'XL', stock: 5 },
  ],
  features: [
    '100% coton premium',
    'Motifs traditionnels africains',
    'Coutures renforcées',
    'Lavable en machine',
    'Taille ajustable',
  ],
  shipping: {
    free: true,
    minAmount: 50000,
    estimatedDays: '2-4 jours',
  },
};

export default function ProductDetailPage() {
  const params = useParams();
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors[0]);
  const [selectedSize, setSelectedSize] = useState(product.sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert('Veuillez sélectionner une couleur et une taille');
      return;
    }
    
    // TODO: Implement add to cart functionality
    console.log('Adding to cart:', {
      product,
      selectedColor,
      selectedSize,
      quantity,
    });
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const isOutOfStock = selectedColor.stock === 0 || selectedSize.stock === 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                  <span className="text-gray-500">Image {selectedImage + 1}</span>
                </div>
              </div>
              
              {/* Thumbnail Images */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-md overflow-hidden border-2 ${
                      selectedImage === index ? 'border-black' : 'border-gray-200'
                    }`}
                  >
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Img {index + 1}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Header */}
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {product.name}
                </h1>
                
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.floor(product.rating)
                            ? 'text-yellow-400 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm text-gray-600">
                      {product.rating} ({product.reviews} avis)
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsWishlisted(!isWishlisted)}
                      className={`p-2 rounded-full ${
                        isWishlisted ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-600'
                      } hover:bg-gray-200 transition-colors`}
                    >
                      <Heart className={`h-5 w-5 ${isWishlisted ? 'fill-current' : ''}`} />
                    </button>
                    <button className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors">
                      <Share2 className="h-5 w-5" />
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="flex items-center space-x-3 mb-6">
                  <span className="text-3xl font-bold text-gray-900">
                    {formatPrice(product.price)}
                  </span>
                  {product.originalPrice && (
                    <span className="text-xl text-gray-500 line-through">
                      {formatPrice(product.originalPrice)}
                    </span>
                  )}
                  {product.originalPrice && (
                    <span className="bg-red-100 text-red-600 px-2 py-1 rounded-md text-sm font-medium">
                      -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Description */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Description
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Color Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Couleur: <span className="font-normal">{selectedColor.name}</span>
                </h3>
                <div className="flex space-x-3">
                  {product.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color)}
                      className={`w-12 h-12 rounded-full border-2 ${
                        selectedColor.name === color.name
                          ? 'border-black'
                          : 'border-gray-300'
                      } ${color.stock === 0 ? 'opacity-50' : ''}`}
                      style={{ backgroundColor: color.hex }}
                      disabled={color.stock === 0}
                      title={`${color.name} (${color.stock} en stock)`}
                    />
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {selectedColor.stock} en stock
                </p>
              </div>

              {/* Size Selection */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Taille: <span className="font-normal">{selectedSize.name}</span>
                </h3>
                <div className="flex space-x-3">
                  {product.sizes.map((size) => (
                    <button
                      key={size.name}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border-2 rounded-md text-sm font-medium transition-colors ${
                        selectedSize.name === size.name
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      } ${size.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={size.stock === 0}
                    >
                      {size.name}
                    </button>
                  ))}
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  {selectedSize.stock} en stock
                </p>
              </div>

              {/* Quantity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Quantité
                </h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <Input
                    type="number"
                    value={quantity}
                    onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                    min="1"
                    max="10"
                    className="w-20 text-center"
                  />
                  <button
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 10}
                    className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <div className="space-y-3">
                <Button
                  onClick={handleAddToCart}
                  disabled={isOutOfStock}
                  size="lg"
                  className="w-full py-4 text-lg"
                >
                  <ShoppingBag className="h-5 w-5 mr-2" />
                  {isOutOfStock ? 'Rupture de Stock' : 'Ajouter au Panier'}
                </Button>
                
                {isOutOfStock && (
                  <p className="text-red-600 text-sm text-center">
                    Ce produit n'est plus disponible dans cette combinaison
                  </p>
                )}
              </div>

              {/* Features */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Caractéristiques
                </h3>
                <ul className="space-y-2">
                  {product.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-gray-600">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Shipping Info */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <Truck className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      Livraison {product.shipping.free ? 'gratuite' : 'payante'}
                    </p>
                    <p className="text-sm text-gray-600">
                      Livraison estimée: {product.shipping.estimatedDays}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Garantie qualité</p>
                    <p className="text-sm text-gray-600">
                      Retours gratuits sous 30 jours
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <RotateCcw className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Échanges faciles</p>
                    <p className="text-sm text-gray-600">
                      Échangez votre taille gratuitement
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 