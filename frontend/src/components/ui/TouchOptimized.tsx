'use client';

import React from 'react';

interface TouchOptimizedProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  as?: 'button' | 'div' | 'a';
  href?: string;
  target?: string;
  rel?: string;
}

export function TouchOptimized({
  children,
  className = "",
  onClick,
  disabled = false,
  as = 'div',
  href,
  target,
  rel,
  ...props
}: TouchOptimizedProps) {
  const baseClasses = "touch-manipulation select-none";
  const combinedClasses = `${baseClasses} ${className}`;

  // Composant bouton
  if (as === 'button') {
    return (
      <button
        className={combinedClasses}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  }

  // Composant lien
  if (as === 'a' && href) {
    return (
      <a
        href={href}
        target={target}
        rel={rel}
        className={combinedClasses}
        onClick={onClick}
        {...props}
      >
        {children}
      </a>
    );
  }

  // Composant div par défaut
  return (
    <div
      className={combinedClasses}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
      {...props}
    >
      {children}
    </div>
  );
} 