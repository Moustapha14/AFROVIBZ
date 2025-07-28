'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  ShoppingBag, 
  Heart, 
  Clock, 
  CheckCircle, 
  Star,
  User,
  Settings,
  LogOut,
  Package,
  Truck,
  CreditCard,
  Gift
} from 'lucide-react';

interface ClientStats {
  totalOrders: number;
  pendingOrders: number;
  completedOrders: number;
  totalSpent: number;
  wishlistItems: number;
  loyaltyPoints: number;
}

interface RecentOrder {
  id: string;
  orderNumber: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  createdAt: Date;
}

// Données mockées
const mockStats: ClientStats = {
  totalOrders: 8,
  pendingOrders: 2,
  completedOrders: 6,
  totalSpent: 1250000,
  wishlistItems: 12,
  loyaltyPoints: 1250,
};

const mockRecentOrders: RecentOrder[] = [
  {
    id: '1',
    orderNumber: 'CMD-2024-001',
    status: 'processing',
    total: 875000,
    items: [
      { name: 'Robe Africaine Élégante', quantity: 1, price: 25000 },
      { name: 'iPhone 15 Pro Max', quantity: 1, price: 850000 }
    ],
    createdAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    orderNumber: 'CMD-2023-008',
    status: 'delivered',
    total: 450000,
    items: [
      { name: 'MacBook Air M2', quantity: 1, price: 650000 }
    ],
    createdAt: new Date('2023-12-20'),
  },
];

export default function ClientDashboardPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<ClientStats>(mockStats);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>(mockRecentOrders);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      if (user.role !== 'user') {
        router.push('/admin');
        return;
      }
    }
  }, [user, loading, router]);

  const handleLogout = async () => {
    logout();
    router.push('/');
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      'pending': { color: 'bg-yellow-100 text-yellow-800', label: 'En attente', icon: Clock },
      'processing': { color: 'bg-blue-100 text-blue-800', label: 'En cours', icon: Package },
      'shipped': { color: 'bg-purple-100 text-purple-800', label: 'Expédié', icon: Truck },
      'delivered': { color: 'bg-green-100 text-green-800', label: 'Livré', icon: CheckCircle },
      'cancelled': { color: 'bg-red-100 text-red-800', label: 'Annulé', icon: LogOut },
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
    }).format(amount);
  };

  const getClientMenuItems = () => {
    return [
      {
        title: 'Mes Commandes',
        description: 'Suivez vos commandes et leur statut',
        icon: <ShoppingBag className="h-6 w-6" />,
        href: '/client/orders',
        color: 'bg-blue-500'
      },
      {
        title: 'Ma Liste de Souhaits',
        description: 'Produits que vous aimeriez acheter',
        icon: <Heart className="h-6 w-6" />,
        href: '/client/wishlist',
        color: 'bg-pink-500'
      },
      {
        title: 'Mon Profil',
        description: 'Gérez vos informations personnelles',
        icon: <User className="h-6 w-6" />,
        href: '/client/profile',
        color: 'bg-green-500'
      },
      {
        title: 'Mes Adresses',
        description: 'Gérez vos adresses de livraison',
        icon: <Truck className="h-6 w-6" />,
        href: '/client/addresses',
        color: 'bg-orange-500'
      },
      {
        title: 'Méthodes de Paiement',
        description: 'Gérez vos moyens de paiement',
        icon: <CreditCard className="h-6 w-6" />,
        href: '/client/payment-methods',
        color: 'bg-purple-500'
      },
      {
        title: 'Programme de Fidélité',
        description: 'Vos points et récompenses',
        icon: <Gift className="h-6 w-6" />,
        href: '/client/loyalty',
        color: 'bg-yellow-500'
      }
    ];
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user || user.role !== 'user') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Mon Espace Client</h1>
            <p className="mt-2 text-gray-600">Bienvenue, {user.displayName} !</p>
          </div>
          <Button onClick={handleLogout} variant="outline" className="flex items-center gap-2">
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>

        {/* Statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <ShoppingBag className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Commandes</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Cours</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingOrders}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Dépensé</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalSpent)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-2 bg-pink-100 rounded-lg">
                <Heart className="h-6 w-6 text-pink-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Liste de Souhaits</p>
                <p className="text-2xl font-bold text-gray-900">{stats.wishlistItems}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu principal */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Actions Rapides</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {getClientMenuItems().map((item, index) => (
                  <button
                    key={index}
                    onClick={() => router.push(item.href)}
                    className="flex items-center p-4 border border-gray-200 rounded-lg hover:border-gray-300 hover:shadow-sm transition-all group"
                  >
                    <div className={`p-3 rounded-lg ${item.color} text-white group-hover:scale-110 transition-transform`}>
                      {item.icon}
                    </div>
                    <div className="ml-4 text-left">
                      <h3 className="font-medium text-gray-900">{item.title}</h3>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Commandes récentes */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Commandes Récentes</h2>
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-gray-900">{order.orderNumber}</h3>
                    {getStatusBadge(order.status)}
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {order.items.length} article(s) • {formatCurrency(order.total)}
                  </p>
                  <p className="text-xs text-gray-500">
                    {order.createdAt.toLocaleDateString('fr-FR')}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 w-full"
                    onClick={() => router.push(`/client/orders/${order.id}`)}
                  >
                    Voir les détails
                  </Button>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() => router.push('/client/orders')}
            >
              Voir toutes mes commandes
            </Button>
          </div>
        </div>

        {/* Programme de fidélité */}
        <div className="mt-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold mb-2">Programme de Fidélité</h2>
              <p className="text-purple-100 mb-4">
                Vous avez {stats.loyaltyPoints} points. Continuez vos achats pour gagner plus de récompenses !
              </p>
              <Button
                variant="outline"
                className="bg-white text-purple-600 hover:bg-purple-50"
                onClick={() => router.push('/client/loyalty')}
              >
                Voir mes récompenses
              </Button>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold">{stats.loyaltyPoints}</div>
              <div className="text-purple-100">Points</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 