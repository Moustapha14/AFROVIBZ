'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Product } from '@/types';
import { Plus, Edit, Trash2, Search, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';
import ProductModal from '@/components/admin/ProductModal';

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

  const handleAddProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts([...products, newProduct]);
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

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Chargement...</div>;
  }

  if (!user || user.role !== 'super_admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={product.images[0] || '/images/placeholder.svg'}
                            alt={product.name}
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
                          onClick={() => handleToggleActive(product.id)}
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          {product.isActive ? 'Désactiver' : 'Activer'}
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(product)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product.id)}
                          className="text-red-600 hover:text-red-900"
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