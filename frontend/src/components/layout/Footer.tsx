import {
  Facebook,
  Twitter,
  Instagram,
  Mail,
  Phone,
  MapPin,
  Heart,
  Package,
  Users,
  HelpCircle,
  Shield,
} from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export function Footer() {
  return (
    <footer className='bg-gray-900 text-white safe-area-bottom'>
      <div className='mobile-container py-8 sm:py-12 lg:py-16'>
        <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-12 lg:gap-16'>
          {/* Company Info - Mobile First */}
          <div className='sm:col-span-2 lg:col-span-1'>
            <div className='flex items-center space-x-3 mb-4 sm:mb-6'>
              <div className='h-8 w-8 sm:h-10 sm:w-10 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-black font-bold text-sm sm:text-base'>
                AV
              </div>
              <span className='font-bold text-lg sm:text-xl lg:text-2xl'>AFRO🗼VIBZ</span>
            </div>
            <p className='text-gray-300 text-sm sm:text-base mb-4 sm:mb-6 text-balance leading-relaxed'>
              Votre destination pour la mode africaine au Gabon. Découvrez nos collections uniques
              et authentiques avec livraison rapide partout au pays.
            </p>
            <div className='flex space-x-4'>
              <a
                href='#'
                className='text-gray-400 hover:text-white transition-colors p-2 action-button'
                aria-label='Facebook'
              >
                <Facebook className='h-5 w-5 sm:h-6 sm:w-6' />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-white transition-colors p-2 action-button'
                aria-label='Twitter'
              >
                <Twitter className='h-5 w-5 sm:h-6 sm:w-6' />
              </a>
              <a
                href='#'
                className='text-gray-400 hover:text-white transition-colors p-2 action-button'
                aria-label='Instagram'
              >
                <Instagram className='h-5 w-5 sm:h-6 sm:w-6' />
              </a>
            </div>
          </div>

          {/* Quick Links - Mobile First */}
          <div>
            <h3 className='text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center'>
              <Package className='h-5 w-5 mr-2' />
              Liens Rapides
            </h3>
            <ul className='space-y-2 sm:space-y-3'>
              <li>
                <Link
                  href='/products'
                  className='text-gray-300 hover:text-white transition-colors text-sm sm:text-base block py-1'
                >
                  Tous les Produits
                </Link>
              </li>
              <li>
                <Link
                  href='/products?category=femmes'
                  className='text-gray-300 hover:text-white transition-colors text-sm sm:text-base block py-1'
                >
                  Mode Femme
                </Link>
              </li>
              <li>
                <Link
                  href='/products?category=hommes'
                  className='text-gray-300 hover:text-white transition-colors text-sm sm:text-base block py-1'
                >
                  Mode Homme
                </Link>
              </li>
              <li>
                <Link
                  href='/products?category=enfants'
                  className='text-gray-300 hover:text-white transition-colors text-sm sm:text-base block py-1'
                >
                  Mode Enfant
                </Link>
              </li>
              <li>
                <Link
                  href='/products?category=accessoires'
                  className='text-gray-300 hover:text-white transition-colors text-sm sm:text-base block py-1'
                >
                  Accessoires
                </Link>
              </li>
              <li>
                <Link
                  href='/products?category=tech'
                  className='text-gray-300 hover:text-white transition-colors text-sm sm:text-base block py-1'
                >
                  Tech & Électronique
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service - Mobile First */}
          <div>
            <h3 className='text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center'>
              <HelpCircle className='h-5 w-5 mr-2' />
              Service Client
            </h3>
            <ul className='space-y-2 sm:space-y-3'>
              <li>
                <Link
                  href='/contact'
                  className='text-gray-300 hover:text-white transition-colors text-sm sm:text-base block py-1'
                >
                  Contactez-nous
                </Link>
              </li>
              <li>
                <Link
                  href='/shipping'
                  className='text-gray-300 hover:text-white transition-colors text-sm sm:text-base block py-1'
                >
                  Livraison
                </Link>
              </li>

              <li>
                <Link
                  href='/faq'
                  className='text-gray-300 hover:text-white transition-colors text-sm sm:text-base block py-1'
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href='/size-guide'
                  className='text-gray-300 hover:text-white transition-colors text-sm sm:text-base block py-1'
                >
                  Guide des Tailles
                </Link>
              </li>
              <li>
                <Link
                  href='/tracking'
                  className='text-gray-300 hover:text-white transition-colors text-sm sm:text-base block py-1'
                >
                  Suivi de Commande
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info - Mobile First */}
          <div>
            <h3 className='text-lg sm:text-xl font-semibold mb-4 sm:mb-6 flex items-center'>
              <Users className='h-5 w-5 mr-2' />
              Contact
            </h3>
            <div className='space-y-3 sm:space-y-4'>
              <div className='flex items-start space-x-3'>
                <MapPin className='h-5 w-5 text-gray-400 flex-shrink-0 mt-1' />
                <div>
                  <p className='text-gray-300 text-sm sm:text-base leading-relaxed'>
                    Libreville, Gabon
                    <br />
                    Quartier Akanda
                    <br />
                    <span className='text-gray-400 text-xs sm:text-sm'>Zone Industrielle</span>
                  </p>
                </div>
              </div>
              <div className='flex items-center space-x-3'>
                <Phone className='h-5 w-5 text-gray-400 flex-shrink-0' />
                <a
                  href='tel:+24100000000'
                  className='text-gray-300 hover:text-white transition-colors text-sm sm:text-base'
                >
                  +241 00 00 00 00
                </a>
              </div>
              <div className='flex items-center space-x-3'>
                <Mail className='h-5 w-5 text-gray-400 flex-shrink-0' />
                <a
                  href='mailto:contact@afrovibz.ga'
                  className='text-gray-300 hover:text-white transition-colors text-sm sm:text-base break-all'
                >
                  contact@afrovibz.ga
                </a>
              </div>
              <div className='pt-2'>
                <p className='text-gray-400 text-xs sm:text-sm'>Horaires: Lun-Sam 8h-18h</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Mobile First */}
        <div className='border-t border-gray-800 mt-8 sm:mt-12 pt-8 sm:pt-12'>
          <div className='flex flex-col lg:flex-row justify-between items-center space-y-4 lg:space-y-0'>
            <div className='text-center lg:text-left'>
              <p className='text-gray-400 text-sm sm:text-base'>
                © 2024 AFRO🗼VIBZ. Tous droits réservés.
              </p>
            </div>
            <div className='flex flex-col sm:flex-row items-center space-y-2 sm:space-y-0 sm:space-x-6'>
              <Link
                href='/privacy'
                className='text-gray-400 hover:text-white transition-colors text-sm sm:text-base'
              >
                Politique de Confidentialité
              </Link>
              <Link
                href='/terms'
                className='text-gray-400 hover:text-white transition-colors text-sm sm:text-base'
              >
                Conditions d'Utilisation
              </Link>
            </div>
          </div>

          {/* Made with love - Mobile First */}
          <div className='text-center mt-6 sm:mt-8'>
            <p className='text-gray-500 text-xs sm:text-sm flex items-center justify-center space-x-2'>
              <span>Fait avec</span>
              <Heart className='h-3 w-3 sm:h-4 sm:w-4 text-red-500 fill-current' />
              <span>au Gabon</span>
            </p>
            <p className='text-gray-600 text-xs mt-2'>Propulsé par Next.js & Tailwind CSS</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
