'use client';

import {
  Settings,
  Save,
  Globe,
  Mail,
  CreditCard,
  Shield,
  Palette,
  Bell,
  Database,
  Save as SaveIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/hooks/useAuth';

interface SiteSettings {
  general: {
    siteName: string;
    siteDescription: string;
    contactEmail: string;
    contactPhone: string;
    address: string;
    currency: string;
    timezone: string;
    language: string;
  };
  payment: {
    stripeEnabled: boolean;
    stripePublicKey: string;
    stripeSecretKey: string;
    mobileMoneyEnabled: boolean;
    bankTransferEnabled: boolean;
    cashOnDeliveryEnabled: boolean;
  };
  email: {
    smtpHost: string;
    smtpPort: number;
    smtpUser: string;
    smtpPassword: string;
    fromEmail: string;
    fromName: string;
  };
  appearance: {
    primaryColor: string;
    secondaryColor: string;
    logoUrl: string;
    faviconUrl: string;
    enableDarkMode: boolean;
  };
  notifications: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    orderConfirmation: boolean;
    orderStatusUpdates: boolean;
    newUserRegistration: boolean;
    lowStockAlerts: boolean;
  };
  security: {
    enableTwoFactor: boolean;
    sessionTimeout: number;
    maxLoginAttempts: number;
    passwordMinLength: number;
    requireStrongPassword: boolean;
  };
}

// Données mockées
const mockSettings: SiteSettings = {
  general: {
    siteName: 'AFRO🗼VIBZ',
    siteDescription: 'Votre boutique en ligne de mode africaine et tech',
    contactEmail: 'contact@afrovibz.com',
    contactPhone: '+241 01234567',
    address: '123 Rue de la Paix, Libreville, Gabon',
    currency: 'FCFA',
    timezone: 'Africa/Libreville',
    language: 'fr',
  },
  payment: {
    stripeEnabled: false,
    stripePublicKey: '',
    stripeSecretKey: '',
    mobileMoneyEnabled: true,
    bankTransferEnabled: true,
    cashOnDeliveryEnabled: true,
  },
  email: {
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUser: 'noreply@afrovibz.com',
    smtpPassword: '',
    fromEmail: 'noreply@afrovibz.com',
    fromName: 'AFRO🗼VIBZ',
  },
  appearance: {
    primaryColor: '#000000',
    secondaryColor: '#FFD700',
    logoUrl: '/images/logo.png',
    faviconUrl: '/favicon.ico',
    enableDarkMode: false,
  },
  notifications: {
    emailNotifications: true,
    smsNotifications: false,
    orderConfirmation: true,
    orderStatusUpdates: true,
    newUserRegistration: true,
    lowStockAlerts: true,
  },
  security: {
    enableTwoFactor: false,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    passwordMinLength: 8,
    requireStrongPassword: true,
  },
};

export default function SuperAdminSettingsPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [settings, setSettings] = useState<SiteSettings>(mockSettings);
  const [activeTab, setActiveTab] = useState<
    'general' | 'payment' | 'email' | 'appearance' | 'notifications' | 'security'
  >('general');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'super_admin')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulation de sauvegarde
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    toast.success('Paramètres sauvegardés avec succès');
  };

  const handleInputChange = (section: keyof SiteSettings, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 flex items-center justify-center'>Chargement...</div>
    );
  }

  if (!user || user.role !== 'super_admin') {
    return null;
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Paramètres du Site</h1>
          <p className='mt-2 text-gray-600'>Configuration générale de la plateforme AFRO🗼VIBZ</p>
        </div>

        <div className='bg-white rounded-lg shadow'>
          {/* Tabs */}
          <div className='border-b border-gray-200'>
            <nav className='-mb-px flex space-x-8 px-6'>
              <button
                onClick={() => setActiveTab('general')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'general'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Globe className='h-4 w-4 inline mr-2' />
                Général
              </button>
              <button
                onClick={() => setActiveTab('payment')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'payment'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <CreditCard className='h-4 w-4 inline mr-2' />
                Paiement
              </button>
              <button
                onClick={() => setActiveTab('email')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'email'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Mail className='h-4 w-4 inline mr-2' />
                Email
              </button>
              <button
                onClick={() => setActiveTab('appearance')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'appearance'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Palette className='h-4 w-4 inline mr-2' />
                Apparence
              </button>
              <button
                onClick={() => setActiveTab('notifications')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'notifications'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Bell className='h-4 w-4 inline mr-2' />
                Notifications
              </button>
              <button
                onClick={() => setActiveTab('security')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'security'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Shield className='h-4 w-4 inline mr-2' />
                Sécurité
              </button>
            </nav>
          </div>

          {/* Content */}
          <div className='p-6'>
            {activeTab === 'general' && (
              <div className='space-y-6'>
                <h3 className='text-lg font-medium text-gray-900'>Paramètres Généraux</h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Nom du site
                    </label>
                    <Input
                      value={settings.general.siteName}
                      onChange={e => handleInputChange('general', 'siteName', e.target.value)}
                      placeholder='Nom du site'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Description
                    </label>
                    <Input
                      value={settings.general.siteDescription}
                      onChange={e =>
                        handleInputChange('general', 'siteDescription', e.target.value)
                      }
                      placeholder='Description du site'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Email de contact
                    </label>
                    <Input
                      type='email'
                      value={settings.general.contactEmail}
                      onChange={e => handleInputChange('general', 'contactEmail', e.target.value)}
                      placeholder='contact@example.com'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Téléphone de contact
                    </label>
                    <Input
                      value={settings.general.contactPhone}
                      onChange={e => handleInputChange('general', 'contactPhone', e.target.value)}
                      placeholder='+241 01234567'
                    />
                  </div>

                  <div className='md:col-span-2'>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Adresse</label>
                    <Input
                      value={settings.general.address}
                      onChange={e => handleInputChange('general', 'address', e.target.value)}
                      placeholder='Adresse complète'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>Devise</label>
                    <select
                      value={settings.general.currency}
                      onChange={e => handleInputChange('general', 'currency', e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                    >
                      <option value='FCFA'>FCFA</option>
                      <option value='EUR'>EUR</option>
                      <option value='USD'>USD</option>
                    </select>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Fuseau horaire
                    </label>
                    <select
                      value={settings.general.timezone}
                      onChange={e => handleInputChange('general', 'timezone', e.target.value)}
                      className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black'
                    >
                      <option value='Africa/Libreville'>Africa/Libreville</option>
                      <option value='UTC'>UTC</option>
                      <option value='Europe/Paris'>Europe/Paris</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'payment' && (
              <div className='space-y-6'>
                <h3 className='text-lg font-medium text-gray-900'>Paramètres de Paiement</h3>

                <div className='space-y-4'>
                  <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                    <div>
                      <h4 className='font-medium text-gray-900'>Stripe</h4>
                      <p className='text-sm text-gray-600'>Paiements par carte bancaire</p>
                    </div>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={settings.payment.stripeEnabled}
                        onChange={e =>
                          handleInputChange('payment', 'stripeEnabled', e.target.checked)
                        }
                        className='rounded border-gray-300 text-black focus:ring-black'
                      />
                      <span className='ml-2 text-sm text-gray-700'>Activer</span>
                    </label>
                  </div>

                  <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                    <div>
                      <h4 className='font-medium text-gray-900'>Mobile Money</h4>
                      <p className='text-sm text-gray-600'>Paiements par mobile money</p>
                    </div>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={settings.payment.mobileMoneyEnabled}
                        onChange={e =>
                          handleInputChange('payment', 'mobileMoneyEnabled', e.target.checked)
                        }
                        className='rounded border-gray-300 text-black focus:ring-black'
                      />
                      <span className='ml-2 text-sm text-gray-700'>Activer</span>
                    </label>
                  </div>

                  <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                    <div>
                      <h4 className='font-medium text-gray-900'>Virement Bancaire</h4>
                      <p className='text-sm text-gray-600'>Paiements par virement</p>
                    </div>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={settings.payment.bankTransferEnabled}
                        onChange={e =>
                          handleInputChange('payment', 'bankTransferEnabled', e.target.checked)
                        }
                        className='rounded border-gray-300 text-black focus:ring-black'
                      />
                      <span className='ml-2 text-sm text-gray-700'>Activer</span>
                    </label>
                  </div>

                  <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                    <div>
                      <h4 className='font-medium text-gray-900'>Paiement à la Livraison</h4>
                      <p className='text-sm text-gray-600'>Paiement en espèces à la livraison</p>
                    </div>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={settings.payment.cashOnDeliveryEnabled}
                        onChange={e =>
                          handleInputChange('payment', 'cashOnDeliveryEnabled', e.target.checked)
                        }
                        className='rounded border-gray-300 text-black focus:ring-black'
                      />
                      <span className='ml-2 text-sm text-gray-700'>Activer</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'email' && (
              <div className='space-y-6'>
                <h3 className='text-lg font-medium text-gray-900'>Configuration Email</h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Serveur SMTP
                    </label>
                    <Input
                      value={settings.email.smtpHost}
                      onChange={e => handleInputChange('email', 'smtpHost', e.target.value)}
                      placeholder='smtp.gmail.com'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Port SMTP
                    </label>
                    <Input
                      type='number'
                      value={settings.email.smtpPort}
                      onChange={e =>
                        handleInputChange('email', 'smtpPort', parseInt(e.target.value))
                      }
                      placeholder='587'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Utilisateur SMTP
                    </label>
                    <Input
                      value={settings.email.smtpUser}
                      onChange={e => handleInputChange('email', 'smtpUser', e.target.value)}
                      placeholder='user@example.com'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Mot de passe SMTP
                    </label>
                    <Input
                      type='password'
                      value={settings.email.smtpPassword}
                      onChange={e => handleInputChange('email', 'smtpPassword', e.target.value)}
                      placeholder='Mot de passe'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Email d'expédition
                    </label>
                    <Input
                      type='email'
                      value={settings.email.fromEmail}
                      onChange={e => handleInputChange('email', 'fromEmail', e.target.value)}
                      placeholder='noreply@example.com'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Nom d'expédition
                    </label>
                    <Input
                      value={settings.email.fromName}
                      onChange={e => handleInputChange('email', 'fromName', e.target.value)}
                      placeholder="Nom de l'expéditeur"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'appearance' && (
              <div className='space-y-6'>
                <h3 className='text-lg font-medium text-gray-900'>Apparence</h3>

                <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Couleur principale
                    </label>
                    <div className='flex items-center space-x-2'>
                      <input
                        type='color'
                        value={settings.appearance.primaryColor}
                        onChange={e =>
                          handleInputChange('appearance', 'primaryColor', e.target.value)
                        }
                        className='w-12 h-10 border border-gray-300 rounded'
                      />
                      <Input
                        value={settings.appearance.primaryColor}
                        onChange={e =>
                          handleInputChange('appearance', 'primaryColor', e.target.value)
                        }
                        placeholder='#000000'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      Couleur secondaire
                    </label>
                    <div className='flex items-center space-x-2'>
                      <input
                        type='color'
                        value={settings.appearance.secondaryColor}
                        onChange={e =>
                          handleInputChange('appearance', 'secondaryColor', e.target.value)
                        }
                        className='w-12 h-10 border border-gray-300 rounded'
                      />
                      <Input
                        value={settings.appearance.secondaryColor}
                        onChange={e =>
                          handleInputChange('appearance', 'secondaryColor', e.target.value)
                        }
                        placeholder='#FFD700'
                      />
                    </div>
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      URL du logo
                    </label>
                    <Input
                      value={settings.appearance.logoUrl}
                      onChange={e => handleInputChange('appearance', 'logoUrl', e.target.value)}
                      placeholder='/images/logo.png'
                    />
                  </div>

                  <div>
                    <label className='block text-sm font-medium text-gray-700 mb-2'>
                      URL du favicon
                    </label>
                    <Input
                      value={settings.appearance.faviconUrl}
                      onChange={e => handleInputChange('appearance', 'faviconUrl', e.target.value)}
                      placeholder='/favicon.ico'
                    />
                  </div>

                  <div className='md:col-span-2'>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={settings.appearance.enableDarkMode}
                        onChange={e =>
                          handleInputChange('appearance', 'enableDarkMode', e.target.checked)
                        }
                        className='rounded border-gray-300 text-black focus:ring-black'
                      />
                      <span className='ml-2 text-sm text-gray-700'>Activer le mode sombre</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'notifications' && (
              <div className='space-y-6'>
                <h3 className='text-lg font-medium text-gray-900'>Notifications</h3>

                <div className='space-y-4'>
                  <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                    <div>
                      <h4 className='font-medium text-gray-900'>Notifications Email</h4>
                      <p className='text-sm text-gray-600'>Activer les notifications par email</p>
                    </div>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={settings.notifications.emailNotifications}
                        onChange={e =>
                          handleInputChange('notifications', 'emailNotifications', e.target.checked)
                        }
                        className='rounded border-gray-300 text-black focus:ring-black'
                      />
                      <span className='ml-2 text-sm text-gray-700'>Activer</span>
                    </label>
                  </div>

                  <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                    <div>
                      <h4 className='font-medium text-gray-900'>Notifications SMS</h4>
                      <p className='text-sm text-gray-600'>Activer les notifications par SMS</p>
                    </div>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={settings.notifications.smsNotifications}
                        onChange={e =>
                          handleInputChange('notifications', 'smsNotifications', e.target.checked)
                        }
                        className='rounded border-gray-300 text-black focus:ring-black'
                      />
                      <span className='ml-2 text-sm text-gray-700'>Activer</span>
                    </label>
                  </div>

                  <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                    <div>
                      <h4 className='font-medium text-gray-900'>Confirmation de commande</h4>
                      <p className='text-sm text-gray-600'>
                        Envoyer une confirmation lors de la commande
                      </p>
                    </div>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={settings.notifications.orderConfirmation}
                        onChange={e =>
                          handleInputChange('notifications', 'orderConfirmation', e.target.checked)
                        }
                        className='rounded border-gray-300 text-black focus:ring-black'
                      />
                      <span className='ml-2 text-sm text-gray-700'>Activer</span>
                    </label>
                  </div>

                  <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                    <div>
                      <h4 className='font-medium text-gray-900'>Mises à jour de statut</h4>
                      <p className='text-sm text-gray-600'>
                        Notifier les changements de statut de commande
                      </p>
                    </div>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={settings.notifications.orderStatusUpdates}
                        onChange={e =>
                          handleInputChange('notifications', 'orderStatusUpdates', e.target.checked)
                        }
                        className='rounded border-gray-300 text-black focus:ring-black'
                      />
                      <span className='ml-2 text-sm text-gray-700'>Activer</span>
                    </label>
                  </div>

                  <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                    <div>
                      <h4 className='font-medium text-gray-900'>Nouvelle inscription</h4>
                      <p className='text-sm text-gray-600'>Notifier les nouvelles inscriptions</p>
                    </div>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={settings.notifications.newUserRegistration}
                        onChange={e =>
                          handleInputChange(
                            'notifications',
                            'newUserRegistration',
                            e.target.checked
                          )
                        }
                        className='rounded border-gray-300 text-black focus:ring-black'
                      />
                      <span className='ml-2 text-sm text-gray-700'>Activer</span>
                    </label>
                  </div>

                  <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                    <div>
                      <h4 className='font-medium text-gray-900'>Alertes de stock faible</h4>
                      <p className='text-sm text-gray-600'>Notifier quand le stock est faible</p>
                    </div>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={settings.notifications.lowStockAlerts}
                        onChange={e =>
                          handleInputChange('notifications', 'lowStockAlerts', e.target.checked)
                        }
                        className='rounded border-gray-300 text-black focus:ring-black'
                      />
                      <span className='ml-2 text-sm text-gray-700'>Activer</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'security' && (
              <div className='space-y-6'>
                <h3 className='text-lg font-medium text-gray-900'>Sécurité</h3>

                <div className='space-y-4'>
                  <div className='flex items-center justify-between p-4 border border-gray-200 rounded-lg'>
                    <div>
                      <h4 className='font-medium text-gray-900'>
                        Authentification à deux facteurs
                      </h4>
                      <p className='text-sm text-gray-600'>
                        Exiger une authentification à deux facteurs
                      </p>
                    </div>
                    <label className='flex items-center'>
                      <input
                        type='checkbox'
                        checked={settings.security.enableTwoFactor}
                        onChange={e =>
                          handleInputChange('security', 'enableTwoFactor', e.target.checked)
                        }
                        className='rounded border-gray-300 text-black focus:ring-black'
                      />
                      <span className='ml-2 text-sm text-gray-700'>Activer</span>
                    </label>
                  </div>

                  <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Timeout de session (minutes)
                      </label>
                      <Input
                        type='number'
                        value={settings.security.sessionTimeout}
                        onChange={e =>
                          handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))
                        }
                        placeholder='30'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Tentatives de connexion max
                      </label>
                      <Input
                        type='number'
                        value={settings.security.maxLoginAttempts}
                        onChange={e =>
                          handleInputChange(
                            'security',
                            'maxLoginAttempts',
                            parseInt(e.target.value)
                          )
                        }
                        placeholder='5'
                      />
                    </div>

                    <div>
                      <label className='block text-sm font-medium text-gray-700 mb-2'>
                        Longueur min du mot de passe
                      </label>
                      <Input
                        type='number'
                        value={settings.security.passwordMinLength}
                        onChange={e =>
                          handleInputChange(
                            'security',
                            'passwordMinLength',
                            parseInt(e.target.value)
                          )
                        }
                        placeholder='8'
                      />
                    </div>

                    <div className='flex items-center'>
                      <label className='flex items-center'>
                        <input
                          type='checkbox'
                          checked={settings.security.requireStrongPassword}
                          onChange={e =>
                            handleInputChange('security', 'requireStrongPassword', e.target.checked)
                          }
                          className='rounded border-gray-300 text-black focus:ring-black'
                        />
                        <span className='ml-2 text-sm text-gray-700'>
                          Exiger un mot de passe fort
                        </span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Save Button */}
            <div className='mt-8 pt-6 border-t border-gray-200'>
              <div className='flex justify-end'>
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                  className='flex items-center gap-2'
                >
                  <SaveIcon className='h-4 w-4' />
                  {isSaving ? 'Sauvegarde...' : 'Sauvegarder les paramètres'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
