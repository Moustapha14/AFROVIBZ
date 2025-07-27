'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { toast } from 'react-hot-toast';

export default function LoginPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <h1 className="text-3xl font-bold text-gray-900">AFRO🗼VIBZ</h1>
        </div>
        <h2 className="text-xl xs:text-2xl sm:text-3xl font-bold text-gray-900 text-center mt-6">
          Connexion
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
    </div>
  );
} 