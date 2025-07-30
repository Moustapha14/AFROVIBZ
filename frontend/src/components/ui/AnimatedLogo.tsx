'use client';

import React from 'react';

interface AnimatedLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function AnimatedLogo({ className = '', size = 'lg' }: AnimatedLogoProps) {
  const sizeClasses = {
    sm: 'text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
    xl: 'text-4xl'
  };

  return (
    <div className={`flex items-center justify-center relative ${className}`}>
      <div className={`${sizeClasses[size]} font-bold text-gray-900 sm:text-gray-900 text-white relative flex items-center gap-1 drop-shadow-lg sm:drop-shadow-none`}>
        <span className="inline-block animate-pulse hover:scale-110 transition-transform duration-300">
          AFRO
        </span>
        <span className="inline-block animate-bounce text-yellow-300 sm:text-yellow-500 hover:rotate-12 transition-transform duration-300 drop-shadow-md">
          🗼
        </span>
        <span className="inline-block animate-pulse hover:scale-110 transition-transform duration-300" style={{ animationDelay: '0.5s' }}>
          VIBZ
        </span>
      </div>
      
      {/* Effet de brillance qui traverse le logo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div 
          className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent transform -skew-x-12"
          style={{
            animation: 'shine 3s infinite',
          }}
        />
      </div>
      
      <style jsx>{`
        @keyframes shine {
          0% {
            transform: translateX(-200%) skewX(-12deg);
          }
          50% {
            transform: translateX(200%) skewX(-12deg);
          }
          100% {
            transform: translateX(-200%) skewX(-12deg);
          }
        }
      `}</style>
    </div>
  );
}