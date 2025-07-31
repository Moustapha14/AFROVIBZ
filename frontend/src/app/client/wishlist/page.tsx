'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useWishlist } from '@/lib/hooks/useWishlist';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { WishlistButton } from '@/components/ui/WishlistButton';
import { 
  Heart, 
  Trash2, 
  Eye, 
  ShoppingBag, 
  Share2, 
  Filter,
  SortAsc,
  SortDesc,
  ArrowLeft,
  Search,
  Grid3X3,
  List
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Product } from '@/types';
import Image from 'next/image';
import { cn } from '@/lib/utils';

// Données mockées pour la liste de souhaits (utilisées si aucun favori n'est sauvegardé)
const mockWishlist: Product[] = [
  {
    id: '1',
    name: 'Robe Africaine Élégante',
    description: 'Une robe élégante aux motifs africains traditionnels',
    price: 25000,
    originalPrice: 35000,
    category: 'femmes',
    images: ['/images/products/product-1.svg'],
    colors: [{ name: 'Rouge', hex: '#FF0000', stock: 10 }],
    sizes: ['S', 'M', 'L', 'XL'],
    stock: 30,
    tags: ['robe', 'africain', 'élégant'],
    isActive: true,
    rating: 4.5,
    reviews: 128,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    name: 'iPhone 15 Pro Max',
    description: 'Smartphone Apple dernière génération',
    price: 850000,
    originalPrice: 950000,
    category: 'tech',
    images: ['/images/products/iphone-15.svg'],
    colors: [{ name: 'Titanium Naturel', hex: '#8B7355', stock: 8 }],
    sizes: ['128GB', '256GB', '512GB', '1TB'],
    stock: 31,
    tags: ['iphone', 'smartphone', 'apple', '5g'],
    isActive: true,
    rating: 4.8,
    reviews: 95,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    name: 'MacBook Air M2',
    description: 'Ordinateur portable Apple avec puce M2',
    price: 650000,
    originalPrice: 750000,
    category: 'tech',
    images: ['/images/products/macbook-air.svg'],
    colors: [{ name: 'Argent', hex: '#C0C0C0', stock: 5 }],
    sizes: ['13"', '15"'],
    stock: 15,
    tags: ['macbook', 'apple', 'm2', 'portable'],
    isActive: true,
    rating: 4.7,
    reviews: 203,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Smartphone Samsung haut de gamme',
    price: 750000,
    originalPrice: 850000,
    category: 'tech',
    images: ['/images/products/galaxy-s24.svg'],
    colors: [{ name: 'Noir', hex: '#000000', stock: 12 }],
    sizes: ['256GB', '512GB', '1TB'],
    stock: 25,
    tags: ['samsung', 'smartphone', 'android', '5g'],
    isActive: true,
    rating: 4.6,
    reviews: 156,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export default function ClientWishlistPage() {
  const { user, loading } = useAuth();
  const { wishlist, removeFromWishlist, clearWishlist, loading: wishlistLoading } = useWishlist();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'user')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const filteredWishlist = wishlist.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedWishlist = [...filteredWishlist].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      case 'date':
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const handleRemoveFromWishlist = (productId: string) => {
    removeFromWishlist(productId);
  };

  const handleAddToCart = (product: Product) => {
    // Simulation d'ajout au panier
    toast.success(`${product.name} ajouté au panier !`);
    router.push('/cart');
  };

  const handleViewProduct = (productId: string) => {
    router.push(`/product/${productId}`);
  };

  const handleShareWishlist = () => {
    // Simulation de partage
    navigator.clipboard.writeText(`${window.location.origin}/client/wishlist`);
    toast.success('Lien de la liste de souhaits copié !');
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
    }).format(amount);
  };

  const getDiscountPercentage = (originalPrice: number, currentPrice: number) => {
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  if (loading || wishlistLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-2 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  if (!user || user.role !== 'user') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Mobile-First */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <button
              onClick={() => router.back()}
              className="p-2 -ml-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft className="h-5 w-5 text-gray-600" />
            </button>
            <h1 className="text-lg font-semibold text-gray-900">Mes Favoris</h1>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                <Filter className="h-5 w-5 text-gray-600" />
              </button>
              <button
                onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
                className="p-2 rounded-full hover:bg-gray-100 transition-colors"
              >
                {viewMode === 'grid' ? (
                  <List className="h-5 w-5 text-gray-600" />
                ) : (
                  <Grid3X3 className="h-5 w-5 text-gray-600" />
                )}
              </button>
            </div>
          </div>
          
          {/* Compteur */}
          <div className="mt-2 text-sm text-gray-600">
            {wishlist.length} article(s) dans vos favoris
          </div>
        </div>

        {/* Barre de recherche mobile */}
        <div className="px-4 pb-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Rechercher dans vos favoris..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full"
            />
          </div>
        </div>

        {/* Filtres mobiles */}
        {showFilters && (
          <div className="px-4 pb-3 border-t border-gray-100">
            <div className="flex gap-2 pt-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="all">Toutes catégories</option>
                <option value="femmes">Femmes</option>
                <option value="hommes">Hommes</option>
                <option value="enfants">Enfants</option>
                <option value="tech">Tech</option>
                <option value="accessoires">Accessoires</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="date">Plus récents</option>
                <option value="name">Nom A-Z</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Contenu principal */}
      <div className="px-4 py-4">
        {/* Liste des produits */}
        {sortedWishlist.length > 0 ? (
          <div className={viewMode === 'grid' 
            ? "grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4" 
            : "space-y-3"
          }>
            {sortedWishlist.map((product) => (
              <div key={product.id} className={cn(
                "bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden",
                viewMode === 'list' && "flex"
              )}>
                {/* Image du produit */}
                <div className={cn(
                  "relative",
                  viewMode === 'list' && "w-24 h-24 flex-shrink-0"
                )}>
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={viewMode === 'list' ? 96 : 300}
                    height={viewMode === 'list' ? 96 : 200}
                    className={cn(
                      "object-cover",
                      viewMode === 'list' ? "w-full h-full" : "w-full h-32 sm:h-40"
                    )}
                  />
                  
                  {/* Badge de réduction */}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute top-1 left-1 bg-red-500 text-white px-1.5 py-0.5 rounded text-xs font-semibold">
                      -{getDiscountPercentage(product.originalPrice, product.price)}%
                    </div>
                  )}

                  {/* Bouton favoris */}
                  <div className="absolute top-1 right-1">
                    <WishlistButton 
                      product={product} 
                      size="sm" 
                      variant="default"
                    />
                  </div>

                  {/* Indicateur de stock */}
                  <div className="absolute bottom-1 left-1">
                    {product.stock > 0 ? (
                      <span className="bg-green-500 text-white px-1.5 py-0.5 rounded text-xs">
                        En stock
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white px-1.5 py-0.5 rounded text-xs">
                        Rupture
                      </span>
                    )}
                  </div>
                </div>

                {/* Informations du produit */}
                <div className={cn(
                  "p-3",
                  viewMode === 'list' && "flex-1 flex flex-col justify-between"
                )}>
                  <div>
                    <h3 className={cn(
                      "font-semibold text-gray-900 mb-1",
                      viewMode === 'list' ? "text-sm" : "text-sm sm:text-base",
                      "line-clamp-2"
                    )}>
                      {product.name}
                    </h3>
                    
                    {viewMode === 'list' && (
                      <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                        {product.description}
                      </p>
                    )}

                    {/* Prix */}
                    <div className="flex items-center gap-2 mb-2">
                      <span className={cn(
                        "font-bold text-gray-900",
                        viewMode === 'list' ? "text-sm" : "text-base"
                      )}>
                        {formatCurrency(product.price)}
                      </span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs sm:text-sm text-gray-500 line-through font-medium">
                          {formatCurrency(product.originalPrice)}
                        </span>
                      )}
                    </div>

                    {/* Couleurs disponibles - seulement en mode grille */}
                    {viewMode === 'grid' && product.colors.length > 0 && (
                      <div className="mb-2">
                        <div className="flex gap-1">
                          {product.colors.slice(0, 3).map((color, index) => (
                            <div
                              key={index}
                              className="w-3 h-3 rounded-full border border-gray-300"
                              style={{ backgroundColor: color.hex }}
                              title={color.name}
                            />
                          ))}
                          {product.colors.length > 3 && (
                            <span className="text-xs text-gray-500">+{product.colors.length - 3}</span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Boutons d'action */}
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleViewProduct(product.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1 text-xs"
                    >
                      <Eye className="h-3 w-3 mr-1" />
                      Voir
                    </Button>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      size="sm"
                      className="flex-1 text-xs"
                      disabled={product.stock === 0}
                    >
                      <ShoppingBag className="h-3 w-3 mr-1" />
                      Panier
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* État vide */
          <div className="text-center py-12">
            <Heart className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-4 text-lg font-medium text-gray-900">Vos favoris sont vides</h3>
            <p className="mt-2 text-sm text-gray-500 px-4">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Aucun produit ne correspond à vos critères de recherche.'
                : 'Commencez à ajouter des produits que vous aimeriez acheter.'
              }
            </p>
            <div className="mt-6 px-4">
              <Button 
                onClick={() => router.push('/products')}
                className="w-full sm:w-auto"
              >
                Découvrir nos produits
              </Button>
            </div>
          </div>
        )}

        {/* Actions en bas de page */}
        {sortedWishlist.length > 0 && (
          <div className="mt-6 bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                {sortedWishlist.length} article(s) dans vos favoris
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={handleShareWishlist}
                  variant="outline"
                  size="sm"
                  className="flex-1 sm:flex-none text-xs"
                >
                  <Share2 className="h-3 w-3 mr-1" />
                  Partager
                </Button>
                <Button
                  onClick={() => router.push('/products')}
                  size="sm"
                  className="flex-1 sm:flex-none text-xs"
                >
                  <ShoppingBag className="h-3 w-3 mr-1" />
                  Continuer
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 