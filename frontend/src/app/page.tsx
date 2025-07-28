import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Star, ShoppingBag, Heart, Truck, Shield, RotateCcw } from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import OptimizedImageCarousel from '@/components/HeroSection/OptimizedImageCarousel';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'AFRO🗼VIBZ - Mode Africaine Moderne & Tech | Livraison Rapide au Gabon',
  description: 'Découvrez notre collection unique de mode africaine contemporaine et d\'accessoires tech. Livraison rapide partout au Gabon. Vêtements traditionnels et modernes, smartphones, ordinateurs.',
  keywords: ['mode africaine', 'vêtements', 'tech', 'smartphones', 'ordinateurs', 'Gabon', 'livraison', 'fashion', 'afrovibz', 'wax', 'pagne', 'boubou'],
  authors: [{ name: 'AFRO🗼VIBZ' }],
  creator: 'AFRO🗼VIBZ',
  publisher: 'AFRO🗼VIBZ',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://afrovibz.ga'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AFRO🗼VIBZ - Mode Africaine Moderne & Tech',
    description: 'Collection exclusive de mode africaine contemporaine et d\'accessoires tech. Livraison rapide au Gabon.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'AFRO🗼VIBZ',
    images: [
      {
        url: '/images/og-homepage.jpg',
        width: 1200,
        height: 630,
        alt: 'AFRO🗼VIBZ - Mode Africaine Moderne & Tech',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AFRO🗼VIBZ - Mode Africaine Moderne & Tech',
    description: 'Collection exclusive de mode africaine contemporaine et d\'accessoires tech. Livraison rapide au Gabon.',
    images: ['/images/og-homepage.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

// Données temporaires pour la démo
const featuredProducts = [
  {
    id: '1',
    name: 'Sac Hexagonal Élégant',
    price: 25000,
    originalPrice: 35000,
    image: '/images/products/sac-hexagonal.jpg',
    rating: 4.5,
    reviews: 128,
  },
  {
    id: '2',
    name: 'Sac Noir Moderne',
    price: 18000,
    originalPrice: 25000,
    image: '/images/products/sac-noir.jpg',
    rating: 4.8,
    reviews: 95,
  },
  {
    id: '3',
    name: 'Sac Blanc Poignée Dorée',
    price: 12000,
    originalPrice: 18000,
    image: '/images/products/sac-blanc.jpg',
    rating: 4.3,
    reviews: 67,
  },
  {
    id: '4',
    name: 'Sac Rouge Charme Cerise',
    price: 45000,
    originalPrice: 60000,
    image: '/images/products/sac-rouge.jpg',
    rating: 4.7,
    reviews: 156,
  },
  {
    id: '5',
    name: 'Sac Rose Élégant',
    price: 85000,
    originalPrice: 95000,
    image: '/images/products/sac-rose.jpg',
    rating: 4.9,
    reviews: 342,
  },
  {
    id: '6',
    name: 'Sac Vert Naturel',
    price: 120000,
    originalPrice: 135000,
    image: '/images/products/sac-vert.jpg',
    rating: 4.8,
    reviews: 189,
  },
  {
    id: '7',
    name: 'Robe Africaine Élégante',
    price: 45000,
    originalPrice: 55000,
    image: '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (1).jpeg',
    rating: 4.6,
    reviews: 89,
  },
  {
    id: '8',
    name: 'Boubou Traditionnel',
    price: 35000,
    originalPrice: 45000,
    image: '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (2).jpeg',
    rating: 4.4,
    reviews: 156,
  },
  {
    id: '9',
    name: 'Tenue Enfant Moderne',
    price: 15000,
    originalPrice: 20000,
    image: '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (3).jpeg',
    rating: 4.7,
    reviews: 78,
  },
  {
    id: '10',
    name: 'Accessoires Élégants',
    price: 8000,
    originalPrice: 12000,
    image: '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (4).jpeg',
    rating: 4.5,
    reviews: 234,
  },
  {
    id: '11',
    name: 'Smartphone Premium',
    price: 250000,
    originalPrice: 300000,
    image: '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (5).jpeg',
    rating: 4.9,
    reviews: 445,
  },
  {
    id: '12',
    name: 'Collection Spéciale',
    price: 75000,
    originalPrice: 90000,
    image: '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (6).jpeg',
    rating: 4.8,
    reviews: 167,
  },
];

const categories = [
  {
    name: 'Femmes',
    image: '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (1).jpeg',
    href: '/products?category=femmes',
  },
  {
    name: 'Hommes',
    image: '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (2).jpeg',
    href: '/products?category=hommes',
  },
  {
    name: 'Enfants',
    image: '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (3).jpeg',
    href: '/products?category=enfants',
  },
  {
    name: 'Accessoires',
    image: '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (4).jpeg',
    href: '/products?category=accessoires',
  },
  {
    name: 'Tech',
    image: '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (5).jpeg',
    href: '/products?category=tech',
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen-mobile">
      {/* Hero Section - Mobile First */}
      <section className="relative h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] xl:h-[85vh] overflow-hidden">
        <OptimizedImageCarousel />
        <div className="relative z-10 flex items-center justify-center h-full text-center text-white px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-balance">
              Découvrez la Mode Africaine
            </h1>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto px-2 text-balance">
              Les dernières tendances avec livraison rapide au Gabon
            </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center">
              <Link href="/products" className="w-full sm:w-auto min-w-[200px]">
                <Button 
                  size="lg" 
                  className="w-full sm:w-auto text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 h-12 sm:h-14 mobile-button"
                >
                  Acheter Maintenant
                  <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                </Button>
              </Link>
              <Link href="/products" className="w-full sm:w-auto min-w-[200px]">
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="w-full sm:w-auto text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-white text-black hover:bg-gray-100 h-12 sm:h-14 mobile-button"
                >
                  Voir les Collections
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Mobile First */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-white">
        <div className="mobile-container">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 text-balance">
              Explorez nos Catégories
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2 text-balance">
              Trouvez votre style parmi nos collections variées
            </p>
          </div>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
            {categories.map((category, index) => (
              <Link 
                key={index} 
                href={category.href} 
                className="group block tap-highlight-none"
              >
                <div className="relative overflow-hidden rounded-lg bg-gray-200 mobile-aspect-square">
                  <Image
                    src={category.image}
                    alt={`Catégorie ${category.name}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                    priority={index < 4}
                    quality={85}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4">
                    <h3 className="text-white font-semibold text-sm sm:text-base md:text-lg group-hover:scale-105 transition-transform duration-200 text-balance">
                      {category.name}
                    </h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products - Mobile First */}
      <section className="py-8 sm:py-12 md:py-16 lg:py-20 bg-gray-50">
        <div className="mobile-container">
          <div className="text-center mb-8 sm:mb-12 lg:mb-16">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 text-balance">
              Produits Vedettes
            </h2>
            <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2 text-balance">
              Les articles les plus populaires de notre collection
            </p>
          </div>
          
          <div className="mobile-grid">
            {featuredProducts.map((product) => (
              <div key={product.id} className="mobile-card group hover:shadow-mobile-elevated transition-all duration-300">
                <div className="relative mobile-aspect-square overflow-hidden bg-gray-200">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    priority={featuredProducts.indexOf(product) < 4}
                    quality={90}
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                  />
                  <div className="absolute top-3 right-3 z-10">
                    <button 
                      className="p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors action-button"
                      aria-label="Ajouter aux favoris"
                    >
                      <Heart className="h-4 w-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3">
                    <button 
                      className="w-full bg-black text-white py-2 px-4 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center mobile-button"
                      aria-label={`Ajouter ${product.name} au panier`}
                    >
                      <ShoppingBag className="h-4 w-4 mr-2" />
                      Ajouter au Panier
                    </button>
                  </div>
                </div>
                
                <div className="p-3 sm:p-4">
                  <h3 className="font-medium text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base text-balance">
                    {product.name}
                  </h3>
                  
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 sm:h-4 sm:w-4 ${
                            i < Math.floor(product.rating)
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">
                      ({product.reviews})
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm sm:text-base md:text-lg font-bold text-gray-900">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs sm:text-sm text-gray-500 line-through">
                          {formatPrice(product.originalPrice)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-8 sm:mt-12 lg:mt-16">
            <Link href="/products">
              <Button 
                size="lg" 
                className="text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 mobile-button"
              >
                Voir Tous les Produits
                <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile First */}
      <section className="py-12 sm:py-16 md:py-20 lg:py-24 bg-white">
        <div className="mobile-container">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12 lg:gap-16">
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Truck className="w-8 h-8 sm:w-10 sm:h-10 text-yellow-600" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3 text-balance">
                Livraison Rapide
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 text-balance">
                Livraison gratuite au Gabon à partir de 50,000 FCFA
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <Shield className="w-8 h-8 sm:w-10 sm:h-10 text-green-600" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3 text-balance">
                Qualité Garantie
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 text-balance">
                Produits de qualité premium sélectionnés avec soin
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <RotateCcw className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3 text-balance">
                Retours Faciles
              </h3>
              <p className="text-sm sm:text-base md:text-lg text-gray-600 text-balance">
                Retours gratuits sous 30 jours si vous n'êtes pas satisfait
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
