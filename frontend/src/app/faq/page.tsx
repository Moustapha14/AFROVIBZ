'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useContent } from '@/lib/context/ContentContext';
import { 
  ChevronDown, 
  ChevronUp, 
  ArrowLeft,
  HelpCircle,
  ShoppingBag,
  Truck,
  CreditCard,
  Phone,
  Mail,
  Package,
  User
} from 'lucide-react';

// Metadata défini dans layout parent ou via next/head



// Mapping des icônes pour les catégories
const iconMap = {
  'ShoppingBag': ShoppingBag,
  'Truck': Truck,
  'CreditCard': CreditCard,
  'User': User,
  'Package': Package,
  'HelpCircle': HelpCircle
};

export default function FAQPage() {
  const { faqItems, faqCategories } = useContent();
  const [activeCategory, setActiveCategory] = useState('all');
  const [openItems, setOpenItems] = useState<string[]>([]);

  // Filtrer les questions actives seulement
  const activeFAQs = faqItems.filter(item => item.isActive);
  
  const filteredFAQs = activeCategory === 'all' 
    ? activeFAQs 
    : activeFAQs.filter(faq => faq.category === activeCategory);

  // Créer les catégories avec l'icône "Toutes" en premier
  const allCategories = [
    { id: 'all', name: 'Toutes', icon: 'HelpCircle', isActive: true },
    ...faqCategories.filter(cat => cat.isActive)
  ];

  const toggleItem = (id: string) => {
    setOpenItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    );
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
            Questions Fréquentes
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            Trouvez rapidement les réponses à vos questions les plus courantes
          </p>
        </div>

        {/* Category Filter - Mobile First */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
            {allCategories.map((category) => {
              const Icon = iconMap[category.icon as keyof typeof iconMap] || HelpCircle;
              return (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`inline-flex items-center space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 min-h-[44px] touch-manipulation tap-highlight-none ${
                    activeCategory === category.id
                      ? 'bg-black text-white shadow-sm'
                      : 'bg-white text-gray-700 hover:bg-gray-100 shadow-sm'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* FAQ List - Mobile First */}
        <div className="max-w-4xl mx-auto">
          <div className="space-y-3 sm:space-y-4">
            {filteredFAQs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <button
                  onClick={() => toggleItem(faq.id)}
                  className="w-full px-4 sm:px-6 py-4 sm:py-5 text-left focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 hover:bg-gray-50 transition-colors min-h-[60px] touch-manipulation tap-highlight-none"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1 pr-4">
                      <h3 className="text-sm sm:text-base font-medium text-gray-900 leading-relaxed">
                        {faq.question}
                      </h3>
                      <span className="inline-block mt-1 px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded">
                        {faq.category}
                      </span>
                    </div>
                    <div className="flex-shrink-0">
                      {openItems.includes(faq.id) ? (
                        <ChevronUp className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-500" />
                      )}
                    </div>
                  </div>
                </button>
                
                {openItems.includes(faq.id) && (
                  <div className="px-4 sm:px-6 pb-4 sm:pb-5">
                    <div className="border-t border-gray-200 pt-4">
                      <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Help Section */}
        <div className="mt-12 lg:mt-16">
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 text-center">
            <HelpCircle className="h-12 w-12 text-black mx-auto mb-4" />
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
              Vous ne trouvez pas votre réponse ?
            </h3>
            <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-lg mx-auto">
              Notre équipe est là pour vous aider. Contactez-nous et nous vous répondrons rapidement.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-4">
              <Link 
                href="/contact"
                className="inline-flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium min-h-[44px] w-full sm:w-auto justify-center touch-manipulation tap-highlight-none"
              >
                <Mail className="h-4 w-4" />
                <span>Nous contacter</span>
              </Link>
              
              <a 
                href="tel:+24100000000"
                className="inline-flex items-center space-x-2 border border-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium min-h-[44px] w-full sm:w-auto justify-center touch-manipulation tap-highlight-none"
              >
                <Phone className="h-4 w-4" />
                <span>+241 00 00 00 00</span>
              </a>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link 
            href="/shipping"
            className="block bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow text-center border border-gray-200"
          >
            <Truck className="h-6 w-6 text-black mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Livraison</span>
          </Link>

          
          <Link 
            href="/size-guide"
            className="block bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow text-center border border-gray-200"
          >
            <CreditCard className="h-6 w-6 text-black mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Guide Tailles</span>
          </Link>
          
          <Link 
            href="/tracking"
            className="block bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow text-center border border-gray-200"
          >
            <ShoppingBag className="h-6 w-6 text-black mx-auto mb-2" />
            <span className="text-sm font-medium text-gray-900">Suivi</span>
          </Link>
        </div>
      </div>
    </div>
  );
}