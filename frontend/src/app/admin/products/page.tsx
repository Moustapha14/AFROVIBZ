'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import ProductModal from '@/components/admin/ProductModal';
import { 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2,
  Package,
  Image as ImageIcon
} from 'lucide-react';
import { Product } from '@/types';
import { ProductsService } from '@/lib/api/products';
import Image from 'next/image';
import { toast } from 'react-hot-toast';

// Données mockées pour les produits
const mockProducts: Product[] = [
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
];

export default function AdminProductsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [productsLoading, setProductsLoading] = useState(false);

  // Charger les produits depuis l'API
  useEffect(() => {
    const loadProducts = async () => {
      try {
        setProductsLoading(true);
        const response = await ProductsService.getAllProducts({ limit: 100 });
        setProducts(response.products);
      } catch (error) {
        console.error('Erreur lors du chargement des produits:', error);
        // Garder les produits mockés en cas d'erreur
        toast.error('Erreur lors du chargement des produits');
      } finally {
        setProductsLoading(false);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'super_admin')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleDeleteProduct = (productId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(products.filter(p => p.id !== productId));
      toast.success('Produit supprimé avec succès');
    }
  };

  const handleToggleActive = (productId: string) => {
    setProducts(products.map(p => 
      p.id === productId ? { ...p, isActive: !p.isActive } : p
    ));
    toast.success('Statut du produit mis à jour');
  };

  const handleAddProduct = async (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const response = await ProductsService.createProduct(productData);
      if (response.success) {
        setProducts([...products, response.product]);
        toast.success('Produit ajouté avec succès');
      } else {
        toast.error('Erreur lors de l\'ajout du produit');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout du produit:', error);
      toast.error('Erreur lors de l\'ajout du produit');
    }
  };

  const handleEditProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (selectedProduct) {
      setProducts(products.map(p => 
        p.id === selectedProduct.id 
          ? { ...p, ...productData, updatedAt: new Date() }
          : p
      ));
    }
  };

  const handleOpenEditModal = (product: Product) => {
    setSelectedProduct(product);
    setIsEditModalOpen(true);
  };

  if (loading || productsLoading || !user) {
    return <div className="flex items-center justify-center min-h-[400px]">Chargement...</div>;
  }

  if (!user || user.role !== 'super_admin') {
    return null;
  }

  return (
    <div className="space-y-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Produits</h1>
          <p className="mt-2 text-gray-600">Gérez votre catalogue de produits</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Rechercher un produit..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">Toutes les catégories</option>
                <option value="femmes">Femmes</option>
                <option value="hommes">Hommes</option>
                <option value="enfants">Enfants</option>
                <option value="accessoires">Accessoires</option>
                <option value="tech">Tech</option>
              </select>
            </div>

            {/* Add Product Button */}
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter un produit
            </Button>
          </div>
        </div>

        {/* Products Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Catégorie
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Prix
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <Image
                            src={product.images[0] || '/images/placeholder.svg'}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="h-10 w-10 rounded-full object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          <div className="text-sm text-gray-500">{product.description.substring(0, 50)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800 capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.price.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.stock}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        product.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {product.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => router.push(`/admin/products/${product.id}/images`)}
                          className="text-green-600 hover:text-green-900"
                          title="Gérer les images"
                        >
                          <ImageIcon className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleToggleActive(product.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                          title={product.isActive ? 'Désactiver' : 'Activer'}
                        >
                          {product.isActive ? 'Désactiver' : 'Activer'}
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="text-blue-600 hover:text-blue-900"
                          title="Modifier"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
                          title="Supprimer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Filter className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun produit trouvé</h3>
            <p className="text-gray-500">Aucun produit ne correspond à vos critères de recherche.</p>
          </div>
        )}

        {/* Product Modal */}
        <ProductModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleAddProduct}
          mode="add"
        />

        <ProductModal
          isOpen={isEditModalOpen}
          onClose={() => {
            setIsEditModalOpen(false);
            setSelectedProduct(null);
          }}
          onSave={handleEditProduct}
          product={selectedProduct}
          mode="edit"
        />
      </div>
    </div>
  );
} 