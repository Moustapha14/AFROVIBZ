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
  separator = <ChevronRight className="h-4 w-4 text-gray-400" />
}: BreadcrumbsProps) {
  return (
    <nav className={cn("flex items-center space-x-1 text-sm", className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-1">
        <li>
          <Link 
            href="/" 
            className="flex items-center text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="Accueil"
          >
            <Home className="h-4 w-4" />
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {separator}
            {item.current ? (
              <span 
                className="ml-1 text-gray-900 font-medium truncate"
                aria-current="page"
              >
                {item.label}
              </span>
            ) : item.href ? (
              <Link 
                href={item.href}
                className="ml-1 text-gray-500 hover:text-gray-700 transition-colors truncate"
              >
                {item.label}
              </Link>
            ) : (
              <span className="ml-1 text-gray-500 truncate">
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