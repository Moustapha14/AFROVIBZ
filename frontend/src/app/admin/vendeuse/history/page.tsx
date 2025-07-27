'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Calendar, Download, Eye, Filter } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Interface pour l'historique des commandes
interface OrderHistory {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  total: number;
  status: 'completed' | 'cancelled' | 'refunded';
  deliveryOption: string;
  completedAt: Date;
  notes: string;
}

// Données mockées pour l'historique
const mockHistory: OrderHistory[] = [
  {
    id: '1',
    orderNumber: 'CMD-2023-001',
    customerName: 'Marie Dupont',
    customerEmail: 'marie.dupont@email.com',
    items: [
      { name: 'Robe Africaine Élégante', quantity: 1, price: 25000 },
      { name: 'iPhone 15 Pro Max', quantity: 1, price: 850000 }
    ],
    total: 875000,
    status: 'completed',
    deliveryOption: 'Express',
    completedAt: new Date('2023-12-15'),
    notes: 'Livraison réussie, client satisfait',
  },
  {
    id: '2',
    orderNumber: 'CMD-2023-002',
    customerName: 'Jean Martin',
    customerEmail: 'jean.martin@email.com',
    items: [
      { name: 'MacBook Air M2', quantity: 1, price: 650000 }
    ],
    total: 650000,
    status: 'completed',
    deliveryOption: 'Standard',
    completedAt: new Date('2023-12-10'),
    notes: 'Livraison dans les délais',
  },
  {
    id: '3',
    orderNumber: 'CMD-2023-003',
    customerName: 'Sophie Bernard',
    customerEmail: 'sophie.bernard@email.com',
    items: [
      { name: 'Samsung Galaxy S24 Ultra', quantity: 1, price: 750000 }
    ],
    total: 750000,
    status: 'cancelled',
    deliveryOption: 'Express',
    completedAt: new Date('2023-12-05'),
    notes: 'Commande annulée par le client',
  },
];

export default function VendeuseHistoryPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<OrderHistory[]>(mockHistory);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [dateRange, setDateRange] = useState('all');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'vendeuse')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const filteredHistory = history.filter(item => {
    const matchesSearch = item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.orderNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    
    // Date range filtering
    let matchesDate = true;
    const now = new Date();
    const itemDate = item.completedAt;
    
    if (dateRange === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      matchesDate = itemDate >= weekAgo;
    } else if (dateRange === 'month') {
      const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      matchesDate = itemDate >= monthAgo;
    } else if (dateRange === 'quarter') {
      const quarterAgo = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
      matchesDate = itemDate >= quarterAgo;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'completed': { color: 'bg-green-100 text-green-800', label: 'Terminée' },
      'cancelled': { color: 'bg-red-100 text-red-800', label: 'Annulée' },
      'refunded': { color: 'bg-orange-100 text-orange-800', label: 'Remboursée' },
    };
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleExportData = () => {
    // Simulation d'export
    toast.success('Export des données en cours...');
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Chargement...</div>;
  }

  if (!user || user.role !== 'vendeuse') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Historique des Commandes</h1>
          <p className="mt-2 text-gray-600">Consultez l'historique complet de vos commandes</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total commandes</p>
                <p className="text-2xl font-bold text-gray-900">{history.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Terminées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {history.filter(h => h.status === 'completed').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <Calendar className="h-6 w-6 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Annulées</p>
                <p className="text-2xl font-bold text-gray-900">
                  {history.filter(h => h.status === 'cancelled').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Chiffre d'affaires</p>
                <p className="text-2xl font-bold text-gray-900">
                  {history
                    .filter(h => h.status === 'completed')
                    .reduce((sum, h) => sum + h.total, 0)
                    .toLocaleString('fr-FR')} FCFA
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
                  placeholder="Rechercher dans l'historique..."
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
                <option value="completed">Terminées</option>
                <option value="cancelled">Annulées</option>
                <option value="refunded">Remboursées</option>
              </select>

              {/* Date Range Filter */}
              <select
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">Toutes les dates</option>
                <option value="week">7 derniers jours</option>
                <option value="month">30 derniers jours</option>
                <option value="quarter">3 derniers mois</option>
              </select>
            </div>

            {/* Export Button */}
            <Button
              onClick={handleExportData}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exporter
            </Button>
          </div>
        </div>

        {/* History Table */}
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
                    Date de fin
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.orderNumber}</div>
                        <div className="text-sm text-gray-500">{item.deliveryOption}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.customerName}</div>
                        <div className="text-sm text-gray-500">{item.customerEmail}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {item.items.length} produit(s)
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.items.map(item => item.name).join(', ')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.total.toLocaleString('fr-FR')} FCFA
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.completedAt.toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {/* TODO: View order details */}}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
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
        {filteredHistory.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Calendar className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun historique trouvé</h3>
            <p className="text-gray-500">Aucune commande ne correspond à vos critères de recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
} 