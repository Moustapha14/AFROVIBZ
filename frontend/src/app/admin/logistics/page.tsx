'use client';

import {
  Search,
  Truck,
  MapPin,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Edit,
  Trash2,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/hooks/useAuth';

interface Carrier {
  id: string;
  name: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  serviceAreas: string[];
  deliveryTime: string;
  costPerKm: number;
  isActive: boolean;
  rating: number;
  totalDeliveries: number;
  successRate: number;
}

interface DeliveryZone {
  id: string;
  name: string;
  description: string;
  deliveryTime: string;
  cost: number;
  isActive: boolean;
  coveredAreas: string[];
}

interface ShippingMethod {
  id: string;
  name: string;
  description: string;
  deliveryTime: string;
  cost: number;
  isActive: boolean;
  minOrderAmount?: number;
  maxWeight?: number;
}

// Données mockées
const mockCarriers: Carrier[] = [
  {
    id: '1',
    name: 'Express Gabon',
    contactPerson: 'Jean Dupont',
    email: 'contact@expressgabon.ga',
    phone: '+241 01234567',
    address: '123 Avenue de la Paix, Libreville',
    serviceAreas: ['Libreville', 'Port-Gentil', 'Franceville'],
    deliveryTime: '24-48h',
    costPerKm: 500,
    isActive: true,
    rating: 4.5,
    totalDeliveries: 1250,
    successRate: 98.5,
  },
  {
    id: '2',
    name: 'Rapide Transport',
    contactPerson: 'Marie Martin',
    email: 'info@rapidetransport.ga',
    phone: '+241 02345678',
    address: '456 Boulevard du Commerce, Libreville',
    serviceAreas: ['Libreville', 'Lambaréné', 'Mouila'],
    deliveryTime: '48-72h',
    costPerKm: 350,
    isActive: true,
    rating: 4.2,
    totalDeliveries: 890,
    successRate: 96.8,
  },
  {
    id: '3',
    name: 'Gabon Express',
    contactPerson: 'Pierre Durand',
    email: 'contact@gabonexpress.ga',
    phone: '+241 03456789',
    address: '789 Rue des Palmiers, Port-Gentil',
    serviceAreas: ['Port-Gentil', 'Libreville'],
    deliveryTime: '24h',
    costPerKm: 750,
    isActive: false,
    rating: 4.8,
    totalDeliveries: 650,
    successRate: 99.2,
  },
];

const mockDeliveryZones: DeliveryZone[] = [
  {
    id: '1',
    name: 'Libreville Centre',
    description: 'Zone centrale de Libreville',
    deliveryTime: '2-4h',
    cost: 2000,
    isActive: true,
    coveredAreas: ['Centre-ville', 'Quartier Louis', 'Akébé'],
  },
  {
    id: '2',
    name: 'Libreville Périphérie',
    description: 'Zones périphériques de Libreville',
    deliveryTime: '4-6h',
    cost: 3500,
    isActive: true,
    coveredAreas: ['Nombakélé', 'Alibandeng', 'Gros-Bouquet'],
  },
  {
    id: '3',
    name: 'Port-Gentil',
    description: 'Livraison à Port-Gentil',
    deliveryTime: '24-48h',
    cost: 15000,
    isActive: true,
    coveredAreas: ['Port-Gentil Centre', 'Port-Gentil Périphérie'],
  },
];

const mockShippingMethods: ShippingMethod[] = [
  {
    id: '1',
    name: 'Express',
    description: 'Livraison express en 2-4h',
    deliveryTime: '2-4h',
    cost: 5000,
    isActive: true,
    minOrderAmount: 50000,
  },
  {
    id: '2',
    name: 'Standard',
    description: 'Livraison standard en 24h',
    deliveryTime: '24h',
    cost: 2500,
    isActive: true,
    minOrderAmount: 25000,
  },
  {
    id: '3',
    name: 'Économique',
    description: 'Livraison économique en 48h',
    deliveryTime: '48h',
    cost: 1500,
    isActive: true,
    minOrderAmount: 10000,
  },
  {
    id: '4',
    name: 'Récupération en Mains Propres',
    description: 'Récupération au point de vente',
    deliveryTime: 'Immédiat',
    cost: 0,
    isActive: true,
  },
];

export default function SuperAdminLogisticsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [carriers, setCarriers] = useState<Carrier[]>(mockCarriers);
  const [deliveryZones, setDeliveryZones] = useState<DeliveryZone[]>(mockDeliveryZones);
  const [shippingMethods, setShippingMethods] = useState<ShippingMethod[]>(mockShippingMethods);
  const [activeTab, setActiveTab] = useState<'carriers' | 'zones' | 'methods'>('carriers');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!loading && (!user || user.role !== 'super_admin')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const filteredCarriers = carriers.filter(
    carrier =>
      carrier.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      carrier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredZones = deliveryZones.filter(
    zone =>
      zone.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      zone.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMethods = shippingMethods.filter(
    method =>
      method.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      method.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleToggleCarrierActive = (carrierId: string) => {
    setCarriers(carriers.map(c => (c.id === carrierId ? { ...c, isActive: !c.isActive } : c)));
    toast.success('Statut du transporteur mis à jour');
  };

  const handleToggleZoneActive = (zoneId: string) => {
    setDeliveryZones(
      deliveryZones.map(z => (z.id === zoneId ? { ...z, isActive: !z.isActive } : z))
    );
    toast.success('Statut de la zone de livraison mis à jour');
  };

  const handleToggleMethodActive = (methodId: string) => {
    setShippingMethods(
      shippingMethods.map(m => (m.id === methodId ? { ...m, isActive: !m.isActive } : m))
    );
    toast.success('Statut de la méthode de livraison mis à jour');
  };

  const getLogisticsStats = () => {
    return {
      totalCarriers: carriers.length,
      activeCarriers: carriers.filter(c => c.isActive).length,
      totalZones: deliveryZones.length,
      activeZones: deliveryZones.filter(z => z.isActive).length,
      totalMethods: shippingMethods.length,
      activeMethods: shippingMethods.filter(m => m.isActive).length,
      averageRating: carriers.reduce((sum, c) => sum + c.rating, 0) / carriers.length,
      totalDeliveries: carriers.reduce((sum, c) => sum + c.totalDeliveries, 0),
    };
  };

  const stats = getLogisticsStats();

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>Chargement...</div>
    );
  }

  if (!user || user.role !== 'super_admin') {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Logistique</h1>
          <p className='mt-2 text-gray-600'>Gestion des livraisons et transporteurs</p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='p-2 bg-blue-100 rounded-lg'>
                <Truck className='h-6 w-6 text-blue-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Transporteurs</p>
                <p className='text-2xl font-bold text-gray-900'>{stats.totalCarriers}</p>
                <p className='text-xs text-green-600'>{stats.activeCarriers} actifs</p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='p-2 bg-green-100 rounded-lg'>
                <MapPin className='h-6 w-6 text-green-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Zones de Livraison</p>
                <p className='text-2xl font-bold text-gray-900'>{stats.totalZones}</p>
                <p className='text-xs text-green-600'>{stats.activeZones} actives</p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='p-2 bg-purple-100 rounded-lg'>
                <Clock className='h-6 w-6 text-purple-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Méthodes de Livraison</p>
                <p className='text-2xl font-bold text-gray-900'>{stats.totalMethods}</p>
                <p className='text-xs text-green-600'>{stats.activeMethods} actives</p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='p-2 bg-orange-100 rounded-lg'>
                <CheckCircle className='h-6 w-6 text-orange-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Note Moyenne</p>
                <p className='text-2xl font-bold text-gray-900'>
                  {stats.averageRating.toFixed(1)}/5
                </p>
                <p className='text-xs text-green-600'>{stats.totalDeliveries} livraisons</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className='bg-white rounded-lg shadow mb-6'>
          <div className='border-b border-gray-200'>
            <nav className='-mb-px flex space-x-8 px-6'>
              <button
                onClick={() => setActiveTab('carriers')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'carriers'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Transporteurs
              </button>
              <button
                onClick={() => setActiveTab('zones')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'zones'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Zones de Livraison
              </button>
              <button
                onClick={() => setActiveTab('methods')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'methods'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Méthodes de Livraison
              </button>
            </nav>
          </div>

          {/* Search Bar */}
          <div className='p-6 border-b border-gray-200'>
            <div className='flex items-center justify-between'>
              <div className='relative flex-1 max-w-md'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  type='text'
                  placeholder={`Rechercher ${activeTab === 'carriers' ? 'un transporteur' : activeTab === 'zones' ? 'une zone' : 'une méthode'}...`}
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>
              <Button className='flex items-center gap-2'>
                <Plus className='h-4 w-4' />
                Ajouter
              </Button>
            </div>
          </div>

          {/* Content */}
          <div className='p-6'>
            {activeTab === 'carriers' && (
              <div className='space-y-4'>
                {filteredCarriers.map(carrier => (
                  <div key={carrier.id} className='border border-gray-200 rounded-lg p-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex-1'>
                        <div className='flex items-center space-x-3'>
                          <h3 className='text-lg font-medium text-gray-900'>{carrier.name}</h3>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              carrier.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {carrier.isActive ? 'Actif' : 'Inactif'}
                          </span>
                          <div className='flex items-center'>
                            <span className='text-sm text-gray-600'>{carrier.rating}/5</span>
                            <span className='text-yellow-400 ml-1'>★</span>
                          </div>
                        </div>
                        <p className='text-sm text-gray-600 mt-1'>
                          Contact: {carrier.contactPerson} • {carrier.email} • {carrier.phone}
                        </p>
                        <p className='text-sm text-gray-600'>
                          Zones: {carrier.serviceAreas.join(', ')} • Délai: {carrier.deliveryTime} •
                          Coût: {carrier.costPerKm} FCFA/km
                        </p>
                        <p className='text-sm text-gray-600'>
                          {carrier.totalDeliveries} livraisons • {carrier.successRate}% de réussite
                        </p>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <button
                          onClick={() => handleToggleCarrierActive(carrier.id)}
                          className='text-blue-600 hover:text-blue-900'
                        >
                          {carrier.isActive ? 'Désactiver' : 'Activer'}
                        </button>
                        <button className='text-green-600 hover:text-green-900'>
                          <Edit className='h-4 w-4' />
                        </button>
                        <button className='text-red-600 hover:text-red-900'>
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'zones' && (
              <div className='space-y-4'>
                {filteredZones.map(zone => (
                  <div key={zone.id} className='border border-gray-200 rounded-lg p-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex-1'>
                        <div className='flex items-center space-x-3'>
                          <h3 className='text-lg font-medium text-gray-900'>{zone.name}</h3>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              zone.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {zone.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className='text-sm text-gray-600 mt-1'>{zone.description}</p>
                        <p className='text-sm text-gray-600'>
                          Délai: {zone.deliveryTime} • Coût: {zone.cost.toLocaleString('fr-FR')}{' '}
                          FCFA
                        </p>
                        <p className='text-sm text-gray-600'>
                          Zones couvertes: {zone.coveredAreas.join(', ')}
                        </p>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <button
                          onClick={() => handleToggleZoneActive(zone.id)}
                          className='text-blue-600 hover:text-blue-900'
                        >
                          {zone.isActive ? 'Désactiver' : 'Activer'}
                        </button>
                        <button className='text-green-600 hover:text-green-900'>
                          <Edit className='h-4 w-4' />
                        </button>
                        <button className='text-red-600 hover:text-red-900'>
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === 'methods' && (
              <div className='space-y-4'>
                {filteredMethods.map(method => (
                  <div key={method.id} className='border border-gray-200 rounded-lg p-4'>
                    <div className='flex items-center justify-between'>
                      <div className='flex-1'>
                        <div className='flex items-center space-x-3'>
                          <h3 className='text-lg font-medium text-gray-900'>{method.name}</h3>
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              method.isActive
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {method.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <p className='text-sm text-gray-600 mt-1'>{method.description}</p>
                        <p className='text-sm text-gray-600'>
                          Délai: {method.deliveryTime} • Coût: {method.cost.toLocaleString('fr-FR')}{' '}
                          FCFA
                          {method.minOrderAmount &&
                            ` • Min: ${method.minOrderAmount.toLocaleString('fr-FR')} FCFA`}
                        </p>
                      </div>
                      <div className='flex items-center space-x-2'>
                        <button
                          onClick={() => handleToggleMethodActive(method.id)}
                          className='text-blue-600 hover:text-blue-900'
                        >
                          {method.isActive ? 'Désactiver' : 'Activer'}
                        </button>
                        <button className='text-green-600 hover:text-green-900'>
                          <Edit className='h-4 w-4' />
                        </button>
                        <button className='text-red-600 hover:text-red-900'>
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
