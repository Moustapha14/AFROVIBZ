'use client';

import { Download, FileText, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import React, { useState } from 'react';
import { toast } from 'react-hot-toast';

import { Button } from '@/components/ui/Button';

interface InvoiceDownloadProps {
  invoiceId: string;
  variant?: 'primary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  showIcon?: boolean;
  showText?: boolean;
  onSuccess?: () => void;
  onError?: (error: string) => void;
}

export default function InvoiceDownload({
  invoiceId,
  variant = 'primary',
  size = 'md',
  className = '',
  showIcon = true,
  showText = true,
  onSuccess,
  onError,
}: InvoiceDownloadProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDownload = async () => {
    if (loading) return;

    setLoading(true);
    setSuccess(false);

    try {
      // Vérifier l'authentification
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Vous devez être connecté pour télécharger cette facture');
      }

      // Appeler l'API de téléchargement
      const response = await fetch(`/api/invoices/${invoiceId}/download`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erreur ${response.status}: ${response.statusText}`);
      }

      // Télécharger le fichier
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture-${invoiceId}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      // Succès
      setSuccess(true);
      toast.success('Facture téléchargée avec succès');
      onSuccess?.();

      // Reset success state after 2 seconds
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du téléchargement';
      toast.error(errorMessage);
      onError?.(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const getButtonContent = () => {
    if (success) {
      return (
        <>
          <CheckCircle className='h-4 w-4' />
          {showText && <span>Téléchargé</span>}
        </>
      );
    }

    if (loading) {
      return (
        <>
          <Loader2 className='h-4 w-4 animate-spin' />
          {showText && <span>Téléchargement...</span>}
        </>
      );
    }

    return (
      <>
        {showIcon && <Download className='h-4 w-4' />}
        {showText && <span>Télécharger PDF</span>}
      </>
    );
  };

  const getButtonVariant = () => {
    if (success) return 'outline';
    return variant;
  };

  const getButtonSize = () => {
    switch (size) {
      case 'sm':
        return 'text-xs px-3 py-2 min-h-[36px]';
      case 'lg':
        return 'text-base px-6 py-3 min-h-[52px]';
      default:
        return 'text-sm px-4 py-2 min-h-[44px]';
    }
  };

  return (
    <Button
      onClick={handleDownload}
      disabled={loading}
      variant={getButtonVariant()}
      className={`
        inline-flex items-center justify-center gap-2 
        font-medium rounded-lg transition-all duration-150
        touch-manipulation focus:outline-none focus:ring-2 
        focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:pointer-events-none
        active:scale-95
        ${getButtonSize()}
        ${success ? 'text-green-700 border-green-300 bg-green-50' : ''}
        ${className}
      `}
      title={loading ? 'Téléchargement en cours...' : `Télécharger la facture ${invoiceId}`}
    >
      {getButtonContent()}
    </Button>
  );
}

// Composant compact pour les tableaux
export function InvoiceDownloadCompact({ invoiceId }: { invoiceId: string }) {
  return (
    <InvoiceDownload
      invoiceId={invoiceId}
      variant='ghost'
      size='sm'
      showText={false}
      className='p-2 hover:bg-gray-100'
    />
  );
}

// Composant avec statut avancé
export function InvoiceDownloadWithStatus({
  invoiceId,
  status = 'available',
}: {
  invoiceId: string;
  status?: 'available' | 'processing' | 'error' | 'unavailable';
}) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    if (status !== 'available' || loading) return;
    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentification requise');
        return;
      }

      const response = await fetch(`/api/invoices/${invoiceId}/download`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error('Erreur de téléchargement');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `facture-${invoiceId}.pdf`;
      a.click();
      window.URL.revokeObjectURL(url);

      toast.success('Facture téléchargée');
    } catch (error) {
      toast.error('Erreur lors du téléchargement');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = () => {
    switch (status) {
      case 'available':
        return {
          icon: Download,
          text: 'Télécharger',
          className: 'text-blue-600 hover:text-blue-700',
          disabled: false,
        };
      case 'processing':
        return {
          icon: Loader2,
          text: 'Génération...',
          className: 'text-yellow-600',
          disabled: true,
        };
      case 'error':
        return {
          icon: AlertCircle,
          text: 'Erreur',
          className: 'text-red-600',
          disabled: true,
        };
      case 'unavailable':
        return {
          icon: FileText,
          text: 'Non disponible',
          className: 'text-gray-400',
          disabled: true,
        };
      default:
        return {
          icon: Download,
          text: 'Télécharger',
          className: 'text-blue-600',
          disabled: false,
        };
    }
  };

  const config = getStatusConfig();
  const IconComponent = config.icon;

  return (
    <button
      onClick={handleDownload}
      disabled={config.disabled || loading}
      className={`
        inline-flex items-center gap-2 px-3 py-2 text-sm font-medium
        rounded-md transition-colors duration-150
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        disabled:opacity-50 disabled:cursor-not-allowed
        min-h-[44px] touch-manipulation
        ${config.className}
      `}
    >
      <IconComponent className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
      <span>{loading ? 'Téléchargement...' : config.text}</span>
    </button>
  );
}
