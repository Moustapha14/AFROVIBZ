import { useState, useEffect, createContext, useContext } from 'react';
import { User } from '@/types';

// Données mockées pour les comptes de test
const mockUsers = [
  {
    id: '1',
    email: 'superadmin@afrovibz.com',
    displayName: 'Super Administrateur AFROVIBZ',
    role: 'super_admin' as const,
    photoURL: '/images/avatar-admin.png',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '2',
    email: 'vendeuse1@afrovibz.com',
    displayName: 'Vendeuse Marie',
    role: 'vendeuse' as const,
    photoURL: '/images/avatar-vendeuse.png',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '3',
    email: 'vendeuse2@afrovibz.com',
    displayName: 'Vendeuse Sophie',
    role: 'vendeuse' as const,
    photoURL: '/images/avatar-vendeuse.png',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
  {
    id: '4',
    email: 'client@afrovibz.com',
    displayName: 'Client Test',
    role: 'user' as const,
    photoURL: '/images/avatar-user.png',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01'),
  },
];

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  register: (email: string, password: string, displayName: string) => Promise<{ success: boolean; message: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Vérifier si un utilisateur est connecté au chargement
    const savedUser = localStorage.getItem('mockUser');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; message: string }> => {
    // Simulation d'un délai de connexion
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Vérifier les identifiants mockés
    const mockUser = mockUsers.find(u => u.email === email);
    
    if (!mockUser) {
      return { success: false, message: 'Email ou mot de passe incorrect' };
    }

    // Vérifier le mot de passe (simulation simple)
    const expectedPasswords = {
      'superadmin@afrovibz.com': 'admin123',
      'vendeuse1@afrovibz.com': 'vendeuse123',
      'vendeuse2@afrovibz.com': 'vendeuse123',
      'client@afrovibz.com': 'client123',
    };

    if (expectedPasswords[email as keyof typeof expectedPasswords] !== password) {
      return { success: false, message: 'Email ou mot de passe incorrect' };
    }

    // Connexion réussie
    setUser(mockUser);
    localStorage.setItem('mockUser', JSON.stringify(mockUser));
    localStorage.setItem('mockToken', 'mock-jwt-token-' + mockUser.id);
    
    return { success: true, message: 'Connexion réussie' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mockUser');
    localStorage.removeItem('mockToken');
  };

  const register = async (email: string, password: string, displayName: string): Promise<{ success: boolean; message: string }> => {
    // Simulation d'un délai d'inscription
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Vérifier si l'email existe déjà
    if (mockUsers.find(u => u.email === email)) {
      return { success: false, message: 'Cet email est déjà utilisé' };
    }

    // Créer un nouvel utilisateur
    const newUser: User = {
      id: Date.now().toString(),
      email: email, // Assurer que email est défini
      displayName: displayName, // Assurer que displayName est défini
      role: 'user',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Ajouter à la liste mockée (en mémoire seulement)
    mockUsers.push(newUser as any); // Type assertion pour éviter le conflit de type

    // Connecter automatiquement l'utilisateur
    setUser(newUser);
    localStorage.setItem('mockUser', JSON.stringify(newUser));
    localStorage.setItem('mockToken', 'mock-jwt-token-' + newUser.id);

    return { success: true, message: 'Inscription réussie' };
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 