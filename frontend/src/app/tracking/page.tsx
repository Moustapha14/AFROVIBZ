'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  Search, 
  Package, 
  Truck, 
  CheckCircle, 
  Clock,
  ArrowLeft,
  MapPin,
  Phone,
  AlertCircle
} from 'lucide-react';

// Metadata défini dans layout parent ou via next/head

interface TrackingStatus {
  status: 'preparing' | 'shipped' | 'in_transit' | 'delivered';
  title: string;
  description: string;
  timestamp: string;
  location?: string;
}

interface Order {
  orderNumber: string;
  trackingNumber: string;
  status: 'preparing' | 'shipped' | 'in_transit' | 'delivered';
  estimatedDelivery: string;
  currentLocation: string;
  items: Array<{
    name: string;
    quantity: number;
    image?: string;
  }>;
  timeline: TrackingStatus[];
}

const mockOrder: Order = {
  orderNumber: 'CMD-2024-001',
  trackingNumber: 'AF24001789',
  status: 'in_transit',
  estimatedDelivery: '25 janvier 2024',
  currentLocation: 'Centre de tri Libreville',
  items: [
    { name: 'Robe Africaine Élégante', quantity: 1 },
    { name: 'Sac Hexagonal Noir', quantity: 1 }
  ],
  timeline: [
    {
      status: 'preparing',
      title: 'Commande confirmée',
      description: 'Votre commande a été confirmée et est en préparation',
      timestamp: '22 janvier 2024, 14:30',
      location: 'Entrepôt AFROVIBZ'
    },
    {
      status: 'shipped',
      title: 'Expédiée',
      description: 'Votre commande a été expédiée',
      timestamp: '23 janvier 2024, 09:15',
      location: 'Entrepôt AFROVIBZ'
    },
    {
      status: 'in_transit',
      title: 'En transit',
      description: 'Votre colis est en route vers sa destination',
      timestamp: '24 janvier 2024, 11:00',
      location: 'Centre de tri Libreville'
    }
  ]
};

export default function TrackingPage() {
  const [trackingInput, setTrackingInput] = useState('');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState('');

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingInput.trim()) return;

    setIsSearching(true);
    setError('');

    // Simulation d'une recherche API
    setTimeout(() => {
      if (trackingInput === 'AF24001789' || trackingInput === 'CMD-2024-001') {
        setSearchedOrder(mockOrder);
      } else {
        setError('Numéro de suivi introuvable. Vérifiez votre numéro.');
      }
      setIsSearching(false);
    }, 1500);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'preparing':
        return <Package className="h-5 w-5" />;
      case 'shipped':
      case 'in_transit':
        return <Truck className="h-5 w-5" />;
      case 'delivered':
        return <CheckCircle className="h-5 w-5" />;
      default:
        return <Clock className="h-5 w-5" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'preparing':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'shipped':
      case 'in_transit':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'delivered':
        return 'text-green-600 bg-green-50 border-green-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mobile-container py-6 sm:py-8 lg:py-12">
        {/* Breadcrumb */}
        <div className="mb-6">
          <Link 
            href="/" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 text-sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à l'accueil
          </Link>
        </div>

        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Suivi de Commande
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            Suivez votre commande en temps réel en entrant votre numéro de suivi
          </p>
        </div>

        {/* Search Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <form onSubmit={handleSearch} className="space-y-6">
              <div>
                <label htmlFor="tracking" className="block text-sm font-medium text-gray-700 mb-2">
                  Numéro de suivi ou numéro de commande
                </label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                  <Input
                    id="tracking"
                    type="text"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="Ex: AF24001789 ou CMD-2024-001"
                    className="pl-10 mobile-input"
                    required
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Le numéro de suivi vous a été envoyé par SMS et email
                </p>
              </div>

              {error && (
                <div className="flex items-start space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-red-700">{error}</span>
                </div>
              )}

              <Button
                type="submit"
                disabled={isSearching}
                className="w-full min-h-[44px] mobile-button"
              >
                {isSearching ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Recherche en cours...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Suivre ma commande
                  </>
                )}
              </Button>
            </form>

            {/* Démo hint */}
            <div className="mt-6 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-800">
                <strong>Démo :</strong> Essayez avec "AF24001789" ou "CMD-2024-001"
              </p>
            </div>
          </div>
        </div>

        {/* Tracking Results */}
        {searchedOrder && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Order Status Overview */}
            <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                    Statut de la commande
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Numéro de commande</p>
                      <p className="font-semibold text-gray-900">{searchedOrder.orderNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Numéro de suivi</p>
                      <p className="font-semibold text-gray-900">{searchedOrder.trackingNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Livraison estimée</p>
                      <p className="font-semibold text-gray-900">{searchedOrder.estimatedDelivery}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Position actuelle</p>
                      <div className="flex items-center space-x-2">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <p className="font-semibold text-gray-900">{searchedOrder.currentLocation}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Articles commandés
                  </h3>
                  <div className="space-y-3">
                    {searchedOrder.items.map((item, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Package className="h-6 w-6 text-gray-500" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900 text-sm sm:text-base">{item.name}</p>
                          <p className="text-sm text-gray-600">Quantité: {item.quantity}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
              <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
                Historique de livraison
              </h2>
              
              <div className="space-y-6">
                {searchedOrder.timeline.map((event, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 ${getStatusColor(event.status)}`}>
                      {getStatusIcon(event.status)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-sm sm:text-base">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-600 leading-relaxed">
                            {event.description}
                          </p>
                          {event.location && (
                            <div className="flex items-center space-x-1 mt-1">
                              <MapPin className="h-3 w-3 text-gray-400" />
                              <span className="text-xs text-gray-500">{event.location}</span>
                            </div>
                          )}
                        </div>
                        <div className="mt-2 sm:mt-0 sm:text-right">
                          <p className="text-xs sm:text-sm text-gray-500">
                            {event.timestamp}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Future step - delivery */}
                <div className="flex items-start space-x-4 opacity-50">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center border-2 border-gray-200 bg-gray-50">
                    <CheckCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-500 text-sm sm:text-base">
                      Livraison
                    </h3>
                    <p className="text-sm text-gray-400">
                      En attente - Livraison prévue le {searchedOrder.estimatedDelivery}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 sm:p-8">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">
                Besoin d'aide ?
              </h3>
              <p className="text-blue-800 text-sm sm:text-base mb-4">
                Si vous avez des questions sur votre livraison ou si vous ne recevez pas votre commande 
                à la date prévue, contactez-nous.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <Link 
                  href="/contact"
                  className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium min-h-[44px] w-full sm:w-auto justify-center touch-manipulation tap-highlight-none"
                >
                  Nous contacter
                </Link>
                
                <a 
                  href="tel:+24100000000"
                  className="inline-flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors font-medium"
                >
                  <Phone className="h-4 w-4" />
                  <span>+241 00 00 00 00</span>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Info sans commande */}
        {!searchedOrder && !error && (
          <div className="max-w-2xl mx-auto text-center">
            <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Où trouver votre numéro de suivi ?
              </h3>
              <ul className="text-left text-sm text-gray-600 space-y-2 mb-6">
                <li>• Dans l'email de confirmation d'expédition</li>
                <li>• Dans le SMS de notification d'expédition</li>
                <li>• Dans votre espace client, section "Mes commandes"</li>
                <li>• Sur votre facture (numéro de commande)</li>
              </ul>
              
              <Link 
                href="/client/orders"
                className="inline-flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium"
              >
                Voir mes commandes
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}