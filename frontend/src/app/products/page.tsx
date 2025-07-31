'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ProductImage } from '@/components/ui/ProductImage';
import { ProductModal } from '@/components/ui/ProductModal';
import { useCart } from '@/lib/hooks/useCart';
import { useWishlist } from '@/lib/hooks/useWishlist';
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
import { formatPrice, formatCompactPrice } from '@/lib/utils';
import { Pagination } from '@/components/ui/Pagination';
import { Product } from '@/types';
import { ProductsService, ProductsResponse } from '@/lib/api/products';


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
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Get category and search query from URL params
  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    if (category) {
      setSelectedCategory(category);
    }
    if (search) {
      setSearchQuery(search);
    }
  }, [searchParams]);

  // Charger les produits depuis l'API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const response = await ProductsService.getAllProducts({
          page: currentPage,
          limit: productsPerPage,
          category: selectedCategory || undefined,
          sortBy: sortBy,
        });
        
        setProducts(response.products);
        setTotalProducts(response.total);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        // Fallback vers les données statiques en cas d'erreur
        const { products: staticProducts } = await import('@/lib/data/products');
        setProducts(staticProducts);
        setTotalProducts(staticProducts.length);
        setTotalPages(Math.ceil(staticProducts.length / productsPerPage));
      } finally {
        setLoading(false);
      }
    };

    loadProducts();
  }, [currentPage, selectedCategory, sortBy]);

  // Filtrer par prix et recherche textuelle (côté client pour la démo)
  const filteredProducts = products.filter(product => {
    // Filtrage par recherche textuelle
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = product.name.toLowerCase().includes(query);
      const matchesDescription = product.description.toLowerCase().includes(query);
      if (!matchesName && !matchesDescription) {
        return false;
      }
    }
    
    // Filtrage par prix
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
            {searchQuery ? `Résultats pour "${searchQuery}"` : 'Nos Produits'}
          </h1>
          <p className="text-xs xs:text-sm sm:text-base text-gray-600">
            {searchQuery 
              ? `${filteredProducts.length} produit${filteredProducts.length !== 1 ? 's' : ''} trouvé${filteredProducts.length !== 1 ? 's' : ''}`
              : 'Découvrez notre collection de vêtements africains'
            }
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
            {loading ? 'Chargement...' : `${totalProducts} produit${totalProducts !== 1 ? 's' : ''} trouvé${totalProducts !== 1 ? 's' : ''}`}
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-lg shadow-sm animate-pulse">
                <div className="aspect-square bg-gray-200 rounded-t-lg"></div>
                <div className="p-4">
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Products Grid */}
        {!loading && viewMode === 'grid' && (
          <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 xs:gap-4 sm:gap-6">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 group">
                <div className="relative aspect-square overflow-hidden rounded-t-lg bg-gray-200">
                  <ProductImage
                    src={product.images[0]}
                    alt={product.name}
                    fallbackText={product.name}
                  />
                  <div className="absolute top-2 xs:top-3 right-2 xs:right-3 z-10">
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isInWishlist(product.id)) {
                          removeFromWishlist(product.id);
                        } else {
                          addToWishlist(product);
                        }
                      }}
                      className={`p-1.5 xs:p-2 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors h-8 w-8 xs:h-10 xs:w-10 flex items-center justify-center ${
                        isInWishlist(product.id) ? 'text-red-500' : 'text-gray-600'
                      }`}
                      aria-label={isInWishlist(product.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                      <Heart className={`h-3 w-3 xs:h-4 xs:w-4 ${isInWishlist(product.id) ? 'fill-current' : 'fill-none'}`} />
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
                    <div className="flex items-center space-x-2 xs:space-x-3 min-w-0 flex-1 max-w-full overflow-hidden">
                      <span className="text-sm xs:text-base sm:text-lg font-bold text-gray-900 flex-shrink-0">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <>
                          <span className="sm:hidden text-base text-gray-500 line-through flex-shrink-0 font-semibold whitespace-nowrap">
                            {formatCompactPrice(product.originalPrice)}
                          </span>
                          <span className="hidden sm:inline text-xs sm:text-sm text-gray-500 line-through flex-shrink-0 font-medium">
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
        )}

        {/* Products List View */}
        {!loading && viewMode === 'list' && (
          <div className="space-y-3 xs:space-y-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm p-3 xs:p-4 flex space-x-3 xs:space-x-4">
                <div className="w-16 h-16 xs:w-20 xs:h-20 sm:w-24 sm:h-24 bg-gray-200 rounded-lg flex-shrink-0 overflow-hidden">
                  <ProductImage
                    src={product.images[0]}
                    alt={product.name}
                    fallbackText={product.name}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-1">
                    <h3 className="font-medium text-gray-900 text-xs xs:text-sm sm:text-base flex-1">{product.name}</h3>
                    <button 
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        if (isInWishlist(product.id)) {
                          removeFromWishlist(product.id);
                        } else {
                          addToWishlist(product);
                        }
                      }}
                      className={`p-1.5 bg-white rounded-full shadow-sm hover:bg-gray-50 transition-colors h-8 w-8 flex items-center justify-center ml-2 ${
                        isInWishlist(product.id) ? 'text-red-500' : 'text-gray-600'
                      }`}
                      aria-label={isInWishlist(product.id) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                    >
                      <Heart className={`h-3 w-3 ${isInWishlist(product.id) ? 'fill-current' : 'fill-none'}`} />
                    </button>
                  </div>
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
                    <div className="flex items-center space-x-2 xs:space-x-3 min-w-0 flex-1 overflow-hidden">
                      <span className="text-sm xs:text-base sm:text-lg font-bold text-gray-900 flex-shrink-0">
                        {formatPrice(product.price)}
                      </span>
                      {product.originalPrice && (
                        <>
                          <span className="sm:hidden text-base text-gray-500 line-through flex-shrink-0 font-semibold whitespace-nowrap">
                            {formatCompactPrice(product.originalPrice)}
                          </span>
                          <span className="hidden sm:inline text-xs sm:text-sm text-gray-500 line-through flex-shrink-0 font-medium">
                            {formatPrice(product.originalPrice)}
                          </span>
                        </>
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