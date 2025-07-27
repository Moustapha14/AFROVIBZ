'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProductImage } from '@/components/ui/ProductImage';
import { ProductModal } from '@/components/ui/ProductModal';
import { useCart } from '@/lib/hooks/useCart';
import { 
  Filter, 
  Grid, 
  List, 
  ChevronDown, 
  Star, 
  ShoppingBag, 
  Heart,
  SlidersHorizontal,
  X
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import { Pagination } from '@/components/ui/Pagination';
import { Product } from '@/types';

// Données temporaires pour la démo
const products: Product[] = [
  {
    id: '1',
    name: 'Robe Africaine Élégante',
    description: 'Une robe élégante aux motifs africains traditionnels',
    price: 25000,
    originalPrice: 35000,
    category: 'femmes',
    images: ['/images/products/product-1.svg'],
    colors: [
      { name: 'Rouge', hex: '#FF0000', stock: 10 },
      { name: 'Bleu', hex: '#0000FF', stock: 8 },
      { name: 'Vert', hex: '#00FF00', stock: 12 }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 30,
    tags: ['robe', 'africain', 'élégant'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Chemise Wax Traditionnelle',
    description: 'Chemise en wax traditionnel pour hommes',
    price: 18000,
    originalPrice: 25000,
    category: 'hommes',
    images: ['/images/products/product-2.svg'],
    colors: [
      { name: 'Jaune', hex: '#FFFF00', stock: 15 },
      { name: 'Orange', hex: '#FFA500', stock: 10 }
    ],
    sizes: ['M', 'L', 'XL'],
    stock: 25,
    tags: ['chemise', 'wax', 'traditionnel'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Pagne Moderne',
    description: 'Pagne moderne aux couleurs vives',
    price: 12000,
    originalPrice: 18000,
    category: 'femmes',
    images: ['/images/products/product-3.svg'],
    colors: [
      { name: 'Multicolore', hex: '#FFD700', stock: 20 }
    ],
    sizes: ['Unique'],
    stock: 20,
    tags: ['pagne', 'moderne', 'multicolore'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Boubou Traditionnel',
    description: 'Boubou traditionnel pour cérémonies',
    price: 45000,
    originalPrice: 60000,
    category: 'hommes',
    images: ['/images/products/product-4.svg'],
    colors: [
      { name: 'Blanc', hex: '#FFFFFF', stock: 5 },
      { name: 'Bleu', hex: '#0000FF', stock: 8 }
    ],
    sizes: ['L', 'XL'],
    stock: 13,
    tags: ['boubou', 'traditionnel', 'cérémonie'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Jupe Wax Colorée',
    description: 'Jupe en wax aux couleurs éclatantes',
    price: 15000,
    originalPrice: 22000,
    category: 'femmes',
    images: ['/images/products/product-5.svg'],
    colors: [
      { name: 'Rouge', hex: '#FF0000', stock: 12 },
      { name: 'Jaune', hex: '#FFFF00', stock: 10 },
      { name: 'Vert', hex: '#00FF00', stock: 8 }
    ],
    sizes: ['S', 'M', 'L'],
    stock: 30,
    tags: ['jupe', 'wax', 'colorée'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Pantalon Africain',
    description: 'Pantalon africain confortable et élégant',
    price: 22000,
    originalPrice: 30000,
    category: 'hommes',
    images: ['/images/products/product-6.svg'],
    colors: [
      { name: 'Noir', hex: '#000000', stock: 15 },
      { name: 'Marron', hex: '#8B4513', stock: 12 }
    ],
    sizes: ['M', 'L', 'XL'],
    stock: 27,
    tags: ['pantalon', 'africain', 'confortable'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Produits Tech
  {
    id: '7',
    name: 'iPhone 15 Pro Max',
    description: 'Smartphone Apple dernière génération avec appareil photo professionnel',
    price: 850000,
    originalPrice: 950000,
    category: 'tech',
    images: ['/images/products/iphone-15.svg'],
    colors: [
      { name: 'Titanium Naturel', hex: '#8B7355', stock: 8 },
      { name: 'Titanium Bleu', hex: '#4A90E2', stock: 6 },
      { name: 'Titanium Blanc', hex: '#F5F5F5', stock: 10 },
      { name: 'Titanium Noir', hex: '#1A1A1A', stock: 7 }
    ],
    sizes: ['128GB', '256GB', '512GB', '1TB'],
    stock: 31,
    tags: ['iphone', 'smartphone', 'apple', '5g'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '8',
    name: 'MacBook Air M2',
    description: 'Ordinateur portable Apple avec puce M2, ultra-léger et performant',
    price: 1200000,
    originalPrice: 1350000,
    category: 'tech',
    images: ['/images/products/macbook-air.svg'],
    colors: [
      { name: 'Gris Sidéral', hex: '#8E8E93', stock: 5 },
      { name: 'Argent', hex: '#E5E5E7', stock: 8 },
      { name: 'Or', hex: '#F4E4BC', stock: 4 },
      { name: 'Minuit', hex: '#1D1D1F', stock: 6 }
    ],
    sizes: ['8GB RAM', '16GB RAM'],
    stock: 23,
    tags: ['macbook', 'laptop', 'apple', 'm2'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '9',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Smartphone Android premium avec S Pen intégré',
    price: 750000,
    originalPrice: 850000,
    category: 'tech',
    images: ['/images/products/galaxy-s24.svg'],
    colors: [
      { name: 'Titanium Noir', hex: '#1A1A1A', stock: 12 },
      { name: 'Titanium Jaune', hex: '#FFD700', stock: 8 },
      { name: 'Titanium Violet', hex: '#8B5CF6', stock: 10 },
      { name: 'Titanium Gris', hex: '#6B7280', stock: 9 }
    ],
    sizes: ['256GB', '512GB', '1TB'],
    stock: 39,
    tags: ['samsung', 'smartphone', 'android', 's-pen'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '10',
    name: 'iPad Pro 12.9"',
    description: 'Tablette professionnelle Apple avec puce M2 et écran Liquid Retina XDR',
    price: 950000,
    originalPrice: 1100000,
    category: 'tech',
    images: ['/images/products/ipad-pro.svg'],
    colors: [
      { name: 'Argent', hex: '#F5F5F7', stock: 7 },
      { name: 'Gris Sidéral', hex: '#8E8E93', stock: 5 }
    ],
    sizes: ['128GB', '256GB', '512GB', '1TB', '2TB'],
    stock: 25,
    tags: ['ipad', 'tablette', 'apple', 'pro'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '11',
    name: 'AirPods Pro 2',
    description: 'Écouteurs sans fil Apple avec réduction de bruit active',
    price: 180000,
    originalPrice: 220000,
    category: 'tech',
    images: ['/images/products/airpods-pro.svg'],
    colors: [
      { name: 'Blanc', hex: '#FFFFFF', stock: 25 },
      { name: 'Noir', hex: '#1A1A1A', stock: 20 }
    ],
    sizes: ['Unique'],
    stock: 45,
    tags: ['airpods', 'écouteurs', 'apple', 'bluetooth'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '12',
    name: 'PlayStation 5',
    description: 'Console de jeux nouvelle génération Sony avec DualSense',
    price: 450000,
    originalPrice: 500000,
    category: 'tech',
    images: ['/images/products/ps5.svg'],
    colors: [
      { name: 'Blanc', hex: '#FFFFFF', stock: 15 },
      { name: 'Noir', hex: '#1A1A1A', stock: 12 }
    ],
    sizes: ['Disque', 'Digital'],
    stock: 27,
    tags: ['playstation', 'console', 'gaming', 'sony'],
    isActive: true,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const categories = [
  { id: 'femmes', name: 'Femmes' },
  { id: 'hommes', name: 'Hommes' },
  { id: 'enfants', name: 'Enfants' },
  { id: 'accessoires', name: 'Accessoires' },
  { id: 'tech', name: 'Tech' },
];

const priceRanges = [
  { min: 0, max: 10000, label: 'Moins de 10,000 FCFA' },
  { min: 10000, max: 25000, label: '10,000 - 25,000 FCFA' },
  { min: 25000, max: 50000, label: '25,000 - 50,000 FCFA' },
  { min: 50000, max: null, label: 'Plus de 50,000 FCFA' },
];

function ProductsPageContent() {
  const searchParams = useSearchParams();
  const { addToCart } = useCart();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Get category from URL params
  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategory(category);
    }
  }, [searchParams]);

  // Filter and sort products
  const filteredProducts = products.filter(product => {
    if (selectedCategory && product.category !== selectedCategory) {
      return false;
    }
    
    if (selectedPriceRange) {
      const range = priceRanges.find(r => r.label === selectedPriceRange);
      if (range) {
        if (range.max && (product.price < range.min || product.price > range.max)) {
          return false;
        }
        if (!range.max && product.price < range.min) {
          return false;
        }
      }
    }
    
    return true;
  });

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'newest':
      default:
        return 0; // Keep original order for demo
    }
  });

  // Pagination
  const totalPages = Math.ceil(sortedProducts.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + productsPerPage);

  const handleAddToCart = (product: Product, quantity: number, size: string, color: string) => {
    addToCart(product, quantity, size, color);
    alert(`${product.name} ajouté au panier !`);
  };

  const openProductModal = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const closeProductModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-4 xs:py-6 sm:py-8">
        {/* Header */}
        <div className="mb-4 xs:mb-6 sm:mb-8">
          <h1 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 mb-1 xs:mb-2">
            Nos Produits
          </h1>
          <p className="text-xs xs:text-sm sm:text-base text-gray-600">
            Découvrez notre collection de vêtements africains
          </p>
        </div>

        {/* Filters and Sort */}
        <div className="bg-white rounded-lg shadow-sm p-3 xs:p-4 mb-4 xs:mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3 xs:gap-4">
            {/* Mobile filter button */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className="w-full h-11 py-3"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filtres
                {showFilters && <X className="h-4 w-4 ml-2" />}
              </Button>
            </div>

            {/* Desktop filters */}
            <div className="hidden lg:flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Catégorie:</span>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Toutes</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium text-gray-700">Prix:</span>
                <select
                  value={selectedPriceRange}
                  onChange={(e) => setSelectedPriceRange(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                >
                  <option value="">Tous les prix</option>
                  {priceRanges.map((range) => (
                    <option key={range.label} value={range.label}>
                      {range.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sort and view */}
            <div className="flex flex-col xs:flex-row items-start xs:items-center space-y-3 xs:space-y-0 xs:space-x-4">
              <div className="flex flex-col xs:flex-row items-start xs:items-center space-y-2 xs:space-y-0 xs:space-x-2 w-full xs:w-auto">
                <span className="text-xs xs:text-sm font-medium text-gray-700">Trier par:</span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full xs:w-auto border border-gray-300 rounded-md px-3 py-2 text-xs xs:text-sm focus:ring-2 focus:ring-black focus:border-transparent h-10"
                >
                  <option value="newest">Plus récents</option>
                  <option value="price-low">Prix croissant</option>
                  <option value="price-high">Prix décroissant</option>
                  <option value="rating">Meilleures notes</option>
                </select>
              </div>

              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors h-10 w-10 flex items-center justify-center ${
                    viewMode === 'grid' ? 'bg-gray-200' : 'hover:bg-gray-100'
                  }`}
                  aria-label="Vue grille"
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors h-10 w-10 flex items-center justify-center ${
                    viewMode === 'list' ? 'bg-gray-200' : 'hover:bg-gray-100'
                  }`}
                  aria-label="Vue liste"
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Mobile filters */}
          {showFilters && (
            <div className="lg:hidden mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-xs xs:text-sm font-medium text-gray-700 mb-2">
                    Catégorie
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-3 text-xs xs:text-sm focus:ring-2 focus:ring-black focus:border-transparent h-11"
                  >
                    <option value="">Toutes</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prix
                  </label>
                  <select
                    value={selectedPriceRange}
                    onChange={(e) => setSelectedPriceRange(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-transparent"
                  >
                    <option value="">Tous les prix</option>
                    {priceRanges.map((range) => (
                      <option key={range.label} value={range.label}>
                        {range.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Results count */}
        <div className="mb-4 xs:mb-6">
          <p className="text-xs xs:text-sm sm:text-base text-gray-600">
            {filteredProducts.length} produit{filteredProducts.length !== 1 ? 's' : ''} trouvé{filteredProducts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {/* Products Grid */}
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
            {paginatedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group">
                <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-200">
                  <ProductImage
                    src={product.images[0]}
                    alt={product.name}
                    fallbackText={product.name}
                  />
                  <div className="absolute top-2 xs:top-3 right-2 xs:right-3 z-10">
                    <button 
                      className="p-1.5 xs:p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors h-8 w-8 xs:h-10 xs:w-10 flex items-center justify-center"
                      aria-label="Ajouter aux favoris"
                    >
                      <Heart className="h-3 w-3 xs:h-4 xs:w-4 text-gray-600" />
                    </button>
                  </div>
                  <div className="absolute bottom-2 xs:bottom-3 left-2 xs:left-3 right-2 xs:right-3">
                    <button 
                      onClick={() => openProductModal(product)}
                      className="w-full bg-black text-white py-2 px-3 xs:px-4 rounded-md text-xs xs:text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center h-10"
                      aria-label={`Ajouter ${product.name} au panier`}
                    >
                      <ShoppingBag className="h-3 w-3 xs:h-4 xs:w-4 mr-1 xs:mr-2" />
                      <span className="hidden xs:inline">Ajouter</span>
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
                            i < 4 // Note fixe de 4 étoiles pour la démo
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1 xs:ml-2">
                      (4.5)
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
        ) : (
          <div className="space-y-3 xs:space-y-4">
            {paginatedProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm p-3 xs:p-4 flex space-x-3 xs:space-x-4">
                <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                  <ProductImage
                    src={product.images[0]}
                    alt={product.name}
                    fallbackText={product.name}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 mb-1 text-xs xs:text-sm sm:text-base">{product.name}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-2 w-2 xs:h-3 xs:w-3 sm:h-4 sm:w-4 ${
                            i < 4 // Note fixe de 4 étoiles pour la démo
                              ? 'text-yellow-400 fill-current'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1 xs:ml-2">(4.5)</span>
                  </div>
                  <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-2">
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
                    <Button 
                      onClick={() => openProductModal(product)}
                      size="sm"
                      className="w-full xs:w-auto h-10"
                    >
                      <ShoppingBag className="h-3 w-3 xs:h-4 xs:w-4 mr-1 xs:mr-2" />
                      <span className="text-xs xs:text-sm">Ajouter</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 xs:mt-8">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
              maxVisiblePages={5}
            />
          </div>
        )}

        {/* Product Modal */}
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={closeProductModal}
          onAddToCart={handleAddToCart}
        />
      </div>
    </div>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center">Chargement...</div>}>
      <ProductsPageContent />
    </Suspense>
  );
} 