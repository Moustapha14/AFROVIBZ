'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Heart, 
  Trash2, 
  Eye, 
  ShoppingBag, 
  Share2, 
  Filter,
  SortAsc,
  SortDesc
} from 'lucide-react';
import { toast } from 'react-hot-toast';
import { Product } from '@/types';
import Image from 'next/image';

// Données mockées pour la liste de souhaits
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
  const router = useRouter();
  const [wishlist, setWishlist] = useState<Product[]>(mockWishlist);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [sortBy, setSortBy] = useState('date');

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
    setWishlist(wishlist.filter(p => p.id !== productId));
    toast.success('Produit retiré de la liste de souhaits');
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

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Chargement...</div>;
  }

  if (!user || user.role !== 'user') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Ma Liste de Souhaits</h1>
              <p className="mt-2 text-gray-600">
                {wishlist.length} article(s) dans votre liste de souhaits
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={handleShareWishlist}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Share2 className="h-4 w-4" />
                Partager
              </Button>
              <Button
                onClick={() => router.push('/products')}
                className="flex items-center gap-2"
              >
                <ShoppingBag className="h-4 w-4" />
                Continuer les achats
              </Button>
            </div>
          </div>
        </div>

        {/* Filtres et recherche */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher dans votre liste de souhaits..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Toutes les catégories</option>
                <option value="femmes">Femmes</option>
                <option value="hommes">Hommes</option>
                <option value="enfants">Enfants</option>
                <option value="tech">Tech</option>
                <option value="accessoires">Accessoires</option>
              </select>
            </div>
            <div className="sm:w-48">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="date">Plus récents</option>
                <option value="name">Nom A-Z</option>
                <option value="price-low">Prix croissant</option>
                <option value="price-high">Prix décroissant</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des produits */}
        {sortedWishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedWishlist.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                {/* Image du produit */}
                <div className="relative">
                  <Image
                    src={product.images[0]}
                    alt={product.name}
                    width={300}
                    height={200}
                    className="w-full h-48 object-cover"
                    onError={() => {
                      // Fallback handled by Next.js Image component
                    }}
                  />
                  
                  {/* Badge de réduction */}
                  {product.originalPrice && product.originalPrice > product.price && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                      -{getDiscountPercentage(product.originalPrice, product.price)}%
                    </div>
                  )}

                  {/* Boutons d'action */}
                  <div className="absolute top-2 right-2 flex flex-col gap-2">
                    <button
                      onClick={() => handleViewProduct(product.id)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-gray-50 transition-colors"
                      title="Voir le produit"
                    >
                      <Eye className="h-4 w-4 text-gray-600" />
                    </button>
                    <button
                      onClick={() => handleRemoveFromWishlist(product.id)}
                      className="p-2 bg-white rounded-full shadow-md hover:bg-red-50 transition-colors"
                      title="Retirer de la liste"
                    >
                      <Trash2 className="h-4 w-4 text-red-600" />
                    </button>
                  </div>

                  {/* Indicateur de stock */}
                  <div className="absolute bottom-2 left-2">
                    {product.stock > 0 ? (
                      <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">
                        En stock ({product.stock})
                      </span>
                    ) : (
                      <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">
                        Rupture de stock
                      </span>
                    )}
                  </div>
                </div>

                {/* Informations du produit */}
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {product.name}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {product.description}
                  </p>

                  {/* Prix */}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-lg font-bold text-gray-900">
                      {formatCurrency(product.price)}
                    </span>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatCurrency(product.originalPrice)}
                      </span>
                    )}
                  </div>

                  {/* Couleurs disponibles */}
                  {product.colors.length > 0 && (
                    <div className="mb-3">
                      <p className="text-xs text-gray-500 mb-1">Couleurs disponibles :</p>
                      <div className="flex gap-1">
                        {product.colors.slice(0, 4).map((color, index) => (
                          <div
                            key={index}
                            className="w-4 h-4 rounded-full border border-gray-300"
                            style={{ backgroundColor: color.hex }}
                            title={color.name}
                          />
                        ))}
                        {product.colors.length > 4 && (
                          <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tailles disponibles */}
                  {product.sizes.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs text-gray-500 mb-1">Tailles disponibles :</p>
                      <div className="flex flex-wrap gap-1">
                        {product.sizes.slice(0, 3).map((size, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-gray-100 text-xs rounded"
                          >
                            {size}
                          </span>
                        ))}
                        {product.sizes.length > 3 && (
                          <span className="text-xs text-gray-500">+{product.sizes.length - 3}</span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Bouton d'action */}
                  <Button
                    onClick={() => handleAddToCart(product)}
                    className="w-full flex items-center justify-center gap-2"
                    disabled={product.stock === 0}
                  >
                    <ShoppingBag className="h-4 w-4" />
                    {product.stock > 0 ? 'Ajouter au panier' : 'Rupture de stock'}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* État vide */
          <div className="text-center py-12">
            <Heart className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Votre liste de souhaits est vide</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Aucun produit ne correspond à vos critères de recherche.'
                : 'Commencez à ajouter des produits que vous aimeriez acheter.'
              }
            </p>
            <div className="mt-6">
              <Button onClick={() => router.push('/products')}>
                Découvrir nos produits
              </Button>
            </div>
          </div>
        )}

        {/* Actions en bas de page */}
        {sortedWishlist.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <div className="text-sm text-gray-600">
                {sortedWishlist.length} article(s) dans votre liste de souhaits
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={handleShareWishlist}
                  variant="outline"
                  className="flex items-center gap-2"
                >
                  <Share2 className="h-4 w-4" />
                  Partager ma liste
                </Button>
                <Button
                  onClick={() => router.push('/products')}
                  className="flex items-center gap-2"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Continuer les achats
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 