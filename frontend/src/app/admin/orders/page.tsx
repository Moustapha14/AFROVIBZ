'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Eye, CheckCircle, XCircle, Clock, Truck, Filter, Download, ShoppingCart, DollarSign } from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    size?: string;
    color?: string;
  }>;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded';
  deliveryOption: string;
  deliveryAddress: string;
  paymentMethod: string;
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  assignedVendeuse?: string;
  createdAt: Date;
  updatedAt: Date;
  notes: string;
}

// Données mockées pour les commandes
const mockOrders: Order[] = [
  {
    id: '1',
    orderNumber: 'CMD-2024-001',
    customerName: 'Marie Dupont',
    customerEmail: 'marie.dupont@email.com',
    customerPhone: '+241 01234567',
    items: [
      { name: 'Robe Africaine Élégante', quantity: 1, price: 25000, size: 'M', color: 'Rouge' },
      { name: 'iPhone 15 Pro Max', quantity: 1, price: 850000, size: '256GB', color: 'Titanium' }
    ],
    total: 875000,
    status: 'processing',
    deliveryOption: 'Express',
    deliveryAddress: '123 Rue de la Paix, Libreville, Gabon',
    paymentMethod: 'Mobile Money',
    paymentStatus: 'paid',
    assignedVendeuse: 'Sophie Martin',
    createdAt: new Date('2024-01-15T10:30:00'),
    updatedAt: new Date('2024-01-16T09:15:00'),
    notes: 'Client demande livraison avant 14h',
  },
  {
    id: '2',
    orderNumber: 'CMD-2024-002',
    customerName: 'Jean Martin',
    customerEmail: 'jean.martin@email.com',
    customerPhone: '+241 02345678',
    items: [
      { name: 'MacBook Air M2', quantity: 1, price: 650000 }
    ],
    total: 650000,
    status: 'shipped',
    deliveryOption: 'Standard',
    deliveryAddress: '456 Avenue des Palmiers, Libreville, Gabon',
    paymentMethod: 'Carte Bancaire',
    paymentStatus: 'paid',
    assignedVendeuse: 'Marie Dubois',
    createdAt: new Date('2024-01-14T14:20:00'),
    updatedAt: new Date('2024-01-15T16:30:00'),
    notes: '',
  },
  {
    id: '3',
    orderNumber: 'CMD-2024-003',
    customerName: 'Sophie Bernard',
    customerEmail: 'sophie.bernard@email.com',
    customerPhone: '+241 03456789',
    items: [
      { name: 'Samsung Galaxy S24 Ultra', quantity: 1, price: 750000 },
      { name: 'AirPods Pro 2', quantity: 1, price: 120000 }
    ],
    total: 870000,
    status: 'delivered',
    deliveryOption: 'Express',
    deliveryAddress: '789 Boulevard de la Mer, Libreville, Gabon',
    paymentMethod: 'Mobile Money',
    paymentStatus: 'paid',
    assignedVendeuse: 'Sophie Martin',
    createdAt: new Date('2024-01-13T09:45:00'),
    updatedAt: new Date('2024-01-14T11:20:00'),
    notes: 'Livraison réussie, client satisfait',
  },
  {
    id: '4',
    orderNumber: 'CMD-2024-004',
    customerName: 'Pierre Durand',
    customerEmail: 'pierre.durand@email.com',
    customerPhone: '+241 04567890',
    items: [
      { name: 'iPad Pro 12.9"', quantity: 1, price: 450000 }
    ],
    total: 450000,
    status: 'cancelled',
    deliveryOption: 'Standard',
    deliveryAddress: '321 Rue du Commerce, Libreville, Gabon',
    paymentMethod: 'Carte Bancaire',
    paymentStatus: 'refunded',
    createdAt: new Date('2024-01-12T16:15:00'),
    updatedAt: new Date('2024-01-13T10:30:00'),
    notes: 'Annulé par le client - produit indisponible',
  },
];

export default function SuperAdminOrdersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('all');
  const [selectedVendeuse, setSelectedVendeuse] = useState('all');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'super_admin')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customerEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || order.status === selectedStatus;
    const matchesPaymentStatus = selectedPaymentStatus === 'all' || order.paymentStatus === selectedPaymentStatus;
    const matchesVendeuse = selectedVendeuse === 'all' || order.assignedVendeuse === selectedVendeuse;
    return matchesSearch && matchesStatus && matchesPaymentStatus && matchesVendeuse;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'En attente', icon: Clock },
      'processing': { color: 'bg-blue-100 text-blue-800', label: 'En traitement', icon: Clock },
      'shipped': { color: 'bg-purple-100 text-purple-800', label: 'Expédiée', icon: Truck },
      'delivered': { color: 'bg-green-100 text-green-800', label: 'Livrée', icon: CheckCircle },
      'cancelled': { color: 'bg-red-100 text-red-800', label: 'Annulée', icon: XCircle },
      'refunded': { color: 'bg-gray-100 text-gray-800', label: 'Remboursée', icon: XCircle },
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

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date() } : order
    ));
    toast.success(`Statut de la commande mis à jour vers ${newStatus}`);
  };

  const handleAssignVendeuse = (orderId: string, vendeuse: string) => {
    setOrders(orders.map(order => 
      order.id === orderId ? { ...order, assignedVendeuse: vendeuse, updatedAt: new Date() } : order
    ));
    toast.success(`Commande assignée à ${vendeuse}`);
  };

  const handleExportOrders = () => {
    toast.success('Export des commandes en cours...');
  };

  const getOrderStats = () => {
    return {
      total: orders.length,
      pending: orders.filter(o => o.status === 'pending').length,
      processing: orders.filter(o => o.status === 'processing').length,
      shipped: orders.filter(o => o.status === 'shipped').length,
      delivered: orders.filter(o => o.status === 'delivered').length,
      cancelled: orders.filter(o => o.status === 'cancelled').length,
      totalRevenue: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0),
    };
  };

  const stats = getOrderStats();

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
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Commandes</h1>
          <p className="mt-2 text-gray-600">Suivez et gérez toutes les commandes de la plateforme</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Commandes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En attente</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
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

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Revenus</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(stats.totalRevenue / 1000000).toFixed(1)}M FCFA
                </p>
              </div>
            </div>
          </div>
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
                  placeholder="Rechercher une commande..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">Tous les statuts</option>
                <option value="pending">En attente</option>
                <option value="processing">En traitement</option>
                <option value="shipped">Expédiée</option>
                <option value="delivered">Livrée</option>
                <option value="cancelled">Annulée</option>
                <option value="refunded">Remboursée</option>
              </select>

              {/* Payment Status Filter */}
              <select
                value={selectedPaymentStatus}
                onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">Tous les paiements</option>
                <option value="pending">En attente</option>
                <option value="paid">Payé</option>
                <option value="failed">Échoué</option>
                <option value="refunded">Remboursé</option>
              </select>

              {/* Vendeuse Filter */}
              <select
                value={selectedVendeuse}
                onChange={(e) => setSelectedVendeuse(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">Toutes les vendeuses</option>
                <option value="Sophie Martin">Sophie Martin</option>
                <option value="Marie Dubois">Marie Dubois</option>
                <option value="">Non assignée</option>
              </select>
            </div>

            {/* Export Button */}
            <Button
              onClick={handleExportOrders}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>

        {/* Orders Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Commande
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Produits
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
                    Vendeuse
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
                        <div className="text-sm text-gray-500">
                          {order.createdAt.toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerEmail}</div>
                        <div className="text-sm text-gray-500">{order.customerPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {order.items.length} produit(s)
                      </div>
                      <div className="text-sm text-gray-500">
                        {order.items.map(item => item.name).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.total.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentStatusBadge(order.paymentStatus)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.assignedVendeuse || 'Non assignée'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {/* TODO: View order details */}}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {order.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(order.id, 'processing')}
                          >
                            Traiter
                          </Button>
                        )}
                        {order.status === 'processing' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(order.id, 'shipped')}
                          >
                            Expédier
                          </Button>
                        )}
                        {order.status === 'shipped' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(order.id, 'delivered')}
                          >
                            Livrer
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <ShoppingCart className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucune commande trouvée</h3>
            <p className="text-gray-500">Aucune commande ne correspond à vos critères de recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
} 