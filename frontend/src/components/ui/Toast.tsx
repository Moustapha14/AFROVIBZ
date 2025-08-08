import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
import React from 'react';

import { cn } from '@/lib/utils';

interface ToastProps {
  type?: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message?: string;
  onClose?: () => void;
  className?: string;
}

const toastIcons = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertCircle,
  info: Info,
};

const toastStyles = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

export function Toast({ type = 'info', title, message, onClose, className }: ToastProps) {
  const Icon = toastIcons[type];

  return (
    <div
      className={cn(
        'flex items-start p-3 sm:p-4 border rounded-lg sm:rounded-xl shadow-lg sm:shadow-sm max-w-sm w-full sm:w-auto toast-mobile',
        toastStyles[type],
        className
      )}
      data-testid='toast'
    >
      <Icon className='h-5 w-5 sm:h-4 sm:w-4 flex-shrink-0 mt-0.5' />
      <div className='ml-3 flex-1 min-w-0'>
        <h3 className='text-sm sm:text-xs font-medium leading-tight'>{title}</h3>
        {message && <p className='mt-1 text-xs sm:text-xs opacity-90 leading-tight'>{message}</p>}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className='ml-3 sm:ml-4 flex-shrink-0 p-2 sm:p-1 rounded-md hover:bg-black hover:bg-opacity-10 transition-colors touch-manipulation'
          aria-label='Fermer'
          style={{ minHeight: '44px', minWidth: '44px' }}
        >
          <X className='h-4 w-4 sm:h-3 sm:w-3' />
        </button>
      )}
    </div>
  );
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className='fixed top-4 right-4 z-[9999] space-y-2 max-w-sm w-full sm:w-auto px-4 sm:px-0 toast-container pointer-events-none'>
      <div className='space-y-2 pointer-events-auto'>
        {children}
      </div>
    </div>
  );
}
