'use client';

import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PasswordInput } from '@/components/ui/PasswordInput';
import { toast } from 'react-hot-toast';

interface PhoneAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

// Comptes de test avec numéros de téléphone
const testPhoneAccounts = [
  { phone: '+241 01 23 45 67', password: 'phone123', name: 'Client Mobile 1' },
  { phone: '+241 06 12 34 56', password: 'phone123', name: 'Client Mobile 2' },
  { phone: '+241 07 98 76 54', password: 'phone123', name: 'Client Mobile 3' },
];

export function PhoneAuthModal({ isOpen, onClose, onSuccess }: PhoneAuthModalProps) {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleLogin = async () => {
    if (!phoneNumber.trim()) {
      toast.error('Veuillez saisir un numéro de téléphone');
      return;
    }

    if (!password.trim()) {
      toast.error('Veuillez saisir votre mot de passe');
      return;
    }

    setIsLoading(true);
    
    // Simulation de vérification des identifiants
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Vérifier si c'est un compte de test valide
    const account = testPhoneAccounts.find(
      acc => acc.phone === phoneNumber && acc.password === password
    );

    if (!account) {
      setIsLoading(false);
      toast.error('Numéro de téléphone ou mot de passe incorrect');
      return;
    }

    setIsLoading(false);
    toast.success(`Connexion réussie ! Bienvenue ${account.name}`);
    onSuccess();
    handleClose();
  };

  const handleClose = () => {
    setPhoneNumber('');
    setPassword('');
    onClose();
  };

  const handleUseTestAccount = (account: typeof testPhoneAccounts[0]) => {
    setPhoneNumber(account.phone);
    setPassword(account.password);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
            Connexion par téléphone
          </h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-4">
          {/* Numéro de téléphone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Numéro de téléphone
            </label>
            <Input
              type="tel"
              placeholder="+241 XX XX XX XX"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              className="w-full"
              required
            />
          </div>

          {/* Mot de passe */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mot de passe
            </label>
            <PasswordInput
              placeholder="Votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full"
              required
            />
          </div>

          {/* Comptes de test */}
          <div className="border-t pt-4">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Comptes de test disponibles :
            </p>
            <div className="space-y-2">
              {testPhoneAccounts.map((account) => (
                <button
                  key={account.phone}
                  type="button"
                  onClick={() => handleUseTestAccount(account)}
                  className="block w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-md transition-colors"
                >
                  <div className="font-medium">{account.name}</div>
                  <div className="text-gray-600">{account.phone}</div>
                  <div className="text-xs text-gray-500">Mot de passe: {account.password}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Bouton de connexion */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6"
          >
            {isLoading ? 'Connexion...' : 'Se connecter'}
          </Button>
        </form>
      </div>
    </div>
  );
}