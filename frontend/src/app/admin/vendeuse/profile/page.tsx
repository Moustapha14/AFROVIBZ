'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import Image from 'next/image';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  Save,
  Camera,
  Edit3,
  ShoppingCart,
  Truck
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface VendeuseProfile {
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
  commission: number;
  totalSales: number;
  totalOrders: number;
  rating: number;
}

// Données mockées du profil vendeuse
const mockProfile: VendeuseProfile = {
  id: '2',
  displayName: 'Marie Dupont',
  email: 'vendeuse1@afrovibz.com',
  phone: '+241 01 23 45 67',
  address: '123 Avenue de la Paix',
  city: 'Libreville',
  birthDate: '1990-05-15',
  joinDate: '2023-03-01',
  avatar: '/images/avatar-vendeuse.png',
  bio: 'Vendeuse passionnée spécialisée dans les vêtements traditionnels africains et les accessoires modernes.',
  commission: 15,
  totalSales: 12500000,
  totalOrders: 156,
  rating: 4.8,
};

export default function VendeuseProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [profile, setProfile] = useState<VendeuseProfile>(mockProfile);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<VendeuseProfile>(mockProfile);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'vendeuse')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleInputChange = (field: keyof VendeuseProfile, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePasswordChange = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = async () => {
    try {
      // Simulation d'une mise à jour
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
      // Simulation d'un changement de mot de passe
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

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'XAF',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mon Profil</h1>
          <p className="text-gray-600 mt-2">Gérez vos informations personnelles et vos paramètres</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Colonne de gauche - Informations du profil */}
          <div className="lg:col-span-2 space-y-6">
            {/* Carte principale du profil */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Informations Personnelles</h2>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  {isEditing ? 'Annuler' : 'Modifier'}
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nom complet
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.displayName}
                      onChange={(e) => handleInputChange('displayName', e.target.value)}
                      placeholder="Votre nom complet"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.displayName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="votre@email.com"
                      type="email"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Téléphone
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      placeholder="+241 01 23 45 67"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Ville
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.city}
                      onChange={(e) => handleInputChange('city', e.target.value)}
                      placeholder="Libreville"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.city}</p>
                  )}
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adresse
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="Votre adresse complète"
                    />
                  ) : (
                    <p className="text-gray-900">{profile.address}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date de naissance
                  </label>
                  {isEditing ? (
                    <Input
                      value={formData.birthDate}
                      onChange={(e) => handleInputChange('birthDate', e.target.value)}
                      type="date"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {new Date(profile.birthDate).toLocaleDateString('fr-FR')}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date d'inscription
                  </label>
                  <p className="text-gray-900">
                    {new Date(profile.joinDate).toLocaleDateString('fr-FR')}
                  </p>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Parlez-nous de vous..."
                    />
                  ) : (
                    <p className="text-gray-900">{profile.bio}</p>
                  )}
                </div>
              </div>

              {isEditing && (
                <div className="mt-6 flex justify-end">
                  <Button onClick={handleSaveProfile} className="flex items-center gap-2">
                    <Save className="h-4 w-4" />
                    Sauvegarder
                  </Button>
                </div>
              )}
            </div>

            {/* Changement de mot de passe */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Changer le Mot de Passe</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mot de passe actuel
                  </label>
                  <PasswordInput
                    value={passwordData.currentPassword}
                    onChange={(e) => handlePasswordChange('currentPassword', e.target.value)}
                    placeholder="Votre mot de passe actuel"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nouveau mot de passe
                  </label>
                  <PasswordInput
                    value={passwordData.newPassword}
                    onChange={(e) => handlePasswordChange('newPassword', e.target.value)}
                    placeholder="Nouveau mot de passe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Confirmer le nouveau mot de passe
                  </label>
                  <PasswordInput
                    value={passwordData.confirmPassword}
                    onChange={(e) => handlePasswordChange('confirmPassword', e.target.value)}
                    placeholder="Confirmez le nouveau mot de passe"
                  />
                </div>

                <Button onClick={handleChangePassword} className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Changer le mot de passe
                </Button>
              </div>
            </div>
          </div>

          {/* Colonne de droite - Statistiques et avatar */}
          <div className="space-y-6">
            {/* Avatar et informations rapides */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="text-center">
                <div className="relative inline-block">
                  <Image
                    src={profile.avatar}
                    alt={profile.displayName}
                    width={96}
                    height={96}
                    className="rounded-full mx-auto mb-4 object-cover"
                    onError={(e) => {
                      e.currentTarget.src = '/images/avatar-vendeuse.png';
                    }}
                  />
                  <button className="absolute bottom-0 right-0 bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center">
                    <Camera className="h-4 w-4" />
                  </button>
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900">{profile.displayName}</h3>
                <p className="text-gray-600">Vendeuse AFROVIBZ</p>
                
                <div className="flex items-center justify-center mt-2">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(profile.rating) ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="ml-1 text-sm text-gray-600">({profile.rating})</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistiques */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mes Statistiques</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Commission</span>
                  <span className="font-semibold text-green-600">{profile.commission}%</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Ventes totales</span>
                  <span className="font-semibold text-gray-900">{formatCurrency(profile.totalSales)}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Commandes traitées</span>
                  <span className="font-semibold text-gray-900">{profile.totalOrders}</span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Note moyenne</span>
                  <span className="font-semibold text-yellow-600">{profile.rating}/5</span>
                </div>
              </div>
            </div>

            {/* Actions rapides */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions Rapides</h3>
              
              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push('/admin/vendeuse/orders')}
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Voir mes commandes
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push('/admin/vendeuse/logistics')}
                >
                  <Truck className="h-4 w-4 mr-2" />
                  Suivi logistique
                </Button>
                
                <Button
                  variant="outline"
                  className="w-full justify-start"
                  onClick={() => router.push('/admin/vendeuse/history')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Historique
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
