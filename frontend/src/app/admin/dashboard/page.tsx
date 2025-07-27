'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { 
  Users, 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  DollarSign, 
  UserCheck,
  Truck,
  Star,
  Calendar,
  BarChart3,
  Activity,
  Target
} from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalVendeuses: number;
  totalOrders: number;
  totalProducts: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
  pendingOrders: number;
  activeProducts: number;
  averageOrderValue: number;
  conversionRate: number;
}

interface RecentActivity {
  id: string;
  type: 'order' | 'user' | 'product' | 'revenue';
  title: string;
  description: string;
  amount?: number;
  timestamp: Date;
  status: 'success' | 'warning' | 'error' | 'info';
}

interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  image: string;
}

// Données mockées
const mockStats: DashboardStats = {
  totalUsers: 1247,
  totalVendeuses: 23,
  totalOrders: 892,
  totalProducts: 156,
  monthlyRevenue: 4500000,
  yearlyRevenue: 52000000,
  pendingOrders: 45,
  activeProducts: 142,
  averageOrderValue: 85000,
  conversionRate: 3.2,
};

const mockRecentActivity: RecentActivity[] = [
  {
    id: '1',
    type: 'order',
    title: 'Nouvelle commande #CMD-2024-001',
    description: 'Marie Dupont a passé une commande de 125,000 FCFA',
    amount: 125000,
    timestamp: new Date('2024-01-16T10:30:00'),
    status: 'success',
  },
  {
    id: '2',
    type: 'user',
    title: 'Nouveau vendeur inscrit',
    description: 'Sophie Martin s\'est inscrite comme vendeuse',
    timestamp: new Date('2024-01-16T09:15:00'),
    status: 'info',
  },
  {
    id: '3',
    type: 'product',
    title: 'Produit ajouté',
    description: 'iPhone 15 Pro Max ajouté au catalogue',
    timestamp: new Date('2024-01-16T08:45:00'),
    status: 'success',
  },
  {
    id: '4',
    type: 'revenue',
    title: 'Objectif mensuel atteint',
    description: 'Revenus mensuels dépassent 4,500,000 FCFA',
    amount: 4500000,
    timestamp: new Date('2024-01-16T08:00:00'),
    status: 'success',
  },
  {
    id: '5',
    type: 'order',
    title: 'Commande annulée #CMD-2024-002',
    description: 'Commande de Jean Martin annulée',
    timestamp: new Date('2024-01-16T07:30:00'),
    status: 'warning',
  },
];

const mockTopProducts: TopProduct[] = [
  {
    id: '1',
    name: 'iPhone 15 Pro Max',
    sales: 45,
    revenue: 38250000,
    image: '/images/products/iphone-15.svg',
  },
  {
    id: '2',
    name: 'Robe Africaine Élégante',
    sales: 38,
    revenue: 950000,
    image: '/images/products/product-1.svg',
  },
  {
    id: '3',
    name: 'MacBook Air M2',
    sales: 32,
    revenue: 20800000,
    image: '/images/products/macbook-air.svg',
  },
  {
    id: '4',
    name: 'Samsung Galaxy S24 Ultra',
    sales: 28,
    revenue: 21000000,
    image: '/images/products/galaxy-s24.svg',
  },
];

export default function SuperAdminDashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats>(mockStats);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>(mockRecentActivity);
  const [topProducts, setTopProducts] = useState<TopProduct[]>(mockTopProducts);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'super_admin')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'order': return <ShoppingCart className="h-4 w-4" />;
      case 'user': return <Users className="h-4 w-4" />;
      case 'product': return <Package className="h-4 w-4" />;
      case 'revenue': return <DollarSign className="h-4 w-4" />;
      default: return <Activity className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-600 bg-green-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-red-600 bg-red-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
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
          <h1 className="text-3xl font-bold text-gray-900">Tableau de Bord</h1>
          <p className="mt-2 text-gray-600">Vue d'ensemble de la plateforme AFRO🗼VIBZ</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalUsers.toLocaleString()}</p>
                <p className="text-xs text-green-600">+12% ce mois</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <UserCheck className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Vendeuses</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalVendeuses}</p>
                <p className="text-xs text-green-600">+3 ce mois</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Commandes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders.toLocaleString()}</p>
                <p className="text-xs text-orange-600">{stats.pendingOrders} en attente</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Package className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Produits</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                <p className="text-xs text-green-600">{stats.activeProducts} actifs</p>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus Mensuels</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.monthlyRevenue.toLocaleString('fr-FR')} FCFA
                </p>
                <p className="text-xs text-green-600">+8.5% vs mois dernier</p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus Annuels</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.yearlyRevenue.toLocaleString('fr-FR')} FCFA
                </p>
                <p className="text-xs text-green-600">+15.2% vs année dernière</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Panier Moyen</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.averageOrderValue.toLocaleString('fr-FR')} FCFA
                </p>
                <p className="text-xs text-green-600">+2.1% vs mois dernier</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Target className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Activity */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Activité Récente</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start space-x-3">
                    <div className={`p-2 rounded-full ${getStatusColor(activity.status)}`}>
                      {getActivityIcon(activity.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                      <p className="text-sm text-gray-500">{activity.description}</p>
                      {activity.amount && (
                        <p className="text-sm font-medium text-green-600">
                          {activity.amount.toLocaleString('fr-FR')} FCFA
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        {activity.timestamp.toLocaleString('fr-FR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Produits les Plus Vendus</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {topProducts.map((product, index) => (
                  <div key={product.id} className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-lg font-bold text-gray-600">#{index + 1}</span>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-500">
                        {product.sales} ventes • {product.revenue.toLocaleString('fr-FR')} FCFA
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        <span className="text-sm text-gray-600 ml-1">
                          {((product.revenue / stats.monthlyRevenue) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button
              onClick={() => router.push('/admin/products')}
              variant="outline"
              className="flex flex-col items-center p-4 h-auto"
            >
              <Package className="h-6 w-6 mb-2" />
              <span className="text-sm">Gérer les Produits</span>
            </Button>
            
            <Button
              onClick={() => router.push('/admin/users')}
              variant="outline"
              className="flex flex-col items-center p-4 h-auto"
            >
              <Users className="h-6 w-6 mb-2" />
              <span className="text-sm">Gérer les Utilisateurs</span>
            </Button>
            
            <Button
              onClick={() => router.push('/admin/orders')}
              variant="outline"
              className="flex flex-col items-center p-4 h-auto"
            >
              <ShoppingCart className="h-6 w-6 mb-2" />
              <span className="text-sm">Voir les Commandes</span>
            </Button>
            
            <Button
              onClick={() => router.push('/admin/analytics')}
              variant="outline"
              className="flex flex-col items-center p-4 h-auto"
            >
              <BarChart3 className="h-6 w-6 mb-2" />
              <span className="text-sm">Analytics</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
} 