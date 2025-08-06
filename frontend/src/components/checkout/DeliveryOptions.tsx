'use client';

import { Truck, Store, Clock, MapPin, Building2 } from 'lucide-react';
import React from 'react';

import { formatPrice } from '@/lib/utils';

export interface DeliveryOption {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  icon: React.ReactNode;
}

interface DeliveryOptionsProps {
  selectedOption: string;
  onSelectOption: (optionId: string) => void;
}

const deliveryOptions: DeliveryOption[] = [
  {
    id: 'standard',
    name: 'Livraison Standard',
    description: 'Livraison à domicile en 3-5 jours ouvrables',
    price: 2000,
    estimatedDays: '3-5 jours',
    icon: <Truck className='h-5 w-5' />,
  },
  {
    id: 'express',
    name: 'Livraison Express',
    description: 'Livraison rapide en 1-2 jours ouvrables',
    price: 5000,
    estimatedDays: '1-2 jours',
    icon: <Clock className='h-5 w-5' />,
  },
  {
    id: 'pickup',
    name: 'Point Relais',
    description: 'Retrait dans un point relais partenaire',
    price: 1000,
    estimatedDays: '2-3 jours',
    icon: <Store className='h-5 w-5' />,
  },
  {
    id: 'same-day',
    name: 'Livraison le Même Jour',
    description: 'Livraison le jour même (Libreville uniquement)',
    price: 8000,
    estimatedDays: 'Le jour même',
    icon: <MapPin className='h-5 w-5' />,
  },
  {
    id: 'self-pickup',
    name: 'Récupération en Mains Propres',
    description: 'Retrait directement dans nos locaux à Libreville',
    price: 0,
    estimatedDays: 'Immédiat',
    icon: <Building2 className='h-5 w-5' />,
  },
];

export function DeliveryOptions({ selectedOption, onSelectOption }: DeliveryOptionsProps) {
  return (
    <div className='space-y-3 sm:space-y-4'>
      <h3 className='text-base sm:text-lg font-semibold text-gray-900'>Mode de livraison</h3>

      <div className='space-y-2 sm:space-y-3'>
        {deliveryOptions.map(option => (
          <div
            key={option.id}
            className={`border rounded-lg p-3 sm:p-4 cursor-pointer transition-all touch-manipulation ${
              selectedOption === option.id
                ? 'border-black bg-gray-50'
                : 'border-gray-200 hover:border-gray-300 active:border-gray-400'
            }`}
            onClick={() => onSelectOption(option.id)}
          >
            <div className='flex items-start justify-between'>
              <div className='flex items-start space-x-2 sm:space-x-3 flex-1 min-w-0'>
                <div
                  className={`p-1.5 sm:p-2 rounded-full flex-shrink-0 ${
                    selectedOption === option.id
                      ? 'bg-black text-white'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {React.cloneElement(option.icon as React.ReactElement, { className: 'h-4 w-4 sm:h-5 sm:w-5' })}
                </div>
                <div className='flex-1 min-w-0'>
                  <div className='flex flex-col sm:flex-row sm:items-center sm:space-x-2'>
                    <h4 className='text-sm sm:text-base font-medium text-gray-900 truncate'>{option.name}</h4>
                    <span className='text-xs sm:text-sm text-gray-500 mt-0.5 sm:mt-0'>({option.estimatedDays})</span>
                  </div>
                  <p className='text-xs sm:text-sm text-gray-600 mt-1 pr-2'>{option.description}</p>
                </div>
              </div>
              <div className='text-right flex-shrink-0 ml-2'>
                <span className='text-sm sm:text-base font-semibold text-gray-900'>
                  {option.price === 0 ? 'Gratuit' : formatPrice(option.price)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Free shipping notice */}
      <div className='bg-green-50 border border-green-200 rounded-lg p-3'>
        <p className='text-xs sm:text-sm text-green-800'>
          <strong>Livraison gratuite</strong> pour toute commande supérieure à 50,000 FCFA
        </p>
      </div>
    </div>
  );
}
