'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  Package, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Settings,
  UserCheck,
  BarChart3,
  FileText,
  Truck,
  Gift,
  Shield,
  LogOut,
  HelpCircle
} from 'lucide-react';

interface AdminStats {
  totalUsers: number;
  totalVendeuses: number;
  totalOrders: number;
  totalProducts: number;
  monthlyRevenue: number;
  yearlyRevenue: number;
}

export default function AdminPage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push('/auth/login');
        return;
      }

      if (user.role !== 'super_admin' && user.role !== 'vendeuse') {
        router.push('/');
        return;
      }

      // Charger les statistiques selon le rôle
      if (user.role === 'super_admin') {
        loadSuperAdminStats();
      } else if (user.role === 'vendeuse') {
        loadVendeuseStats();
      }
    }
  }, [user, loading, router]);

  const loadSuperAdminStats = async () => {
    try {
      const response = await fetch('/api/super-admin/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const loadVendeuseStats = async () => {
    try {
      const response = await fetch('/api/vendeuse/dashboard', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        // Adapter les données pour l'affichage vendeuse
        setStats({
          totalUsers: 0,
          totalVendeuses: 0,
          totalOrders: Object.values(data.stats).reduce((sum: number, count: any) => sum + count, 0),
          totalProducts: 0,
          monthlyRevenue: 0,
          yearlyRevenue: 0
        });
      }
    } catch (error) {
      console.error('Erreur lors du chargement des statistiques:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  const getAdminMenuItems = () => {
    if (user?.role === 'super_admin') {
      return [
        {
          title: 'Tableau de Bord',
          description: 'Vue d\'ensemble de la plateforme',
          icon: <BarChart3 className="h-6 w-6" />,
          href: '/admin/dashboard',
          color: 'bg-blue-500'
        },
        {
          title: 'Gestion des Produits',
          description: 'Ajouter, modifier, supprimer des produits',
          icon: <Package className="h-6 w-6" />,
          href: '/admin/products',
          color: 'bg-green-500'
        },
        {
          title: 'Gestion des Utilisateurs',
          description: 'Gérer les comptes utilisateurs et vendeuses',
          icon: <Users className="h-6 w-6" />,
          href: '/admin/users',
          color: 'bg-purple-500'
        },
        {
          title: 'Gestion des Commandes',
          description: 'Suivre et gérer toutes les commandes',
          icon: <ShoppingCart className="h-6 w-6" />,
          href: '/admin/orders',
          color: 'bg-orange-500'
        },
        {
          title: 'Promotions & Codes',
          description: 'Créer et gérer les promotions',
          icon: <Gift className="h-6 w-6" />,
          href: '/admin/promotions',
          color: 'bg-pink-500'
        },
        {
          title: 'Gestion FAQ',
          description: 'Gérer les questions fréquemment posées',
          icon: <HelpCircle className="h-6 w-6" />,
          href: '/admin/content/faq',
          color: 'bg-blue-500'
        },
        {
          title: 'Analytics & Rapports',
          description: 'Statistiques détaillées et analyses',
          icon: <TrendingUp className="h-6 w-6" />,
          href: '/admin/analytics',
          color: 'bg-indigo-500'
        },
        {
          title: 'Logistique',
          description: 'Gestion des livraisons et transporteurs',
          icon: <Truck className="h-6 w-6" />,
          href: '/admin/logistics',
          color: 'bg-yellow-500'
        },
        {
          title: 'Paramètres du Site',
          description: 'Configuration générale de la plateforme',
          icon: <Settings className="h-6 w-6" />,
          href: '/admin/settings',
          color: 'bg-gray-500'
        }
      ];
    } else if (user?.role === 'vendeuse') {
      return [
        {
          title: 'Tableau de Bord',
          description: 'Vue d\'ensemble de vos commandes',
          icon: <BarChart3 className="h-6 w-6" />,
          href: '/admin/vendeuse/dashboard',
          color: 'bg-blue-500'
        },
        {
          title: 'Mes Commandes',
          description: 'Gérer les commandes qui vous sont assignées',
          icon: <ShoppingCart className="h-6 w-6" />,
          href: '/admin/vendeuse/orders',
          color: 'bg-green-500'
        },
        {
          title: 'Suivi Logistique',
          description: 'Tableau de suivi des expéditions',
          icon: <Truck className="h-6 w-6" />,
          href: '/admin/vendeuse/logistics',
          color: 'bg-orange-500'
        },
        {
          title: 'Historique',
          description: 'Historique de vos commandes traitées',
          icon: <FileText className="h-6 w-6" />,
          href: '/admin/vendeuse/history',
          color: 'bg-purple-500'
        },
        {
          title: 'Mon Profil',
          description: 'Gérer votre profil vendeuse',
          icon: <UserCheck className="h-6 w-6" />,
          href: '/admin/vendeuse/profile',
          color: 'bg-pink-500'
        }
      ];
    }
    return [];
  };

  if (loading || loadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const menuItems = getAdminMenuItems();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="h-10 w-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-lg">
                AV
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">
                  {user.role === 'super_admin' ? 'Administration' : 'Espace Vendeuse'}
                </h1>
                <p className="text-sm text-gray-500">
                  {user.displayName} • {user.role === 'super_admin' ? 'Super Admin' : 'Vendeuse'}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Button
                onClick={() => router.push('/')}
                variant="outline"
                size="sm"
              >
                Retour au Site
              </Button>
              <Button
                onClick={handleLogout}
                variant="outline"
                size="sm"
                className="text-red-600 border-red-600 hover:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistiques rapides */}
        {stats && user.role === 'super_admin' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-green-100 rounded-lg">
                  <UserCheck className="h-6 w-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Vendeuses</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalVendeuses}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-orange-100 rounded-lg">
                  <ShoppingCart className="h-6 w-6 text-orange-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Commandes</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Package className="h-6 w-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Produits</p>
                  <p className="text-2xl font-bold text-gray-900">{stats.totalProducts}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Menu principal */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">
              {user.role === 'super_admin' ? 'Fonctionnalités d\'Administration' : 'Fonctionnalités Vendeuse'}
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              {user.role === 'super_admin' 
                ? 'Gérez tous les aspects de la plateforme AFROVIBZ'
                : 'Gérez vos commandes et le suivi logistique'
              }
            </p>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {menuItems.map((item, index) => (
                <div
                  key={index}
                  className="group relative bg-gray-50 rounded-lg p-6 hover:bg-gray-100 transition-all duration-200 cursor-pointer border border-gray-200 hover:border-gray-300"
                  onClick={() => router.push(item.href)}
                >
                  <div className="flex items-start space-x-4">
                    <div className={`p-3 rounded-lg ${item.color} text-white`}>
                      {item.icon}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 group-hover:text-gray-700">
                        {item.title}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {item.description}
                      </p>
                    </div>
                  </div>
                  <div className="absolute inset-0 rounded-lg ring-2 ring-transparent group-hover:ring-gray-300 transition-all duration-200" />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Informations de sécurité */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h3 className="text-sm font-medium text-blue-900">Sécurité</h3>
              <p className="text-sm text-blue-700 mt-1">
                {user.role === 'super_admin' 
                  ? 'Vous avez accès à toutes les fonctionnalités d\'administration. Utilisez ces privilèges avec responsabilité.'
                  : 'Vous avez accès aux fonctionnalités de gestion des commandes qui vous sont assignées.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 