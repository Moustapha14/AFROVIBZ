'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { AnimatedLogo } from '@/components/ui/AnimatedLogo';
import { SocialAuthButtons } from '@/components/auth/SocialAuthButtons';
import { PhoneAuthModal } from '@/components/auth/PhoneAuthModal';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isPhoneModalOpen, setIsPhoneModalOpen] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const result = await login(formData.email, formData.password);
      
      if (result.success) {
        toast.success(result.message);
        router.push('/');
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error('Une erreur est survenue lors de la connexion');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhoneAuth = () => {
    setIsPhoneModalOpen(true);
  };

  const handleGoogleAuth = () => {
    // Simulation de l'authentification Google
    toast.loading('Connexion avec Google...', { duration: 2000 });
    setTimeout(() => {
      toast.success('Authentification Google simulée !');
      // Ici vous intégreriez la vraie authentification Google
    }, 2000);
  };

  const handlePhoneAuthSuccess = () => {
    toast.success('Connexion par téléphone réussie !');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-400 via-orange-400 to-red-500 sm:bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Éléments décoratifs pour mobile */}
      <div className="absolute inset-0 sm:hidden">
        {/* Cercles décoratifs */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-8 w-16 h-16 bg-white/20 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-6 w-12 h-12 bg-yellow-300/30 rounded-full animate-ping"></div>
        <div className="absolute bottom-40 right-12 w-8 h-8 bg-white/15 rounded-full"></div>
        
        {/* Motifs africains stylisés */}
        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
          <div className="w-6 h-6 border-2 border-white/20 rotate-45"></div>
        </div>
        <div className="absolute bottom-1/3 right-6">
          <div className="w-4 h-4 border-2 border-yellow-300/40 rotate-45"></div>
        </div>
      </div>
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <AnimatedLogo className="mb-6" size="xl" />
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-white sm:text-gray-900 text-center drop-shadow-lg sm:drop-shadow-none">
          Connexion
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-white/95 backdrop-blur-sm sm:bg-white py-8 px-4 shadow-2xl sm:shadow rounded-2xl sm:rounded-lg sm:px-10 border border-white/20 sm:border-transparent">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-xs xs:text-sm font-medium text-gray-700">
                Adresse email
              </label>
              <div className="mt-1">
                <Input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="votre@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-xs xs:text-sm font-medium text-gray-700">
                Mot de passe
              </label>
              <div className="mt-1">
                <PasswordInput
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Votre mot de passe"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link href="/auth/register" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Pas encore de compte ?
                </Link>
              </div>
            </div>

            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Connexion...' : 'Se connecter'}
              </Button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Ou</span>
              </div>
            </div>

            {/* Authentification sociale */}
            <div className="mt-6">
              <SocialAuthButtons
                onPhoneAuth={handlePhoneAuth}
                onGoogleAuth={handleGoogleAuth}
                disabled={isLoading}
              />
            </div>

            {/* Séparateur */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500">Comptes de test</span>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Remplir automatiquement avec un compte de test
                  setFormData({
                    email: 'superadmin@afrovibz.com',
                    password: 'admin123'
                  });
                }}
              >
                Tester avec Super Admin
              </Button>
            </div>

            <div className="mt-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Remplir automatiquement avec un compte vendeuse
                  setFormData({
                    email: 'vendeuse1@afrovibz.com',
                    password: 'vendeuse123'
                  });
                }}
              >
                Tester avec Vendeuse
              </Button>
            </div>

            <div className="mt-3">
              <Button
                type="button"
                variant="outline"
                className="w-full"
                onClick={() => {
                  // Remplir automatiquement avec un compte client
                  setFormData({
                    email: 'client@afrovibz.com',
                    password: 'client123'
                  });
                }}
              >
                Tester avec Client
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal d'authentification par téléphone */}
      <PhoneAuthModal
        isOpen={isPhoneModalOpen}
        onClose={() => setIsPhoneModalOpen(false)}
        onSuccess={handlePhoneAuthSuccess}
      />
    </div>
  );
} 