import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { SheinHeader } from "@/components/layout/SheinHeader";
import { Footer } from "@/components/layout/Footer";
import { Providers } from "@/components/Providers";
import { Toaster } from "react-hot-toast";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: {
    default: "AFRO🗼VIBZ - Mode Africaine au Gabon",
    template: "%s | AFRO🗼VIBZ"
  },
  description: "Découvrez les dernières tendances de mode africaine avec livraison rapide au Gabon. Vêtements, accessoires et plus encore sur AFRO🗼VIBZ.",
  keywords: ["mode africaine", "vêtements", "Gabon", "livraison", "fashion", "afrovibz", "wax", "pagne", "boubou"],
  authors: [{ name: "AFRO🗼VIBZ" }],
  creator: "AFRO🗼VIBZ",
  publisher: "AFRO🗼VIBZ",
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
    title: "AFRO🗼VIBZ - Mode Africaine au Gabon",
    description: "Découvrez les dernières tendances de mode africaine avec livraison rapide au Gabon.",
    type: "website",
    locale: "fr_FR",
    siteName: "AFRO🗼VIBZ",
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'AFRO🗼VIBZ - Mode Africaine',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AFRO🗼VIBZ - Mode Africaine au Gabon',
    description: 'Découvrez les dernières tendances de mode africaine avec livraison rapide au Gabon.',
    images: ['/images/og-image.jpg'],
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
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className={inter.variable}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AFRO🗼VIBZ" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#000000" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* Preconnect to external domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        
        {/* DNS Prefetch */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      </head>
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <SheinHeader />
            <main className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                fontSize: '14px',
                maxWidth: '400px',
              },
              success: {
                style: {
                  background: '#10b981',
                },
              },
              error: {
                style: {
                  background: '#ef4444',
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
