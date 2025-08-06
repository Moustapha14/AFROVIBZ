import React from 'react';

import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function PrivacyPage() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Politique de confidentialité', current: true },
            ]}
          />
          <h1 className='text-3xl font-bold text-gray-900 mt-4'>Politique de confidentialité</h1>
          <p className='text-gray-600 mt-2'>
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* Content */}
        <div className='bg-white rounded-lg shadow-sm p-8'>
          <div className='prose prose-lg max-w-none'>
            <h2>1. Introduction</h2>
            <p>
              AFRO🗼VIBZ s'engage à protéger votre vie privée et vos données personnelles. Cette
              politique de confidentialité explique comment nous collectons, utilisons et protégeons
              vos informations lorsque vous utilisez notre site web.
            </p>

            <h2>2. Informations que nous collectons</h2>
            <h3>2.1 Informations que vous nous fournissez</h3>
            <ul>
              <li>Nom et prénom</li>
              <li>Adresse email</li>
              <li>Numéro de téléphone</li>
              <li>Adresse de livraison</li>
              <li>Informations de paiement</li>
            </ul>

            <h3>2.2 Informations collectées automatiquement</h3>
            <ul>
              <li>Adresse IP</li>
              <li>Type de navigateur</li>
              <li>Système d'exploitation</li>
              <li>Pages visitées</li>
              <li>Durée de visite</li>
              <li>Cookies et technologies similaires</li>
            </ul>

            <h2>3. Utilisation des informations</h2>
            <p>Nous utilisons vos informations pour :</p>
            <ul>
              <li>Traiter vos commandes et paiements</li>
              <li>Livrer vos produits</li>
              <li>Communiquer avec vous concernant votre commande</li>
              <li>Améliorer nos services</li>
              <li>Personnaliser votre expérience</li>
              <li>Respecter nos obligations légales</li>
            </ul>

            <h2>4. Partage des informations</h2>
            <p>
              Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des tiers,
              sauf dans les cas suivants :
            </p>
            <ul>
              <li>Avec votre consentement explicite</li>
              <li>Pour traiter vos paiements (processeurs de paiement)</li>
              <li>Pour la livraison (services de transport)</li>
              <li>Pour respecter les obligations légales</li>
              <li>Pour protéger nos droits et notre sécurité</li>
            </ul>

            <h2>5. Sécurité des données</h2>
            <p>
              Nous mettons en place des mesures de sécurité appropriées pour protéger vos données
              personnelles contre l'accès non autorisé, la modification, la divulgation ou la
              destruction.
            </p>
            <ul>
              <li>Chiffrement SSL/TLS</li>
              <li>Accès restreint aux données</li>
              <li>Surveillance continue de la sécurité</li>
              <li>Sauvegardes régulières</li>
            </ul>

            <h2>6. Cookies et technologies similaires</h2>
            <p>
              Nous utilisons des cookies pour améliorer votre expérience sur notre site. Les cookies
              nous aident à :
            </p>
            <ul>
              <li>Mémoriser vos préférences</li>
              <li>Analyser le trafic du site</li>
              <li>Personnaliser le contenu</li>
              <li>Améliorer les performances</li>
            </ul>

            <h2>7. Vos droits</h2>
            <p>Conformément aux lois gabonaises, vous avez le droit de :</p>
            <ul>
              <li>Accéder à vos données personnelles</li>
              <li>Rectifier vos données inexactes</li>
              <li>Supprimer vos données</li>
              <li>Limiter le traitement de vos données</li>
              <li>Vous opposer au traitement</li>
              <li>Portabilité de vos données</li>
            </ul>

            <h2>8. Conservation des données</h2>
            <p>
              Nous conservons vos données personnelles aussi longtemps que nécessaire pour les
              finalités pour lesquelles elles ont été collectées, ou conformément aux obligations
              légales.
            </p>

            <h2>9. Transferts internationaux</h2>
            <p>
              Vos données sont principalement traitées au Gabon. En cas de transfert vers d'autres
              pays, nous nous assurons que des garanties appropriées sont en place pour protéger vos
              données.
            </p>

            <h2>10. Sites web tiers</h2>
            <p>
              Notre site peut contenir des liens vers des sites web tiers. Nous ne sommes pas
              responsables des pratiques de confidentialité de ces sites. Nous vous encourageons à
              lire leurs politiques de confidentialité.
            </p>

            <h2>11. Modifications de cette politique</h2>
            <p>
              Nous pouvons mettre à jour cette politique de confidentialité de temps à autre. Les
              modifications seront publiées sur cette page avec une nouvelle date de mise à jour.
            </p>

            <h2>12. Contact</h2>
            <p>
              Pour toute question concernant cette politique de confidentialité ou pour exercer vos
              droits, contactez-nous :
            </p>
            <ul>
              <li>Email : privacy@afrovibz.ga</li>
              <li>Téléphone : +241 XX XX XX XX</li>
              <li>Adresse : Libreville, Gabon</li>
            </ul>

            <h2>13. Autorité de contrôle</h2>
            <p>
              Si vous n'êtes pas satisfait de notre réponse, vous pouvez contacter l'autorité de
              contrôle compétente au Gabon pour la protection des données personnelles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
