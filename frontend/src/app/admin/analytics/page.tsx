'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { 
  TrendingUp, 
  TrendingDown, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  Package,
  Calendar,
  Download,
  BarChart3,
  PieChart,
  Activity,
  Target
} from 'lucide-react';

interface AnalyticsData {
  period: string;
  revenue: number;
  orders: number;
  users: number;
  products: number;
  conversionRate: number;
  averageOrderValue: number;
}

interface CategoryData {
  name: string;
  sales: number;
  revenue: number;
  percentage: number;
}

interface TopProduct {
  name: string;
  sales: number;
  revenue: number;
  growth: number;
}

// Données mockées
const mockAnalytics: AnalyticsData[] = [
  { period: 'Jan 2024', revenue: 4500000, orders: 892, users: 1247, products: 156, conversionRate: 3.2, averageOrderValue: 85000 },
  { period: 'Dec 2023', revenue: 4200000, orders: 845, users: 1189, products: 142, conversionRate: 3.1, averageOrderValue: 82000 },
  { period: 'Nov 2023', revenue: 3800000, orders: 798, users: 1123, products: 138, conversionRate: 2.9, averageOrderValue: 78000 },
  { period: 'Oct 2023', revenue: 3500000, orders: 745, users: 1056, products: 135, conversionRate: 2.8, averageOrderValue: 75000 },
];

const mockCategories: CategoryData[] = [
  { name: 'Tech', sales: 245, revenue: 28500000, percentage: 45 },
  { name: 'Femmes', sales: 189, revenue: 12500000, percentage: 25 },
  { name: 'Hommes', sales: 156, revenue: 9800000, percentage: 20 },
  { name: 'Accessoires', sales: 98, revenue: 4500000, percentage: 7 },
  { name: 'Enfants', sales: 67, revenue: 3200000, percentage: 3 },
];

const mockTopProducts: TopProduct[] = [
  { name: 'iPhone 15 Pro Max', sales: 45, revenue: 38250000, growth: 12.5 },
  { name: 'MacBook Air M2', sales: 32, revenue: 20800000, growth: 8.3 },
  { name: 'Samsung Galaxy S24 Ultra', sales: 28, revenue: 21000000, growth: 15.2 },
  { name: 'Robe Africaine Élégante', sales: 38, revenue: 950000, growth: 5.7 },
  { name: 'iPad Pro 12.9"', sales: 25, revenue: 11250000, growth: 3.1 },
];

export default function SuperAdminAnalyticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [analytics, setAnalytics] = useState<AnalyticsData[]>(mockAnalytics);
  const [categories, setCategories] = useState<CategoryData[]>(mockCategories);
  const [topProducts, setTopProducts] = useState<TopProduct[]>(mockTopProducts);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'super_admin')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const currentData = analytics[0];
  const previousData = analytics[1];

  const calculateGrowth = (current: number, previous: number) => {
    if (previous === 0) return 100;
    return ((current - previous) / previous) * 100;
  };

  const revenueGrowth = calculateGrowth(currentData.revenue, previousData.revenue);
  const ordersGrowth = calculateGrowth(currentData.orders, previousData.orders);
  const usersGrowth = calculateGrowth(currentData.users, previousData.users);
  const conversionGrowth = calculateGrowth(currentData.conversionRate, previousData.conversionRate);

  const handleExportReport = () => {
    toast.success('Rapport d\'analytics en cours d\'export...');
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
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Analytics & Rapports</h1>
              <p className="mt-2 text-gray-600">Statistiques détaillées et analyses de la plateforme</p>
            </div>
            <Button
              onClick={handleExportReport}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Exporter le rapport
            </Button>
          </div>
        </div>

        {/* Period Selector */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Période d'analyse</h2>
            <div className="flex space-x-2">
              <Button
                variant={selectedPeriod === 'week' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('week')}
              >
                Semaine
              </Button>
              <Button
                variant={selectedPeriod === 'month' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('month')}
              >
                Mois
              </Button>
              <Button
                variant={selectedPeriod === 'quarter' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('quarter')}
              >
                Trimestre
              </Button>
              <Button
                variant={selectedPeriod === 'year' ? 'primary' : 'outline'}
                size="sm"
                onClick={() => setSelectedPeriod('year')}
              >
                Année
              </Button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Revenus</p>
                <p className="text-2xl font-bold text-gray-900">
                  {(currentData.revenue / 1000000).toFixed(1)}M FCFA
                </p>
                <div className="flex items-center mt-2">
                  {revenueGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm ml-1 ${revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(revenueGrowth).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Commandes</p>
                <p className="text-2xl font-bold text-gray-900">{currentData.orders.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  {ordersGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm ml-1 ${ordersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(ordersGrowth).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <ShoppingCart className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Utilisateurs</p>
                <p className="text-2xl font-bold text-gray-900">{currentData.users.toLocaleString()}</p>
                <div className="flex items-center mt-2">
                  {usersGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm ml-1 ${usersGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(usersGrowth).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Taux de conversion</p>
                <p className="text-2xl font-bold text-gray-900">{currentData.conversionRate}%</p>
                <div className="flex items-center mt-2">
                  {conversionGrowth >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600" />
                  )}
                  <span className={`text-sm ml-1 ${conversionGrowth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {Math.abs(conversionGrowth).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Revenue Trend */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Évolution des Revenus</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {analytics.map((data, index) => (
                  <div key={data.period} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{data.period}</span>
                    <div className="flex items-center space-x-4">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(data.revenue / 5000000) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {(data.revenue / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Category Performance */}
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Performance par Catégorie</h2>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {categories.map((category) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div 
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: `hsl(${Math.random() * 360}, 70%, 50%)` }}
                      ></div>
                      <span className="text-sm font-medium text-gray-900">{category.name}</span>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-green-600 h-2 rounded-full" 
                          style={{ width: `${category.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600">{category.percentage}%</span>
                      <span className="text-sm font-medium text-gray-900">
                        {(category.revenue / 1000000).toFixed(1)}M
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Produits les Plus Performants</h2>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Produit
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ventes
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Revenus
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Croissance
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {topProducts.map((product, index) => (
                    <tr key={product.name} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-bold text-gray-600">#{index + 1}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{product.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {product.sales}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {(product.revenue / 1000000).toFixed(1)}M FCFA
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {product.growth >= 0 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                          <span className={`text-sm ml-1 ${product.growth >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {Math.abs(product.growth).toFixed(1)}%
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 