'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/lib/hooks/useAuth';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  FileText,
  Settings,
  BarChart3,
  Truck,
  Gift,
  Shield,
  LogOut,
  Menu,
  X,
  UserCheck
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard', icon: LayoutDashboard },
  { name: 'Commandes', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Produits', href: '/admin/products', icon: Package },
  { name: 'Clients', href: '/admin/users', icon: Users },
  { name: 'Factures', href: '/admin/invoices', icon: FileText },
  { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  { name: 'Logistique', href: '/admin/logistics', icon: Truck },
  { name: 'Promotions', href: '/admin/promotions', icon: Gift },
  { name: 'Paramètres', href: '/admin/settings', icon: Settings },
];

const vendeuseNavigation = [
  { name: 'Dashboard', href: '/admin/vendeuse/dashboard', icon: LayoutDashboard },
  { name: 'Mes Commandes', href: '/admin/vendeuse/orders', icon: ShoppingCart },
  { name: 'Historique', href: '/admin/vendeuse/history', icon: BarChart3 },
  { name: 'Logistique', href: '/admin/vendeuse/logistics', icon: Truck },
  { name: 'Profil', href: '/admin/vendeuse/profile', icon: UserCheck },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleLogout = async () => {
    await logout();
  };

  const isVendeuse = user?.role === 'vendeuse';
  const currentNavigation = isVendeuse ? vendeuseNavigation : navigation;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile-first sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-xl transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex h-16 items-center justify-between px-6 border-b border-gray-200">
            <Link href="/admin" className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-gradient-to-r from-pink-500 to-red-500 rounded-lg flex items-center justify-center text-white font-bold text-sm">
                AV
              </div>
              <span className="font-bold text-lg text-gray-900">AFRO🗼VIBZ</span>
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 px-3 py-4 overflow-y-auto">
            <div className="space-y-2">
              {currentNavigation.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => isMobile && setSidebarOpen(false)}
                    className={cn(
                      "group flex items-center gap-x-3 rounded-lg px-3 py-3 text-sm font-medium transition-all duration-150 min-h-[44px]",
                      isActive
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900 active:bg-gray-100"
                    )}
                  >
                    <item.icon className={cn(
                      "h-5 w-5 flex-shrink-0 transition-colors",
                      isActive ? "text-blue-700" : "text-gray-400 group-hover:text-gray-500"
                    )} />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </nav>

          {/* User section */}
          <div className="border-t border-gray-200 p-4">
            <div className="flex items-center space-x-3 mb-4">
              <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                <Shield className="h-4 w-4 text-gray-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {user?.displayName || 'Admin'}
                </p>
                <p className="text-xs text-gray-500 capitalize">
                  {user?.role || 'admin'}
                </p>
              </div>
            </div>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="w-full justify-start gap-2 min-h-[44px]"
            >
              <LogOut className="h-4 w-4" />
              Déconnexion
            </Button>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 lg:pl-72 flex flex-col">
        {/* Mobile header */}
        <div className="sticky top-0 z-30 bg-white border-b border-gray-200 lg:hidden">
          <div className="flex items-center justify-between px-4 py-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex items-center space-x-2">
              <div className="h-6 w-6 bg-gradient-to-r from-pink-500 to-red-500 rounded flex items-center justify-center text-white font-bold text-xs">
                AV
              </div>
              <span className="font-bold text-sm text-gray-900">AFRO🗼VIBZ</span>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Page content */}
        <main className="flex-1">
          <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
} 