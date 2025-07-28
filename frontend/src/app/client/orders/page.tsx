'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Eye, Clock, CheckCircle, XCircle, Truck, Package, Download } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
  deliveryOption: string;
  deliveryAddress: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  createdAt: Date;
  updatedAt: Date;
  estimatedDelivery?: Date;
  trackingNumber?: string;
}

// Données mockées pour les commandes client
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'CMD-2024-001',
    status: 'processing',
    total: 875000,
    items: [
      { name: 'Robe Africaine Élégante', quantity: 1, price: 25000, size: 'M', color: 'Rouge' },
      { name: 'iPhone 15 Pro Max', quantity: 1, price: 850000, size: '256GB', color: 'Titanium' }
    ],
    deliveryOption: 'Express',
    deliveryAddress: '123 Rue de la Paix, Libreville, Gabon',
    paymentMethod: 'Mobile Money',
    paymentStatus: 'paid',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-16T09:15:00'),
    estimatedDelivery: new Date('2024-01-18'),
    trackingNumber: 'TRK-2024-001',
  },
  {
    id: '2',
    orderNumber: 'CMD-2023-008',
    status: 'delivered',
    total: 650000,
    items: [
      { name: 'MacBook Air M2', quantity: 1, price: 650000, size: '13"', color: 'Argent' }
    ],
    deliveryOption: 'Standard',
    deliveryAddress: '456 Avenue des Palmiers, Libreville, Gabon',
    paymentMethod: 'Carte Bancaire',
    paymentStatus: 'paid',
    createdAt: new Date('2023-12-20T14:20:00'),
    updatedAt: new Date('2023-12-22T16:30:00'),
    estimatedDelivery: new Date('2023-12-25'),
    trackingNumber: 'TRK-2023-008',
  },
  {
    id: '3',
    orderNumber: 'CMD-2023-007',
    status: 'delivered',
    total: 870000,
    items: [
      { name: 'Samsung Galaxy S24 Ultra', quantity: 1, price: 750000, size: '256GB', color: 'Noir' },
      { name: 'AirPods Pro 2', quantity: 1, price: 120000, size: 'Standard', color: 'Blanc' }
    ],
    deliveryOption: 'Express',
    deliveryAddress: '789 Boulevard de la Mer, Libreville, Gabon',
    paymentMethod: 'Mobile Money',
    paymentStatus: 'paid',
    createdAt: new Date('2023-12-15T09:45:00'),
    updatedAt: new Date('2023-12-17T11:20:00'),
    estimatedDelivery: new Date('2023-12-18'),
    trackingNumber: 'TRK-2023-007',
  },
  {
    id: '4',
    orderNumber: 'CMD-2023-006',
    status: 'cancelled',
    total: 450000,
    items: [
      { name: 'iPad Pro 12.9"', quantity: 1, price: 450000, size: '256GB', color: 'Argent' }
    ],
    deliveryOption: 'Standard',
    deliveryAddress: '321 Rue du Commerce, Libreville, Gabon',
    paymentMethod: 'Carte Bancaire',
    paymentStatus: 'refunded',
    createdAt: new Date('2023-12-10T16:15:00'),
    updatedAt: new Date('2023-12-11T10:30:00'),
  },
];

export default function ClientOrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'user')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'En attente', icon: Clock },
      'processing': { color: 'bg-blue-100 text-blue-800', label: 'En cours', icon: Package },
      'shipped': { color: 'bg-purple-100 text-purple-800', label: 'Expédié', icon: Truck },
      'delivered': { color: 'bg-green-100 text-green-800', label: 'Livré', icon: CheckCircle },
      'cancelled': { color: 'bg-red-100 text-red-800', label: 'Annulé', icon: XCircle },
      'refunded': { color: 'bg-gray-100 text-gray-800', label: 'Remboursé', icon: XCircle },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    const Icon = config.icon;
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </span>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'En attente' },
      'paid': { color: 'bg-green-100 text-green-800', label: 'Payé' },
      'failed': { color: 'bg-red-100 text-red-800', label: 'Échoué' },
      'refunded': { color: 'bg-gray-100 text-gray-800', label: 'Remboursé' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
    }).format(amount);
  };

  const handleExportOrders = () => {
    toast.success('Export de vos commandes en cours...');
  };

  const getOrderStats = () => {
    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending' || o.status === 'processing').length;
    const delivered = orders.filter(o => o.status === 'delivered').length;
    const cancelled = orders.filter(o => o.status === 'cancelled' || o.status === 'refunded').length;
    
    return { total, pending, delivered, cancelled };
  };

  const stats = getOrderStats();

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
              <h1 className="text-3xl font-bold text-gray-900">Mes Commandes</h1>
              <p className="mt-2 text-gray-600">Suivez l'état de vos commandes et consultez votre historique</p>
            </div>
            <Button onClick={handleExportOrders} variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En cours</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Livrées</p>
                <p className="text-2xl font-bold text-gray-900">{stats.delivered}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Annulées</p>
                <p className="text-2xl font-bold text-gray-900">{stats.cancelled}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Rechercher par numéro de commande..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="sm:w-48">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="processing">En cours</option>
                <option value="shipped">Expédié</option>
                <option value="delivered">Livré</option>
                <option value="cancelled">Annulé</option>
                <option value="refunded">Remboursé</option>
              </select>
            </div>
          </div>
        </div>

        {/* Liste des commandes */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commande
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Articles
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Paiement
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.orderNumber}</div>
                        <div className="text-sm text-gray-500">{order.deliveryOption}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items.length} article(s)
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items[0]?.name}
                        {order.items.length > 1 && ` +${order.items.length - 1} autres`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(order.total)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.createdAt.toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/client/orders/${order.id}`)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-3 w-3" />
                        Détails
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredOrders.length === 0 && (
            <div className="text-center py-12">
              <Package className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune commande trouvée</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchTerm || selectedStatus !== 'all' 
                  ? 'Essayez de modifier vos critères de recherche.'
                  : 'Vous n\'avez pas encore passé de commande.'
                }
              </p>
              {!searchTerm && selectedStatus === 'all' && (
                <div className="mt-6">
                  <Button onClick={() => router.push('/products')}>
                    Découvrir nos produits
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 