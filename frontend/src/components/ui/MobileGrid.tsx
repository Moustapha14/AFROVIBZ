import React from 'react';

import { cn } from '@/lib/utils';

interface MobileGridProps {
  children: React.ReactNode;
  cols?: {
    mobile?: number;
    tablet?: number;
    desktop?: number;
    wide?: number;
  };
  gap?: {
    mobile?: string;
    tablet?: string;
    desktop?: string;
  };
  className?: string;
}

const MobileGrid: React.FC<MobileGridProps> = ({
  children,
  cols = {
    mobile: 1,
    tablet: 2,
    desktop: 3,
    wide: 4,
  },
  gap = {
    mobile: '1rem',
    tablet: '1.5rem',
    desktop: '2rem',
  },
  className,
}) => {
  const getGridCols = () => {
    const mobileCols = cols.mobile || 1;
    const tabletCols = cols.tablet || mobileCols;
    const desktopCols = cols.desktop || tabletCols;
    const wideCols = cols.wide || desktopCols;

    return `grid-cols-${mobileCols} sm:grid-cols-${tabletCols} md:grid-cols-${desktopCols} lg:grid-cols-${wideCols}`;
  };

  const getGap = () => {
    const mobileGap = gap.mobile || '1rem';
    const tabletGap = gap.tablet || mobileGap;
    const desktopGap = gap.desktop || tabletGap;

    return `gap-4 sm:gap-6 md:gap-8`;
  };

  return <div className={cn('grid', getGridCols(), getGap(), 'w-full', className)}>{children}</div>;
};

export { MobileGrid };
