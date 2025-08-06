import React from 'react';

import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export default function TermsPage() {
  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <Breadcrumbs
            items={[
              { label: 'Accueil', href: '/' },
              { label: "Conditions d'utilisation", current: true },
            ]}
          />
          <h1 className='text-3xl font-bold text-gray-900 mt-4'>Conditions d'utilisation</h1>
          <p className='text-gray-600 mt-2'>
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR')}
          </p>
        </div>

        {/* Content */}
        <div className='bg-white rounded-lg shadow-sm p-8'>
          <div className='prose prose-lg max-w-none'>
            <h2>1. Acceptation des conditions</h2>
            <p>
              En accédant et en utilisant le site web AFRO🗼VIBZ, vous acceptez d'être lié par ces
              conditions d'utilisation. Si vous n'acceptez pas ces conditions, veuillez ne pas
              utiliser notre site.
            </p>

            <h2>2. Description du service</h2>
            <p>
              AFRO🗼VIBZ est une plateforme de commerce électronique spécialisée dans la vente de
              vêtements et accessoires africains au Gabon. Nous proposons une large gamme de
              produits authentiques et de qualité.
            </p>

            <h2>3. Compte utilisateur</h2>
            <p>
              Pour effectuer des achats sur notre site, vous devez créer un compte utilisateur. Vous
              êtes responsable de :
            </p>
            <ul>
              <li>Maintenir la confidentialité de vos informations de connexion</li>
              <li>Toutes les activités qui se produisent sous votre compte</li>
              <li>Notifier immédiatement AFRO🗼VIBZ de toute utilisation non autorisée</li>
            </ul>

            <h2>4. Commandes et paiements</h2>
            <p>
              Toutes les commandes sont soumises à acceptation par AFRO🗼VIBZ. Nous nous réservons
              le droit de refuser toute commande pour quelque raison que ce soit.
            </p>
            <p>
              Les prix sont affichés en FCFA et incluent la TVA applicable. Les frais de livraison
              s'ajoutent au prix total de la commande.
            </p>

            <h2>5. Livraison</h2>
            <p>
              Nous livrons dans tout le Gabon. Les délais de livraison estimés sont fournis à titre
              indicatif et peuvent varier selon la disponibilité des produits et la zone de
              livraison.
            </p>

            <h2>6. Retours et remboursements</h2>
            <p>
              Vous disposez de 30 jours à compter de la réception pour retourner un produit, sous
              réserve que :
            </p>
            <ul>
              <li>Le produit soit dans son état d'origine</li>
              <li>Le produit ne soit pas utilisé ou endommagé</li>
              <li>L'emballage d'origine soit conservé</li>
            </ul>

            <h2>7. Propriété intellectuelle</h2>
            <p>
              Tout le contenu de ce site web, y compris les textes, images, logos et designs, est
              protégé par les droits de propriété intellectuelle et appartient à AFRO🗼VIBZ ou à ses
              partenaires.
            </p>

            <h2>8. Protection des données</h2>
            <p>
              Nous nous engageons à protéger vos données personnelles conformément à notre politique
              de confidentialité et aux lois gabonaises en vigueur.
            </p>

            <h2>9. Limitation de responsabilité</h2>
            <p>
              AFRO🗼VIBZ ne peut être tenu responsable des dommages indirects, accessoires ou
              consécutifs résultant de l'utilisation de notre site ou de nos services.
            </p>

            <h2>10. Modifications</h2>
            <p>
              Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment.
              Les modifications entrent en vigueur dès leur publication sur le site.
            </p>

            <h2>11. Droit applicable</h2>
            <p>
              Ces conditions d'utilisation sont régies par les lois de la République du Gabon. Tout
              litige sera soumis à la compétence des tribunaux gabonais.
            </p>

            <h2>12. Contact</h2>
            <p>Pour toute question concernant ces conditions d'utilisation, contactez-nous à :</p>
            <ul>
              <li>Email : contact@afrovibz.ga</li>
              <li>Téléphone : +241 XX XX XX XX</li>
              <li>Adresse : Libreville, Gabon</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
