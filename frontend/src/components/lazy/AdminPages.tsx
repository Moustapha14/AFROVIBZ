import dynamic from 'next/dynamic';

// Dynamic imports pour les pages admin lourdes
export const AdminDashboard = dynamic(() => import('@/app/admin/dashboard/page'), {
  loading: () => (
    <div className='flex items-center justify-center min-h-screen'>
      Chargement du tableau de bord...
    </div>
  ),
  ssr: false,
});

export const AdminProducts = dynamic(() => import('@/app/admin/products/page'), {
  loading: () => (
    <div className='flex items-center justify-center min-h-screen'>Chargement des produits...</div>
  ),
  ssr: false,
});

export const AdminOrders = dynamic(() => import('@/app/admin/orders/page'), {
  loading: () => (
    <div className='flex items-center justify-center min-h-screen'>Chargement des commandes...</div>
  ),
  ssr: false,
});

export const AdminAnalytics = dynamic(() => import('@/app/admin/analytics/page'), {
  loading: () => (
    <div className='flex items-center justify-center min-h-screen'>Chargement des analytics...</div>
  ),
  ssr: false,
});

export const AdminInvoices = dynamic(() => import('@/app/admin/invoices/page'), {
  loading: () => (
    <div className='flex items-center justify-center min-h-screen'>Chargement des factures...</div>
  ),
  ssr: false,
});

// Composants admin lourds
export const ProductModal = dynamic(() => import('@/components/admin/ProductModal'), {
  loading: () => <div className='flex items-center justify-center p-8'>Chargement du modal...</div>,
  ssr: false,
});

export const ImageUpload = dynamic(() => import('@/components/admin/ImageUpload'), {
  loading: () => (
    <div className='flex items-center justify-center p-8'>Chargement de l'upload...</div>
  ),
  ssr: false,
});
