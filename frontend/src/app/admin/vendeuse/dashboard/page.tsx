'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  Package, 
  Truck, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

interface VendeuseStats {
  'à préparer': number;
  'en cours d\'expédition': number;
  'livré': number;
  'retourné': number;
}

interface Order {
  _id: string;
  orderNumber: string;
  user: {
    displayName: string;
    email: string;
    phone: string;
  };
  items: Array<{
    product: {
      name: string;
      images: string[];
    };
    quantity: number;
    price: number;
  }>;
  total: number;
  orderStatus: string;
  logisticsStatus: string;
  createdAt: string;
}

export default function VendeuseDashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<VendeuseStats | null>(null);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      if (user.role !== 'vendeuse') {
        router.push('/admin');
        return;
      }

      loadDashboardData();
    }
  }, [user, loading, router]);

  const loadDashboardData = async () => {
    try {
      const response = await fetch('/api/vendeuse/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
        setRecentOrders(data.recentOrders);
      }
    } catch (error) {
      console.error('Erreur lors du chargement du tableau de bord:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'à préparer':
        return 'bg-yellow-100 text-yellow-800';
      case 'en cours d\'expédition':
        return 'bg-blue-100 text-blue-800';
      case 'livré':
        return 'bg-green-100 text-green-800';
      case 'retourné':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'à préparer':
        return <Package className="h-4 w-4" />;
      case 'en cours d\'expédition':
        return <Truck className="h-4 w-4" />;
      case 'livré':
        return <CheckCircle className="h-4 w-4" />;
      case 'retourné':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const totalOrders = stats ? Object.values(stats).reduce((sum, count) => sum + count, 0) : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push('/admin')}
                variant="outline"
                size="sm"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Retour
              </Button>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  Tableau de Bord Vendeuse
                </h1>
                <p className="text-sm text-gray-500">
                  {user.displayName} • Gestion des commandes
                </p>
              </div>
            </div>
            
            <Button
              onClick={loadDashboardData}
              variant="outline"
              size="sm"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Package className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Commandes</p>
                <p className="text-2xl font-bold text-gray-900">{totalOrders}</p>
              </div>
            </div>
          </div>

          {stats && Object.entries(stats).map(([status, count]) => (
            <div key={status} className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className={`p-3 rounded-lg ${getStatusColor(status).replace('text-', 'bg-').replace('bg-yellow-100', 'bg-yellow-100').replace('bg-blue-100', 'bg-blue-100').replace('bg-green-100', 'bg-green-100').replace('bg-red-100', 'bg-red-100')}`}>
                  {getStatusIcon(status)}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600 capitalize">{status}</p>
                  <p className="text-2xl font-bold text-gray-900">{count}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Commandes récentes */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-900">
                Commandes Récentes à Traiter
              </h2>
              <Button
                onClick={() => router.push('/admin/vendeuse/orders')}
                variant="outline"
                size="sm"
              >
                Voir toutes
              </Button>
            </div>
          </div>

          <div className="p-6">
            {recentOrders.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Aucune commande à traiter pour le moment</p>
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order._id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => router.push(`/admin/vendeuse/orders/${order._id}`)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex-shrink-0">
                          {order.items[0]?.product.images[0] ? (
                            <img
                              src={order.items[0].product.images[0]}
                              alt={order.items[0].product.name}
                              className="w-full h-full object-cover rounded-lg"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center rounded-lg">
                              <span className="text-xs text-gray-500">Img</span>
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">
                            {order.orderNumber}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {order.user.displayName} • {order.items.length} article(s)
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString('fr-FR')}
                          </p>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          {formatPrice(order.total)}
                        </p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.logisticsStatus)}`}>
                          {getStatusIcon(order.logisticsStatus)}
                          <span className="ml-1 capitalize">{order.logisticsStatus}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Actions rapides */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Valider Commandes</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Validez les nouvelles commandes et mettez-les en préparation
            </p>
            <Button
              onClick={() => router.push('/admin/vendeuse/orders?status=à préparer')}
              className="w-full"
            >
              Commencer
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Suivi Logistique</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Suivez l'état des expéditions et mettez à jour les statuts
            </p>
            <Button
              onClick={() => router.push('/admin/vendeuse/logistics')}
              variant="outline"
              className="w-full"
            >
              Accéder
            </Button>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Package className="h-5 w-5 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900">Historique</h3>
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Consultez l'historique de toutes vos commandes traitées
            </p>
            <Button
              onClick={() => router.push('/admin/vendeuse/history')}
              variant="outline"
              className="w-full"
            >
              Consulter
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 