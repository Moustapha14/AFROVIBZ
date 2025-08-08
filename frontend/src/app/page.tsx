'use client';

import { ArrowRight, Star, ShoppingBag, Heart, Truck, Shield } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

import { useToast } from '@/lib/context/ToastContext';

import OptimizedImageCarousel from '@/components/HeroSection/OptimizedImageCarousel';
import { Button } from '@/components/ui/Button';
import { useCart } from '@/lib/hooks/useCart';
import { useWishlist } from '@/lib/hooks/useWishlist';
import { formatPrice, formatCompactPrice } from '@/lib/utils';

// Données temporaires pour la démo
const featuredProducts = [
  {
    id: '1',
    name: 'Sac Hexagonal Élégant',
    description: 'Un sac élégant avec une forme hexagonale unique',
    price: 25000,
    originalPrice: 35000,
    category: 'accessoires',
    images: ['/images/products/sac-hexagonal.jpg'],
    colors: [{ name: 'Noir', hex: '#000000', stock: 10 }],
    sizes: ['Unique'],
    stock: 15,
    tags: ['sac', 'élégant', 'hexagonal'],
    isActive: true,
    rating: 4.5,
    reviews: 128,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'Sac Noir Moderne',
    description: 'Sac moderne en cuir noir de qualité',
    price: 18000,
    originalPrice: 25000,
    category: 'accessoires',
    images: ['/images/products/sac-noir.jpg'],
    colors: [{ name: 'Noir', hex: '#000000', stock: 8 }],
    sizes: ['Unique'],
    stock: 12,
    tags: ['sac', 'moderne', 'cuir'],
    isActive: true,
    rating: 4.8,
    reviews: 95,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'Sac Blanc Poignée Dorée',
    description: 'Sac blanc avec poignée dorée élégante',
    price: 12000,
    originalPrice: 18000,
    category: 'accessoires',
    images: ['/images/products/sac-blanc.jpg'],
    colors: [{ name: 'Blanc', hex: '#FFFFFF', stock: 6 }],
    sizes: ['Unique'],
    stock: 10,
    tags: ['sac', 'blanc', 'doré'],
    isActive: true,
    rating: 4.3,
    reviews: 67,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    name: 'Sac Rouge Charme Cerise',
    description: 'Sac rouge charmant avec finitions soignées',
    price: 45000,
    originalPrice: 60000,
    category: 'accessoires',
    images: ['/images/products/sac-rouge.jpg'],
    colors: [{ name: 'Rouge', hex: '#FF0000', stock: 4 }],
    sizes: ['Unique'],
    stock: 8,
    tags: ['sac', 'rouge', 'charmant'],
    isActive: true,
    rating: 4.7,
    reviews: 156,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '5',
    name: 'Sac Rose Élégant',
    description: 'Sac rose élégant avec finitions soignées',
    price: 85000,
    originalPrice: 95000,
    category: 'accessoires',
    images: ['/images/products/sac-rose.jpg'],
    colors: [{ name: 'Rose', hex: '#FFC0CB', stock: 7 }],
    sizes: ['Unique'],
    stock: 9,
    tags: ['sac', 'rose', 'élégant'],
    isActive: true,
    rating: 4.9,
    reviews: 342,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '6',
    name: 'Sac Vert Naturel',
    description: 'Sac vert naturel avec matériaux écologiques',
    price: 120000,
    originalPrice: 135000,
    category: 'accessoires',
    images: ['/images/products/sac-vert.jpg'],
    colors: [{ name: 'Vert', hex: '#228B22', stock: 5 }],
    sizes: ['Unique'],
    stock: 6,
    tags: ['sac', 'vert', 'naturel'],
    isActive: true,
    rating: 4.8,
    reviews: 189,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '7',
    name: 'Robe Africaine Élégante',
    description: 'Robe africaine élégante aux motifs traditionnels',
    price: 45000,
    originalPrice: 55000,
    category: 'femmes',
    images: ['/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (1).jpeg'],
    colors: [{ name: 'Multicolore', hex: '#FFD700', stock: 12 }],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 20,
    tags: ['robe', 'africain', 'élégant'],
    isActive: true,
    rating: 4.6,
    reviews: 89,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '8',
    name: 'Boubou Traditionnel',
    description: 'Boubou traditionnel africain de qualité',
    price: 35000,
    originalPrice: 45000,
    category: 'hommes',
    images: ['/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (2).jpeg'],
    colors: [{ name: 'Bleu', hex: '#0000FF', stock: 8 }],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 15,
    tags: ['boubou', 'traditionnel', 'africain'],
    isActive: true,
    rating: 4.4,
    reviews: 156,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '9',
    name: 'Tenue Enfant Moderne',
    description: 'Tenue moderne pour enfants avec style africain',
    price: 15000,
    originalPrice: 20000,
    category: 'enfants',
    images: ['/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (3).jpeg'],
    colors: [{ name: 'Rouge', hex: '#FF0000', stock: 10 }],
    sizes: ['2A', '4A', '6A', '8A'],
    stock: 25,
    tags: ['enfant', 'moderne', 'africain'],
    isActive: true,
    rating: 4.7,
    reviews: 78,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '10',
    name: 'Accessoires Élégants',
    description: "Collection d'accessoires élégants africains",
    price: 8000,
    originalPrice: 12000,
    category: 'accessoires',
    images: ['/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (4).jpeg'],
    colors: [{ name: 'Or', hex: '#FFD700', stock: 15 }],
    sizes: ['Unique'],
    stock: 30,
    tags: ['accessoires', 'élégant', 'africain'],
    isActive: true,
    rating: 4.5,
    reviews: 234,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '11',
    name: 'Smartphone Premium',
    description: 'Smartphone premium dernière génération',
    price: 250000,
    originalPrice: 300000,
    category: 'tech',
    images: ['/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (5).jpeg'],
    colors: [{ name: 'Noir', hex: '#000000', stock: 6 }],
    sizes: ['128GB', '256GB', '512GB'],
    stock: 12,
    tags: ['smartphone', 'premium', 'tech'],
    isActive: true,
    rating: 4.9,
    reviews: 445,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '12',
    name: 'Collection Spéciale',
    description: 'Collection spéciale limitée AFROVIBZ',
    price: 75000,
    originalPrice: 90000,
    category: 'femmes',
    images: ['/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (6).jpeg'],
    colors: [{ name: 'Multicolore', hex: '#FFD700', stock: 3 }],
    sizes: ['S', 'M', 'L'],
    stock: 8,
    tags: ['collection', 'spéciale', 'limitée'],
    isActive: true,
    rating: 4.8,
    reviews: 167,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
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
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { addToCart, getCartCount } = useCart();
  const { showToast } = useToast();

  const handleAddToCart = (product: any, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    // Utiliser les valeurs par défaut pour la démo
    const defaultSize = product.sizes?.[0] || 'Unique';
    const defaultColor = product.colors?.[0]?.name || 'Standard';

    const prevCartCount = getCartCount();
    addToCart(product, 1, defaultSize, defaultColor);
    
    // Use setTimeout to ensure cart state is updated
    setTimeout(() => {
      const newCartCount = getCartCount();
      if (newCartCount > prevCartCount) {
        showToast({
          type: 'success',
          title: 'Produit ajouté !',
          message: `${product.name} a été ajouté à votre panier`,
          duration: 3000
        });
      }
    }, 100);
  };

  return (
    <div className='min-h-screen-mobile'>
      {/* Hero Section - Mobile First */}
      <section className='relative h-[60vh] sm:h-[70vh] md:h-[75vh] lg:h-[80vh] xl:h-[85vh] overflow-hidden'>
        <OptimizedImageCarousel />
        <div className='relative z-10 flex items-center justify-center h-full text-center text-white px-4 sm:px-6 lg:px-8'>
          <div className='max-w-4xl mx-auto'>
            <h1 className='text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl 2xl:text-7xl font-bold mb-4 sm:mb-6 leading-tight text-balance'>
              Découvrez la Mode Africaine
            </h1>
            <p className='text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl mb-6 sm:mb-8 opacity-90 max-w-2xl mx-auto px-2 text-balance'>
              Les dernières tendances avec livraison rapide au Gabon
            </p>
            <div className='flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center'>
              <Link href='/products' className='w-full sm:w-auto min-w-[200px]'>
                <Button
                  size='lg'
                  className='w-full sm:w-auto text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 h-12 sm:h-14 mobile-button'
                >
                  Acheter Maintenant
                  <ArrowRight className='ml-2 h-4 w-4 sm:h-5 sm:w-5' />
                </Button>
              </Link>
              <Link href='/products' className='w-full sm:w-auto min-w-[200px]'>
                <Button
                  variant='outline'
                  size='lg'
                  className='w-full sm:w-auto text-sm sm:text-base lg:text-lg px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-white text-black hover:bg-gray-100 h-12 sm:h-14 mobile-button'
                >
                  Voir les Collections
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section - Mobile First */}
      <section className='py-8 sm:py-12 md:py-16 lg:py-20 bg-white'>
        <div className='mobile-container'>
          <div className='text-center mb-8 sm:mb-12 lg:mb-16'>
            <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 text-balance'>
              Explorez nos Catégories
            </h2>
            <p className='text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2 text-balance'>
              Trouvez votre style parmi nos collections variées
            </p>
          </div>

          <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-6 lg:gap-8'>
            {categories.map((category, index) => (
              <Link key={index} href={category.href} className='group block tap-highlight-none'>
                <div className='relative overflow-hidden rounded-lg bg-gray-200 mobile-aspect-square'>
                  <Image
                    src={category.image}
                    alt={`Catégorie ${category.name}`}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform duration-300'
                    sizes='(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw'
                    priority={index < 4}
                    quality={85}
                    placeholder='blur'
                    blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
                  />
                  <div className='absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent' />
                  <div className='absolute bottom-3 sm:bottom-4 left-3 sm:left-4 right-3 sm:right-4'>
                    <h3 className='text-white font-semibold text-sm sm:text-base md:text-lg group-hover:scale-105 transition-transform duration-200 text-balance'>
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
      <section className='py-8 sm:py-12 md:py-16 lg:py-20 bg-gray-50'>
        <div className='mobile-container'>
          <div className='text-center mb-8 sm:mb-12 lg:mb-16'>
            <h2 className='text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 lg:mb-6 text-balance'>
              Produits Vedettes
            </h2>
            <p className='text-sm sm:text-base md:text-lg lg:text-xl text-gray-600 max-w-2xl mx-auto px-2 text-balance'>
              Les articles les plus populaires de notre collection
            </p>
          </div>

          <div className='mobile-grid'>
            {featuredProducts.map(product => (
              <div
                key={product.id}
                className='mobile-card group hover:shadow-mobile-elevated transition-all duration-300'
              >
                <div className='relative mobile-aspect-square overflow-hidden bg-gray-200'>
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    fill
                    className='object-cover group-hover:scale-105 transition-transform duration-300'
                    sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw'
                    priority={featuredProducts.indexOf(product) < 4}
                    quality={90}
                    placeholder='blur'
                    blurDataURL='data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=='
                  />
                  <div className='absolute top-3 right-3 z-10'>
                    <button
                      onClick={e => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isInWishlist(product.id)) {
                          removeFromWishlist(product.id);
                        } else {
                          addToWishlist(product);
                        }
                      }}
                      className={`p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors action-button ${
                        isInWishlist(product.id) ? 'text-red-500' : 'text-gray-600'
                      }`}
                      aria-label={
                        isInWishlist(product.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'
                      }
                    >
                      <Heart
                        className={`h-4 w-4 ${isInWishlist(product.id) ? 'fill-current' : 'fill-none'}`}
                      />
                    </button>
                  </div>
                  <div className='absolute bottom-3 left-3 right-3'>
                    <button
                      onClick={e => handleAddToCart(product, e)}
                      className='w-full bg-black text-white py-2 px-4 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center mobile-button'
                      aria-label={`Ajouter ${product.name} au panier`}
                    >
                      <ShoppingBag className='h-4 w-4 mr-2' />
                      Ajouter au Panier
                    </button>
                  </div>
                </div>

                <div className='p-3 sm:p-4'>
                  <h3 className='font-medium text-gray-900 mb-2 line-clamp-2 text-sm sm:text-base text-balance'>
                    {product.name}
                  </h3>

                  <div className='flex items-center mb-2'>
                    <div className='flex items-center'>
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
                    <span className='text-xs text-gray-500 ml-2'>({product.reviews})</span>
                  </div>

                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2 xs:space-x-3 min-w-0 flex-1 max-w-full overflow-hidden'>
                      <span className='text-sm sm:text-base md:text-lg font-bold text-gray-900 flex-shrink-0'>
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <>
                          <span className='sm:hidden text-base text-gray-500 line-through flex-shrink-0 font-semibold whitespace-nowrap'>
                            {formatCompactPrice(product.originalPrice)}
                          </span>
                          <span className='hidden sm:inline text-xs sm:text-sm text-gray-500 line-through flex-shrink-0 font-medium'>
                            {formatPrice(product.originalPrice)}
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className='text-center mt-8 sm:mt-12 lg:mt-16'>
            <Link href='/products'>
              <Button
                size='lg'
                className='text-base sm:text-lg lg:text-xl px-6 sm:px-8 lg:px-10 py-3 sm:py-4 mobile-button'
              >
                Voir Tous les Produits
                <ArrowRight className='ml-2 h-4 w-4 sm:h-5 sm:w-5' />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section - Mobile First */}
      <section className='py-12 sm:py-16 md:py-20 lg:py-24 bg-white'>
        <div className='mobile-container'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 max-w-4xl mx-auto'>
            <div className='text-center'>
              <div className='w-16 h-16 sm:w-20 sm:h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6'>
                <Truck className='w-8 h-8 sm:w-10 sm:h-10 text-yellow-600' />
              </div>
              <h3 className='text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3 text-balance'>
                Livraison Rapide
              </h3>
              <p className='text-sm sm:text-base md:text-lg text-gray-600 text-balance'>
                Livraison gratuite au Gabon à partir de 50,000 FCFA
              </p>
            </div>

            <div className='text-center'>
              <div className='w-16 h-16 sm:w-20 sm:h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6'>
                <Shield className='w-8 h-8 sm:w-10 sm:h-10 text-green-600' />
              </div>
              <h3 className='text-lg sm:text-xl md:text-2xl font-semibold text-gray-900 mb-2 sm:mb-3 text-balance'>
                Qualité Garantie
              </h3>
              <p className='text-sm sm:text-base md:text-lg text-gray-600 text-balance'>
                Produits de qualité premium sélectionnés avec soin
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
