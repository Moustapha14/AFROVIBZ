'use client';

import {
  Package,
  Truck,
  CheckCircle,
  Clock,
  MapPin,
  Phone,
  Mail,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
  Calendar,
  DollarSign,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { useAuth } from '@/lib/hooks/useAuth';
import { formatPrice } from '@/lib/utils';

interface TrackingStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'current' | 'pending';
  timestamp: Date;
  location?: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface OrderDetails {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: Date;
  estimatedDelivery: Date;
  trackingNumber?: string;
  shippingAddress: {
    address: string;
    city: string;
    country: string;
    postalCode: string;
  };
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    image: string;
  }>;
}

export default function OrderTrackingPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [trackingSteps, setTrackingSteps] = useState<TrackingStep[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Mock data pour la démo
  const mockOrder: OrderDetails = {
    id: params.id as string,
    customerName: 'Marie Nguema',
    customerEmail: 'marie@example.com',
    customerPhone: '+241 00 00 00 00',
    total: 45000,
    status: 'shipped',
    createdAt: new Date('2024-01-15T10:30:00'),
    estimatedDelivery: new Date('2024-01-25T18:00:00'),
    trackingNumber: 'TRK-2024-001',
    shippingAddress: {
      address: '123 Rue de la Paix',
      city: 'Libreville',
      country: 'Gabon',
      postalCode: '0000',
    },
    items: [
      {
        name: 'Robe Africaine Élégante',
        quantity: 1,
        price: 25000,
        image: '/images/product-1.jpg',
      },
      {
        name: 'Chemise Wax Traditionnelle',
        quantity: 1,
        price: 20000,
        image: '/images/product-2.jpg',
      },
    ],
  };

  const mockTrackingSteps: TrackingStep[] = [
    {
      id: '1',
      title: 'Commande confirmée',
      description: 'Votre commande a été confirmée et est en cours de préparation',
      status: 'completed',
      timestamp: new Date('2024-01-15T10:30:00'),
      icon: CheckCircle,
    },
    {
      id: '2',
      title: 'En cours de préparation',
      description: 'Nos équipes préparent votre commande avec soin',
      status: 'completed',
      timestamp: new Date('2024-01-16T14:20:00'),
      icon: Package,
    },
    {
      id: '3',
      title: 'Expédiée',
      description: 'Votre commande a été expédiée et est en route',
      status: 'current',
      timestamp: new Date('2024-01-18T09:15:00'),
      location: 'Libreville, Gabon',
      icon: Truck,
    },
    {
      id: '4',
      title: 'En transit',
      description: 'Votre commande est en cours de livraison',
      status: 'pending',
      timestamp: new Date('2024-01-20T16:45:00'),
      location: 'Port-Gentil, Gabon',
      icon: Truck,
    },
    {
      id: '5',
      title: 'Livrée',
      description: 'Votre commande a été livrée avec succès',
      status: 'pending',
      timestamp: new Date('2024-01-25T18:00:00'),
      location: 'Libreville, Gabon',
      icon: CheckCircle,
    },
  ];

  useEffect(() => {
    loadOrderData();
  }, [params.id]);

  const loadOrderData = async () => {
    try {
      setLoading(true);

      // Simuler un appel API
      await new Promise(resolve => setTimeout(resolve, 1500));

      setOrder(mockOrder);
      setTrackingSteps(mockTrackingSteps);
    } catch (error) {
      console.error('Erreur lors du chargement de la commande:', error);
      toast.error('Erreur lors du chargement des données');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadOrderData();
    setRefreshing(false);
    toast.success('Informations mises à jour');
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

  const getStepIcon = (step: TrackingStep) => {
    const IconComponent = step.icon;
    return (
      <IconComponent
        className={`h-5 w-5 ${
          step.status === 'completed'
            ? 'text-green-600'
            : step.status === 'current'
              ? 'text-blue-600'
              : 'text-gray-400'
        }`}
      />
    );
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <LoadingSpinner size='lg' />
          <p className='mt-4 text-gray-600'>Chargement du suivi de commande...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>
        <div className='text-center'>
          <AlertCircle className='mx-auto h-12 w-12 text-gray-400' />
          <h3 className='mt-2 text-sm font-medium text-gray-900'>Commande non trouvée</h3>
          <p className='mt-1 text-sm text-gray-500'>
            La commande demandée n'existe pas ou vous n'avez pas les permissions pour la consulter.
          </p>
          <Button onClick={() => router.back()} className='mt-4'>
            <ArrowLeft className='h-4 w-4 mr-2' />
            Retour
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      {/* Header */}
      <div className='bg-white shadow-sm border-b'>
        <div className='px-4 py-4 sm:px-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Button onClick={() => router.back()} variant='ghost' size='sm' className='p-2'>
                <ArrowLeft className='h-5 w-5' />
              </Button>
              <div>
                <h1 className='text-lg font-semibold text-gray-900'>Suivi de commande</h1>
                <p className='text-sm text-gray-500'>Commande #{order.id}</p>
              </div>
            </div>
            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              variant='outline'
              size='sm'
              className='min-h-[44px]'
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
              Actualiser
            </Button>
          </div>
        </div>
      </div>

      <div className='max-w-2xl mx-auto px-4 py-6 space-y-6'>
        {/* Order Summary Card */}
        <div className='bg-white rounded-xl shadow-sm border p-6'>
          <div className='flex items-center justify-between mb-4'>
            <h2 className='text-lg font-semibold text-gray-900'>Résumé de la commande</h2>
            <span
              className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${getStatusColor(order.status)}`}
            >
              {getStatusText(order.status)}
            </span>
          </div>

          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6'>
            <div className='flex items-center space-x-3'>
              <Calendar className='h-5 w-5 text-gray-400' />
              <div>
                <p className='text-sm text-gray-500'>Date de commande</p>
                <p className='text-sm font-medium text-gray-900'>
                  {order.createdAt.toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>
            <div className='flex items-center space-x-3'>
              <DollarSign className='h-5 w-5 text-gray-400' />
              <div>
                <p className='text-sm text-gray-500'>Total</p>
                <p className='text-sm font-medium text-gray-900'>{formatPrice(order.total)}</p>
              </div>
            </div>
          </div>

          {order.trackingNumber && (
            <div className='bg-gray-50 rounded-lg p-4'>
              <p className='text-sm text-gray-600 mb-1'>Numéro de suivi</p>
              <p className='font-mono text-sm font-medium text-gray-900'>{order.trackingNumber}</p>
            </div>
          )}
        </div>

        {/* Customer Info */}
        <div className='bg-white rounded-xl shadow-sm border p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>Informations client</h3>
          <div className='space-y-3'>
            <div className='flex items-center space-x-3'>
              <div className='h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center'>
                <span className='text-sm font-medium text-blue-600'>
                  {order.customerName.charAt(0)}
                </span>
              </div>
              <div>
                <p className='text-sm font-medium text-gray-900'>{order.customerName}</p>
                <div className='flex items-center space-x-4 text-sm text-gray-500'>
                  <span className='flex items-center'>
                    <Mail className='h-4 w-4 mr-1' />
                    {order.customerEmail}
                  </span>
                  <span className='flex items-center'>
                    <Phone className='h-4 w-4 mr-1' />
                    {order.customerPhone}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shipping Address */}
        <div className='bg-white rounded-xl shadow-sm border p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>Adresse de livraison</h3>
          <div className='flex items-start space-x-3'>
            <MapPin className='h-5 w-5 text-gray-400 mt-0.5' />
            <div className='text-sm text-gray-900'>
              <p>{order.shippingAddress.address}</p>
              <p>
                {order.shippingAddress.postalCode} {order.shippingAddress.city}
              </p>
              <p>{order.shippingAddress.country}</p>
            </div>
          </div>
        </div>

        {/* Tracking Timeline */}
        <div className='bg-white rounded-xl shadow-sm border p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-6'>Suivi de livraison</h3>

          <div className='space-y-6'>
            {trackingSteps.map((step, index) => (
              <div key={step.id} className='flex items-start space-x-4'>
                {/* Timeline connector */}
                <div className='flex flex-col items-center'>
                  <div
                    className={`
                    flex items-center justify-center w-10 h-10 rounded-full border-2
                    ${
                      step.status === 'completed'
                        ? 'bg-green-100 border-green-600'
                        : step.status === 'current'
                          ? 'bg-blue-100 border-blue-600'
                          : 'bg-gray-100 border-gray-300'
                    }
                  `}
                  >
                    {getStepIcon(step)}
                  </div>
                  {index < trackingSteps.length - 1 && (
                    <div
                      className={`
                      w-0.5 h-12 mt-2
                      ${step.status === 'completed' ? 'bg-green-300' : 'bg-gray-200'}
                    `}
                    />
                  )}
                </div>

                {/* Step content */}
                <div className='flex-1 min-w-0 pb-6'>
                  <div className='flex items-center justify-between mb-2'>
                    <h4 className='text-sm font-medium text-gray-900'>{step.title}</h4>
                    <span className='text-xs text-gray-500'>
                      {step.timestamp.toLocaleDateString('fr-FR')} à{' '}
                      {step.timestamp.toLocaleTimeString('fr-FR', {
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <p className='text-sm text-gray-600 mb-2'>{step.description}</p>
                  {step.location && (
                    <p className='text-xs text-gray-500 flex items-center'>
                      <MapPin className='h-3 w-3 mr-1' />
                      {step.location}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Estimated delivery */}
          <div className='mt-6 pt-6 border-t border-gray-200'>
            <div className='flex items-center space-x-3'>
              <Clock className='h-5 w-5 text-blue-600' />
              <div>
                <p className='text-sm font-medium text-gray-900'>Livraison estimée</p>
                <p className='text-sm text-gray-600'>
                  {order.estimatedDelivery.toLocaleDateString('fr-FR')} à{' '}
                  {order.estimatedDelivery.toLocaleTimeString('fr-FR', {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className='bg-white rounded-xl shadow-sm border p-6'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>Articles commandés</h3>
          <div className='space-y-4'>
            {order.items.map((item, index) => (
              <div key={index} className='flex items-center space-x-4'>
                <div className='w-16 h-16 bg-gray-200 rounded-lg flex-shrink-0' />
                <div className='flex-1 min-w-0'>
                  <p className='text-sm font-medium text-gray-900 truncate'>{item.name}</p>
                  <p className='text-sm text-gray-500'>Quantité: {item.quantity}</p>
                </div>
                <div className='text-sm font-medium text-gray-900'>{formatPrice(item.price)}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
