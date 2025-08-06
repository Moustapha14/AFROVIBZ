import {
  Truck,
  Clock,
  MapPin,
  Package,
  Shield,
  Phone,
  AlertCircle,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: 'Livraison | AFRO🗼VIBZ',
  description:
    'Informations sur nos options de livraison au Gabon. Livraison gratuite dès 50,000 FCFA.',
};

export default function ShippingPage() {
  const shippingZones = [
    {
      name: 'Libreville Centre',
      price: 'Gratuit dès 50,000 FCFA',
      normalPrice: '2,000 FCFA',
      time: '24-48h',
      areas: ['Akanda', 'Glass', 'Batterie IV', 'Nombakélé', 'Lalala'],
    },
    {
      name: 'Grande Libreville',
      price: 'Gratuit dès 50,000 FCFA',
      normalPrice: '3,000 FCFA',
      time: '2-3 jours',
      areas: ['Owendo', 'Nzeng-Ayong', 'PK5', 'PK8', 'Kinguélé'],
    },
    {
      name: 'Gabon National',
      price: 'Gratuit dès 75,000 FCFA',
      normalPrice: '5,000-15,000 FCFA',
      time: '3-7 jours',
      areas: ['Port-Gentil', 'Franceville', 'Oyem', 'Mouila', 'Lambaréné'],
    },
  ];

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='mobile-container py-6 sm:py-8 lg:py-12'>
        {/* Breadcrumb */}
        <div className='mb-6'>
          <Link
            href='/'
            className='inline-flex items-center text-gray-600 hover:text-gray-900 text-sm'
          >
            <ArrowLeft className='h-4 w-4 mr-2' />
            Retour à l'accueil
          </Link>
        </div>

        {/* Header */}
        <div className='text-center mb-8 sm:mb-12'>
          <h1 className='text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4'>
            Informations de Livraison
          </h1>
          <p className='text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed'>
            Découvrez nos options de livraison rapide et sécurisée partout au Gabon
          </p>
        </div>

        {/* Livraison gratuite highlight */}
        <div className='bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 mb-8'>
          <div className='flex items-start space-x-3'>
            <Truck className='h-6 w-6 text-green-600 flex-shrink-0 mt-1' />
            <div>
              <h3 className='text-lg sm:text-xl font-semibold text-green-900 mb-2'>
                Livraison Gratuite !
              </h3>
              <p className='text-green-800 text-sm sm:text-base'>
                Profitez de la livraison gratuite dès <strong>50,000 FCFA</strong> dans Libreville
                et dès <strong>75,000 FCFA</strong> dans tout le Gabon.
              </p>
            </div>
          </div>
        </div>

        {/* Zones de livraison */}
        <div className='mb-12'>
          <h2 className='text-xl sm:text-2xl font-bold text-gray-900 mb-6'>Zones de Livraison</h2>

          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {shippingZones.map((zone, index) => (
              <div key={index} className='bg-white rounded-lg shadow-sm p-6 border border-gray-200'>
                <div className='flex items-center space-x-3 mb-4'>
                  <MapPin className='h-5 w-5 text-black' />
                  <h3 className='text-lg font-semibold text-gray-900'>{zone.name}</h3>
                </div>

                <div className='space-y-3'>
                  <div>
                    <p className='text-sm text-gray-600'>Prix normal</p>
                    <p className='font-medium text-gray-900'>{zone.normalPrice}</p>
                  </div>

                  <div>
                    <p className='text-sm text-gray-600'>Livraison gratuite</p>
                    <p className='font-medium text-green-600'>{zone.price}</p>
                  </div>

                  <div className='flex items-center space-x-2'>
                    <Clock className='h-4 w-4 text-gray-500' />
                    <span className='text-sm text-gray-600'>Délai: {zone.time}</span>
                  </div>

                  <div>
                    <p className='text-xs text-gray-500 font-medium mb-2'>Quartiers inclus:</p>
                    <div className='flex flex-wrap gap-1'>
                      {zone.areas.map((area, areaIndex) => (
                        <span
                          key={areaIndex}
                          className='inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded'
                        >
                          {area}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Process de livraison */}
        <div className='mb-12'>
          <h2 className='text-xl sm:text-2xl font-bold text-gray-900 mb-6'>Comment ça marche ?</h2>

          <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6'>
            <div className='text-center'>
              <div className='bg-black text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='font-bold'>1</span>
              </div>
              <h3 className='font-semibold text-gray-900 mb-2'>Commande</h3>
              <p className='text-sm text-gray-600'>Finalisez votre commande en ligne</p>
            </div>

            <div className='text-center'>
              <div className='bg-black text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='font-bold'>2</span>
              </div>
              <h3 className='font-semibold text-gray-900 mb-2'>Préparation</h3>
              <p className='text-sm text-gray-600'>Nous préparons soigneusement votre colis</p>
            </div>

            <div className='text-center'>
              <div className='bg-black text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4'>
                <span className='font-bold'>3</span>
              </div>
              <h3 className='font-semibold text-gray-900 mb-2'>Expédition</h3>
              <p className='text-sm text-gray-600'>Votre commande est en route</p>
            </div>

            <div className='text-center'>
              <div className='bg-green-500 text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4'>
                <CheckCircle className='h-6 w-6' />
              </div>
              <h3 className='font-semibold text-gray-900 mb-2'>Réception</h3>
              <p className='text-sm text-gray-600'>Recevez votre commande</p>
            </div>
          </div>
        </div>

        {/* Informations importantes */}
        <div className='grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12'>
          <div className='bg-white rounded-lg shadow-sm p-6'>
            <div className='flex items-center space-x-3 mb-4'>
              <Package className='h-6 w-6 text-black' />
              <h3 className='text-lg font-semibold text-gray-900'>Emballage Sécurisé</h3>
            </div>
            <ul className='space-y-2 text-sm text-gray-600'>
              <li className='flex items-start space-x-2'>
                <CheckCircle className='h-4 w-4 text-green-500 flex-shrink-0 mt-0.5' />
                <span>Emballage résistant et recyclable</span>
              </li>
              <li className='flex items-start space-x-2'>
                <CheckCircle className='h-4 w-4 text-green-500 flex-shrink-0 mt-0.5' />
                <span>Protection optimale des produits fragiles</span>
              </li>
              <li className='flex items-start space-x-2'>
                <CheckCircle className='h-4 w-4 text-green-500 flex-shrink-0 mt-0.5' />
                <span>Étiquetage discret</span>
              </li>
            </ul>
          </div>

          <div className='bg-white rounded-lg shadow-sm p-6'>
            <div className='flex items-center space-x-3 mb-4'>
              <Shield className='h-6 w-6 text-black' />
              <h3 className='text-lg font-semibold text-gray-900'>Suivi & Sécurité</h3>
            </div>
            <ul className='space-y-2 text-sm text-gray-600'>
              <li className='flex items-start space-x-2'>
                <CheckCircle className='h-4 w-4 text-green-500 flex-shrink-0 mt-0.5' />
                <span>Numéro de suivi SMS automatique</span>
              </li>
              <li className='flex items-start space-x-2'>
                <CheckCircle className='h-4 w-4 text-green-500 flex-shrink-0 mt-0.5' />
                <span>Assurance colis incluse</span>
              </li>
              <li className='flex items-start space-x-2'>
                <CheckCircle className='h-4 w-4 text-green-500 flex-shrink-0 mt-0.5' />
                <span>Support client 6j/7</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Conditions spéciales */}
        <div className='bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6'>
          <div className='flex items-start space-x-3'>
            <AlertCircle className='h-6 w-6 text-yellow-600 flex-shrink-0 mt-1' />
            <div>
              <h3 className='text-lg font-semibold text-yellow-900 mb-3'>Conditions Spéciales</h3>
              <div className='space-y-2 text-sm text-yellow-800'>
                <p>
                  • <strong>Délais prolongés:</strong> +1-2 jours pendant les fêtes et périodes de
                  forte demande
                </p>
                <p>
                  • <strong>Zones reculées:</strong> Certaines zones peuvent nécessiter un délai
                  supplémentaire
                </p>
                <p>
                  • <strong>Produits volumineux:</strong> Les produits tech lourds peuvent
                  nécessiter une livraison spécialisée
                </p>
                <p>
                  • <strong>Météo:</strong> Les conditions météorologiques peuvent affecter les
                  délais
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact livraison */}
        <div className='text-center mt-12'>
          <h3 className='text-lg font-semibold text-gray-900 mb-4'>
            Questions sur votre livraison ?
          </h3>
          <div className='flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6'>
            <a
              href='tel:+24100000000'
              className='inline-flex items-center space-x-2 text-black hover:text-gray-700 transition-colors'
            >
              <Phone className='h-4 w-4' />
              <span className='font-medium'>+241 00 00 00 00</span>
            </a>
            <Link
              href='/contact'
              className='inline-flex items-center space-x-2 bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium'
            >
              Nous contacter
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
