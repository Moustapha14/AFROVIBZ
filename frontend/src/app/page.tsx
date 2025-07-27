'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Star, ShoppingBag, Heart } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

// Données temporaires pour la démo
const featuredProducts = [
  {
    id: '1',
    name: 'Robe Africaine Élégante',
    price: 25000,
    originalPrice: 35000,
    image: '/images/product-1.jpg',
    rating: 4.5,
    reviews: 128,
  },
  {
    id: '2',
    name: 'Chemise Wax Traditionnelle',
    price: 18000,
    originalPrice: 25000,
    image: '/images/product-2.jpg',
    rating: 4.8,
    reviews: 95,
  },
  {
    id: '3',
    name: 'Pagne Moderne',
    price: 12000,
    originalPrice: 18000,
    image: '/images/product-3.jpg',
    rating: 4.3,
    reviews: 67,
  },
  {
    id: '4',
    name: 'Boubou Traditionnel',
    price: 45000,
    originalPrice: 60000,
    image: '/images/product-4.jpg',
    rating: 4.7,
    reviews: 156,
  },
  {
    id: '5',
    name: 'iPhone 15 Pro Max',
    price: 850000,
    originalPrice: 950000,
    image: '/images/products/iphone-15.svg',
    rating: 4.9,
    reviews: 342,
  },
  {
    id: '6',
    name: 'MacBook Air M2',
    price: 1200000,
    originalPrice: 1350000,
    image: '/images/products/macbook-air.svg',
    rating: 4.8,
    reviews: 189,
  },
];

const categories = [
  {
    name: 'Femmes',
    image: '/images/category-women.jpg',
    href: '/products?category=femmes',
  },
  {
    name: 'Hommes',
    image: '/images/category-men.jpg',
    href: '/products?category=hommes',
  },
  {
    name: 'Enfants',
    image: '/images/category-kids.jpg',
    href: '/products?category=enfants',
  },
  {
    name: 'Accessoires',
    image: '/images/category-accessories.jpg',
    href: '/products?category=accessoires',
  },
  {
    name: 'Tech',
    image: '/images/category-tech.jpg',
    href: '/products?category=tech',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[70vh] sm:h-[75vh] md:h-[80vh] lg:h-[85vh] bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 overflow-hidden">
        <div className="absolute inset-0 bg-black bg-opacity-20"></div>
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight">
              Découvrez la Mode Africaine
            </h1>
            <p className="text-base xs:text-lg sm:text-xl md:text-2xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto px-2">
              Les dernières tendances avec livraison rapide au Gabon
            </p>
            <div className="flex flex-col xs:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link href="/products" className="w-full xs:w-auto min-w-[200px]">
                <Button size="lg" className="w-full xs:w-auto text-sm xs:text-base sm:text-lg px-4 xs:px-6 sm:px-8 py-3 sm:py-4 h-12 xs:h-14">
                  Acheter Maintenant
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link href="/products" className="w-full xs:w-auto min-w-[200px]">
                <Button variant="outline" size="lg" className="w-full xs:w-auto text-sm xs:text-base sm:text-lg px-4 xs:px-6 sm:px-8 py-3 sm:py-4 bg-white text-black hover:bg-gray-100 h-12 xs:h-14">
                  Voir les Collections
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-8 sm:py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
              Explorez nos Catégories
            </h2>
            <p className="text-sm xs:text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Trouvez votre style parmi nos collections variées
            </p>
          </div>
          
          <div className="grid grid-cols-2 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
            {categories.map((category, index) => (
              <Link key={index} href={category.href} className="group block">
                <div className="relative overflow-hidden rounded-lg bg-gray-200 aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-2 xs:bottom-3 sm:bottom-4 left-2 xs:left-3 sm:left-4 right-2 xs:right-3 sm:right-4">
                    <h3 className="text-white font-semibold text-sm xs:text-base sm:text-lg group-hover:scale-105 transition-transform duration-200">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-8 sm:py-12 md:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8 md:mb-12">
            <h2 className="text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-2 sm:mb-3 md:mb-4">
              Produits Vedettes
            </h2>
            <p className="text-sm xs:text-base sm:text-lg text-gray-600 max-w-2xl mx-auto px-2">
              Les articles les plus populaires de notre collection
            </p>
          </div>
          
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group">
                <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-200">
                  <div className="absolute top-3 right-3 z-10">
                    <button 
                      className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors"
                      aria-label="Ajouter aux favoris"
                    >
                      <Heart className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <button 
                      className="w-full bg-black text-white py-2 px-4 rounded-md text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center"
                      aria-label={`Ajouter ${product.name} au panier`}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Ajouter au Panier
                    </button>
                  </div>
                </div>
                
                <div className="p-2 xs:p-3 sm:p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-xs xs:text-sm sm:text-base">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-2 w-2 xs:h-3 xs:w-3 sm:h-4 sm:w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1 xs:ml-2">
                      ({product.reviews})
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 xs:space-x-2">
                      <span className="text-sm xs:text-base sm:text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8 sm:mt-12">
            <Link href="/products">
              <Button size="lg" className="text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4">
                Voir Tous les Produits
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Livraison Rapide
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Livraison gratuite au Gabon à partir de 50,000 FCFA
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Qualité Garantie
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Produits de qualité premium sélectionnés avec soin
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 100 19.5 9.75 9.75 0 000-19.5z" />
                </svg>
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                Retours Faciles
              </h3>
              <p className="text-sm sm:text-base text-gray-600">
                Retours gratuits sous 30 jours si vous n'êtes pas satisfait
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
