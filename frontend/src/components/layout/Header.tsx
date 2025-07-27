'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCart } from '@/lib/hooks/useCart';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  ShoppingBag, 
  User, 
  Search, 
  Menu, 
  X,
  Heart,
  Phone
} from 'lucide-react';
import { formatPrice } from '@/lib/utils';

export function Header() {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  // Fermer le menu mobile quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      // Empêcher le scroll du body quand le menu est ouvert
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      {/* Top bar */}
      <div className="bg-black text-white py-2 px-2 xs:px-4 text-center">
        <p className="truncate text-xs xs:text-sm">Livraison gratuite au Gabon à partir de 50,000 FCFA 🚚</p>
      </div>

      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12 xs:h-14 sm:h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-1 xs:space-x-2 flex-shrink-0 mr-4 lg:mr-0">
            <div className="h-8 w-8 xs:h-10 xs:w-10 sm:h-12 sm:w-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm xs:text-base sm:text-lg">
              AV
            </div>
            <span className="font-bold text-xs xs:text-sm sm:text-lg md:text-xl truncate">AFRO🗼VIBZ</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8 ml-8 xl:ml-12">
            <Link href="/products" className="text-gray-700 hover:text-black transition-colors font-medium">
              Femmes
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-black transition-colors font-medium">
              Hommes
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-black transition-colors font-medium">
              Enfants
            </Link>
            <Link href="/products" className="text-gray-700 hover:text-black transition-colors font-medium">
              Accessoires
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Rechercher des produits..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  aria-label="Rechercher des produits"
                />
              </div>
            </form>
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-1 xs:space-x-2 sm:space-x-4">
            {/* Wishlist - Desktop */}
            <Link href="/wishlist" className="hidden md:block p-2 text-gray-700 hover:text-black transition-colors" aria-label="Favoris">
              <Heart className="h-5 w-5" />
            </Link>

            {/* Cart */}
            <Link href="/cart" className="relative p-1 xs:p-2 text-gray-700 hover:text-black transition-colors" aria-label="Panier">
              <ShoppingBag className="h-4 w-4 xs:h-5 xs:w-5" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 xs:h-5 xs:w-5 flex items-center justify-center font-medium">
                  {getCartCount() > 99 ? '99+' : getCartCount()}
                </span>
              )}
            </Link>

            {/* User menu */}
            {user ? (
              <div className="relative group">
                <button 
                  className="flex items-center space-x-2 p-2 text-gray-700 hover:text-black transition-colors"
                  aria-label="Menu utilisateur"
                  aria-expanded="false"
                >
                  <User className="h-5 w-5" />
                  <span className="hidden sm:block text-sm font-medium">{user.displayName || 'Mon Compte'}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-gray-200">
                  <Link href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Mon Profil
                  </Link>
                  <Link href="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Mes Commandes
                  </Link>
                  {user.role === 'admin' && (
                    <Link href="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Administration
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Se déconnecter
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/auth/login">
                  <Button variant="outline" size="sm" className="hidden sm:inline-flex">
                    Se connecter
                  </Button>
                </Link>
                <Link href="/auth/register">
                  <Button size="sm" className="hidden sm:inline-flex">
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 text-gray-700 hover:text-black transition-colors"
              aria-label="Menu mobile"
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch}>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Rechercher des produits..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                aria-label="Rechercher des produits"
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div 
          ref={mobileMenuRef}
          className="lg:hidden fixed inset-0 z-50 bg-black bg-opacity-50"
          aria-modal="true"
          role="dialog"
        >
          <div className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h2 className="text-lg font-semibold">Menu</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2 text-gray-500 hover:text-gray-700"
                aria-label="Fermer le menu"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4 space-y-4">
              {/* User section */}
              {user ? (
                <div className="border-b pb-4">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-gray-600" />
                    </div>
                    <div>
                      <p className="font-medium">{user.displayName || 'Utilisateur'}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Link
                      href="/profile"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Mon Profil
                    </Link>
                    <Link
                      href="/orders"
                      className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Mes Commandes
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        href="/admin"
                        className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Administration
                      </Link>
                    )}
                    <button
                      onClick={() => {
                        handleLogout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="block w-full text-left px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      Se déconnecter
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-b pb-4">
                  <div className="space-y-2">
                    <Link
                      href="/auth/login"
                      className="block w-full text-center px-4 py-2 bg-black text-white rounded-md font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      Se connecter
                    </Link>
                    <Link
                      href="/auth/register"
                      className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 rounded-md font-medium"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      S'inscrire
                    </Link>
                  </div>
                </div>
              )}

              {/* Navigation links */}
              <div className="space-y-2">
                <Link
                  href="/products"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Femmes
                </Link>
                <Link
                  href="/products"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Hommes
                </Link>
                <Link
                  href="/products"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Enfants
                </Link>
                <Link
                  href="/products"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Accessoires
                </Link>
                <Link
                  href="/wishlist"
                  className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md font-medium"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Favoris
                </Link>
              </div>

              {/* Contact */}
              <div className="border-t pt-4">
                <div className="flex items-center space-x-3 px-3 py-2">
                  <Phone className="h-5 w-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-sm">Support</p>
                    <p className="text-sm text-gray-500">+241 XX XX XX XX</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
} 