'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  MapPin, 
  Plus, 
  Edit, 
  Trash2, 
  CheckCircle, 
  Home, 
  Building, 
  User,
  Phone,
  Mail
} from 'lucide-react';
import { toast } from 'react-hot-toast';

interface Address {
  id: string;
  type: 'home' | 'work' | 'other';
  name: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  isDefaultBilling: boolean;
  notes?: string;
}

// Données mockées pour les adresses
const mockAddresses: Address[] = [
  {
    id: '1',
    type: 'home',
    name: 'Domicile',
    firstName: 'Jean',
    lastName: 'Dupont',
    phone: '+241 01 23 45 67',
    email: 'jean.dupont@email.com',
    address: '123 Rue de la Paix',
    city: 'Libreville',
    postalCode: '0000',
    country: 'Gabon',
    isDefault: true,
    isDefaultBilling: true,
    notes: 'Code d\'entrée: 1234',
  },
  {
    id: '2',
    type: 'work',
    name: 'Bureau',
    firstName: 'Jean',
    lastName: 'Dupont',
    phone: '+241 02 34 56 78',
    email: 'jean.dupont@entreprise.com',
    address: '456 Avenue des Palmiers, Immeuble Commerce, 3ème étage',
    city: 'Libreville',
    postalCode: '0000',
    country: 'Gabon',
    isDefault: false,
    isDefaultBilling: false,
    notes: 'Réception au rez-de-chaussée',
  },
];

export default function ClientAddressesPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [addresses, setAddresses] = useState<Address[]>(mockAddresses);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const [formData, setFormData] = useState<Omit<Address, 'id'>>({
    type: 'home',
    name: '',
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Gabon',
    isDefault: false,
    isDefaultBilling: false,
    notes: '',
  });

  useEffect(() => {
    if (!loading && (!user || user.role !== 'user')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const handleInputChange = (field: keyof typeof formData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleAddAddress = () => {
    if (!formData.name || !formData.firstName || !formData.lastName || !formData.address || !formData.city) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    const newAddress: Address = {
      ...formData,
      id: Date.now().toString(),
    };

    // Gérer les adresses par défaut
    if (formData.isDefault) {
      setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
    }
    if (formData.isDefaultBilling) {
      setAddresses(prev => prev.map(addr => ({ ...addr, isDefaultBilling: false })));
    }

    setAddresses(prev => [...prev, newAddress]);
    setIsAddModalOpen(false);
    resetForm();
    toast.success('Adresse ajoutée avec succès');
  };

  const handleEditAddress = () => {
    if (!selectedAddress) return;

    if (!formData.name || !formData.firstName || !formData.lastName || !formData.address || !formData.city) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    // Gérer les adresses par défaut
    if (formData.isDefault) {
      setAddresses(prev => prev.map(addr => ({ ...addr, isDefault: false })));
    }
    if (formData.isDefaultBilling) {
      setAddresses(prev => prev.map(addr => ({ ...addr, isDefaultBilling: false })));
    }

    setAddresses(prev => prev.map(addr => 
      addr.id === selectedAddress.id ? { ...addr, ...formData } : addr
    ));
    setIsEditModalOpen(false);
    setSelectedAddress(null);
    resetForm();
    toast.success('Adresse modifiée avec succès');
  };

  const handleDeleteAddress = (addressId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette adresse ?')) {
      setAddresses(prev => prev.filter(addr => addr.id !== addressId));
      toast.success('Adresse supprimée avec succès');
    }
  };

  const handleSetDefault = (addressId: string, type: 'shipping' | 'billing') => {
    setAddresses(prev => prev.map(addr => ({
      ...addr,
      isDefault: type === 'shipping' ? addr.id === addressId : addr.isDefault,
      isDefaultBilling: type === 'billing' ? addr.id === addressId : addr.isDefaultBilling,
    })));
    toast.success(`Adresse définie comme ${type === 'shipping' ? 'livraison' : 'facturation'} par défaut`);
  };

  const openEditModal = (address: Address) => {
    setSelectedAddress(address);
    setFormData({
      type: address.type,
      name: address.name,
      firstName: address.firstName,
      lastName: address.lastName,
      phone: address.phone,
      email: address.email,
      address: address.address,
      city: address.city,
      postalCode: address.postalCode,
      country: address.country,
      isDefault: address.isDefault,
      isDefaultBilling: address.isDefaultBilling,
      notes: address.notes || '',
    });
    setIsEditModalOpen(true);
  };

  const resetForm = () => {
    setFormData({
      type: 'home',
      name: '',
      firstName: '',
      lastName: '',
      phone: '',
      email: '',
      address: '',
      city: '',
      postalCode: '',
      country: 'Gabon',
      isDefault: false,
      isDefaultBilling: false,
      notes: '',
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'home':
        return <Home className="h-5 w-5" />;
      case 'work':
        return <Building className="h-5 w-5" />;
      default:
        return <MapPin className="h-5 w-5" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'home':
        return 'Domicile';
      case 'work':
        return 'Bureau';
      default:
        return 'Autre';
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Chargement...</div>;
  }

  if (!user || user.role !== 'user') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Mes Adresses</h1>
              <p className="mt-2 text-gray-600">Gérez vos adresses de livraison et de facturation</p>
            </div>
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Ajouter une adresse
            </Button>
          </div>
        </div>

        {/* Liste des adresses */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {/* En-tête de la carte */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    {getTypeIcon(address.type)}
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{address.name}</h3>
                    <p className="text-sm text-gray-500">{getTypeLabel(address.type)}</p>
                  </div>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => openEditModal(address)}
                    className="p-1 text-gray-400 hover:text-blue-600 transition-colors"
                    title="Modifier"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteAddress(address.id)}
                    className="p-1 text-gray-400 hover:text-red-600 transition-colors"
                    title="Supprimer"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Informations de l'adresse */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-sm">
                  <User className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">
                    {address.firstName} {address.lastName}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{address.phone}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-gray-400" />
                  <span className="text-gray-900">{address.email}</span>
                </div>
                
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-gray-400 mt-0.5" />
                  <div className="text-gray-900">
                    <div>{address.address}</div>
                    <div>{address.postalCode} {address.city}</div>
                    <div>{address.country}</div>
                  </div>
                </div>

                {address.notes && (
                  <div className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                    <strong>Note :</strong> {address.notes}
                  </div>
                )}
              </div>

              {/* Badges par défaut */}
              <div className="flex flex-wrap gap-2 mb-4">
                {address.isDefault && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Livraison par défaut
                  </span>
                )}
                {address.isDefaultBilling && (
                  <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Facturation par défaut
                  </span>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                {!address.isDefault && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(address.id, 'shipping')}
                    className="flex-1"
                  >
                    Définir livraison
                  </Button>
                )}
                {!address.isDefaultBilling && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleSetDefault(address.id, 'billing')}
                    className="flex-1"
                  >
                    Définir facturation
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* État vide */}
        {addresses.length === 0 && (
          <div className="text-center py-12">
            <MapPin className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">Aucune adresse enregistrée</h3>
            <p className="mt-1 text-sm text-gray-500">
              Ajoutez votre première adresse pour faciliter vos commandes.
            </p>
            <div className="mt-6">
              <Button onClick={() => setIsAddModalOpen(true)}>
                Ajouter une adresse
              </Button>
            </div>
          </div>
        )}

        {/* Modal d'ajout/modification */}
        {(isAddModalOpen || isEditModalOpen) && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">
                  {isAddModalOpen ? 'Ajouter une adresse' : 'Modifier l\'adresse'}
                </h2>

                <div className="space-y-4">
                  {/* Type d'adresse */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type d'adresse *
                    </label>
                    <select
                      value={formData.type}
                      onChange={(e) => handleInputChange('type', e.target.value as 'home' | 'work' | 'other')}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="home">Domicile</option>
                      <option value="work">Bureau</option>
                      <option value="other">Autre</option>
                    </select>
                  </div>

                  {/* Nom de l'adresse */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de l'adresse *
                    </label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Ex: Domicile, Bureau, etc."
                    />
                  </div>

                  {/* Prénom et nom */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Prénom *
                      </label>
                      <Input
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        placeholder="Prénom"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Nom *
                      </label>
                      <Input
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        placeholder="Nom"
                      />
                    </div>
                  </div>

                  {/* Téléphone et email */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Téléphone
                      </label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="+241 01 23 45 67"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <Input
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="email@example.com"
                        type="email"
                      />
                    </div>
                  </div>

                  {/* Adresse */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Adresse *
                    </label>
                    <Input
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="123 Rue de la Paix"
                    />
                  </div>

                  {/* Ville et code postal */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Ville *
                      </label>
                      <Input
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        placeholder="Libreville"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Code postal
                      </label>
                      <Input
                        value={formData.postalCode}
                        onChange={(e) => handleInputChange('postalCode', e.target.value)}
                        placeholder="0000"
                      />
                    </div>
                  </div>

                  {/* Pays */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pays
                    </label>
                    <Input
                      value={formData.country}
                      onChange={(e) => handleInputChange('country', e.target.value)}
                      placeholder="Gabon"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Notes (optionnel)
                    </label>
                    <textarea
                      value={formData.notes}
                      onChange={(e) => handleInputChange('notes', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Code d'entrée, instructions de livraison, etc."
                    />
                  </div>

                  {/* Options par défaut */}
                  <div className="space-y-3">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isDefault}
                        onChange={(e) => handleInputChange('isDefault', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Définir comme adresse de livraison par défaut
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isDefaultBilling}
                        onChange={(e) => handleInputChange('isDefaultBilling', e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">
                        Définir comme adresse de facturation par défaut
                      </span>
                    </label>
                  </div>
                </div>

                {/* Boutons d'action */}
                <div className="flex gap-3 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsAddModalOpen(false);
                      setIsEditModalOpen(false);
                      setSelectedAddress(null);
                      resetForm();
                    }}
                    className="flex-1"
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={isAddModalOpen ? handleAddAddress : handleEditAddress}
                    className="flex-1"
                  >
                    {isAddModalOpen ? 'Ajouter' : 'Modifier'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 