import React from 'react';
import { ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/lib/utils';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
  showPageNumbers?: boolean;
  maxVisiblePages?: number;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
  showPageNumbers = true,
  maxVisiblePages = 5,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];
    const halfVisible = Math.floor(maxVisiblePages / 2);

    if (totalPages <= maxVisiblePages) {
      // Si le nombre total de pages est inférieur au maximum visible, afficher toutes
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Calculer les pages à afficher
      let start = Math.max(1, currentPage - halfVisible);
      let end = Math.min(totalPages, currentPage + halfVisible);

      // Ajuster si on est près des bords
      if (currentPage <= halfVisible) {
        end = Math.min(totalPages, maxVisiblePages);
      } else if (currentPage > totalPages - halfVisible) {
        start = Math.max(1, totalPages - maxVisiblePages + 1);
      }

      // Ajouter la première page et les points de suspension si nécessaire
      if (start > 1) {
        pages.push(1);
        if (start > 2) {
          pages.push('...');
        }
      }

      // Ajouter les pages visibles
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      // Ajouter la dernière page et les points de suspension si nécessaire
      if (end < totalPages) {
        if (end < totalPages - 1) {
          pages.push('...');
        }
        pages.push(totalPages);
      }
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <div className={cn("flex items-center justify-center space-x-1", className)}>
      {/* Bouton Précédent */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-2 xs:px-3 h-10"
        aria-label="Page précédente"
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="hidden xs:inline ml-1">Précédent</span>
      </Button>

      {/* Numéros de pages */}
      {showPageNumbers && (
        <div className="flex items-center space-x-1">
          {visiblePages.map((page, index) => (
            <React.Fragment key={index}>
              {page === '...' ? (
                <div className="flex items-center justify-center w-8 h-8">
                  <MoreHorizontal className="h-4 w-4 text-gray-400" />
                </div>
              ) : (
                <Button
                  variant={currentPage === page ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => onPageChange(page as number)}
                  className="w-8 h-8 p-0 text-xs xs:text-sm h-10"
                  aria-label={`Page ${page}`}
                  aria-current={currentPage === page ? 'page' : undefined}
                >
                  {page}
                </Button>
              )}
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Bouton Suivant */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-2 xs:px-3 h-10"
        aria-label="Page suivante"
      >
        <span className="hidden xs:inline mr-1">Suivant</span>
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}

// Composant de pagination simple pour mobile
export function SimplePagination({
  currentPage,
  totalPages,
  onPageChange,
  className,
}: Omit<PaginationProps, 'showPageNumbers' | 'maxVisiblePages'>) {
  if (totalPages <= 1) return null;

  return (
    <div className={cn("flex items-center justify-between", className)}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex-1 sm:flex-none"
      >
        <ChevronLeft className="h-4 w-4 mr-1" />
        Précédent
      </Button>

      <div className="hidden sm:flex items-center space-x-2">
        <span className="text-sm text-gray-600">
          Page {currentPage} sur {totalPages}
        </span>
      </div>

      <Button
        variant="outline"
        size="sm"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex-1 sm:flex-none"
      >
        Suivant
        <ChevronRight className="h-4 w-4 ml-1" />
      </Button>
    </div>
  );
} 