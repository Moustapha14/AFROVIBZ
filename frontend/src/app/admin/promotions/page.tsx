'use client';

import { Search, Plus, Edit, Trash2, Copy, Calendar, Percent, Gift } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/hooks/useAuth';

interface Promotion {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed' | 'free_shipping';
  value: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit: number;
  usedCount: number;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
  applicableCategories: string[];
  applicableProducts: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Données mockées pour les promotions
const mockPromotions: Promotion[] = [
  {
    id: '1',
    code: 'WELCOME20',
    name: 'Bienvenue -20%',
    description: 'Réduction de 20% pour les nouveaux clients',
    type: 'percentage',
    value: 20,
    minOrderAmount: 50000,
    maxDiscount: 50000,
    usageLimit: 100,
    usedCount: 45,
    isActive: true,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-12-31'),
    applicableCategories: ['femmes', 'hommes', 'enfants'],
    applicableProducts: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    code: 'TECH50',
    name: 'Tech -50€',
    description: 'Réduction fixe de 50€ sur les produits tech',
    type: 'fixed',
    value: 50,
    minOrderAmount: 100000,
    usageLimit: 50,
    usedCount: 12,
    isActive: true,
    startDate: new Date('2024-01-15'),
    endDate: new Date('2024-02-15'),
    applicableCategories: ['tech'],
    applicableProducts: [],
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '3',
    code: 'FREESHIP',
    name: 'Livraison Gratuite',
    description: 'Livraison gratuite pour toute commande',
    type: 'free_shipping',
    value: 0,
    minOrderAmount: 75000,
    usageLimit: 200,
    usedCount: 89,
    isActive: true,
    startDate: new Date('2024-01-01'),
    endDate: new Date('2024-03-31'),
    applicableCategories: ['femmes', 'hommes', 'enfants', 'accessoires'],
    applicableProducts: [],
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    code: 'FLASH30',
    name: 'Flash Sale -30%',
    description: 'Promotion flash de 30% sur tous les produits',
    type: 'percentage',
    value: 30,
    usageLimit: 75,
    usedCount: 75,
    isActive: false,
    startDate: new Date('2024-01-10'),
    endDate: new Date('2024-01-12'),
    applicableCategories: ['femmes', 'hommes', 'enfants', 'accessoires', 'tech'],
    applicableProducts: [],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-12'),
  },
];

export default function SuperAdminPromotionsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'super_admin')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch =
      promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      promotion.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && promotion.isActive) ||
      (selectedStatus === 'inactive' && !promotion.isActive);
    const matchesType = selectedType === 'all' || promotion.type === selectedType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const getTypeBadge = (type: string) => {
    const typeConfig = {
      percentage: { color: 'bg-blue-100 text-blue-800', label: 'Pourcentage', icon: Percent },
      fixed: { color: 'bg-green-100 text-green-800', label: 'Montant fixe', icon: Gift },
      free_shipping: {
        color: 'bg-purple-100 text-purple-800',
        label: 'Livraison gratuite',
        icon: Gift,
      },
    };
    const config = typeConfig[type as keyof typeof typeConfig];
    const Icon = config.icon;
    return (
      <span
        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}
      >
        <Icon className='h-3 w-3 mr-1' />
        {config.label}
      </span>
    );
  };

  const getStatusBadge = (promotion: Promotion) => {
    const now = new Date();
    const isExpired = now > promotion.endDate;
    const isNotStarted = now < promotion.startDate;
    const isLimitReached = promotion.usedCount >= promotion.usageLimit;

    if (!promotion.isActive) {
      return (
        <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800'>
          Inactive
        </span>
      );
    }
    if (isExpired) {
      return (
        <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800'>
          Expirée
        </span>
      );
    }
    if (isNotStarted) {
      return (
        <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800'>
          À venir
        </span>
      );
    }
    if (isLimitReached) {
      return (
        <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800'>
          Limite atteinte
        </span>
      );
    }
    return (
      <span className='inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'>
        Active
      </span>
    );
  };

  const handleToggleActive = (promotionId: string) => {
    setPromotions(
      promotions.map(p => (p.id === promotionId ? { ...p, isActive: !p.isActive } : p))
    );
    toast.success('Statut de la promotion mis à jour');
  };

  const handleDeletePromotion = (promotionId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette promotion ?')) {
      setPromotions(promotions.filter(p => p.id !== promotionId));
      toast.success('Promotion supprimée avec succès');
    }
  };

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Code copié dans le presse-papiers');
  };

  const getPromotionStats = () => {
    const now = new Date();
    return {
      total: promotions.length,
      active: promotions.filter(
        p => p.isActive && now >= p.startDate && now <= p.endDate && p.usedCount < p.usageLimit
      ).length,
      expired: promotions.filter(p => now > p.endDate).length,
      totalUsage: promotions.reduce((sum, p) => sum + p.usedCount, 0),
    };
  };

  const stats = getPromotionStats();

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
          <h1 className='text-3xl font-bold text-gray-900'>Promotions & Codes</h1>
          <p className='mt-2 text-gray-600'>Créez et gérez les promotions et codes de réduction</p>
        </div>

        {/* Stats Cards */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-8'>
          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='p-2 bg-blue-100 rounded-lg'>
                <Gift className='h-6 w-6 text-blue-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Total Promotions</p>
                <p className='text-2xl font-bold text-gray-900'>{stats.total}</p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='p-2 bg-green-100 rounded-lg'>
                <Gift className='h-6 w-6 text-green-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Actives</p>
                <p className='text-2xl font-bold text-gray-900'>{stats.active}</p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='p-2 bg-red-100 rounded-lg'>
                <Calendar className='h-6 w-6 text-red-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Expirées</p>
                <p className='text-2xl font-bold text-gray-900'>{stats.expired}</p>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-lg shadow p-6'>
            <div className='flex items-center'>
              <div className='p-2 bg-purple-100 rounded-lg'>
                <Percent className='h-6 w-6 text-purple-600' />
              </div>
              <div className='ml-4'>
                <p className='text-sm font-medium text-gray-600'>Utilisations</p>
                <p className='text-2xl font-bold text-gray-900'>{stats.totalUsage}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Bar */}
        <div className='bg-white rounded-lg shadow p-6 mb-6'>
          <div className='flex flex-col sm:flex-row gap-4 items-center justify-between'>
            <div className='flex flex-col sm:flex-row gap-4 flex-1'>
              {/* Search */}
              <div className='relative flex-1 max-w-md'>
                <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
                <Input
                  type='text'
                  placeholder='Rechercher une promotion...'
                  value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className='pl-10'
                />
              </div>

              {/* Status Filter */}
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
              >
                <option value='all'>Tous les statuts</option>
                <option value='active'>Actives</option>
                <option value='inactive'>Inactives</option>
              </select>

              {/* Type Filter */}
              <select
                value={selectedType}
                onChange={e => setSelectedType(e.target.value)}
                className='px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
              >
                <option value='all'>Tous les types</option>
                <option value='percentage'>Pourcentage</option>
                <option value='fixed'>Montant fixe</option>
                <option value='free_shipping'>Livraison gratuite</option>
              </select>
            </div>

            {/* Add Promotion Button */}
            <Button onClick={() => setIsAddModalOpen(true)} className='flex items-center gap-2'>
              <Plus className='h-4 w-4' />
              Créer une promotion
            </Button>
          </div>
        </div>

        {/* Promotions Table */}
        <div className='bg-white rounded-lg shadow overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='min-w-full divide-y divide-gray-200'>
              <thead className='bg-gray-50'>
                <tr>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Code
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Promotion
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Type
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Valeur
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Utilisations
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Statut
                  </th>
                  <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className='bg-white divide-y divide-gray-200'>
                {filteredPromotions.map(promotion => (
                  <tr key={promotion.id} className='hover:bg-gray-50'>
                    <td className='px-6 py-4 whitespace-nowrap'>
                      <div className='flex items-center space-x-2'>
                        <span className='text-sm font-medium text-gray-900'>{promotion.code}</span>
                        <button
                          onClick={() => handleCopyCode(promotion.code)}
                          className='text-gray-400 hover:text-gray-600'
                        >
                          <Copy className='h-4 w-4' />
                        </button>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div>
                        <div className='text-sm font-medium text-gray-900'>{promotion.name}</div>
                        <div className='text-sm text-gray-500'>{promotion.description}</div>
                        <div className='text-xs text-gray-400'>
                          {promotion.startDate.toLocaleDateString('fr-FR')} -{' '}
                          {promotion.endDate.toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>{getTypeBadge(promotion.type)}</td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {promotion.type === 'percentage' && `${promotion.value}%`}
                      {promotion.type === 'fixed' && `${promotion.value}€`}
                      {promotion.type === 'free_shipping' && 'Gratuit'}
                      {promotion.minOrderAmount && (
                        <div className='text-xs text-gray-500'>
                          Min: {promotion.minOrderAmount.toLocaleString('fr-FR')} FCFA
                        </div>
                      )}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-900'>
                      {promotion.usedCount} / {promotion.usageLimit}
                    </td>
                    <td className='px-6 py-4 whitespace-nowrap'>{getStatusBadge(promotion)}</td>
                    <td className='px-6 py-4 whitespace-nowrap text-sm font-medium'>
                      <div className='flex items-center space-x-2'>
                        <button
                          onClick={() => handleToggleActive(promotion.id)}
                          className='text-blue-600 hover:text-blue-900'
                        >
                          {promotion.isActive ? 'Désactiver' : 'Activer'}
                        </button>
                        <button
                          onClick={() => {
                            /* TODO: Edit promotion */
                          }}
                          className='text-green-600 hover:text-green-900'
                        >
                          <Edit className='h-4 w-4' />
                        </button>
                        <button
                          onClick={() => handleDeletePromotion(promotion.id)}
                          className='text-red-600 hover:text-red-900'
                        >
                          <Trash2 className='h-4 w-4' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredPromotions.length === 0 && (
          <div className='text-center py-12'>
            <div className='text-gray-400 mb-4'>
              <Gift className='h-12 w-12 mx-auto' />
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>Aucune promotion trouvée</h3>
            <p className='text-gray-500'>
              Aucune promotion ne correspond à vos critères de recherche.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
