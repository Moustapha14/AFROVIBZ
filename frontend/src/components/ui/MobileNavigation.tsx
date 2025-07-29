import React, { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { X, Menu } from 'lucide-react';

interface MobileNavigationProps {
  children: React.ReactNode;
  trigger?: React.ReactNode;
  position?: 'left' | 'right' | 'top' | 'bottom';
  overlay?: boolean;
  className?: string;
  onOpen?: () => void;
  onClose?: () => void;
}

const MobileNavigation: React.FC<MobileNavigationProps> = ({
  children,
  trigger,
  position = 'right',
  overlay = true,
  className,
  onOpen,
  onClose,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      onOpen?.();
    } else {
      document.body.style.overflow = 'unset';
      onClose?.();
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onOpen, onClose]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleClose();
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const positions = {
    left: 'fixed inset-y-0 left-0 w-80 sm:w-96',
    right: 'fixed inset-y-0 right-0 w-80 sm:w-96',
    top: 'fixed inset-x-0 top-0 h-80 sm:h-96',
    bottom: 'fixed inset-x-0 bottom-0 h-80 sm:h-96',
  };

  const animations = {
    left: isOpen ? 'animate-slide-in-left' : 'animate-slide-out-left',
    right: isOpen ? 'animate-slide-in-right' : 'animate-slide-out-right',
    top: isOpen ? 'animate-slide-in-top' : 'animate-slide-out-top',
    bottom: isOpen ? 'animate-slide-in-bottom' : 'animate-slide-out-bottom',
  };

  return (
    <>
      {/* Trigger */}
      {trigger || (
        <button
          onClick={() => setIsOpen(true)}
          className="p-3 text-gray-700 hover:text-black transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label="Ouvrir le menu"
          aria-expanded={isOpen}
        >
          <Menu className="h-6 w-6" />
        </button>
      )}

      {/* Overlay */}
      {isOpen && overlay && (
        <div
          className="fixed inset-0 z-40 bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={handleClose}
          aria-hidden="true"
        />
      )}

      {/* Navigation Panel */}
      {isOpen && (
        <div
          className={cn(
            'fixed z-50 bg-white shadow-xl',
            positions[position],
            animations[position],
            className
          )}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
            <button
              onClick={handleClose}
              className="p-3 text-gray-500 hover:text-gray-700 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Fermer le menu"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Content */}
          <div className="flex flex-col h-full">
            <div className="flex-1 overflow-y-auto overscroll-contain">
              {children}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export { MobileNavigation };
