'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/lib/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { User } from '@/types';
import { Search, Edit, Trash2, UserPlus, Shield, User as UserIcon } from 'lucide-react';
import { toast } from 'react-hot-toast';

// Données mockées pour les utilisateurs
const mockUsers: User[] = [
  {
    id: '1',
    email: 'superadmin@afrovibz.com',
    displayName: 'Super Administrateur AFROVIBZ',
    role: 'super_admin',
    photoURL: '/images/avatar-admin.png',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'vendeuse1@afrovibz.com',
    displayName: 'Vendeuse Marie',
    role: 'vendeuse',
    photoURL: '/images/avatar-vendeuse.png',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    email: 'client@afrovibz.com',
    displayName: 'Client Test',
    role: 'user',
    photoURL: '/images/avatar-user.png',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

export default function AdminUsersPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    if (!loading && (!user || user.role !== 'super_admin')) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === 'all' || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      'super_admin': { color: 'bg-red-100 text-red-800', label: 'Super Admin' },
      'admin': { color: 'bg-purple-100 text-purple-800', label: 'Admin' },
      'vendeuse': { color: 'bg-blue-100 text-blue-800', label: 'Vendeuse' },
      'user': { color: 'bg-gray-100 text-gray-800', label: 'Client' },
    };
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.user;
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.color}`}>
        {config.label}
      </span>
    );
  };

  const handleDeleteUser = (userId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer cet utilisateur ?')) {
      setUsers(users.filter(u => u.id !== userId));
      toast.success('Utilisateur supprimé avec succès');
    }
  };

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Chargement...</div>;
  }

  if (!user || user.role !== 'super_admin') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Gestion des Utilisateurs</h1>
          <p className="mt-2 text-gray-600">Gérez les comptes utilisateurs de votre plateforme</p>
        </div>

        {/* Actions Bar */}
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex flex-col sm:flex-row gap-4 flex-1">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Rechercher un utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Role Filter */}
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option value="all">Tous les rôles</option>
                <option value="super_admin">Super Admin</option>
                <option value="admin">Admin</option>
                <option value="vendeuse">Vendeuse</option>
                <option value="user">Client</option>
              </select>
            </div>

            {/* Add User Button */}
            <Button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2"
            >
              <UserPlus className="h-4 w-4" />
              Ajouter un utilisateur
            </Button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Utilisateur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rôle
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date d'inscription
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0">
                          <img
                            className="h-10 w-10 rounded-full object-cover"
                            src={userItem.photoURL || '/images/avatar-placeholder.svg'}
                            alt={userItem.displayName || 'Utilisateur'}
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">
                            {userItem.displayName || 'Nom non défini'}
                          </div>
                          <div className="text-sm text-gray-500">ID: {userItem.id}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {userItem.email || 'Email non défini'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getRoleBadge(userItem.role)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {userItem.createdAt.toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => {/* TODO: Edit user */}}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Edit className="h-4 w-4" />
                        </button>
                        {userItem.id !== user.id && (
                          <button
                            onClick={() => handleDeleteUser(userItem.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Empty State */}
        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <UserIcon className="h-12 w-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aucun utilisateur trouvé</h3>
            <p className="text-gray-500">Aucun utilisateur ne correspond à vos critères de recherche.</p>
          </div>
        )}
      </div>
    </div>
  );
} 