'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Send, 
  MessageCircle,
  Headphones,
  CheckCircle
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface ContactForm {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export default function ContactPage() {
  const [formData, setFormData] = useState<ContactForm>({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulation d'envoi - à remplacer par l'API réelle
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsSubmitted(true);
      toast.success('Message envoyé avec succès !');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (error) {
      toast.error('Erreur lors de l\'envoi du message');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
        <div className="max-w-md w-full text-center">
          <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
              Message envoyé !
            </h2>
            <p className="text-gray-600 mb-6 text-sm sm:text-base">
              Nous vous répondrons dans les 24h ouvrées.
            </p>
            <Button 
              onClick={() => setIsSubmitted(false)}
              className="w-full sm:w-auto"
            >
              Envoyer un autre message
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mobile-container py-6 sm:py-8 lg:py-12">
        {/* Header */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Contactez-nous
          </h1>
          <p className="text-gray-600 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto leading-relaxed">
            Une question ? Un problème ? Notre équipe est là pour vous aider !
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Contact Info - Mobile First */}
          <div className="order-2 lg:order-1">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
              Nos Coordonnées
            </h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-black text-white p-3 rounded-lg flex-shrink-0">
                  <MapPin className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Adresse</h3>
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
                    Quartier Akanda<br />
                    Zone Industrielle<br />
                    Libreville, Gabon
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-black text-white p-3 rounded-lg flex-shrink-0">
                  <Phone className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Téléphone</h3>
                  <a 
                    href="tel:+24100000000"
                    className="text-black hover:text-gray-700 transition-colors text-sm sm:text-base font-medium"
                  >
                    +241 00 00 00 00
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-black text-white p-3 rounded-lg flex-shrink-0">
                  <Mail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Email</h3>
                  <a 
                    href="mailto:contact@afrovibz.ga"
                    className="text-black hover:text-gray-700 transition-colors text-sm sm:text-base font-medium break-all"
                  >
                    contact@afrovibz.ga
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-black text-white p-3 rounded-lg flex-shrink-0">
                  <Clock className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 text-sm sm:text-base">Horaires</h3>
                  <div className="text-gray-600 text-sm sm:text-base">
                    <p>Lundi - Samedi: 8h - 18h</p>
                    <p>Dimanche: Fermé</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Support rapide */}
            <div className="mt-8 p-4 sm:p-6 bg-blue-50 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Headphones className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900 text-sm sm:text-base">Support Rapide</h3>
              </div>
              <p className="text-blue-800 text-xs sm:text-sm mb-4">
                Besoin d'aide immédiate ? Utilisez nos canaux rapides :
              </p>
              <div className="space-y-2">
                <a 
                  href="https://wa.me/24100000000" 
                  className="block w-full text-center bg-green-500 hover:bg-green-600 text-white py-3 px-4 rounded-lg transition-colors text-sm font-medium"
                >
                  <MessageCircle className="h-4 w-4 inline mr-2" />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form - Mobile First */}
          <div className="order-1 lg:order-2">
            <div className="bg-white rounded-lg shadow-sm p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                Envoyez-nous un message
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Nom complet *
                    </label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Votre nom"
                      className="mobile-input"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Téléphone
                    </label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+241 XX XX XX XX"
                      className="mobile-input"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="votre@email.com"
                    className="mobile-input"
                  />
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                    Sujet *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    required
                    value={formData.subject}
                    onChange={handleInputChange}
                    className="w-full border border-gray-300 rounded-md px-3 py-3 text-sm focus:ring-2 focus:ring-black focus:border-transparent min-h-[44px] touch-manipulation tap-highlight-none"
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="commande">Question sur une commande</option>
                    <option value="produit">Question sur un produit</option>
                    <option value="livraison">Problème de livraison</option>
                    <option value="retour">Retour / Échange</option>
                    <option value="technique">Problème technique</option>
                    <option value="autre">Autre</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={6}
                    required
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Décrivez votre demande en détail..."
                    className="w-full border border-gray-300 rounded-md px-3 py-3 text-sm focus:ring-2 focus:ring-black focus:border-transparent resize-none touch-manipulation tap-highlight-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full min-h-[44px] mobile-button"
                >
                  {isSubmitting ? (
                    <>
                      <LoadingSpinner />
                      <span className="ml-2">Envoi en cours...</span>
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}