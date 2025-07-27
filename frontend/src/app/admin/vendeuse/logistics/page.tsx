'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Search, Truck, MapPin, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Interface pour le suivi logistique
interface LogisticsTracking {
  id: string;
  orderNumber: string;
  customerName: string;
  deliveryAddress: string;
  deliveryOption: string;
  status: 'preparing' | 'shipped' | 'in_transit' | 'out_for_delivery' | 'delivered';
  trackingNumber: string;
  estimatedDelivery: Date;
  currentLocation: string;
  lastUpdate: Date;
  notes: string;
}

// Données mockées pour le suivi logistique
const mockLogistics: LogisticsTracking[] = [
  {
    id: '1',
    orderNumber: 'CMD-2024-001',
    customerName: 'Marie Dupont',
    deliveryAddress: '123 Rue de la Paix, Libreville, Gabon',
    deliveryOption: 'Express',
    status: 'in_transit',
    trackingNumber: 'TRK-2024-001',
    estimatedDelivery: new Date('2024-01-18'),
    currentLocation: 'Centre de tri Libreville',
    lastUpdate: new Date('2024-01-16'),
    notes: 'Colis en cours de livraison',
  },
  {
    id: '2',
    orderNumber: 'CMD-2024-002',
    customerName: 'Jean Martin',
    deliveryAddress: '456 Avenue des Palmiers, Libreville, Gabon',
    deliveryOption: 'Standard',
    status: 'preparing',
    trackingNumber: 'TRK-2024-002',
    estimatedDelivery: new Date('2024-01-20'),
    currentLocation: 'Entrepôt AFROVIBZ',
    lastUpdate: new Date('2024-01-16'),
    notes: 'Préparation en cours',
  },
  {
    id: '3',
    orderNumber: 'CMD-2024-003',
    customerName: 'Sophie Bernard',
    deliveryAddress: '789 Boulevard de la Mer, Libreville, Gabon',
    deliveryOption: 'Express',
    status: 'out_for_delivery',
    trackingNumber: 'TRK-2024-003',
    estimatedDelivery: new Date('2024-01-17'),
    currentLocation: 'En route vers le client',
    lastUpdate: new Date('2024-01-16'),
    notes: 'Livreur en route',
  },
];

export default function VendeuseLogisticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [logistics, setLogistics] = useState<LogisticsTracking[]>(mockLogistics);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'vendeuse')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const filteredLogistics = logistics.filter(item => {
    const matchesSearch = item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.trackingNumber.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || item.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'preparing': { color: 'bg-yellow-100 text-yellow-800', label: 'En préparation', icon: Clock },
      'shipped': { color: 'bg-blue-100 text-blue-800', label: 'Expédié', icon: Truck },
      'in_transit': { color: 'bg-purple-100 text-purple-800', label: 'En transit', icon: Truck },
      'out_for_delivery': { color: 'bg-orange-100 text-orange-800', label: 'En livraison', icon: MapPin },
      'delivered': { color: 'bg-green-100 text-green-800', label: 'Livré', icon: CheckCircle },
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

  const handleStatusUpdate = (id: string, newStatus: LogisticsTracking['status']) => {
    setLogistics(logistics.map(item => 
      item.id === id ? { ...item, status: newStatus, lastUpdate: new Date() } : item
    ));
    toast.success(`Statut logistique mis à jour vers ${newStatus}`);
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
          <h1 className="text-3xl font-bold text-gray-900">Suivi Logistique</h1>
          <p className="mt-2 text-gray-600">Suivez et gérez les livraisons de vos clients</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En préparation</p>
                <p className="text-2xl font-bold text-gray-900">
                  {logistics.filter(l => l.status === 'preparing').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Truck className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Expédiés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {logistics.filter(l => l.status === 'shipped').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Truck className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En transit</p>
                <p className="text-2xl font-bold text-gray-900">
                  {logistics.filter(l => l.status === 'in_transit').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <MapPin className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En livraison</p>
                <p className="text-2xl font-bold text-gray-900">
                  {logistics.filter(l => l.status === 'out_for_delivery').length}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Livrés</p>
                <p className="text-2xl font-bold text-gray-900">
                  {logistics.filter(l => l.status === 'delivered').length}
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
                  placeholder="Rechercher un suivi..."
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
                <option value="preparing">En préparation</option>
                <option value="shipped">Expédié</option>
                <option value="in_transit">En transit</option>
                <option value="out_for_delivery">En livraison</option>
                <option value="delivered">Livré</option>
              </select>
            </div>
          </div>
        </div>

        {/* Logistics Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Suivi
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Client
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adresse
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Livraison estimée
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredLogistics.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{item.orderNumber}</div>
                        <div className="text-sm text-gray-500">{item.trackingNumber}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.customerName}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {item.deliveryAddress}
                      </div>
                      <div className="text-sm text-gray-500">{item.deliveryOption}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.estimatedDelivery.toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {/* TODO: View tracking details */}}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Search className="h-4 w-4" />
                        </button>
                        {item.status === 'preparing' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(item.id, 'shipped')}
                          >
                            Expédier
                          </Button>
                        )}
                        {item.status === 'shipped' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(item.id, 'in_transit')}
                          >
                            En transit
                          </Button>
                        )}
                        {item.status === 'in_transit' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(item.id, 'out_for_delivery')}
                          >
                            En livraison
                          </Button>
                        )}
                        {item.status === 'out_for_delivery' && (
                          <Button
                            size="sm"
                            onClick={() => handleStatusUpdate(item.id, 'delivered')}
                          >
                            Livré
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
        {filteredLogistics.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Truck className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun suivi trouvé</h3>
            <p className="text-gray-500">Aucun suivi logistique ne correspond à vos critères de recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
} 