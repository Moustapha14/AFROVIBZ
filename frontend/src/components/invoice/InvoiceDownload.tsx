'use client';

import { Download, FileText, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-hot-toast';

interface InvoiceDownloadProps {
  invoiceId: string;
  orderNumber?: string;
  className?: string;
}

export default function InvoiceDownload({
  invoiceId,
  orderNumber = 'Facture',
  className = '',
}: InvoiceDownloadProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleDownload = async () => {
    if (loading) return;

    setLoading(true);
    setSuccess(false);

    try {
      // Récupération du token d'authentification
      const token = localStorage.getItem('authToken') || 'valid-token'; // Simulation

      const response = await fetch(`/api/invoices/${invoiceId}/download`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Erreur lors du téléchargement');
      }

      // Création du blob et téléchargement
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `facture-${orderNumber}.pdf`;

      // Déclenchement du téléchargement
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // Nettoyage
      window.URL.revokeObjectURL(url);

      setSuccess(true);
      toast.success('Facture téléchargée avec succès !');

      // Reset du succès après 2 secondes
      setTimeout(() => setSuccess(false), 2000);
    } catch (error) {
      console.error('Erreur de téléchargement:', error);

      const errorMessage = error instanceof Error ? error.message : 'Erreur lors du téléchargement';
      toast.error(errorMessage);

      // Gestion des erreurs spécifiques
      if (errorMessage.includes('401')) {
        toast.error('Veuillez vous reconnecter pour télécharger la facture');
      } else if (errorMessage.includes('404')) {
        toast.error('Facture non trouvée');
      } else if (errorMessage.includes('403')) {
        toast.error("Vous n'avez pas l'autorisation de télécharger cette facture");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={`
        flex items-center justify-center gap-2 
        min-h-[44px] px-4 sm:px-6 py-3 
        bg-blue-600 hover:bg-blue-700 active:bg-blue-800
        disabled:bg-gray-400 disabled:cursor-not-allowed
        text-white font-medium rounded-lg
        transition-all duration-150 ease-in-out
        touch-manipulation
        w-full sm:w-auto
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
        active:scale-95
        shadow-sm hover:shadow-md
        ${className}
      `}
      aria-label={`Télécharger la facture ${orderNumber}`}
    >
      {loading ? (
        <>
          <Loader2 className='w-4 h-4 animate-spin' aria-hidden='true' />
          <span className='text-sm sm:text-base'>Génération...</span>
        </>
      ) : success ? (
        <>
          <CheckCircle className='w-4 h-4' aria-hidden='true' />
          <span className='text-sm sm:text-base'>Téléchargé !</span>
        </>
      ) : (
        <>
          <Download className='w-4 h-4' aria-hidden='true' />
          <span className='text-sm sm:text-base'>Télécharger PDF</span>
        </>
      )}
    </button>
  );
}

// Composant de carte de facture pour mobile
export function InvoiceCard({
  invoiceId,
  orderNumber,
  amount,
  date,
  status,
}: {
  invoiceId: string;
  orderNumber: string;
  amount: number;
  date: string;
  status: 'paid' | 'pending' | 'cancelled';
}) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payé';
      case 'pending':
        return 'En attente';
      case 'cancelled':
        return 'Annulé';
      default:
        return 'Inconnu';
    }
  };

  return (
    <div
      className='
      bg-white rounded-xl shadow-sm border border-gray-200
      p-4 space-y-4
      touch-manipulation
      hover:shadow-md transition-shadow duration-200
    '
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-3'>
          <div className='w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center'>
            <FileText className='w-5 h-5 text-blue-600' aria-hidden='true' />
          </div>
          <div>
            <h3 className='font-semibold text-gray-900 text-sm sm:text-base'>{orderNumber}</h3>
            <p className='text-xs text-gray-500'>{new Date(date).toLocaleDateString('fr-FR')}</p>
          </div>
        </div>
        <div className='text-right'>
          <p className='font-bold text-gray-900 text-sm sm:text-base'>
            {amount.toLocaleString('fr-FR')} FCFA
          </p>
          <span
            className={`
            inline-block px-2 py-1 rounded-full text-xs font-medium
            ${getStatusColor(status)}
          `}
          >
            {getStatusText(status)}
          </span>
        </div>
      </div>

      <div className='flex gap-2'>
        <InvoiceDownload invoiceId={invoiceId} orderNumber={orderNumber} className='flex-1' />

        <button
          className='
            flex items-center justify-center
            min-h-[44px] px-3 py-3
            bg-gray-100 hover:bg-gray-200 active:bg-gray-300
            text-gray-700 font-medium rounded-lg
            transition-colors duration-150
            touch-manipulation
            focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2
            active:scale-95
          '
          aria-label='Voir les détails de la facture'
        >
          <span className='sr-only'>Détails</span>
          <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5l7 7-7 7' />
          </svg>
        </button>
      </div>
    </div>
  );
}

// Composant de liste de factures pour mobile
export function InvoiceList({
  invoices,
}: {
  invoices: Array<{
    id: string;
    orderNumber: string;
    amount: number;
    date: string;
    status: 'paid' | 'pending' | 'cancelled';
  }>;
}) {
  if (invoices.length === 0) {
    return (
      <div
        className='
        text-center py-12 px-4
        bg-gray-50 rounded-xl
      '
      >
        <FileText className='w-12 h-12 text-gray-400 mx-auto mb-4' aria-hidden='true' />
        <h3 className='text-lg font-medium text-gray-900 mb-2'>Aucune facture trouvée</h3>
        <p className='text-gray-500 text-sm'>Vos factures apparaîtront ici après vos commandes</p>
      </div>
    );
  }

  return (
    <div className='space-y-4'>
      {invoices.map(invoice => (
        <InvoiceCard
          key={invoice.id}
          invoiceId={invoice.id}
          orderNumber={invoice.orderNumber}
          amount={invoice.amount}
          date={invoice.date}
          status={invoice.status}
        />
      ))}
    </div>
  );
}
