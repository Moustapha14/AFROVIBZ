import React from 'react';
import Link from 'next/link';
import { 
  Ruler, 
  ArrowLeft,
  User,
  Baby,
  Shirt,
  Package
} from 'lucide-react';

export const metadata = {
  title: 'Guide des Tailles | AFRO🗼VIBZ',
  description: 'Guide des tailles pour vêtements femmes, hommes et enfants. Trouvez votre taille parfaite.'
};

export default function SizeGuidePage() {
  const womenSizes = [
    { fr: 'XS', eu: '34', uk: '6', us: '2', bust: '78-82', waist: '58-62', hips: '84-88' },
    { fr: 'S', eu: '36', uk: '8', us: '4', bust: '82-86', waist: '62-66', hips: '88-92' },
    { fr: 'M', eu: '38', uk: '10', us: '6', bust: '86-90', waist: '66-70', hips: '92-96' },
    { fr: 'L', eu: '40', uk: '12', us: '8', bust: '90-94', waist: '70-74', hips: '96-100' },
    { fr: 'XL', eu: '42', uk: '14', us: '10', bust: '94-98', waist: '74-78', hips: '100-104' },
    { fr: 'XXL', eu: '44', uk: '16', us: '12', bust: '98-102', waist: '78-82', hips: '104-108' }
  ];

  const menSizes = [
    { fr: 'XS', eu: '44', uk: '34', us: '34', chest: '86-89', waist: '71-76', hips: '86-89' },
    { fr: 'S', eu: '46', uk: '36', us: '36', chest: '89-94', waist: '76-81', hips: '89-94' },
    { fr: 'M', eu: '48', uk: '38', us: '38', chest: '94-99', waist: '81-86', hips: '94-99' },
    { fr: 'L', eu: '50', uk: '40', us: '40', chest: '99-104', waist: '86-91', hips: '99-104' },
    { fr: 'XL', eu: '52', uk: '42', us: '42', chest: '104-109', waist: '91-96', hips: '104-109' },
    { fr: 'XXL', eu: '54', uk: '44', us: '44', chest: '109-114', waist: '96-102', hips: '109-114' }
  ];

  const kidsSizes = [
    { age: '2-3 ans', height: '92-98', chest: '52-54', waist: '50-52' },
    { age: '4-5 ans', height: '104-110', chest: '56-58', waist: '52-54' },
    { age: '6-7 ans', height: '116-122', chest: '60-62', waist: '54-56' },
    { age: '8-9 ans', height: '128-134', chest: '64-66', waist: '56-58' },
    { age: '10-11 ans', height: '140-146', chest: '68-72', waist: '58-62' },
    { age: '12-13 ans', height: '152-158', chest: '76-80', waist: '62-66' }
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
            Guide des Tailles
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            Trouvez votre taille parfaite avec nos guides détaillés
          </p>
        </div>

        {/* Comment mesurer */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-12">
          <div className="flex items-start space-x-3">
            <Ruler className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-blue-900 mb-3">
                Comment bien prendre ses mesures ?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800">
                <div>
                  <p className="font-medium mb-2">Pour les femmes :</p>
                  <ul className="space-y-1">
                    <li>• <strong>Poitrine :</strong> Tour de poitrine au niveau le plus fort</li>
                    <li>• <strong>Taille :</strong> Tour de taille au niveau le plus fin</li>
                    <li>• <strong>Hanches :</strong> Tour de hanches au niveau le plus fort</li>
                  </ul>
                </div>
                <div>
                  <p className="font-medium mb-2">Pour les hommes :</p>
                  <ul className="space-y-1">
                    <li>• <strong>Poitrine :</strong> Tour de poitrine sous les bras</li>
                    <li>• <strong>Taille :</strong> Tour de taille naturelle</li>
                    <li>• <strong>Hanches :</strong> Tour de hanches au niveau le plus fort</li>
                  </ul>
                </div>
              </div>
              <p className="text-xs text-blue-700 mt-3">
                💡 <strong>Conseil :</strong> Mesurez-vous en sous-vêtements pour plus de précision
              </p>
            </div>
          </div>
        </div>

        {/* Tailles Femmes */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <User className="h-6 w-6 text-black" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Tailles Femmes
            </h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left p-3 sm:p-4 font-semibold text-gray-900">Taille</th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-gray-900">EU</th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-gray-900">UK</th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-gray-900">US</th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-gray-900">Poitrine (cm)</th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-gray-900">Taille (cm)</th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-gray-900">Hanches (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {womenSizes.map((size, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 sm:p-4 font-medium text-gray-900">{size.fr}</td>
                      <td className="p-3 sm:p-4 text-gray-600">{size.eu}</td>
                      <td className="p-3 sm:p-4 text-gray-600">{size.uk}</td>
                      <td className="p-3 sm:p-4 text-gray-600">{size.us}</td>
                      <td className="p-3 sm:p-4 text-gray-600">{size.bust}</td>
                      <td className="p-3 sm:p-4 text-gray-600">{size.waist}</td>
                      <td className="p-3 sm:p-4 text-gray-600">{size.hips}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tailles Hommes */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <Shirt className="h-6 w-6 text-black" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Tailles Hommes
            </h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left p-3 sm:p-4 font-semibold text-gray-900">Taille</th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-gray-900">EU</th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-gray-900">UK</th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-gray-900">US</th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-gray-900">Poitrine (cm)</th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-gray-900">Taille (cm)</th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-gray-900">Hanches (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {menSizes.map((size, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 sm:p-4 font-medium text-gray-900">{size.fr}</td>
                      <td className="p-3 sm:p-4 text-gray-600">{size.eu}</td>
                      <td className="p-3 sm:p-4 text-gray-600">{size.uk}</td>
                      <td className="p-3 sm:p-4 text-gray-600">{size.us}</td>
                      <td className="p-3 sm:p-4 text-gray-600">{size.chest}</td>
                      <td className="p-3 sm:p-4 text-gray-600">{size.waist}</td>
                      <td className="p-3 sm:p-4 text-gray-600">{size.hips}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Tailles Enfants */}
        <div className="mb-12">
          <div className="flex items-center space-x-3 mb-6">
            <Baby className="h-6 w-6 text-black" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Tailles Enfants
            </h2>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs sm:text-sm">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left p-3 sm:p-4 font-semibold text-gray-900">Âge</th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-gray-900">Taille (cm)</th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-gray-900">Poitrine (cm)</th>
                    <th className="text-left p-3 sm:p-4 font-semibold text-gray-900">Taille (cm)</th>
                  </tr>
                </thead>
                <tbody>
                  {kidsSizes.map((size, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3 sm:p-4 font-medium text-gray-900">{size.age}</td>
                      <td className="p-3 sm:p-4 text-gray-600">{size.height}</td>
                      <td className="p-3 sm:p-4 text-gray-600">{size.chest}</td>
                      <td className="p-3 sm:p-4 text-gray-600">{size.waist}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Conseils supplémentaires */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 mb-8">
          <div className="flex items-start space-x-3">
            <Package className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-3">
                Conseils pour bien choisir
              </h3>
              <div className="space-y-2 text-sm text-yellow-800">
                <p>• <strong>Entre deux tailles ?</strong> Choisissez la taille supérieure pour plus de confort</p>
                <p>• <strong>Matières extensibles :</strong> Vous pouvez prendre une taille en dessous</p>
                <p>• <strong>Vêtements amples :</strong> Respectez vos mesures exactes</p>
                <p>• <strong>Incertitude ?</strong> Contactez-nous, nous vous conseillons !</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Besoin d'aide pour choisir votre taille ?
          </h3>
          <p className="text-gray-600 text-sm sm:text-base mb-6 max-w-lg mx-auto">
            Notre équipe vous aide à trouver la taille parfaite. N'hésitez pas à nous contacter !
          </p>
          
          <Link 
            href="/contact"
            className="inline-flex items-center space-x-2 bg-black text-white px-6 py-3 rounded-lg hover:bg-gray-800 transition-colors text-sm font-medium min-h-[44px] touch-manipulation tap-highlight-none"
          >
            Demander conseil
          </Link>
        </div>
      </div>
    </div>
  );
}