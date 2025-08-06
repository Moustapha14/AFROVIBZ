'use client';

import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Download,
  RefreshCw,
} from 'lucide-react';
import React, { useState } from 'react';

import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/lib/hooks/useAuth';
import { formatPrice } from '@/lib/utils';

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
    image?: string;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
  };
  trackingNumber?: string;
  estimatedDelivery?: string;
}

// Données temporaires
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 45000,
    trackingNumber: 'TRK-123456789',
    estimatedDelivery: '2024-01-18',
    items: [
      { id: '1', name: 'Robe Africaine Élégante', quantity: 1, price: 25000 },
      { id: '2', name: 'Chemise Wax Traditionnelle', quantity: 1, price: 20000 },
    ],
    shippingAddress: {
      firstName: 'Jean',
      lastName: 'Dupont',
      address: 'Quartier Akanda',
      city: 'Libreville',
      postalCode: '0000',
      country: 'Gabon',
    },
  },
  {
    id: 'ORD-002',
    date: '2024-01-10',
    status: 'shipped',
    total: 30000,
    trackingNumber: 'TRK-987654321',
    estimatedDelivery: '2024-01-13',
    items: [
      { id: '3', name: 'Pagne Moderne', quantity: 1, price: 12000 },
      { id: '4', name: 'Boubou Traditionnel', quantity: 1, price: 18000 },
    ],
    shippingAddress: {
      firstName: 'Jean',
      lastName: 'Dupont',
      address: 'Quartier Akanda',
      city: 'Libreville',
      postalCode: '0000',
      country: 'Gabon',
    },
  },
  {
    id: 'ORD-003',
    date: '2024-01-05',
    status: 'processing',
    total: 25000,
    items: [{ id: '1', name: 'Robe Africaine Élégante', quantity: 1, price: 25000 }],
    shippingAddress: {
      firstName: 'Jean',
      lastName: 'Dupont',
      address: 'Quartier Akanda',
      city: 'Libreville',
      postalCode: '0000',
      country: 'Gabon',
    },
  },
];

const statusConfig = {
  pending: {
    label: 'En attente',
    color: 'bg-yellow-100 text-yellow-800',
    icon: Clock,
  },
  processing: {
    label: 'En cours',
    color: 'bg-blue-100 text-blue-800',
    icon: RefreshCw,
  },
  shipped: {
    label: 'Expédiée',
    color: 'bg-purple-100 text-purple-800',
    icon: Truck,
  },
  delivered: {
    label: 'Livrée',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Annulée',
    color: 'bg-red-100 text-red-800',
    icon: XCircle,
  },
};

export default function OrdersPage() {
  const { user } = useAuth();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = mockOrders.filter(
    order => filterStatus === 'all' || order.status === filterStatus
  );

  const getStatusIcon = (status: Order['status']) => {
    const Icon = statusConfig[status].icon;
    return <Icon className='h-4 w-4' />;
  };

  const getOrderProgress = (status: Order['status']) => {
    const steps = ['pending', 'processing', 'shipped', 'delivered'];
    const currentIndex = steps.indexOf(status);
    return currentIndex >= 0 ? currentIndex + 1 : 0;
  };

  if (!user) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-2xl font-bold text-gray-900 mb-2'>Connexion requise</h2>
          <p className='text-gray-600 mb-6'>Connectez-vous pour voir vos commandes</p>
          <Button onClick={() => (window.location.href = '/auth/login')}>Se connecter</Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Mes Commandes', current: true },
            ]}
          />
          <h1 className='text-3xl font-bold text-gray-900 mt-4'>Mes Commandes</h1>
        </div>

        {/* Filters */}
        <div className='bg-white rounded-lg shadow-sm p-4 mb-6'>
          <div className='flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4'>
            <span className='text-sm font-medium text-gray-700'>Filtrer par statut:</span>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className='border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-black focus:border-transparent w-full sm:w-auto'
            >
              <option value='all'>Toutes les commandes</option>
              <option value='pending'>En attente</option>
              <option value='processing'>En cours</option>
              <option value='shipped'>Expédiées</option>
              <option value='delivered'>Livrées</option>
              <option value='cancelled'>Annulées</option>
            </select>
          </div>
        </div>

        {/* Orders List */}
        <div className='space-y-6'>
          {filteredOrders.length === 0 ? (
            <div className='bg-white rounded-lg shadow-sm p-8 text-center'>
              <Package className='h-12 w-12 text-gray-400 mx-auto mb-4' />
              <h3 className='text-lg font-medium text-gray-900 mb-2'>Aucune commande trouvée</h3>
              <p className='text-gray-500 mb-6'>
                {filterStatus === 'all'
                  ? "Vous n'avez pas encore passé de commande"
                  : `Aucune commande avec le statut "${statusConfig[filterStatus as keyof typeof statusConfig]?.label || filterStatus}"`}
              </p>
              {filterStatus === 'all' && (
                <Button onClick={() => (window.location.href = '/products')}>
                  Découvrir nos produits
                </Button>
              )}
            </div>
          ) : (
            filteredOrders.map(order => (
              <div key={order.id} className='bg-white rounded-lg shadow-sm'>
                {/* Order Header */}
                <div className='p-4 sm:p-6 border-b border-gray-200'>
                  <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-3 sm:space-y-0'>
                    <div className='flex-1'>
                      <h3 className='text-lg font-semibold text-gray-900'>Commande {order.id}</h3>
                      <p className='text-sm text-gray-500'>
                        Passée le {new Date(order.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className='flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-3'>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium flex items-center justify-center sm:justify-start space-x-1 ${statusConfig[order.status].color}`}
                      >
                        {getStatusIcon(order.status)}
                        <span>{statusConfig[order.status].label}</span>
                      </span>
                      <span className='text-lg font-bold text-gray-900 text-center sm:text-left'>
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Order Progress */}
                {order.status !== 'cancelled' && (
                  <div className='p-4 sm:p-6 border-b border-gray-200'>
                    <div className='hidden sm:flex items-center justify-between'>
                      {['En attente', 'En cours', 'Expédiée', 'Livrée'].map((step, index) => {
                        const isCompleted = index < getOrderProgress(order.status);
                        const isCurrent = index === getOrderProgress(order.status) - 1;

                        return (
                          <div key={step} className='flex items-center'>
                            <div
                              className={`flex items-center justify-center w-8 h-8 rounded-full border-2 ${
                                isCompleted
                                  ? 'border-green-500 bg-green-500 text-white'
                                  : isCurrent
                                    ? 'border-blue-500 bg-blue-500 text-white'
                                    : 'border-gray-300 text-gray-400'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle className='h-4 w-4' />
                              ) : (
                                <span className='text-xs font-medium'>{index + 1}</span>
                              )}
                            </div>
                            <span
                              className={`ml-2 text-sm ${
                                isCompleted || isCurrent ? 'text-gray-900' : 'text-gray-500'
                              }`}
                            >
                              {step}
                            </span>
                            {index < 3 && (
                              <div
                                className={`w-16 h-0.5 mx-4 ${
                                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {/* Mobile Progress - Vertical Layout */}
                    <div className='sm:hidden space-y-3'>
                      {['En attente', 'En cours', 'Expédiée', 'Livrée'].map((step, index) => {
                        const isCompleted = index < getOrderProgress(order.status);
                        const isCurrent = index === getOrderProgress(order.status) - 1;

                        return (
                          <div key={step} className='flex items-center'>
                            <div
                              className={`flex items-center justify-center w-6 h-6 rounded-full border-2 flex-shrink-0 ${
                                isCompleted
                                  ? 'border-green-500 bg-green-500 text-white'
                                  : isCurrent
                                    ? 'border-blue-500 bg-blue-500 text-white'
                                    : 'border-gray-300 text-gray-400'
                              }`}
                            >
                              {isCompleted ? (
                                <CheckCircle className='h-3 w-3' />
                              ) : (
                                <span className='text-xs font-medium'>{index + 1}</span>
                              )}
                            </div>
                            <span
                              className={`ml-3 text-sm ${
                                isCompleted || isCurrent ? 'text-gray-900 font-medium' : 'text-gray-500'
                              }`}
                            >
                              {step}
                            </span>
                            {index < 3 && (
                              <div
                                className={`absolute left-3 mt-6 w-0.5 h-3 ${
                                  isCompleted ? 'bg-green-500' : 'bg-gray-300'
                                }`}
                                style={{ marginLeft: '11px' }}
                              />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div className='p-4 sm:p-6'>
                  <h4 className='font-medium text-gray-900 mb-4'>Articles commandés</h4>
                  <div className='space-y-3'>
                    {order.items.map(item => (
                      <div key={item.id} className='flex items-start sm:items-center space-x-3 sm:space-x-4'>
                        <div className='w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-lg flex-shrink-0'>
                          <div className='w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center'>
                            <span className='text-xs text-gray-500'>Img</span>
                          </div>
                        </div>
                        <div className='flex-1 min-w-0'>
                          <h5 className='font-medium text-gray-900 text-sm sm:text-base truncate'>{item.name}</h5>
                          <p className='text-xs sm:text-sm text-gray-500'>Quantité: {item.quantity}</p>
                        </div>
                        <div className='text-right flex-shrink-0'>
                          <p className='font-medium text-gray-900 text-sm sm:text-base'>
                            {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Order Actions */}
                <div className='p-4 sm:p-6 bg-gray-50 rounded-b-lg'>
                  {/* Desktop Layout */}
                  <div className='hidden sm:flex items-center justify-between'>
                    <div className='flex items-center space-x-4'>
                      <Button variant='outline' size='sm' onClick={() => setSelectedOrder(order)}>
                        <Eye className='h-4 w-4 mr-2' />
                        Voir les détails
                      </Button>

                      {order.trackingNumber && (
                        <Button
                          variant='outline'
                          size='sm'
                          onClick={() => {
                            // TODO: Open tracking modal
                            alert(`Numéro de suivi: ${order.trackingNumber}`);
                          }}
                        >
                          <Truck className='h-4 w-4 mr-2' />
                          Suivre
                        </Button>
                      )}
                    </div>

                    <div className='flex items-center space-x-2'>
                      <Button
                        variant='outline'
                        size='sm'
                        onClick={() => {
                          // TODO: Download invoice
                          alert('Téléchargement de la facture...');
                        }}
                      >
                        <Download className='h-4 w-4 mr-2' />
                        Facture
                      </Button>

                      {order.status === 'delivered' && (
                        <Button size='sm'>Commander à nouveau</Button>
                      )}
                    </div>
                  </div>
                  
                  {/* Mobile Layout */}
                  <div className='sm:hidden space-y-3'>
                    <div className='flex flex-col space-y-2'>
                      <Button variant='outline' size='sm' onClick={() => setSelectedOrder(order)} className='w-full justify-center'>
                        <Eye className='h-4 w-4 mr-2' />
                        Voir les détails
                      </Button>
                      
                      <div className='flex space-x-2'>
                        {order.trackingNumber && (
                          <Button
                            variant='outline'
                            size='sm'
                            className='flex-1 justify-center'
                            onClick={() => {
                              // TODO: Open tracking modal
                              alert(`Numéro de suivi: ${order.trackingNumber}`);
                            }}
                          >
                            <Truck className='h-4 w-4 mr-2' />
                            Suivre
                          </Button>
                        )}
                        
                        <Button
                          variant='outline'
                          size='sm'
                          className='flex-1 justify-center'
                          onClick={() => {
                            // TODO: Download invoice
                            alert('Téléchargement de la facture...');
                          }}
                        >
                          <Download className='h-4 w-4 mr-2' />
                          Facture
                        </Button>
                      </div>
                      
                      {order.status === 'delivered' && (
                        <Button size='sm' className='w-full justify-center'>Commander à nouveau</Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-2 sm:p-4 z-50'>
          <div className='bg-white rounded-lg max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto'>
            <div className='p-4 sm:p-6 border-b border-gray-200'>
              <div className='flex items-center justify-between'>
                <h2 className='text-lg sm:text-xl font-semibold text-gray-900 pr-4'>
                  Détails de la commande {selectedOrder.id}
                </h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className='text-gray-400 hover:text-gray-600 flex-shrink-0'
                >
                  <XCircle className='h-6 w-6' />
                </button>
              </div>
            </div>

            <div className='p-4 sm:p-6 space-y-4 sm:space-y-6'>
              {/* Order Info */}
              <div>
                <h3 className='font-medium text-gray-900 mb-3'>Informations de commande</h3>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm'>
                  <div>
                    <span className='text-gray-500 block'>Numéro de commande:</span>
                    <p className='font-medium'>{selectedOrder.id}</p>
                  </div>
                  <div>
                    <span className='text-gray-500 block'>Date de commande:</span>
                    <p className='font-medium'>
                      {new Date(selectedOrder.date).toLocaleDateString('fr-FR')}
                    </p>
                  </div>
                  <div>
                    <span className='text-gray-500 block'>Statut:</span>
                    <p className='font-medium'>{statusConfig[selectedOrder.status].label}</p>
                  </div>
                  <div>
                    <span className='text-gray-500 block'>Total:</span>
                    <p className='font-medium'>{formatPrice(selectedOrder.total)}</p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className='font-medium text-gray-900 mb-3'>Adresse de livraison</h3>
                <div className='text-sm text-gray-600'>
                  <p>
                    {selectedOrder.shippingAddress.firstName}{' '}
                    {selectedOrder.shippingAddress.lastName}
                  </p>
                  <p>{selectedOrder.shippingAddress.address}</p>
                  <p>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.postalCode}
                  </p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                </div>
              </div>

              {/* Tracking Info */}
              {selectedOrder.trackingNumber && (
                <div>
                  <h3 className='font-medium text-gray-900 mb-3'>Informations de suivi</h3>
                  <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-sm'>
                    <div>
                      <span className='text-gray-500 block'>Numéro de suivi:</span>
                      <p className='font-medium break-all'>{selectedOrder.trackingNumber}</p>
                    </div>
                    {selectedOrder.estimatedDelivery && (
                      <div>
                        <span className='text-gray-500 block'>Livraison estimée:</span>
                        <p className='font-medium'>
                          {new Date(selectedOrder.estimatedDelivery).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
