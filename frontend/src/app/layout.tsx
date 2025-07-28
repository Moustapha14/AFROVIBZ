import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/Providers'
import { Toaster } from 'react-hot-toast'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'
import { StagewiseToolbar } from '@stagewise/toolbar-next'
import ReactPlugin from '@stagewise-plugins/react'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'AFRO🗼VIBZ - Mode Africaine Moderne & Tech | Livraison Rapide au Gabon',
  description: 'Découvrez notre collection unique de mode africaine contemporaine et d\'accessoires tech. Livraison rapide partout au Gabon. Vêtements traditionnels et modernes, smartphones, ordinateurs.',
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Header />
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
              },
            }}
          />
          <StagewiseToolbar
            config={{
              plugins: [ReactPlugin],
            }}
          />
        </Providers>
      </body>
    </html>
  )
}
