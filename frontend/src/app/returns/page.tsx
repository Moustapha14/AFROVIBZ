import React from 'react';
import Link from 'next/link';
import { 
  RotateCcw, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  ArrowLeft,
  Package,
  FileText,
  Phone,
  Mail
} from 'lucide-react';

export const metadata = {
  title: 'Retours & Échanges | AFRO🗼VIBZ',
  description: 'Politique de retours et échanges AFRO🗼VIBZ. Retours gratuits sous 14 jours.'
};

export default function ReturnsPage() {
  const returnSteps = [
    {
      step: 1,
      title: 'Contactez-nous',
      description: 'Contactez notre service client avec votre numéro de commande',
      icon: Phone
    },
    {
      step: 2,
      title: 'Emballez le produit',
      description: 'Remettez le produit dans son emballage d\'origine avec tous les accessoires',
      icon: Package
    },
    {
      step: 3,
      title: 'Étiquette de retour',
      description: 'Nous vous envoyons une étiquette de retour prépayée par email',
      icon: FileText
    },
    {
      step: 4,
      title: 'Expédiez',
      description: 'Déposez le colis chez notre transporteur partenaire',
      icon: RotateCcw
    }
  ];

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
            Retours & Échanges
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            Pas satisfait ? Nous facilitons vos retours et échanges
          </p>
        </div>

        {/* Garantie satisfaction */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 mb-12">
          <div className="flex items-start space-x-3">
            <CheckCircle className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-green-900 mb-2">
                Garantie Satisfaction 14 jours
              </h3>
              <p className="text-green-800 text-sm sm:text-base">
                Nous acceptons les retours jusqu'à <strong>14 jours</strong> après réception, 
                sans frais supplémentaires en cas de défaut.
              </p>
            </div>
          </div>
        </div>

        {/* Processus de retour */}
        <div className="mb-12">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-8 text-center">
            Comment retourner un produit ?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {returnSteps.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200">
                  <div className="bg-black text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-4 text-sm font-bold">
                    {item.step}
                  </div>
                  <Icon className="h-8 w-8 text-gray-600 mx-auto mb-3" />
                  <h3 className="font-semibold text-gray-900 mb-2 text-sm sm:text-base">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Conditions de retour */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <h3 className="text-lg font-semibold text-gray-900">Retours Acceptés</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                <span>Produits non utilisés et dans leur emballage d'origine</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                <span>Retour dans les 14 jours suivant la réception</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                <span>Produits défectueux ou non conformes</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                <span>Erreur de notre part (mauvaise taille, couleur)</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 mt-2"></div>
                <span>Vêtements avec étiquettes intactes</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center space-x-3 mb-4">
              <AlertCircle className="h-6 w-6 text-red-500" />
              <h3 className="text-lg font-semibold text-gray-900">Retours Non Acceptés</h3>
            </div>
            <ul className="space-y-3 text-sm text-gray-600">
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                <span>Produits personnalisés ou sur mesure</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                <span>Sous-vêtements et maillots de bain</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                <span>Produits tech déballés (sauf défaut)</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                <span>Produits endommagés par l'utilisateur</span>
              </li>
              <li className="flex items-start space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0 mt-2"></div>
                <span>Délai de 14 jours dépassé</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Délais et remboursements */}
        <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8 mb-12">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-6">
            Délais et Remboursements
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <Clock className="h-5 w-5 text-black" />
                <h4 className="font-semibold text-gray-900">Délais de traitement</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Réception:</strong> 2-5 jours ouvrés</li>
                <li>• <strong>Inspection:</strong> 1-2 jours ouvrés</li>
                <li>• <strong>Remboursement:</strong> 3-7 jours ouvrés</li>
                <li>• <strong>Total:</strong> 6-14 jours ouvrés maximum</li>
              </ul>
            </div>
            
            <div>
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <h4 className="font-semibold text-gray-900">Modalités de remboursement</h4>
              </div>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• <strong>Carte bancaire:</strong> Remboursement automatique</li>
                <li>• <strong>Mobile Money:</strong> Virement sous 24h</li>
                <li>• <strong>Paiement livraison:</strong> Virement bancaire</li>
                <li>• <strong>Frais de port:</strong> Remboursés si défaut</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Échanges */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 sm:p-8 mb-12">
          <h3 className="text-lg sm:text-xl font-bold text-blue-900 mb-4">
            Préférez un échange ?
          </h3>
          <p className="text-blue-800 text-sm sm:text-base mb-4">
            L'échange est souvent plus rapide qu'un retour-remboursement. 
            Nous expédions le nouvel article dès réception de l'ancien.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-1" />
              <span className="text-sm text-blue-800">Même produit, autre taille/couleur</span>
            </div>
            <div className="flex items-start space-x-2">
              <CheckCircle className="h-4 w-4 text-blue-600 flex-shrink-0 mt-1" />
              <span className="text-sm text-blue-800">Frais d'expédition offerts</span>
            </div>
          </div>
        </div>

        {/* Contact pour retours */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Besoin d'aide pour un retour ?
          </h3>
          <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-lg mx-auto">
            Notre équipe est là pour vous accompagner dans votre retour ou échange.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-3 sm:space-y-0 sm:space-x-6">
            <Link 
              href="/contact"
              className="inline-flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium min-h-[44px] touch-manipulation tap-highlight-none"
            >
              <Mail className="h-4 w-4" />
              <span>Demander un retour</span>
            </Link>
            
            <a 
              href="tel:+24100000000"
              className="inline-flex items-center space-x-2 text-black hover:text-gray-700 transition-colors font-medium"
            >
              <Phone className="h-4 w-4" />
              <span>+241 00 00 00 00</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}