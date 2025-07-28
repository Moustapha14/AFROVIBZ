import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/Providers';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Toaster } from 'react-hot-toast';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'AFRO🗼VIBZ - Mode Africaine Moderne & Tech | Livraison Rapide au Gabon',
    template: '%s | AFRO🗼VIBZ'
  },
  description: 'Découvrez notre collection unique de mode africaine contemporaine et d\'accessoires tech. Livraison rapide partout au Gabon. Vêtements traditionnels et modernes, smartphones, ordinateurs.',
  keywords: ['mode africaine', 'vêtements', 'tech', 'smartphones', 'ordinateurs', 'Gabon', 'livraison', 'fashion', 'afrovibz', 'wax', 'pagne', 'boubou'],
  authors: [{ name: 'AFRO🗼VIBZ' }],
  creator: 'AFRO🗼VIBZ',
  publisher: 'AFRO🗼VIBZ',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://afrovibz.ga'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'AFRO🗼VIBZ - Mode Africaine Moderne & Tech',
    description: 'Collection exclusive de mode africaine contemporaine et d\'accessoires tech. Livraison rapide au Gabon.',
    type: 'website',
    locale: 'fr_FR',
    siteName: 'AFRO🗼VIBZ',
    images: [
      {
        url: '/images/og-homepage.jpg',
        width: 1200,
        height: 630,
        alt: 'AFRO🗼VIBZ - Mode Africaine Moderne & Tech',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AFRO🗼VIBZ - Mode Africaine Moderne & Tech',
    description: 'Collection exclusive de mode africaine contemporaine et d\'accessoires tech. Livraison rapide au Gabon.',
    images: ['/images/og-homepage.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster 
            position="top-center"
            toastOptions={{
              duration: 3000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 4000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
