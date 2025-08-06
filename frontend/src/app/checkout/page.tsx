'use client';

import {
  CreditCard,
  Truck,
  CheckCircle,
  MapPin,
  Phone,
  Mail,
  User,
  Lock,
  ArrowLeft,
  Shield,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import toast from 'react-hot-toast';

import { DeliveryOptions, DeliveryOption } from '@/components/checkout/DeliveryOptions';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCart } from '@/lib/hooks/useCart';
import { formatPrice } from '@/lib/utils';

interface CheckoutStep {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  completed: boolean;
}

interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface PaymentMethod {
  type: 'card' | 'mobile_money' | 'bank_transfer';
  name: string;
  description: string;
  icon: React.ReactNode;
}

const paymentMethods: PaymentMethod[] = [
  {
    type: 'card',
    name: 'Carte bancaire',
    description: 'Visa, Mastercard, American Express',
    icon: <CreditCard className='h-5 w-5' />,
  },
  {
    type: 'mobile_money',
    name: 'Mobile Money',
    description: 'Airtel Money, Moov Money',
    icon: <Phone className='h-5 w-5' />,
  },
  {
    type: 'bank_transfer',
    name: 'Virement bancaire',
    description: 'Transfert direct vers notre compte',
    icon: <Shield className='h-5 w-5' />,
  },
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<PaymentMethod | null>(null);
  const [selectedDeliveryOption, setSelectedDeliveryOption] = useState<string>('standard');

  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Gabon',
  });

  const steps: CheckoutStep[] = [
    {
      id: 'shipping',
      title: 'Livraison',
      description: 'Adresse et mode de livraison',
      icon: <Truck className='h-5 w-5' />,
      completed: currentStep > 1,
    },
    {
      id: 'payment',
      title: 'Paiement',
      description: 'Méthode de paiement',
      icon: <CreditCard className='h-5 w-5' />,
      completed: currentStep > 2,
    },
    {
      id: 'confirmation',
      title: 'Confirmation',
      description: 'Récapitulatif',
      icon: <CheckCircle className='h-5 w-5' />,
      completed: currentStep > 3,
    },
  ];

  // Calculer les frais de livraison basés sur l'option sélectionnée
  const getDeliveryCost = () => {
    const deliveryOptions = {
      standard: 2000,
      express: 5000,
      pickup: 1000,
      'same-day': 8000,
      'self-pickup': 0,
    };
    return deliveryOptions[selectedDeliveryOption as keyof typeof deliveryOptions] || 2000;
  };

  const deliveryCost = getCartTotal() >= 50000 ? 0 : getDeliveryCost();
  const total = getCartTotal() + deliveryCost;

  const handleAddressSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Validation basique
    if (
      !shippingAddress.firstName ||
      !shippingAddress.lastName ||
      !shippingAddress.email ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city
    ) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }
    setCurrentStep(2);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaymentMethod) {
      toast.error('Veuillez sélectionner une méthode de paiement');
      return;
    }
    setCurrentStep(3);
  };

  const handleOrderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      // TODO: Implement order submission to backend
      await new Promise(resolve => setTimeout(resolve, 2000)); // Simulate API call

      toast.success('Commande passée avec succès !');
      clearCart();
      router.push('/orders');
    } catch (error) {
      toast.error('Erreur lors de la commande');
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
        <div className='text-center max-w-sm mx-auto'>
          <h2 className='text-xl sm:text-2xl font-bold text-gray-900 mb-2'>Votre panier est vide</h2>
          <p className='text-gray-600 mb-6 text-sm sm:text-base'>Ajoutez des produits à votre panier pour continuer</p>
          <Button onClick={() => router.push('/products')} className='w-full sm:w-auto'>Continuer les Achats</Button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen min-h-screen-mobile bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8'>
        {/* Header */}
        <div className='mb-4 sm:mb-8'>
          <div className='hidden sm:block'>
            <Breadcrumbs
              items={[
                { label: 'Panier', href: '/cart' },
                { label: 'Checkout', current: true },
              ]}
            />
          </div>
          <h1 className='text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mt-2 sm:mt-4'>Finaliser la commande</h1>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8'>
          {/* Main Content */}
          <div className='lg:col-span-2 order-2 lg:order-1'>
            <div className='bg-white rounded-lg shadow-sm'>
              {/* Progress Steps */}
              <div className='p-3 sm:p-6 border-b border-gray-200'>
                {/* Mobile Progress Steps - Vertical Layout */}
                <div className='sm:hidden'>
                  <div className='flex flex-col space-y-3'>
                    {steps.map((step, index) => (
                      <div key={step.id} className='flex items-center space-x-3'>
                        <div
                          className={`flex items-center justify-center w-8 h-8 rounded-full border-2 flex-shrink-0 ${
                            step.completed || currentStep === index + 1
                              ? 'border-black bg-black text-white'
                              : 'border-gray-300 text-gray-400'
                          }`}
                        >
                          {step.completed ? <CheckCircle className='h-4 w-4' /> : React.cloneElement(step.icon as React.ReactElement, { className: 'h-4 w-4' })}
                        </div>
                        <div className='flex-1 min-w-0'>
                          <p
                            className={`text-sm font-medium ${
                              currentStep === index + 1 ? 'text-black' : 'text-gray-500'
                            }`}
                          >
                            {step.title}
                          </p>
                          <p className='text-xs text-gray-400 truncate'>{step.description}</p>
                        </div>
                        {currentStep === index + 1 && (
                          <div className='w-2 h-2 bg-black rounded-full flex-shrink-0'></div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Desktop Progress Steps - Horizontal Layout */}
                <div className='hidden sm:flex items-center justify-between'>
                  {steps.map((step, index) => (
                    <div key={step.id} className='flex items-center'>
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                          step.completed || currentStep === index + 1
                            ? 'border-black bg-black text-white'
                            : 'border-gray-300 text-gray-400'
                        }`}
                      >
                        {step.completed ? <CheckCircle className='h-5 w-5' /> : step.icon}
                      </div>
                      <div className='ml-3'>
                        <p
                          className={`text-sm font-medium ${
                            currentStep === index + 1 ? 'text-black' : 'text-gray-500'
                          }`}
                        >
                          {step.title}
                        </p>
                        <p className='text-xs text-gray-400'>{step.description}</p>
                      </div>
                      {index < steps.length - 1 && (
                        <div
                          className={`w-16 h-0.5 mx-4 ${
                            step.completed ? 'bg-black' : 'bg-gray-300'
                          }`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <div className='p-3 sm:p-6'>
                {currentStep === 1 && (
                  <form onSubmit={handleAddressSubmit} className='space-y-6'>
                    <div>
                      <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                        Adresse de livraison
                      </h2>

                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Prénom *
                          </label>
                          <Input
                            value={shippingAddress.firstName}
                            onChange={e =>
                              setShippingAddress({
                                ...shippingAddress,
                                firstName: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Nom *
                          </label>
                          <Input
                            value={shippingAddress.lastName}
                            onChange={e =>
                              setShippingAddress({
                                ...shippingAddress,
                                lastName: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                      </div>

                      <div className='mt-4'>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Email *
                        </label>
                        <Input
                          type='email'
                          value={shippingAddress.email}
                          onChange={e =>
                            setShippingAddress({
                              ...shippingAddress,
                              email: e.target.value,
                            })
                          }
                          required
                        />
                      </div>

                      <div className='mt-4'>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Téléphone *
                        </label>
                        <Input
                          type='tel'
                          value={shippingAddress.phone}
                          onChange={e =>
                            setShippingAddress({
                              ...shippingAddress,
                              phone: e.target.value,
                            })
                          }
                          placeholder='+241 XX XX XX XX'
                          required
                        />
                      </div>

                      <div className='mt-4'>
                        <label className='block text-sm font-medium text-gray-700 mb-1'>
                          Adresse *
                        </label>
                        <Input
                          value={shippingAddress.address}
                          onChange={e =>
                            setShippingAddress({
                              ...shippingAddress,
                              address: e.target.value,
                            })
                          }
                          placeholder='Rue, quartier'
                          required
                        />
                      </div>

                      <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mt-4'>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Ville *
                          </label>
                          <Input
                            value={shippingAddress.city}
                            onChange={e =>
                              setShippingAddress({
                                ...shippingAddress,
                                city: e.target.value,
                              })
                            }
                            required
                          />
                        </div>
                        <div>
                          <label className='block text-sm font-medium text-gray-700 mb-1'>
                            Code postal
                          </label>
                          <Input
                            value={shippingAddress.postalCode}
                            onChange={e =>
                              setShippingAddress({
                                ...shippingAddress,
                                postalCode: e.target.value,
                              })
                            }
                          />
                        </div>
                      </div>
                    </div>

                    {/* Mode de livraison */}
                    <div className='mt-8'>
                      <DeliveryOptions
                        selectedOption={selectedDeliveryOption}
                        onSelectOption={setSelectedDeliveryOption}
                      />
                    </div>

                    <div className='flex justify-end pt-4'>
                      <Button type='submit' size='lg' className='w-full sm:w-auto'>
                        Continuer vers le paiement
                      </Button>
                    </div>
                  </form>
                )}

                {currentStep === 2 && (
                  <form onSubmit={handlePaymentSubmit} className='space-y-6'>
                    <div>
                      <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                        Méthode de paiement
                      </h2>

                      <div className='space-y-2 sm:space-y-3'>
                        {paymentMethods.map(method => (
                          <div
                            key={method.type}
                            className={`border-2 rounded-lg p-3 sm:p-4 cursor-pointer transition-colors touch-manipulation ${
                              selectedPaymentMethod?.type === method.type
                                ? 'border-black bg-gray-50'
                                : 'border-gray-200 hover:border-gray-300 active:border-gray-400'
                            }`}
                            onClick={() => setSelectedPaymentMethod(method)}
                          >
                            <div className='flex items-center space-x-2 sm:space-x-3'>
                              <div
                                className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${
                                  selectedPaymentMethod?.type === method.type
                                    ? 'bg-black text-white'
                                    : 'bg-gray-100 text-gray-600'
                                }`}
                              >
                                {React.cloneElement(method.icon as React.ReactElement, { className: 'h-4 w-4 sm:h-5 sm:w-5' })}
                              </div>
                              <div className='flex-1 min-w-0'>
                                <h3 className='text-sm sm:text-base font-medium text-gray-900'>{method.name}</h3>
                                <p className='text-xs sm:text-sm text-gray-500 truncate pr-2'>{method.description}</p>
                              </div>
                              <div
                                className={`w-5 h-5 rounded-full border-2 ${
                                  selectedPaymentMethod?.type === method.type
                                    ? 'border-black bg-black'
                                    : 'border-gray-300'
                                }`}
                              >
                                {selectedPaymentMethod?.type === method.type && (
                                  <div className='w-2 h-2 bg-white rounded-full m-0.5' />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className='flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-4'>
                      <Button type='button' variant='outline' onClick={() => setCurrentStep(1)} className='w-full sm:w-auto order-2 sm:order-1'>
                        <ArrowLeft className='h-4 w-4 mr-2' />
                        Retour
                      </Button>
                      <Button type='submit' size='lg' className='w-full sm:w-auto order-1 sm:order-2'>
                        Continuer vers la confirmation
                      </Button>
                    </div>
                  </form>
                )}

                {currentStep === 3 && (
                  <form onSubmit={handleOrderSubmit} className='space-y-6'>
                    <div>
                      <h2 className='text-xl font-semibold text-gray-900 mb-4'>
                        Récapitulatif de la commande
                      </h2>

                      <div className='bg-gray-50 rounded-lg p-3 sm:p-4 space-y-3 sm:space-y-4'>
                        <div>
                          <h3 className='text-sm sm:text-base font-medium text-gray-900 mb-2'>Adresse de livraison</h3>
                          <div className='text-xs sm:text-sm text-gray-600 space-y-1'>
                            <p>
                              {shippingAddress.firstName} {shippingAddress.lastName}
                            </p>
                            <p className='break-words'>{shippingAddress.address}</p>
                            <p>
                              {shippingAddress.city}{shippingAddress.postalCode && `, ${shippingAddress.postalCode}`}
                            </p>
                            <p>{shippingAddress.country}</p>
                            <p className='break-all'>{shippingAddress.phone}</p>
                            <p className='break-all'>{shippingAddress.email}</p>
                          </div>
                        </div>

                        <div>
                          <h3 className='text-sm sm:text-base font-medium text-gray-900 mb-2'>Mode de livraison</h3>
                          <div className='text-xs sm:text-sm text-gray-600 space-y-1'>
                            <p>
                              Livraison{' '}
                              {selectedDeliveryOption === 'standard'
                                ? 'Standard'
                                : selectedDeliveryOption === 'express'
                                  ? 'Express'
                                  : selectedDeliveryOption === 'pickup'
                                    ? 'Point Relais'
                                    : selectedDeliveryOption === 'same-day'
                                      ? 'Même Jour'
                                      : 'Récupération en Mains Propres'}
                            </p>
                            <p>
                              Délai estimé:{' '}
                              {selectedDeliveryOption === 'standard'
                                ? '3-5 jours'
                                : selectedDeliveryOption === 'express'
                                  ? '1-2 jours'
                                  : selectedDeliveryOption === 'pickup'
                                    ? '2-3 jours'
                                    : selectedDeliveryOption === 'same-day'
                                      ? 'Le jour même'
                                      : 'Immédiat'}
                            </p>
                            <p>
                              Frais: {deliveryCost === 0 ? 'Gratuits' : formatPrice(deliveryCost)}
                            </p>
                          </div>
                        </div>

                        <div>
                          <h3 className='text-sm sm:text-base font-medium text-gray-900 mb-2'>Méthode de paiement</h3>
                          <div className='flex items-center space-x-2 text-xs sm:text-sm text-gray-600'>
                            {selectedPaymentMethod?.icon && React.cloneElement(selectedPaymentMethod.icon as React.ReactElement, { className: 'h-4 w-4' })}
                            <span className='truncate'>{selectedPaymentMethod?.name}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className='flex flex-col sm:flex-row justify-between gap-3 sm:gap-0 pt-4'>
                      <Button type='button' variant='outline' onClick={() => setCurrentStep(2)} className='w-full sm:w-auto order-2 sm:order-1'>
                        <ArrowLeft className='h-4 w-4 mr-2' />
                        Retour
                      </Button>
                      <Button
                        type='submit'
                        size='lg'
                        loading={isProcessing}
                        disabled={isProcessing}
                        className='w-full sm:w-auto order-1 sm:order-2'
                      >
                        Confirmer la commande
                      </Button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1 order-1 lg:order-2'>
            <div className='bg-white rounded-lg shadow-sm p-4 sm:p-6 lg:sticky lg:top-8'>
              <h2 className='text-base sm:text-lg font-semibold text-gray-900 mb-4'>Résumé de la commande</h2>

              <div className='space-y-3 sm:space-y-4'>
                {cart.map(item => (
                  <div key={item.id} className='flex items-center space-x-3'>
                    <div className='w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex-shrink-0'>
                      <div className='w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center'>
                        <span className='text-xs text-gray-500'>Img</span>
                      </div>
                    </div>
                    <div className='flex-1 min-w-0'>
                      <h3 className='text-xs sm:text-sm font-medium text-gray-900 truncate'>
                        {item.product.name}
                      </h3>
                      <p className='text-xs text-gray-500 truncate'>
                        Taille: {item.selectedSize} | Couleur: {item.selectedColor}
                      </p>
                      <p className='text-xs text-gray-500'>Quantité: {item.quantity}</p>
                    </div>
                    <div className='text-xs sm:text-sm font-medium text-gray-900 text-right'>
                      {formatPrice(item.price * item.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className='border-t border-gray-200 mt-4 sm:mt-6 pt-4 sm:pt-6 space-y-2 sm:space-y-3'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Sous-total</span>
                  <span className='font-medium'>{formatPrice(getCartTotal())}</span>
                </div>

                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Livraison</span>
                  <span className='font-medium'>
                    {deliveryCost === 0 ? (
                      <span className='text-green-600'>Gratuite</span>
                    ) : (
                      formatPrice(deliveryCost)
                    )}
                  </span>
                </div>

                <div className='border-t border-gray-200 pt-3'>
                  <div className='flex justify-between text-base sm:text-lg font-bold'>
                    <span>Total</span>
                    <span>{formatPrice(total)}</span>
                  </div>
                </div>
              </div>

              <div className='mt-4 sm:mt-6 bg-green-50 rounded-lg p-3 sm:p-4'>
                <div className='flex items-start space-x-2'>
                  <Shield className='h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0 mt-0.5' />
                  <div>
                    <p className='text-sm font-medium text-green-900'>Paiement sécurisé</p>
                    <p className='text-xs sm:text-sm text-green-700'>
                      Vos données sont protégées par un cryptage SSL
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
