import { ChevronLeft, ChevronRight } from 'lucide-react';
import React, { useState, useRef, useEffect } from 'react';

import { cn } from '@/lib/utils';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  className?: string;
  variant?: 'default' | 'pills' | 'underline';
  fullWidth?: boolean;
  scrollable?: boolean;
}

export function Tabs({
  tabs,
  defaultTab,
  className,
  variant = 'default',
  fullWidth = false,
  scrollable = false,
}: TabsProps) {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const activeTabContent = tabs.find(tab => tab.id === activeTab)?.content;

  const checkScrollButtons = () => {
    if (!scrollContainerRef.current) return;

    const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
    setShowLeftArrow(scrollLeft > 0);
    setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 1);
  };

  const scrollTo = (direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;

    const scrollAmount = 200;
    const newScrollLeft =
      scrollContainerRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);

    scrollContainerRef.current.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    checkScrollButtons();
    window.addEventListener('resize', checkScrollButtons);
    return () => window.removeEventListener('resize', checkScrollButtons);
  }, []);

  const tabVariants = {
    default: {
      container: 'border-b border-gray-200',
      tab: 'px-4 py-2 text-sm font-medium border-b-2 border-transparent hover:text-gray-700 hover:border-gray-300 transition-colors',
      active: 'border-black text-black',
      disabled: 'text-gray-400 cursor-not-allowed hover:text-gray-400 hover:border-transparent',
    },
    pills: {
      container: 'space-x-1',
      tab: 'px-3 py-2 text-sm font-medium rounded-md transition-colors',
      active: 'bg-black text-white',
      disabled: 'text-gray-400 cursor-not-allowed hover:bg-transparent',
    },
    underline: {
      container: 'border-b border-gray-200',
      tab: 'px-4 py-2 text-sm font-medium border-b-2 border-transparent hover:text-gray-700 transition-colors',
      active: 'border-black text-black',
      disabled: 'text-gray-400 cursor-not-allowed hover:text-gray-400 hover:border-transparent',
    },
  };

  const variantStyles = tabVariants[variant];

  return (
    <div className={cn('w-full', className)}>
      {/* Tab Navigation */}
      <div className={cn('flex', fullWidth ? 'w-full' : '', variantStyles.container)}>
        {scrollable && showLeftArrow && (
          <button
            onClick={() => scrollTo('left')}
            className='flex items-center justify-center w-8 h-10 text-gray-500 hover:text-gray-700 transition-colors'
            aria-label='Faire défiler vers la gauche'
          >
            <ChevronLeft className='h-4 w-4' />
          </button>
        )}

        <div
          ref={scrollContainerRef}
          className={cn(
            'flex',
            fullWidth ? 'flex-1' : '',
            scrollable ? 'overflow-x-auto scrollbar-hide' : ''
          )}
          onScroll={checkScrollButtons}
        >
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && setActiveTab(tab.id)}
              className={cn(
                variantStyles.tab,
                fullWidth ? 'flex-1' : '',
                activeTab === tab.id ? variantStyles.active : 'text-gray-500',
                tab.disabled ? variantStyles.disabled : '',
                'whitespace-nowrap'
              )}
              disabled={tab.disabled}
              aria-selected={activeTab === tab.id}
              role='tab'
            >
              {tab.label}
            </button>
          ))}
        </div>

        {scrollable && showRightArrow && (
          <button
            onClick={() => scrollTo('right')}
            className='flex items-center justify-center w-8 h-10 text-gray-500 hover:text-gray-700 transition-colors'
            aria-label='Faire défiler vers la droite'
          >
            <ChevronRight className='h-4 w-4' />
          </button>
        )}
      </div>

      {/* Tab Content */}
      <div className='mt-4' role='tabpanel'>
        {activeTabContent}
      </div>
    </div>
  );
}
