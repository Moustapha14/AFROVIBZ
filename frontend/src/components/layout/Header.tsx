'use client';

import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  Heart,
  Phone,
  Home,
  Package,
  Settings,
  LogOut,
} from 'lucide-react';
import Link from 'next/link';
import React, { useState, useRef, useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCart } from '@/lib/hooks/useCart';
import { useWishlist } from '@/lib/hooks/useWishlist';
import { formatPrice } from '@/lib/utils';

export function Header() {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const { wishlist } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  // Gérer la navigation au clavier
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        setIsSearchFocused(false);
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Rediriger vers la page produits avec le terme de recherche
      window.location.href = `/products?search=${encodeURIComponent(searchQuery.trim())}`;
    }
  };

  const handleLogout = async () => {
    await logout();
    setIsMobileMenuOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <header className='bg-white shadow-sm sticky top-0 z-50 safe-area-top'>
      {/* Top bar - Mobile First */}
      <div className='bg-black text-white py-2 px-4 text-center'>
        <p className='truncate text-xs sm:text-sm font-medium'>
          Livraison gratuite au Gabon à partir de 50,000 FCFA 🚚
        </p>
      </div>

      {/* Main header - Mobile First */}
      <div className='mobile-container'>
        <div className='flex items-center justify-between h-14 sm:h-16 lg:h-18'>
          {/* Logo - Optimisé mobile */}
          <Link
            href='/'
            className='flex items-center space-x-2 flex-shrink-0 mr-2 lg:mr-0 tap-highlight-none'
            onClick={closeMobileMenu}
          >
            <div className='h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center text-white font-bold text-sm sm:text-base lg:text-lg'>
              AV
            </div>
            <span className='font-bold text-sm sm:text-base lg:text-lg xl:text-xl truncate'>
              AFRO🗼VIBZ
            </span>
          </Link>

          {/* Desktop Navigation - Caché sur mobile */}
          <nav className='hidden lg:flex items-center space-x-6 xl:space-x-8 ml-8 xl:ml-12'>
            <Link
              href='/products?category=femmes'
              className='text-gray-700 hover:text-black transition-colors font-medium text-sm xl:text-base'
            >
              Femmes
            </Link>
            <Link
              href='/products?category=hommes'
              className='text-gray-700 hover:text-black transition-colors font-medium text-sm xl:text-base'
            >
              Hommes
            </Link>
            <Link
              href='/products?category=enfants'
              className='text-gray-700 hover:text-black transition-colors font-medium text-sm xl:text-base'
            >
              Enfants
            </Link>
            <Link
              href='/products?category=accessoires'
              className='text-gray-700 hover:text-black transition-colors font-medium text-sm xl:text-base'
            >
              Accessoires
            </Link>
          </nav>

          {/* Search Bar - Desktop */}
          <div className='hidden md:flex flex-1 min-w-[280px] max-w-xl lg:max-w-2xl mx-4 lg:mx-8'>
            <form onSubmit={handleSearch} className='w-full'>
              <div className='relative'>
                <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
                <Input
                  ref={searchInputRef}
                  type='text'
                  placeholder='Rechercher des produits...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className='mobile-input'
                  aria-label='Rechercher des produits'
                />
              </div>
            </form>
          </div>

          {/* Right side actions - Mobile First */}
          <div className='flex items-center space-x-1 sm:space-x-2 lg:space-x-4'>
            {/* Wishlist - Desktop */}
            <Link
              href='/client/wishlist'
              className='hidden md:block relative p-2 text-gray-700 hover:text-black transition-colors action-button'
              aria-label='Favoris'
            >
              <Heart className='h-5 w-5' />
              {wishlist.length > 0 && (
                <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-medium'>
                  {wishlist.length > 99 ? '99+' : wishlist.length}
                </span>
              )}
            </Link>

            {/* Cart - Mobile First */}
            <Link
              href='/cart'
              className='relative p-2 text-gray-700 hover:text-black transition-colors action-button'
              aria-label='Panier'
              onClick={closeMobileMenu}
            >
              <ShoppingBag className='h-5 w-5 sm:h-6 sm:w-6' />
              {getCartCount() > 0 && (
                <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 sm:h-6 sm:w-6 flex items-center justify-center font-medium'>
                  {getCartCount() > 99 ? '99+' : getCartCount()}
                </span>
              )}
            </Link>

            {/* User menu - Desktop */}
            {user ? (
              <div className='hidden md:block relative group'>
                <button
                  className='flex items-center space-x-2 p-2 text-gray-700 hover:text-black transition-colors action-button'
                  aria-label='Menu utilisateur'
                  aria-expanded='false'
                >
                  <User className='h-5 w-5' />
                  <span className='text-sm font-medium'>{user.displayName || 'Mon Compte'}</span>
                </button>
                <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all border border-gray-200'>
                  <Link
                    href='/profile'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                  >
                    Mon Profil
                  </Link>
                  <Link
                    href='/orders'
                    className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                  >
                    Mes Commandes
                  </Link>
                  {(user.role === 'admin' ||
                    user.role === 'super_admin' ||
                    user.role === 'vendeuse') && (
                    <Link
                      href='/admin'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                    >
                      Administration
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100'
                  >
                    Se déconnecter
                  </button>
                </div>
              </div>
            ) : (
              <div className='hidden md:flex items-center space-x-2'>
                <Link href='/auth/login'>
                  <Button variant='outline' size='sm' className='mobile-button'>
                    Se connecter
                  </Button>
                </Link>
                <Link href='/auth/register'>
                  <Button size='sm' className='mobile-button'>
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='md:hidden p-2 text-gray-700 hover:text-black transition-colors action-button'
              aria-label='Menu mobile'
              aria-expanded={isMobileMenuOpen}
            >
              {isMobileMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
            </button>
          </div>
        </div>

        {/* Mobile Search - Optimisé */}
        <div className='md:hidden pb-4'>
          <form onSubmit={handleSearch}>
            <div className='relative'>
              <Search className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5' />
              <Input
                ref={searchInputRef}
                type='text'
                placeholder='Rechercher des produits...'
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className='mobile-input'
                aria-label='Rechercher des produits'
              />
            </div>
          </form>
        </div>
      </div>

      {/* Mobile Navigation Menu - Refactorisé */}
      {isMobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className='md:hidden fixed inset-0 z-50 bg-black bg-opacity-50 backdrop-blur-sm'
          aria-modal='true'
          role='dialog'
        >
          <div className='fixed inset-y-0 right-0 w-80 sm:w-96 bg-white shadow-xl animate-slide-in-right'>
            <div className='flex items-center justify-between p-4 border-b bg-gray-50'>
              <h2 className='text-lg font-semibold text-gray-900'>Menu</h2>
              <button
                onClick={closeMobileMenu}
                className='p-2 text-gray-500 hover:text-gray-700 action-button'
                aria-label='Fermer le menu'
              >
                <X className='h-6 w-6' />
              </button>
            </div>

            <div className='flex flex-col h-full'>
              {/* User section */}
              {user ? (
                <div className='border-b p-4 bg-white'>
                  <div className='flex items-center space-x-3 mb-4'>
                    <div className='w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center'>
                      <User className='h-6 w-6 text-white' />
                    </div>
                    <div className='flex-1 min-w-0'>
                      <p className='font-semibold text-gray-900 truncate'>
                        {user.displayName || 'Utilisateur'}
                      </p>
                      <p className='text-sm text-gray-500 truncate'>{user.email}</p>
                    </div>
                  </div>
                  <div className='space-y-1'>
                    <Link
                      href='/profile'
                      className='flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors'
                      onClick={closeMobileMenu}
                    >
                      <User className='h-5 w-5' />
                      <span>Mon Profil</span>
                    </Link>
                    <Link
                      href='/orders'
                      className='flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors'
                      onClick={closeMobileMenu}
                    >
                      <Package className='h-5 w-5' />
                      <span>Mes Commandes</span>
                    </Link>
                    {(user.role === 'admin' ||
                      user.role === 'super_admin' ||
                      user.role === 'vendeuse') && (
                      <Link
                        href='/admin'
                        className='flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors'
                        onClick={closeMobileMenu}
                      >
                        <Settings className='h-5 w-5' />
                        <span>Administration</span>
                      </Link>
                    )}
                    <button
                      onClick={handleLogout}
                      className='flex items-center space-x-3 w-full text-left px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors'
                    >
                      <LogOut className='h-5 w-5' />
                      <span>Se déconnecter</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className='border-b p-4 bg-white'>
                  <div className='space-y-3'>
                    <Link
                      href='/auth/login'
                      className='block w-full text-center px-4 py-3 bg-black text-white rounded-lg font-medium transition-colors hover:bg-gray-800'
                      onClick={closeMobileMenu}
                    >
                      Se connecter
                    </Link>
                    <Link
                      href='/auth/register'
                      className='block w-full text-center px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium transition-colors hover:bg-gray-50'
                      onClick={closeMobileMenu}
                    >
                      S'inscrire
                    </Link>
                  </div>
                </div>
              )}

              {/* Navigation links - Mobile First */}
              <div className='flex-1 p-4 space-y-1'>
                <Link
                  href='/'
                  className='flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium'
                  onClick={closeMobileMenu}
                >
                  <Home className='h-5 w-5' />
                  <span>Accueil</span>
                </Link>
                <Link
                  href='/products?category=femmes'
                  className='flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium'
                  onClick={closeMobileMenu}
                >
                  <Package className='h-5 w-5' />
                  <span>Femmes</span>
                </Link>
                <Link
                  href='/products?category=hommes'
                  className='flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium'
                  onClick={closeMobileMenu}
                >
                  <Package className='h-5 w-5' />
                  <span>Hommes</span>
                </Link>
                <Link
                  href='/products?category=enfants'
                  className='flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium'
                  onClick={closeMobileMenu}
                >
                  <Package className='h-5 w-5' />
                  <span>Enfants</span>
                </Link>
                <Link
                  href='/products?category=accessoires'
                  className='flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium'
                  onClick={closeMobileMenu}
                >
                  <Package className='h-5 w-5' />
                  <span>Accessoires</span>
                </Link>
                <Link
                  href='/client/wishlist'
                  className='flex items-center space-x-3 px-3 py-3 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors font-medium'
                  onClick={closeMobileMenu}
                >
                  <Heart className='h-5 w-5' />
                  <span>Favoris {wishlist.length > 0 && `(${wishlist.length})`}</span>
                </Link>
              </div>

              {/* Contact - Mobile First */}
              <div className='border-t p-4 bg-gray-50'>
                <div className='flex items-center space-x-3 px-3 py-2'>
                  <Phone className='h-5 w-5 text-gray-600' />
                  <div>
                    <p className='font-medium text-sm text-gray-900'>Support</p>
                    <p className='text-sm text-gray-500'>+241 XX XX XX XX</p>
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
