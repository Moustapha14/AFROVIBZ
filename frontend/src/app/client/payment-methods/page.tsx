'use client';

import {
  CreditCard,
  Plus,
  Edit,
  Trash2,
  CheckCircle,
  Lock,
  Shield,
  Eye,
  EyeOff,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/hooks/useAuth';

interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile_money' | 'bank_transfer';
  name: string;
  isDefault: boolean;
  isActive: boolean;
  lastUsed?: Date;
  // Pour les cartes
  cardNumber?: string;
  cardType?: 'visa' | 'mastercard' | 'american_express';
  expiryMonth?: string;
  expiryYear?: string;
  cardholderName?: string;
  // Pour mobile money
  phoneNumber?: string;
  provider?: 'moov' | 'airtel' | 'libercom';
  // Pour virement bancaire
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
}

// Données mockées pour les méthodes de paiement
const mockPaymentMethods: PaymentMethod[] = [
  {
    id: '1',
    type: 'card',
    name: 'Carte Visa principale',
    isDefault: true,
    isActive: true,
    lastUsed: new Date('2024-01-15'),
    cardNumber: '**** **** **** 1234',
    cardType: 'visa',
    expiryMonth: '12',
    expiryYear: '2026',
    cardholderName: 'Jean Dupont',
  },
  {
    id: '2',
    type: 'mobile_money',
    name: 'Moov Money',
    isDefault: false,
    isActive: true,
    lastUsed: new Date('2024-01-10'),
    phoneNumber: '+241 01 23 45 67',
    provider: 'moov',
  },
  {
    id: '3',
    type: 'bank_transfer',
    name: 'Compte BGF',
    isDefault: false,
    isActive: true,
    lastUsed: new Date('2023-12-20'),
    bankName: 'Banque Gabonaise et Française',
    accountNumber: '**** 5678',
    accountHolder: 'Jean Dupont',
  },
];

export default function ClientPaymentMethodsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(mockPaymentMethods);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | null>(null);
  const [showCardNumbers, setShowCardNumbers] = useState(false);
  const [formData, setFormData] = useState({
    type: 'card' as 'card' | 'mobile_money' | 'bank_transfer',
    name: '',
    isDefault: false,
    // Cartes
    cardNumber: '',
    cardType: 'visa' as 'visa' | 'mastercard' | 'american_express',
    expiryMonth: '',
    expiryYear: '',
    cardholderName: '',
    // Mobile money
    phoneNumber: '',
    provider: 'moov' as 'moov' | 'airtel' | 'libercom',
    // Virement bancaire
    bankName: '',
    accountNumber: '',
    accountHolder: '',
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'user')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddPaymentMethod = () => {
    if (!formData.name) {
      toast.error('Veuillez donner un nom à cette méthode de paiement');
      return;
    }

    // Validation selon le type
    if (formData.type === 'card') {
      if (
        !formData.cardNumber ||
        !formData.cardholderName ||
        !formData.expiryMonth ||
        !formData.expiryYear
      ) {
        toast.error('Veuillez remplir tous les champs de la carte');
        return;
      }
    } else if (formData.type === 'mobile_money') {
      if (!formData.phoneNumber) {
        toast.error('Veuillez saisir le numéro de téléphone');
        return;
      }
    } else if (formData.type === 'bank_transfer') {
      if (!formData.bankName || !formData.accountNumber || !formData.accountHolder) {
        toast.error('Veuillez remplir tous les champs bancaires');
        return;
      }
    }

    const newMethod: PaymentMethod = {
      id: Date.now().toString(),
      type: formData.type,
      name: formData.name,
      isDefault: formData.isDefault,
      isActive: true,
      lastUsed: new Date(),
      ...(formData.type === 'card' && {
        cardNumber: `**** **** **** ${formData.cardNumber.slice(-4)}`,
        cardType: formData.cardType,
        expiryMonth: formData.expiryMonth,
        expiryYear: formData.expiryYear,
        cardholderName: formData.cardholderName,
      }),
      ...(formData.type === 'mobile_money' && {
        phoneNumber: formData.phoneNumber,
        provider: formData.provider,
      }),
      ...(formData.type === 'bank_transfer' && {
        bankName: formData.bankName,
        accountNumber: `**** ${formData.accountNumber.slice(-4)}`,
        accountHolder: formData.accountHolder,
      }),
    };

    // Gérer la méthode par défaut
    if (formData.isDefault) {
      setPaymentMethods(prev => prev.map(method => ({ ...method, isDefault: false })));
    }

    setPaymentMethods(prev => [...prev, newMethod]);
    setIsAddModalOpen(false);
    resetForm();
    toast.success('Méthode de paiement ajoutée avec succès');
  };

  const handleEditPaymentMethod = () => {
    if (!selectedMethod) return;

    if (!formData.name) {
      toast.error('Veuillez donner un nom à cette méthode de paiement');
      return;
    }

    // Validation selon le type
    if (formData.type === 'card') {
      if (!formData.cardholderName || !formData.expiryMonth || !formData.expiryYear) {
        toast.error('Veuillez remplir tous les champs de la carte');
        return;
      }
    } else if (formData.type === 'mobile_money') {
      if (!formData.phoneNumber) {
        toast.error('Veuillez saisir le numéro de téléphone');
        return;
      }
    } else if (formData.type === 'bank_transfer') {
      if (!formData.bankName || !formData.accountHolder) {
        toast.error('Veuillez remplir tous les champs bancaires');
        return;
      }
    }

    // Gérer la méthode par défaut
    if (formData.isDefault) {
      setPaymentMethods(prev => prev.map(method => ({ ...method, isDefault: false })));
    }

    setPaymentMethods(prev =>
      prev.map(method =>
        method.id === selectedMethod.id
          ? {
              ...method,
              name: formData.name,
              isDefault: formData.isDefault,
              ...(formData.type === 'card' && {
                cardType: formData.cardType,
                expiryMonth: formData.expiryMonth,
                expiryYear: formData.expiryYear,
                cardholderName: formData.cardholderName,
              }),
              ...(formData.type === 'mobile_money' && {
                phoneNumber: formData.phoneNumber,
                provider: formData.provider,
              }),
              ...(formData.type === 'bank_transfer' && {
                bankName: formData.bankName,
                accountHolder: formData.accountHolder,
              }),
            }
          : method
      )
    );
    setIsEditModalOpen(false);
    setSelectedMethod(null);
    resetForm();
    toast.success('Méthode de paiement modifiée avec succès');
  };

  const handleDeletePaymentMethod = (methodId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette méthode de paiement ?')) {
      setPaymentMethods(prev => prev.filter(method => method.id !== methodId));
      toast.success('Méthode de paiement supprimée avec succès');
    }
  };

  const handleSetDefault = (methodId: string) => {
    setPaymentMethods(prev =>
      prev.map(method => ({
        ...method,
        isDefault: method.id === methodId,
      }))
    );
    toast.success('Méthode de paiement définie par défaut');
  };

  const openEditModal = (method: PaymentMethod) => {
    setSelectedMethod(method);
    setFormData({
      type: method.type,
      name: method.name,
      isDefault: method.isDefault,
      cardNumber: '',
      cardType: method.cardType || 'visa',
      expiryMonth: method.expiryMonth || '',
      expiryYear: method.expiryYear || '',
      cardholderName: method.cardholderName || '',
      phoneNumber: method.phoneNumber || '',
      provider: method.provider || 'moov',
      bankName: method.bankName || '',
      accountNumber: '',
      accountHolder: method.accountHolder || '',
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'card',
      name: '',
      isDefault: false,
      cardNumber: '',
      cardType: 'visa',
      expiryMonth: '',
      expiryYear: '',
      cardholderName: '',
      phoneNumber: '',
      provider: 'moov',
      bankName: '',
      accountNumber: '',
      accountHolder: '',
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'card':
        return <CreditCard className='h-5 w-5' />;
      case 'mobile_money':
        return <CreditCard className='h-5 w-5' />;
      case 'bank_transfer':
        return <CreditCard className='h-5 w-5' />;
      default:
        return <CreditCard className='h-5 w-5' />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'card':
        return 'Carte bancaire';
      case 'mobile_money':
        return 'Mobile Money';
      case 'bank_transfer':
        return 'Virement bancaire';
      default:
        return 'Autre';
    }
  };

  const getProviderLabel = (provider: string) => {
    switch (provider) {
      case 'moov':
        return 'Moov Money';
      case 'airtel':
        return 'Airtel Money';
      case 'libercom':
        return 'Libercom';
      default:
        return provider;
    }
  };

  const getCardTypeLabel = (cardType: string) => {
    switch (cardType) {
      case 'visa':
        return 'Visa';
      case 'mastercard':
        return 'Mastercard';
      case 'american_express':
        return 'American Express';
      default:
        return cardType;
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>Chargement...</div>
    );
  }

  if (!user || user.role !== 'user') {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <div className='flex justify-between items-center'>
            <div>
              <h1 className='text-3xl font-bold text-gray-900'>Méthodes de Paiement</h1>
              <p className='mt-2 text-gray-600'>Gérez vos moyens de paiement en toute sécurité</p>
            </div>
            <Button onClick={() => setIsAddModalOpen(true)} className='flex items-center gap-2'>
              <Plus className='h-4 w-4' />
              Ajouter une méthode
            </Button>
          </div>
        </div>

        {/* Sécurité */}
        <div className='bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8'>
          <div className='flex items-start gap-3'>
            <Shield className='h-5 w-5 text-blue-600 mt-0.5' />
            <div>
              <h3 className='text-sm font-medium text-blue-900'>Sécurité des paiements</h3>
              <p className='text-sm text-blue-700 mt-1'>
                Vos informations de paiement sont chiffrées et sécurisées. Nous ne stockons jamais
                vos données sensibles.
              </p>
            </div>
          </div>
        </div>

        {/* Liste des méthodes de paiement */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
          {paymentMethods.map(method => (
            <div
              key={method.id}
              className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'
            >
              {/* En-tête de la carte */}
              <div className='flex items-center justify-between mb-4'>
                <div className='flex items-center gap-2'>
                  <div className='p-2 bg-blue-100 rounded-lg'>{getTypeIcon(method.type)}</div>
                  <div>
                    <h3 className='font-semibold text-gray-900'>{method.name}</h3>
                    <p className='text-sm text-gray-500'>{getTypeLabel(method.type)}</p>
                  </div>
                </div>
                <div className='flex gap-1'>
                  <button
                    onClick={() => openEditModal(method)}
                    className='p-1 text-gray-400 hover:text-blue-600 transition-colors'
                    title='Modifier'
                  >
                    <Edit className='h-4 w-4' />
                  </button>
                  <button
                    onClick={() => handleDeletePaymentMethod(method.id)}
                    className='p-1 text-gray-400 hover:text-red-600 transition-colors'
                    title='Supprimer'
                  >
                    <Trash2 className='h-4 w-4' />
                  </button>
                </div>
              </div>

              {/* Détails de la méthode */}
              <div className='space-y-2 mb-4'>
                {method.type === 'card' && (
                  <>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-gray-600'>Numéro de carte</span>
                      <span className='text-sm font-medium text-gray-900'>
                        {showCardNumbers ? method.cardNumber : '**** **** **** ****'}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-gray-600'>Type</span>
                      <span className='text-sm font-medium text-gray-900'>
                        {getCardTypeLabel(method.cardType || '')}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-gray-600'>Titulaire</span>
                      <span className='text-sm font-medium text-gray-900'>
                        {method.cardholderName}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-gray-600'>Expire le</span>
                      <span className='text-sm font-medium text-gray-900'>
                        {method.expiryMonth}/{method.expiryYear}
                      </span>
                    </div>
                  </>
                )}

                {method.type === 'mobile_money' && (
                  <>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-gray-600'>Fournisseur</span>
                      <span className='text-sm font-medium text-gray-900'>
                        {getProviderLabel(method.provider || '')}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-gray-600'>Numéro</span>
                      <span className='text-sm font-medium text-gray-900'>
                        {method.phoneNumber}
                      </span>
                    </div>
                  </>
                )}

                {method.type === 'bank_transfer' && (
                  <>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-gray-600'>Banque</span>
                      <span className='text-sm font-medium text-gray-900'>{method.bankName}</span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-gray-600'>Compte</span>
                      <span className='text-sm font-medium text-gray-900'>
                        {method.accountNumber}
                      </span>
                    </div>
                    <div className='flex items-center justify-between'>
                      <span className='text-sm text-gray-600'>Titulaire</span>
                      <span className='text-sm font-medium text-gray-900'>
                        {method.accountHolder}
                      </span>
                    </div>
                  </>
                )}

                {method.lastUsed && (
                  <div className='flex items-center justify-between'>
                    <span className='text-sm text-gray-600'>Dernière utilisation</span>
                    <span className='text-sm text-gray-500'>
                      {method.lastUsed.toLocaleDateString('fr-FR')}
                    </span>
                  </div>
                )}
              </div>

              {/* Badge par défaut */}
              {method.isDefault && (
                <div className='mb-4'>
                  <span className='inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800'>
                    <CheckCircle className='h-3 w-3 mr-1' />
                    Méthode par défaut
                  </span>
                </div>
              )}

              {/* Actions */}
              <div className='flex gap-2'>
                {!method.isDefault && (
                  <Button
                    variant='outline'
                    size='sm'
                    onClick={() => handleSetDefault(method.id)}
                    className='flex-1'
                  >
                    Définir par défaut
                  </Button>
                )}
                {method.type === 'card' && (
                  <button
                    onClick={() => setShowCardNumbers(!showCardNumbers)}
                    className='p-2 text-gray-400 hover:text-gray-600 transition-colors'
                    title={showCardNumbers ? 'Masquer' : 'Afficher'}
                  >
                    {showCardNumbers ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* État vide */}
        {paymentMethods.length === 0 && (
          <div className='text-center py-12'>
            <CreditCard className='mx-auto h-12 w-12 text-gray-400' />
            <h3 className='mt-2 text-sm font-medium text-gray-900'>Aucune méthode de paiement</h3>
            <p className='mt-1 text-sm text-gray-500'>
              Ajoutez votre première méthode de paiement pour faciliter vos achats.
            </p>
            <div className='mt-6'>
              <Button onClick={() => setIsAddModalOpen(true)}>Ajouter une méthode</Button>
            </div>
          </div>
        )}

        {/* Modal d'ajout/modification */}
        {(isAddModalOpen || isEditModalOpen) && (
          <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50'>
            <div className='bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto'>
              <div className='p-6'>
                <h2 className='text-xl font-semibold text-gray-900 mb-6'>
                  {isAddModalOpen
                    ? 'Ajouter une méthode de paiement'
                    : 'Modifier la méthode de paiement'}
                </h2>

                <div className='space-y-4'>
                  {/* Type de méthode */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Type de méthode *
                    </label>
                    <select
                      value={formData.type}
                      onChange={e =>
                        handleInputChange(
                          'type',
                          e.target.value as 'card' | 'mobile_money' | 'bank_transfer'
                        )
                      }
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      <option value='card'>Carte bancaire</option>
                      <option value='mobile_money'>Mobile Money</option>
                      <option value='bank_transfer'>Virement bancaire</option>
                    </select>
                  </div>

                  {/* Nom de la méthode */}
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Nom de la méthode *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={e => handleInputChange('name', e.target.value)}
                      placeholder='Ex: Carte principale, Moov Money, etc.'
                    />
                  </div>

                  {/* Champs spécifiques selon le type */}
                  {formData.type === 'card' && (
                    <>
                      {isAddModalOpen && (
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Numéro de carte *
                          </label>
                          <Input
                            value={formData.cardNumber}
                            onChange={e => handleInputChange('cardNumber', e.target.value)}
                            placeholder='1234 5678 9012 3456'
                            maxLength={19}
                          />
                        </div>
                      )}

                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Type de carte
                          </label>
                          <select
                            value={formData.cardType}
                            onChange={e =>
                              handleInputChange(
                                'cardType',
                                e.target.value as 'visa' | 'mastercard' | 'american_express'
                              )
                            }
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                          >
                            <option value='visa'>Visa</option>
                            <option value='mastercard'>Mastercard</option>
                            <option value='american_express'>American Express</option>
                          </select>
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Titulaire *
                          </label>
                          <Input
                            value={formData.cardholderName}
                            onChange={e => handleInputChange('cardholderName', e.target.value)}
                            placeholder='Nom du titulaire'
                          />
                        </div>
                      </div>

                      <div className='grid grid-cols-2 gap-4'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Mois d'expiration *
                          </label>
                          <select
                            value={formData.expiryMonth}
                            onChange={e => handleInputChange('expiryMonth', e.target.value)}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                          >
                            <option value=''>Mois</option>
                            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
                              <option key={month} value={month.toString().padStart(2, '0')}>
                                {month.toString().padStart(2, '0')}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Année d'expiration *
                          </label>
                          <select
                            value={formData.expiryYear}
                            onChange={e => handleInputChange('expiryYear', e.target.value)}
                            className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                          >
                            <option value=''>Année</option>
                            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() + i).map(
                              year => (
                                <option key={year} value={year.toString()}>
                                  {year}
                                </option>
                              )
                            )}
                          </select>
                        </div>
                      </div>
                    </>
                  )}

                  {formData.type === 'mobile_money' && (
                    <>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Fournisseur
                        </label>
                        <select
                          value={formData.provider}
                          onChange={e =>
                            handleInputChange(
                              'provider',
                              e.target.value as 'moov' | 'airtel' | 'libercom'
                            )
                          }
                          className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                        >
                          <option value='moov'>Moov Money</option>
                          <option value='airtel'>Airtel Money</option>
                          <option value='libercom'>Libercom</option>
                        </select>
                      </div>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Numéro de téléphone *
                        </label>
                        <Input
                          value={formData.phoneNumber}
                          onChange={e => handleInputChange('phoneNumber', e.target.value)}
                          placeholder='+241 01 23 45 67'
                        />
                      </div>
                    </>
                  )}

                  {formData.type === 'bank_transfer' && (
                    <>
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Nom de la banque *
                        </label>
                        <Input
                          value={formData.bankName}
                          onChange={e => handleInputChange('bankName', e.target.value)}
                          placeholder='Ex: BGF, BICIG, etc.'
                        />
                      </div>
                      {isAddModalOpen && (
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-2'>
                            Numéro de compte *
                          </label>
                          <Input
                            value={formData.accountNumber}
                            onChange={e => handleInputChange('accountNumber', e.target.value)}
                            placeholder='Numéro de compte'
                          />
                        </div>
                      )}
                      <div>
                        <label className='block text-sm font-medium text-gray-700 mb-2'>
                          Titulaire du compte *
                        </label>
                        <Input
                          value={formData.accountHolder}
                          onChange={e => handleInputChange('accountHolder', e.target.value)}
                          placeholder='Nom du titulaire'
                        />
                      </div>
                    </>
                  )}

                  {/* Option par défaut */}
                  <div className='pt-4'>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={formData.isDefault}
                        onChange={e => handleInputChange('isDefault', e.target.checked)}
                        className='rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                      />
                      <span className='ml-2 text-sm text-gray-700'>
                        Définir comme méthode de paiement par défaut
                      </span>
                    </label>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className='flex gap-3 mt-6'>
                  <Button
                    variant='outline'
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setIsEditModalOpen(false);
                      setSelectedMethod(null);
                      resetForm();
                    }}
                    className='flex-1'
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={isAddModalOpen ? handleAddPaymentMethod : handleEditPaymentMethod}
                    className='flex-1'
                  >
                    {isAddModalOpen ? 'Ajouter' : 'Modifier'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
