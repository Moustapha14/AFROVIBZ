import React from 'react';
import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
  separator?: React.ReactNode;
}

export function Breadcrumbs({ 
  items, 
  className,
  separator = <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 text-gray-400 flex-shrink-0" />
}: BreadcrumbsProps) {
  return (
    <nav 
      className={cn("flex items-center space-x-1 text-sm text-gray-500 mb-4 sm:mb-6 overflow-x-auto scrollbar-hide", className)} 
      aria-label="Fil d'Ariane"
    >
      <ol className="flex items-center space-x-1 min-w-max">
        <li>
          <Link 
            href="/" 
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors min-h-[44px] min-w-[44px] justify-center sm:min-h-auto sm:min-w-auto sm:justify-start"
            aria-label="Accueil"
          >
            <Home className="h-4 w-4 sm:mr-1" />
            <span className="hidden sm:inline text-sm">Accueil</span>
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {separator}
            {item.current ? (
              <span 
                className="ml-1 text-gray-900 font-medium truncate max-w-[120px] sm:max-w-none"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : item.href ? (
              <Link 
                href={item.href}
                className="ml-1 text-gray-500 hover:text-gray-700 transition-colors truncate max-w-[120px] sm:max-w-none min-h-[44px] flex items-center sm:min-h-auto"
              >
                {item.label}
              </Link>
            ) : (
              <span className="ml-1 text-gray-500 truncate max-w-[120px] sm:max-w-none">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// Hook pour générer automatiquement les breadcrumbs basés sur le chemin
export function useBreadcrumbs(pathname: string) {
  const segments = pathname.split('/').filter(Boolean);
  
  const breadcrumbs: BreadcrumbItem[] = segments.map((segment, index) => {
    const href = `/${segments.slice(0, index + 1).join('/')}`;
    const isLast = index === segments.length - 1;
    
    // Convertir le segment en label lisible
    const label = segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    return {
      label,
      href: isLast ? undefined : href,
      current: isLast,
    };
  });
  
  return breadcrumbs;
}
