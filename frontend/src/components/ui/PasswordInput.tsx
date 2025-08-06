'use client';

import { Eye, EyeOff, Lock, Shield } from 'lucide-react';
import React, { useState } from 'react';

import { Input } from './Input';

interface PasswordInputProps {
  id?: string;
  name?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  autoComplete?: string;
  className?: string;
  error?: boolean;
  disabled?: boolean;
  icon?: 'lock' | 'shield';
}

export function PasswordInput({
  id,
  name,
  value,
  onChange,
  placeholder = 'Mot de passe',
  required = false,
  autoComplete = 'current-password',
  className = '',
  error = false,
  disabled = false,
  icon = 'lock',
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const IconComponent = icon === 'shield' ? Shield : Lock;

  return (
    <div className='relative'>
      <Input
        id={id}
        name={name}
        type={showPassword ? 'text' : 'password'}
        autoComplete={autoComplete}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`pl-10 pr-12 ${className} ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''}`}
        disabled={disabled}
      />

      {/* Icône */}
      <IconComponent className='absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400' />

      {/* Bouton pour afficher/masquer le mot de passe */}
      <button
        type='button'
        onClick={togglePasswordVisibility}
        className='absolute right-3 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 rounded'
        disabled={disabled}
        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
      >
        {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
      </button>
    </div>
  );
}
