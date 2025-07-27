import React from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';
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

export function Toast({ 
  type = 'info', 
  title, 
  message, 
  onClose, 
  className 
}: ToastProps) {
  const Icon = toastIcons[type];

  return (
    <div className={cn(
      "flex items-start p-4 border rounded-lg shadow-sm max-w-sm",
      toastStyles[type],
      className
    )}>
      <Icon className="h-5 w-5 flex-shrink-0 mt-0.5" />
      <div className="ml-3 flex-1">
        <h3 className="text-sm font-medium">{title}</h3>
        {message && (
          <p className="mt-1 text-sm opacity-90">{message}</p>
        )}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 flex-shrink-0 p-1 rounded-md hover:bg-black hover:bg-opacity-10 transition-colors"
          aria-label="Fermer"
        >
          <X className="h-4 w-4" />
        </button>
      )}
    </div>
  );
}

export function ToastContainer({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {children}
    </div>
  );
} 