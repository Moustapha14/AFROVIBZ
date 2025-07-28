'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '@/lib/hooks/useCart';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Trash2, 
  Minus, 
  Plus, 
  ArrowLeft, 
  ShoppingBag,
  Truck,
  Shield
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';


export default function CartPage() {
  const { 
    cart, 
    removeFromCart, 
    updateQuantity, 
    getCartTotal, 
    getCartCount,
    clearCart 
  } = useCart();

  const shippingCost = getCartTotal() >= 50000 ? 0 : 3000;
  const total = getCartTotal() + shippingCost;

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      updateQuantity(itemId, newQuantity);
    }
  };

  const handleRemoveItem = (itemId: string) => {
    removeFromCart(itemId);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Votre panier est vide
          </h2>
          <p className="text-gray-600 mb-6">
            Découvrez nos produits et commencez vos achats
          </p>
          <Link href="/products">
            <Button size="lg" className="w-full sm:w-auto">
              Continuer les Achats
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Link href="/products" className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="text-sm sm:text-base">Continuer les achats</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Votre Panier ({getCartCount()} article{getCartCount() !== 1 ? 's' : ''})
          </h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-4 sm:p-6">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 p-4 border border-gray-200 rounded-lg">
                      {/* Product Image */}
                      <div className="w-full sm:w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0">
                        <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                          <span className="text-xs text-gray-500">Image</span>
                        </div>
                      </div>

                      {/* Product Info */}
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-900 truncate text-sm sm:text-base">
                          {item.product.name}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500">
                          Taille: {item.selectedSize} | Couleur: {item.selectedColor}
                        </p>
                        <p className="text-base sm:text-lg font-bold text-gray-900 mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between sm:justify-end space-x-2">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            aria-label="Diminuer la quantité"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <Input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => handleQuantityChange(item.id, parseInt(e.target.value) || 1)}
                            min="1"
                            max="10"
                            className="w-16 text-center"
                            aria-label="Quantité"
                          />
                          <button
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= 10}
                            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors"
                            aria-label="Augmenter la quantité"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => handleRemoveItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                          aria-label="Supprimer l'article"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Clear Cart */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 text-sm font-medium transition-colors"
                  >
                    Vider le panier
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 sticky top-8">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                Résumé de la Commande
              </h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sous-total ({getCartCount()} article{getCartCount() !== 1 ? 's' : ''})</span>
                  <span className="font-medium">{formatPrice(getCartTotal())}</span>
                </div>
                
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Livraison</span>
                  <span className="font-medium">
                    {shippingCost === 0 ? (
                      <span className="text-green-600">Gratuite</span>
                    ) : (
                      formatPrice(shippingCost)
                    )}
                  </span>
                </div>

                {shippingCost > 0 && (
                  <div className="text-xs text-gray-500 bg-green-50 p-2 rounded-md">
                    Livraison gratuite à partir de {formatPrice(50000)}
                  </div>
                )}

                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-base sm:text-lg font-bold">
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex items-center space-x-3 mb-3">
                  <Truck className="h-5 w-5 text-gray-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Livraison</p>
                    <p className="text-xs sm:text-sm text-gray-600">2-4 jours ouvrables</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3">
                  <Shield className="h-5 w-5 text-gray-600 flex-shrink-0" />
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Garantie</p>
                    <p className="text-xs sm:text-sm text-gray-600">Retours gratuits sous 30 jours</p>
                  </div>
                </div>
              </div>

              {/* Checkout Button */}
              <Link href="/checkout" className="block">
                <Button size="lg" className="w-full py-3 sm:py-4 text-base sm:text-lg">
                  Passer la Commande
                </Button>
              </Link>

              {/* Payment Methods */}
              <div className="mt-4 text-center">
                <p className="text-xs text-gray-500 mb-2">Méthodes de paiement acceptées</p>
                <div className="flex justify-center space-x-2">
                  <div className="w-8 h-5 bg-gray-200 rounded text-xs flex items-center justify-center">
                    Visa
                  </div>
                  <div className="w-8 h-5 bg-gray-200 rounded text-xs flex items-center justify-center">
                    MC
                  </div>
                  <div className="w-8 h-5 bg-gray-200 rounded text-xs flex items-center justify-center">
                    Pay
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