import React from 'react';
import Link from 'next/link';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  Mail, 
  Phone, 
  MapPin,
  Heart
} from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-3 xs:px-4 sm:px-6 lg:px-8 py-8 xs:py-12">
        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6 xs:gap-8">
          {/* Company Info */}
          <div className="xs:col-span-2 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-3 xs:mb-4">
              <div className="h-6 w-6 xs:h-8 xs:w-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-black font-bold text-xs xs:text-sm">
                AV
              </div>
              <span className="font-bold text-base xs:text-lg">AFRO🗼VIBZ</span>
            </div>
            <p className="text-gray-300 text-xs xs:text-sm mb-3 xs:mb-4">
              Votre destination pour la mode africaine au Gabon. Découvrez nos collections uniques et authentiques.
            </p>
            <div className="flex space-x-4">
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="#" 
                className="text-gray-400 hover:text-white transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Liens Rapides</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Tous les Produits
                </Link>
              </li>
              <li>
                <Link href="/products?category=femmes" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Mode Femme
                </Link>
              </li>
              <li>
                <Link href="/products?category=hommes" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Mode Homme
                </Link>
              </li>
              <li>
                <Link href="/products?category=enfants" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Mode Enfant
                </Link>
              </li>
              <li>
                <Link href="/products?category=accessoires" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Accessoires
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Service Client</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Contactez-nous
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Livraison
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Retours & Échanges
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-gray-300 hover:text-white transition-colors text-sm">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/size-guide" className="text-gray-300 hover:text-white transition-colors text-sm">
                  Guide des Tailles
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-gray-300 text-sm">
                    Libreville, Gabon<br />
                    Quartier Akanda
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <a 
                  href="tel:+24100000000" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  +241 00 00 00 00
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-gray-400 flex-shrink-0" />
                <a 
                  href="mailto:contact@afrovibz.ga" 
                  className="text-gray-300 hover:text-white transition-colors text-sm"
                >
                  contact@afrovibz.ga
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-gray-400 text-sm">
                © 2024 AFRO🗼VIBZ. Tous droits réservés.
              </p>
            </div>
            <div className="flex items-center space-x-6">
              <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors text-sm">
                Politique de Confidentialité
              </Link>
              <Link href="/terms" className="text-gray-400 hover:text-white transition-colors text-sm">
                Conditions d'Utilisation
              </Link>
            </div>
          </div>
          
          {/* Made with love */}
          <div className="text-center mt-4">
            <p className="text-gray-500 text-xs flex items-center justify-center space-x-1">
              <span>Fait avec</span>
              <Heart className="h-3 w-3 text-red-500 fill-current" />
              <span>au Gabon</span>
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
} 