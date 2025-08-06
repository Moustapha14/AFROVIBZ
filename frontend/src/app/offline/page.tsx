'use client';

import { Wifi, WifiOff, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

import { Button } from '@/components/ui/Button';

export default function OfflinePage() {
  const [isOnline, setIsOnline] = React.useState(true);

  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Vérifier l'état initial
    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className='min-h-screen bg-gray-50 flex items-center justify-center px-4'>
      <div className='max-w-md w-full text-center'>
        <div className='bg-white rounded-lg shadow-lg p-8'>
          {/* Icône */}
          <div className='mb-6'>
            {isOnline ? (
              <Wifi className='h-16 w-16 text-green-500 mx-auto' />
            ) : (
              <WifiOff className='h-16 w-16 text-red-500 mx-auto' />
            )}
          </div>

          {/* Titre */}
          <h1 className='text-2xl font-bold text-gray-900 mb-4'>
            {isOnline ? 'Connexion Restaurée' : 'Mode Hors Ligne'}
          </h1>

          {/* Description */}
          <p className='text-gray-600 mb-6'>
            {isOnline
              ? 'Votre connexion internet a été restaurée. Vous pouvez maintenant naviguer normalement.'
              : 'Vous êtes actuellement hors ligne. Certaines fonctionnalités peuvent ne pas être disponibles.'}
          </p>

          {/* Actions */}
          <div className='space-y-3'>
            {!isOnline && (
              <Button
                onClick={handleRetry}
                variant='primary'
                fullWidth
                className='flex items-center justify-center space-x-2'
              >
                <RefreshCw className='h-4 w-4' />
                <span>Réessayer</span>
              </Button>
            )}

            <Link href='/'>
              <Button variant={isOnline ? 'primary' : 'outline'} fullWidth>
                Retour à l'accueil
              </Button>
            </Link>
          </div>

          {/* Informations supplémentaires */}
          <div className='mt-6 pt-6 border-t border-gray-200'>
            <h3 className='text-sm font-medium text-gray-900 mb-2'>
              Fonctionnalités disponibles hors ligne :
            </h3>
            <ul className='text-sm text-gray-600 space-y-1'>
              <li>• Navigation dans les pages visitées</li>
              <li>• Consultation des produits en cache</li>
              <li>• Panier d'achat local</li>
              <li>• Préférences utilisateur</li>
            </ul>
          </div>

          {/* Statut de la connexion */}
          <div className='mt-4 flex items-center justify-center space-x-2'>
            <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className='text-xs text-gray-500'>{isOnline ? 'Connecté' : 'Hors ligne'}</span>
          </div>
        </div>

        {/* Logo AFROVIBZ */}
        <div className='mt-8'>
          <p className='text-sm text-gray-500'>AFRO🗼VIBZ - Mode Africaine Moderne & Tech</p>
        </div>
      </div>
    </div>
  );
}
