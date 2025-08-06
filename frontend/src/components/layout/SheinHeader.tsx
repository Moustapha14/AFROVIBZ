'use client';

import {
  ShoppingBag,
  User,
  Search,
  Menu,
  X,
  Heart,
  Phone,
  ChevronDown,
  Globe,
  Star,
  Truck,
  Shield,
  Gift,
  Clock,
  Laptop,
  Smartphone,
  Tablet,
  Headphones,
  Gamepad2,
  LogOut,
  Settings,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState, useRef, useEffect } from 'react';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuth } from '@/lib/hooks/useAuth';
import { useCart } from '@/lib/hooks/useCart';
import { formatPrice } from '@/lib/utils';

export function SheinHeader() {
  const { user, logout } = useAuth();
  const { getCartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Gestion du scroll pour l'effet sticky
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fermer le menu mobile quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false);
      }
    };

    if (isMobileMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.body.style.overflow = 'unset';
    };
  }, [isMobileMenuOpen]);

  // Fermer les dropdowns quand on clique à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Searching for:', searchQuery);
  };

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const toggleDropdown = (dropdown: string) => {
    setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
  };

  // Données des catégories (style Shein)
  const categories = [
    {
      name: 'FEMMES',
      subcategories: [
        { name: 'Nouveautés', items: ['Nouveautés', 'Tendances', 'Collections'] },
        { name: 'Vêtements', items: ['Robes', 'Tops', 'Pantalons', 'Jupes', 'Vestes', 'Manteaux'] },
        { name: 'Chaussures', items: ['Talons', 'Sneakers', 'Sandales', 'Bottes'] },
        { name: 'Accessoires', items: ['Sacs', 'Bijoux', 'Écharpes', 'Ceintures'] },
      ],
    },
    {
      name: 'HOMMES',
      subcategories: [
        { name: 'Nouveautés', items: ['Nouveautés', 'Tendances'] },
        { name: 'Vêtements', items: ['T-shirts', 'Chemises', 'Pantalons', 'Vestes'] },
        { name: 'Chaussures', items: ['Sneakers', 'Chaussures', 'Sandales'] },
      ],
    },
    {
      name: 'ENFANTS',
      subcategories: [
        { name: 'Filles', items: ['Robes', 'Tops', 'Pantalons'] },
        { name: 'Garçons', items: ['T-shirts', 'Pantalons', 'Vestes'] },
      ],
    },
    {
      name: 'TECH',
      subcategories: [
        {
          name: 'Ordinateurs',
          items: [
            'PC Portables',
            'PC Bureaux',
            'MacBook',
            'iMac',
            'Moniteurs',
            'Claviers',
            'Souris',
          ],
        },
        {
          name: 'Smartphones',
          items: ['iPhone', 'Samsung', 'Xiaomi', 'Huawei', 'Oppo', 'Accessoires Téléphone'],
        },
        {
          name: 'Tablettes',
          items: ['iPad', 'Samsung Galaxy Tab', 'Tablettes Android', 'Accessoires Tablettes'],
        },
        { name: 'Audio', items: ['Écouteurs', 'Casques', 'Enceintes Bluetooth', 'Microphones'] },
        {
          name: 'Gaming',
          items: ['Consoles', 'Manettes', 'Écouteurs Gaming', 'Accessoires Gaming'],
        },
      ],
    },
  ];

  return (
    <header
      className={`bg-white transition-all duration-300 ${isScrolled ? 'shadow-lg' : 'shadow-sm'} sticky top-0 z-50`}
    >
      {/* Top Bar - Promotions et services */}
      <div className='bg-black text-white py-2 px-4 text-center'>
        <div className='max-w-7xl mx-auto flex items-center justify-center space-x-6 text-xs sm:text-sm'>
          <div className='flex items-center space-x-1'>
            <Truck className='h-3 w-3' />
            <span>Livraison gratuite dès 29€</span>
          </div>

          <div className='hidden md:flex items-center space-x-1'>
            <Gift className='h-3 w-3' />
            <span>Offres exclusives</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex items-center justify-between h-16 lg:h-20'>
          {/* Logo */}
          <Link
            href='/'
            className='flex items-center space-x-2 flex-shrink-0'
            aria-label='Accueil AFRO🗼VIBZ'
          >
            <div
              className='h-10 w-10 lg:h-12 lg:w-12 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-lg lg:text-xl'
              aria-hidden='true'
            >
              AV
            </div>
            <span className='font-bold text-lg lg:text-xl text-gray-900'>AFRO🗼VIBZ</span>
          </Link>

          {/* Desktop Navigation */}
          <nav
            className='hidden lg:flex items-center space-x-8 ml-8'
            aria-label='Navigation principale'
          >
            {categories.map(category => (
              <div key={category.name} className='dropdown-container relative'>
                <button
                  onClick={() => toggleDropdown(category.name)}
                  className='flex items-center space-x-1 text-gray-700 hover:text-black transition-colors font-medium py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
                  aria-expanded={activeDropdown === category.name}
                  aria-haspopup='true'
                  aria-label={`Menu ${category.name}`}
                >
                  <span>{category.name}</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform duration-200 ${activeDropdown === category.name ? 'rotate-180' : ''}`}
                    aria-hidden='true'
                  />
                </button>

                {/* Dropdown Menu */}
                {activeDropdown === category.name && (
                  <div
                    className='absolute top-full left-0 mt-1 w-80 bg-white shadow-xl border border-gray-200 rounded-lg py-4 z-50'
                    role='menu'
                    aria-labelledby={`menu-${category.name}`}
                  >
                    <div className='grid grid-cols-2 gap-6 px-6'>
                      {category.subcategories.map(sub => (
                        <div key={sub.name}>
                          <h4 className='font-semibold text-gray-900 mb-2'>{sub.name}</h4>
                          <ul className='space-y-1' role='menu'>
                            {sub.items.map(item => (
                              <li key={item} role='none'>
                                <Link
                                  href={`/products?category=${item.toLowerCase()}`}
                                  className='text-sm text-gray-600 hover:text-black transition-colors block py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1'
                                  role='menuitem'
                                >
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className='hidden md:flex flex-1 max-w-lg mx-8'>
            <form onSubmit={handleSearch} className='w-full'>
              <div className='relative'>
                <Search
                  className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4'
                  aria-hidden='true'
                />
                <Input
                  ref={searchRef}
                  type='text'
                  placeholder='Rechercher des produits...'
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className={`pl-10 pr-4 py-2 border-2 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                    isSearchFocused
                      ? 'border-pink-500 shadow-lg'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  aria-label='Rechercher des produits'
                />
                {isSearchFocused && searchQuery && (
                  <button
                    type='button'
                    onClick={() => setSearchQuery('')}
                    className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded'
                    aria-label='Effacer la recherche'
                  >
                    <X className='h-4 w-4' />
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Right side actions */}
          <div className='flex items-center space-x-4'>
            {/* Language Selector - Desktop */}
            <button
              className='hidden lg:flex items-center space-x-1 text-gray-700 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded p-1'
              aria-label='Sélectionner la langue'
            >
              <Globe className='h-4 w-4' aria-hidden='true' />
              <span className='text-sm'>FR</span>
              <ChevronDown className='h-3 w-3' aria-hidden='true' />
            </button>

            {/* Wishlist - Desktop */}
            <Link
              href='/wishlist'
              className='hidden md:block p-2 text-gray-700 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded'
              aria-label='Favoris'
            >
              <Heart className='h-5 w-5' aria-hidden='true' />
            </Link>

            {/* Cart */}
            <Link
              href='/cart'
              className='relative p-2 text-gray-700 hover:text-black transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded'
              aria-label='Panier'
            >
              <ShoppingBag className='h-5 w-5' aria-hidden='true' />
              {getCartCount() > 0 && (
                <span className='absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium'>
                  {getCartCount() > 99 ? '99+' : getCartCount()}
                </span>
              )}
            </Link>

            {/* User menu */}
            {user ? (
              <div className='dropdown-container relative'>
                <button
                  onClick={() => toggleDropdown('user')}
                  className='flex items-center space-x-2 p-2 text-gray-700 hover:text-black transition-colors'
                  aria-label='Menu utilisateur'
                >
                  <User className='h-5 w-5' />
                  <span className='hidden sm:block text-sm font-medium'>
                    {user.displayName || 'Mon Compte'}
                  </span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform duration-200 ${activeDropdown === 'user' ? 'rotate-180' : ''}`}
                  />
                </button>

                {activeDropdown === 'user' && (
                  <div className='absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 z-50 border border-gray-200'>
                    <Link
                      href='/profile'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                    >
                      Mon Profil
                    </Link>
                    <Link
                      href='/orders'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                    >
                      Mes Commandes
                    </Link>
                    <Link
                      href='/wishlist'
                      className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                    >
                      Mes Favoris
                    </Link>
                    {(user.role === 'admin' ||
                      user.role === 'super_admin' ||
                      user.role === 'vendeuse') && (
                      <Link
                        href='/admin'
                        className='block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                      >
                        Administration
                      </Link>
                    )}
                    <hr className='my-2' />
                    <button
                      onClick={handleLogout}
                      className='block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50'
                    >
                      Se déconnecter
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className='flex items-center space-x-2'>
                <Link href='/auth/login'>
                  <Button variant='outline' size='sm' className='hidden sm:inline-flex'>
                    Se connecter
                  </Button>
                </Link>
                <Link href='/auth/register'>
                  <Button size='sm' className='hidden sm:inline-flex bg-pink-500 hover:bg-pink-600'>
                    S'inscrire
                  </Button>
                </Link>
              </div>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className='lg:hidden p-2 text-gray-700 hover:text-black transition-colors'
              aria-label='Menu mobile'
            >
              {isMobileMenuOpen ? <X className='h-6 w-6' /> : <Menu className='h-6 w-6' />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className='lg:hidden border-t border-gray-200 px-4 py-3'>
        <form onSubmit={handleSearch} className='w-full'>
          <div className='relative'>
            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4' />
            <Input
              type='text'
              placeholder='Rechercher des produits...'
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className='pl-10 pr-4 py-2 border-2 border-gray-300'
              aria-label='Rechercher des produits'
            />
          </div>
        </form>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div ref={mobileMenuRef} className='lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50'>
          <div className='absolute right-0 top-0 h-full w-80 bg-white shadow-xl'>
            <div className='p-4'>
              <div className='flex items-center justify-between mb-6'>
                <h3 className='text-lg font-semibold'>Menu</h3>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className='p-2 text-gray-500 hover:text-gray-700'
                >
                  <X className='h-6 w-6' />
                </button>
              </div>

              {/* Mobile Navigation */}
              <nav className='space-y-4'>
                {categories.map(category => (
                  <div key={category.name}>
                    <Link
                      href={`/products?category=${category.name.toLowerCase()}`}
                      className='block text-lg font-medium text-gray-900 py-2'
                    >
                      {category.name}
                    </Link>
                    <div className='ml-4 space-y-2'>
                      {category.subcategories.map(sub => (
                        <div key={sub.name}>
                          <h4 className='text-sm font-medium text-gray-700 py-1'>{sub.name}</h4>
                          <ul className='ml-4 space-y-1'>
                            {sub.items.slice(0, 3).map(item => (
                              <li key={item}>
                                <Link
                                  href={`/products?category=${item.toLowerCase()}`}
                                  className='text-sm text-gray-600 hover:text-gray-900 block py-1'
                                >
                                  {item}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </nav>

              {/* Mobile User Actions */}
              <div className='mt-8 pt-6 border-t border-gray-200'>
                {user ? (
                  <div className='space-y-2'>
                    <Link href='/profile' className='block text-gray-700 hover:text-gray-900 py-2'>
                      Mon Profil
                    </Link>
                    <Link href='/orders' className='block text-gray-700 hover:text-gray-900 py-2'>
                      Mes Commandes
                    </Link>
                    <Link href='/wishlist' className='block text-gray-700 hover:text-gray-900 py-2'>
                      Mes Favoris
                    </Link>
                    <button
                      onClick={handleLogout}
                      className='block w-full text-left text-gray-700 hover:text-gray-900 py-2'
                    >
                      Se déconnecter
                    </button>
                  </div>
                ) : (
                  <div className='space-y-3'>
                    <Link href='/auth/login'>
                      <Button variant='outline' className='w-full'>
                        Se connecter
                      </Button>
                    </Link>
                    <Link href='/auth/register'>
                      <Button className='w-full bg-pink-500 hover:bg-pink-600'>S'inscrire</Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
