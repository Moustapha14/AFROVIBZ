'use client';

import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Camera,
  Shield,
  Package,
  Bell,
  Globe,
  CreditCard,
  ArrowLeft,
  Edit3,
  Save,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { useAuth } from '@/lib/hooks/useAuth';

interface ClientProfile {
  id: string;
  displayName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  birthDate: string;
  joinDate: string;
  avatar: string;
  bio: string;
  preferences: {
    newsletter: boolean;
    smsNotifications: boolean;
    emailNotifications: boolean;
    language: string;
    currency: string;
  };
}

// Données mockées du profil client
const mockProfile: ClientProfile = {
  id: '4',
  displayName: 'Client Test',
  email: 'client@afrovibz.com',
  phone: '+241 01 23 45 67',
  address: '123 Rue de la Paix',
  city: 'Libreville',
  birthDate: '1995-08-20',
  joinDate: '2023-06-01',
  avatar: '/images/avatar-user.png',
  bio: 'Passionné de mode africaine et de technologie.',
  preferences: {
    newsletter: true,
    smsNotifications: false,
    emailNotifications: true,
    language: 'fr',
    currency: 'XAF',
  },
};

export default function ClientProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<ClientProfile>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<ClientProfile>(mockProfile);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'user')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleInputChange = (field: keyof ClientProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePreferenceChange = (field: keyof ClientProfile['preferences'], value: any) => {
    setFormData(prev => ({
      ...prev,
      preferences: { ...prev.preferences, [field]: value },
    }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      setProfile(formData);
      setIsEditing(false);
      toast.success('Profil mis à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour du profil');
    }
  };

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast.error('Le nouveau mot de passe doit contenir au moins 6 caractères');
      return;
    }

    try {
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      toast.success('Mot de passe modifié avec succès');
    } catch (error) {
      toast.error('Erreur lors du changement de mot de passe');
    }
  };

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500' />
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='max-w-4xl mx-auto px-4 sm:px-6 lg:px-8'>
        {/* En-tête */}
        <div className='mb-8'>
          <Button
            variant='outline'
            onClick={() => router.push('/client')}
            className='mb-4 flex items-center gap-2'
          >
            <ArrowLeft className='h-4 w-4' />
            Retour au tableau de bord
          </Button>
          <h1 className='text-3xl font-bold text-gray-900'>Mon Profil</h1>
          <p className='text-gray-600 mt-2'>
            Gérez vos informations personnelles et vos préférences
          </p>
        </div>

        <div className='grid grid-cols-1 lg:grid-cols-3 gap-8'>
          {/* Colonne de gauche - Informations du profil */}
          <div className='lg:col-span-2 space-y-6'>
            {/* Carte principale du profil */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <div className='flex items-center justify-between mb-6'>
                <h2 className='text-xl font-semibold text-gray-900'>Informations Personnelles</h2>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant='outline'
                  size='sm'
                  className='flex items-center gap-2'
                >
                  <Edit3 className='h-4 w-4' />
                  {isEditing ? 'Annuler' : 'Modifier'}
                </Button>
              </div>

              <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Nom complet
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.displayName}
                      onChange={e => handleInputChange('displayName', e.target.value)}
                      placeholder='Votre nom complet'
                    />
                  ) : (
                    <p className='text-gray-900'>{profile.displayName}</p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Email</label>
                  {isEditing ? (
                    <Input
                      value={formData.email}
                      onChange={e => handleInputChange('email', e.target.value)}
                      placeholder='votre@email.com'
                      type='email'
                    />
                  ) : (
                    <p className='text-gray-900'>{profile.email}</p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Téléphone</label>
                  {isEditing ? (
                    <Input
                      value={formData.phone}
                      onChange={e => handleInputChange('phone', e.target.value)}
                      placeholder='+241 01 23 45 67'
                    />
                  ) : (
                    <p className='text-gray-900'>{profile.phone}</p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Ville</label>
                  {isEditing ? (
                    <Input
                      value={formData.city}
                      onChange={e => handleInputChange('city', e.target.value)}
                      placeholder='Libreville'
                    />
                  ) : (
                    <p className='text-gray-900'>{profile.city}</p>
                  )}
                </div>

                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Adresse</label>
                  {isEditing ? (
                    <Input
                      value={formData.address}
                      onChange={e => handleInputChange('address', e.target.value)}
                      placeholder='Votre adresse complète'
                    />
                  ) : (
                    <p className='text-gray-900'>{profile.address}</p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Date de naissance
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.birthDate}
                      onChange={e => handleInputChange('birthDate', e.target.value)}
                      type='date'
                    />
                  ) : (
                    <p className='text-gray-900'>
                      {new Date(profile.birthDate).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Date d'inscription
                  </label>
                  <p className='text-gray-900'>
                    {new Date(profile.joinDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>

                <div className='md:col-span-2'>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>Bio</label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={e => handleInputChange('bio', e.target.value)}
                      rows={3}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                      placeholder='Parlez-nous de vous...'
                    />
                  ) : (
                    <p className='text-gray-900'>{profile.bio}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className='mt-6 flex justify-end'>
                  <Button onClick={handleSaveProfile} className='flex items-center gap-2'>
                    <Save className='h-4 w-4' />
                    Sauvegarder
                  </Button>
                </div>
              )}
            </div>

            {/* Préférences */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-6'>Préférences</h2>

              <div className='space-y-4'>
                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='text-sm font-medium text-gray-900'>Newsletter</h3>
                    <p className='text-sm text-gray-500'>Recevoir les offres et nouveautés</p>
                  </div>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={formData.preferences.newsletter}
                      onChange={e => handlePreferenceChange('newsletter', e.target.checked)}
                      className='sr-only peer'
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                  </label>
                </div>

                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='text-sm font-medium text-gray-900'>Notifications SMS</h3>
                    <p className='text-sm text-gray-500'>Recevoir des SMS pour les commandes</p>
                  </div>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={formData.preferences.smsNotifications}
                      onChange={e => handlePreferenceChange('smsNotifications', e.target.checked)}
                      className='sr-only peer'
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                  </label>
                </div>

                <div className='flex items-center justify-between'>
                  <div>
                    <h3 className='text-sm font-medium text-gray-900'>Notifications Email</h3>
                    <p className='text-sm text-gray-500'>Recevoir des emails pour les commandes</p>
                  </div>
                  <label className='relative inline-flex items-center cursor-pointer'>
                    <input
                      type='checkbox'
                      checked={formData.preferences.emailNotifications}
                      onChange={e => handlePreferenceChange('emailNotifications', e.target.checked)}
                      className='sr-only peer'
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600" />
                  </label>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Langue</label>
                    <select
                      value={formData.preferences.language}
                      onChange={e => handlePreferenceChange('language', e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      <option value='fr'>Français</option>
                      <option value='en'>English</option>
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Devise</label>
                    <select
                      value={formData.preferences.currency}
                      onChange={e => handlePreferenceChange('currency', e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                    >
                      <option value='XAF'>FCFA</option>
                      <option value='EUR'>EUR</option>
                      <option value='USD'>USD</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            {/* Changement de mot de passe */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <h2 className='text-xl font-semibold text-gray-900 mb-6'>Changer le Mot de Passe</h2>

              <div className='space-y-4'>
                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Mot de passe actuel
                  </label>
                  <PasswordInput
                    value={passwordData.currentPassword}
                    onChange={e => handlePasswordChange('currentPassword', e.target.value)}
                    placeholder='Votre mot de passe actuel'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Nouveau mot de passe
                  </label>
                  <PasswordInput
                    value={passwordData.newPassword}
                    onChange={e => handlePasswordChange('newPassword', e.target.value)}
                    placeholder='Nouveau mot de passe'
                  />
                </div>

                <div>
                  <label className='block text-sm font-medium text-gray-700 mb-2'>
                    Confirmer le nouveau mot de passe
                  </label>
                  <PasswordInput
                    value={passwordData.confirmPassword}
                    onChange={e => handlePasswordChange('confirmPassword', e.target.value)}
                    placeholder='Confirmez le nouveau mot de passe'
                  />
                </div>

                <Button onClick={handleChangePassword} className='flex items-center gap-2'>
                  <Shield className='h-4 w-4' />
                  Changer le mot de passe
                </Button>
              </div>
            </div>
          </div>

          {/* Colonne de droite - Avatar et informations rapides */}
          <div className='space-y-6'>
            {/* Avatar et informations rapides */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <div className='text-center'>
                <div className='relative inline-block'>
                  <img
                    src={profile.avatar}
                    alt={profile.displayName}
                    className='w-24 h-24 rounded-full mx-auto mb-4 object-cover'
                    onError={e => {
                      e.currentTarget.src = '/images/avatar-user.png';
                    }}
                  />
                  <button className='absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors'>
                    <Camera className='h-4 w-4' />
                  </button>
                </div>

                <h3 className='text-lg font-semibold text-gray-900'>{profile.displayName}</h3>
                <p className='text-gray-600'>Client AFROVIBZ</p>
                <p className='text-sm text-gray-500 mt-1'>
                  Membre depuis {new Date(profile.joinDate).toLocaleDateString('fr-FR')}
                </p>
              </div>
            </div>

            {/* Actions rapides */}
            <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
              <h3 className='text-lg font-semibold text-gray-900 mb-4'>Actions Rapides</h3>

              <div className='space-y-3'>
                <Button
                  variant='outline'
                  className='w-full justify-start'
                  onClick={() => router.push('/client/orders')}
                >
                  <Package className='h-4 w-4 mr-2' />
                  Mes commandes
                </Button>

                <Button
                  variant='outline'
                  className='w-full justify-start'
                  onClick={() => router.push('/client/wishlist')}
                >
                  <User className='h-4 w-4 mr-2' />
                  Liste de souhaits
                </Button>

                <Button
                  variant='outline'
                  className='w-full justify-start'
                  onClick={() => router.push('/client/addresses')}
                >
                  <MapPin className='h-4 w-4 mr-2' />
                  Mes adresses
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
