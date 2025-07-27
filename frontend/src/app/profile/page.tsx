'use client';

import React, { useState } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Tabs } from '@/components/ui/Tabs';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Edit, 
  Save, 
  X,
  Package,
  Heart,
  Settings,
  LogOut
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

interface Order {
  id: string;
  date: string;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  total: number;
  items: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

// Données temporaires
const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    date: '2024-01-15',
    status: 'delivered',
    total: 45000,
    items: [
      { id: '1', name: 'Robe Africaine Élégante', quantity: 1, price: 25000 },
      { id: '2', name: 'Chemise Wax Traditionnelle', quantity: 1, price: 20000 },
    ],
  },
  {
    id: 'ORD-002',
    date: '2024-01-10',
    status: 'shipped',
    total: 30000,
    items: [
      { id: '3', name: 'Pagne Moderne', quantity: 1, price: 12000 },
      { id: '4', name: 'Boubou Traditionnel', quantity: 1, price: 18000 },
    ],
  },
];

const mockWishlist = [
  { id: '1', name: 'Robe Africaine Élégante', price: 25000, image: '/images/product-1.jpg' },
  { id: '2', name: 'Chemise Wax Traditionnelle', price: 18000, image: '/images/product-2.jpg' },
];

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const [profile, setProfile] = useState<UserProfile>({
    firstName: user?.displayName?.split(' ')[0] || '',
    lastName: user?.displayName?.split(' ').slice(1).join(' ') || '',
    email: user?.email || '',
    phone: '+241 01234567',
    address: 'Quartier Akanda',
    city: 'Libreville',
    postalCode: '0000',
    country: 'Gabon',
  });

  const [originalProfile] = useState<UserProfile>({ ...profile });

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // TODO: Implement profile update
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profil mis à jour avec succès !');
      setIsEditing(false);
    } catch (error) {
      toast.error('Erreur lors de la mise à jour');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelEdit = () => {
    setProfile(originalProfile);
    setIsEditing(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Déconnexion réussie');
    } catch (error) {
      toast.error('Erreur lors de la déconnexion');
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'En attente';
      case 'processing': return 'En cours';
      case 'shipped': return 'Expédiée';
      case 'delivered': return 'Livrée';
      case 'cancelled': return 'Annulée';
      default: return status;
    }
  };

  const tabs = [
    {
      id: 'profile',
      label: 'Profil',
      content: (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Informations personnelles</h3>
            {!isEditing ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsEditing(true)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Modifier
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCancelEdit}
                >
                  <X className="h-4 w-4 mr-2" />
                  Annuler
                </Button>
                <Button
                  size="sm"
                  onClick={handleSaveProfile}
                  loading={isLoading}
                >
                  <Save className="h-4 w-4 mr-2" />
                  Enregistrer
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <Input
                value={profile.firstName}
                onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <Input
                value={profile.lastName}
                onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <Input
              type="email"
              value={profile.email}
              onChange={(e) => setProfile({ ...profile, email: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Téléphone
            </label>
            <Input
              type="tel"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Adresse
            </label>
            <Input
              value={profile.address}
              onChange={(e) => setProfile({ ...profile, address: e.target.value })}
              disabled={!isEditing}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ville
              </label>
              <Input
                value={profile.city}
                onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Code postal
              </label>
              <Input
                value={profile.postalCode}
                onChange={(e) => setProfile({ ...profile, postalCode: e.target.value })}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Pays
              </label>
              <Input
                value={profile.country}
                onChange={(e) => setProfile({ ...profile, country: e.target.value })}
                disabled={!isEditing}
              />
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'orders',
      label: 'Commandes',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Historique des commandes</h3>
          
          {mockOrders.length === 0 ? (
            <div className="text-center py-8">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucune commande pour le moment</p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockOrders.map((order) => (
                <div key={order.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium text-gray-900">{order.id}</h4>
                      <p className="text-sm text-gray-500">
                        {new Date(order.date).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                        {getStatusText(order.status)}
                      </span>
                      <span className="font-medium text-gray-900">
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">
                          {item.name} x{item.quantity}
                        </span>
                        <span className="text-gray-900">
                          {formatPrice(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <Button variant="outline" size="sm">
                      Voir les détails
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'wishlist',
      label: 'Favoris',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Mes favoris</h3>
          
          {mockWishlist.length === 0 ? (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">Aucun favori pour le moment</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockWishlist.map((item) => (
                <div key={item.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-3">
                    <div className="w-full h-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center">
                      <span className="text-xs text-gray-500">Image</span>
                    </div>
                  </div>
                  <h4 className="font-medium text-gray-900 mb-2">{item.name}</h4>
                  <p className="text-lg font-bold text-gray-900 mb-3">
                    {formatPrice(item.price)}
                  </p>
                  <Button size="sm" className="w-full">
                    Ajouter au panier
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      ),
    },
    {
      id: 'settings',
      label: 'Paramètres',
      content: (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-gray-900">Paramètres du compte</h3>
          
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Notifications</h4>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm text-gray-700">Notifications par email</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" defaultChecked />
                  <span className="text-sm text-gray-700">Notifications SMS</span>
                </label>
                <label className="flex items-center">
                  <input type="checkbox" className="mr-2" />
                  <span className="text-sm text-gray-700">Notifications push</span>
                </label>
              </div>
            </div>
            
            <div className="border border-gray-200 rounded-lg p-4">
              <h4 className="font-medium text-gray-900 mb-2">Sécurité</h4>
              <div className="space-y-2">
                <Button variant="outline" size="sm">
                  Changer le mot de passe
                </Button>
                <Button variant="outline" size="sm">
                  Activer l'authentification à deux facteurs
                </Button>
              </div>
            </div>
            
            <div className="border border-red-200 rounded-lg p-4 bg-red-50">
              <h4 className="font-medium text-red-900 mb-2">Zone de danger</h4>
              <p className="text-sm text-red-700 mb-3">
                Ces actions sont irréversibles. Veuillez faire attention.
              </p>
              <Button
                variant="danger"
                size="sm"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Breadcrumbs 
            items={[
              { label: 'Accueil', href: '/' },
              { label: 'Mon Profil', current: true }
            ]}
          />
          <h1 className="text-3xl font-bold text-gray-900 mt-4">
            Mon Profil
          </h1>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
              {profile.firstName.charAt(0)}{profile.lastName.charAt(0)}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-gray-600">{profile.email}</p>
              <p className="text-sm text-gray-500">Membre depuis {new Date().getFullYear()}</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm">
          <Tabs tabs={tabs} className="p-6" />
        </div>
      </div>
    </div>
  );
} 