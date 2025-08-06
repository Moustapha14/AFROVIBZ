'use client';

import {
  Search,
  Filter,
  Calendar,
  DollarSign,
  Package,
  Eye,
  Edit,
  MoreHorizontal,
  RefreshCw,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  User,
  MapPin,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/lib/hooks/useAuth';
import { formatPrice } from '@/lib/utils';

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  updatedAt: Date;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  shippingAddress: {
    address: string;
    city: string;
    country: string;
  };
  paymentStatus: 'pending' | 'paid' | 'failed';
  trackingNumber?: string;
}

export default function OrdersPage() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [paymentFilter, setPaymentFilter] = useState<string>('all');
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);

  // Mock data pour la démo
  const mockOrders: Order[] = [
    {
      id: 'ORD-001',
      customerName: 'Marie Nguema',
      customerEmail: 'marie@example.com',
      customerPhone: '+241 00 00 00 00',
      total: 45000,
      status: 'shipped',
      createdAt: new Date('2024-01-15T10:30:00'),
      updatedAt: new Date('2024-01-18T09:15:00'),
      items: [
        { name: 'Robe Africaine Élégante', quantity: 1, price: 25000 },
        { name: 'Chemise Wax Traditionnelle', quantity: 1, price: 20000 },
      ],
      shippingAddress: {
        address: '123 Rue de la Paix',
        city: 'Libreville',
        country: 'Gabon',
      },
      paymentStatus: 'paid',
      trackingNumber: 'TRK-2024-001',
    },
    {
      id: 'ORD-002',
      customerName: 'Pierre Mba',
      customerEmail: 'pierre@example.com',
      customerPhone: '+241 00 00 00 01',
      total: 850000,
      status: 'processing',
      createdAt: new Date('2024-01-20T14:20:00'),
      updatedAt: new Date('2024-01-21T16:45:00'),
      items: [{ name: 'iPhone 15 Pro Max', quantity: 1, price: 850000 }],
      shippingAddress: {
        address: '456 Avenue des Palmiers',
        city: 'Port-Gentil',
        country: 'Gabon',
      },
      paymentStatus: 'paid',
    },
    {
      id: 'ORD-003',
      customerName: 'Sophie Ondo',
      customerEmail: 'sophie@example.com',
      customerPhone: '+241 00 00 00 02',
      total: 1200000,
      status: 'pending',
      createdAt: new Date('2024-01-22T09:15:00'),
      updatedAt: new Date('2024-01-22T09:15:00'),
      items: [{ name: 'MacBook Air M2', quantity: 1, price: 1200000 }],
      shippingAddress: {
        address: '789 Boulevard de la Mer',
        city: 'Libreville',
        country: 'Gabon',
      },
      paymentStatus: 'pending',
    },
    {
      id: 'ORD-004',
      customerName: 'Jean Bongo',
      customerEmail: 'jean@example.com',
      customerPhone: '+241 00 00 00 03',
      total: 180000,
      status: 'delivered',
      createdAt: new Date('2024-01-10T11:00:00'),
      updatedAt: new Date('2024-01-25T18:30:00'),
      items: [{ name: 'Pagne Moderne', quantity: 2, price: 90000 }],
      shippingAddress: {
        address: '321 Rue du Commerce',
        city: 'Franceville',
        country: 'Gabon',
      },
      paymentStatus: 'paid',
      trackingNumber: 'TRK-2024-002',
    },
  ];

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1000));
      setOrders(mockOrders);
    } catch (error) {
      console.error('Erreur lors du chargement des commandes:', error);
      toast.error('Erreur lors du chargement des commandes');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: string, newStatus: Order['status']) => {
    try {
      // Simuler une mise à jour
      await new Promise(resolve => setTimeout(resolve, 500));

      setOrders(prev =>
        prev.map(order =>
          order.id === orderId ? { ...order, status: newStatus, updatedAt: new Date() } : order
        )
      );

      toast.success(`Statut de la commande ${orderId} mis à jour`);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending':
        return 'En attente';
      case 'processing':
        return 'En cours';
      case 'shipped':
        return 'Expédiée';
      case 'delivered':
        return 'Livrée';
      case 'cancelled':
        return 'Annulée';
      default:
        return status;
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payé';
      case 'pending':
        return 'En attente';
      case 'failed':
        return 'Échoué';
      default:
        return status;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesPayment = paymentFilter === 'all' || order.paymentStatus === paymentFilter;

    return matchesSearch && matchesStatus && matchesPayment;
  });

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    revenue: orders.filter(o => o.paymentStatus === 'paid').reduce((sum, o) => sum + o.total, 0),
  };

  if (loading) {
    return (
      <div className='flex items-center justify-center min-h-[400px]'>
        <LoadingSpinner size='lg' />
      </div>
    );
  }

  return (
    <div className='space-y-6'>
      {/* Header */}
      <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Commandes</h1>
          <p className='text-gray-600 mt-1'>Gérez toutes les commandes de vos clients</p>
        </div>
        <div className='flex items-center gap-3'>
          <Button onClick={loadOrders} variant='outline' size='sm' className='min-h-[44px]'>
            <RefreshCw className='h-4 w-4 mr-2' />
            Actualiser
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4'>
        <div className='bg-white rounded-lg shadow-sm border p-4'>
          <div className='flex items-center'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <Package className='h-5 w-5 text-blue-600' />
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-500'>Total</p>
              <p className='text-lg font-semibold text-gray-900'>{stats.total}</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border p-4'>
          <div className='flex items-center'>
            <div className='p-2 bg-yellow-100 rounded-lg'>
              <Clock className='h-5 w-5 text-yellow-600' />
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-500'>En attente</p>
              <p className='text-lg font-semibold text-gray-900'>{stats.pending}</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border p-4'>
          <div className='flex items-center'>
            <div className='p-2 bg-blue-100 rounded-lg'>
              <Package className='h-5 w-5 text-blue-600' />
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-500'>En cours</p>
              <p className='text-lg font-semibold text-gray-900'>{stats.processing}</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border p-4'>
          <div className='flex items-center'>
            <div className='p-2 bg-purple-100 rounded-lg'>
              <Truck className='h-5 w-5 text-purple-600' />
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-500'>Expédiées</p>
              <p className='text-lg font-semibold text-gray-900'>{stats.shipped}</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border p-4'>
          <div className='flex items-center'>
            <div className='p-2 bg-green-100 rounded-lg'>
              <CheckCircle className='h-5 w-5 text-green-600' />
            </div>
            <div className='ml-3'>
              <p className='text-sm font-medium text-gray-500'>Livrées</p>
              <p className='text-lg font-semibold text-gray-900'>{stats.delivered}</p>
            </div>
          </div>
        </div>

        <div className='bg-white rounded-lg shadow-sm border p-4'>
          <div className='flex items-center'>
            <div className='p-2 bg-green-100 rounded-lg'>
              <DollarSign className='h-5 w-5 text-green-600' />
            </div>
            <div className='ml-3 flex-1 min-w-0'>
              <p className='text-sm font-medium text-gray-500'>Revenus</p>
              <p className='text-base font-semibold text-gray-900 truncate'>
                {formatPrice(stats.revenue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className='bg-white rounded-lg shadow-sm border p-4'>
        <div className='flex flex-col sm:flex-row gap-4'>
          <div className='flex-1'>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
              <Input
                type='text'
                placeholder='Rechercher par client, email ou numéro de commande...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className='pl-10 min-h-[44px]'
              />
            </div>
          </div>
          <div className='sm:w-48'>
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]'
            >
              <option value='all'>Tous les statuts</option>
              <option value='pending'>En attente</option>
              <option value='processing'>En cours</option>
              <option value='shipped'>Expédiée</option>
              <option value='delivered'>Livrée</option>
              <option value='cancelled'>Annulée</option>
            </select>
          </div>
          <div className='sm:w-48'>
            <select
              value={paymentFilter}
              onChange={e => setPaymentFilter(e.target.value)}
              className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[44px]'
            >
              <option value='all'>Tous les paiements</option>
              <option value='paid'>Payé</option>
              <option value='pending'>En attente</option>
              <option value='failed'>Échoué</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className='bg-white rounded-lg shadow-sm border overflow-hidden'>
        <div className='overflow-x-auto'>
          <table className='min-w-full divide-y divide-gray-200'>
            <thead className='bg-gray-50'>
              <tr>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Commande
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Client
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Montant
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Statut
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Paiement
                </th>
                <th className='px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Date
                </th>
                <th className='px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='bg-white divide-y divide-gray-200'>
              {filteredOrders.map(order => (
                <tr key={order.id} className='hover:bg-gray-50 transition-colors'>
                  <td className='px-4 py-4 whitespace-nowrap'>
                    <div>
                      <div className='text-sm font-medium text-gray-900'>{order.id}</div>
                      {order.trackingNumber && (
                        <div className='text-sm text-gray-500'>{order.trackingNumber}</div>
                      )}
                    </div>
                  </td>
                  <td className='px-4 py-4 whitespace-nowrap'>
                    <div>
                      <div className='text-sm font-medium text-gray-900'>{order.customerName}</div>
                      <div className='text-sm text-gray-500'>{order.customerEmail}</div>
                    </div>
                  </td>
                  <td className='px-4 py-4 whitespace-nowrap'>
                    <div className='text-sm font-medium text-gray-900'>
                      {formatPrice(order.total)}
                    </div>
                  </td>
                  <td className='px-4 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}
                    >
                      {getStatusText(order.status)}
                    </span>
                  </td>
                  <td className='px-4 py-4 whitespace-nowrap'>
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(order.paymentStatus)}`}
                    >
                      {getPaymentStatusText(order.paymentStatus)}
                    </span>
                  </td>
                  <td className='px-4 py-4 whitespace-nowrap text-sm text-gray-500'>
                    {order.createdAt.toLocaleDateString('fr-FR')}
                  </td>
                  <td className='px-4 py-4 whitespace-nowrap text-right text-sm font-medium'>
                    <div className='flex items-center justify-end gap-2'>
                      <Link href={`/orders/${order.id}/tracking`}>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='min-h-[36px] min-w-[36px] p-2'
                          title='Voir le suivi'
                        >
                          <Eye className='h-4 w-4' />
                        </Button>
                      </Link>
                      <Link href={`/admin/orders/${order.id}`}>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='min-h-[36px] min-w-[36px] p-2'
                          title='Modifier'
                        >
                          <Edit className='h-4 w-4' />
                        </Button>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredOrders.length === 0 && (
          <div className='text-center py-12'>
            <Package className='mx-auto h-12 w-12 text-gray-400' />
            <h3 className='mt-2 text-sm font-medium text-gray-900'>Aucune commande trouvée</h3>
            <p className='mt-1 text-sm text-gray-500'>
              {searchQuery || statusFilter !== 'all' || paymentFilter !== 'all'
                ? 'Essayez de modifier vos critères de recherche.'
                : "Aucune commande n'a été passée pour le moment."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
