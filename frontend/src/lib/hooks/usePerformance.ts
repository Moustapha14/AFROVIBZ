import { useCallback, useMemo, useRef, useState, useEffect } from 'react';

/**
 * Hook pour optimiser les performances avec debouncing
 */
export function useDebounce<T extends (...args: any[]) => any>(callback: T, delay: number): T {
  const timeoutRef = useRef<NodeJS.Timeout>();

  return useCallback(
    ((...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      timeoutRef.current = setTimeout(() => callback(...args), delay);
    }) as T,
    [callback, delay]
  );
}

/**
 * Hook pour optimiser les listes avec virtualisation
 */
export function useVirtualizedList<T>(items: T[], itemHeight: number, containerHeight: number) {
  return useMemo(() => {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const startIndex = 0;
    const endIndex = Math.min(startIndex + visibleCount, items.length);

    return {
      visibleItems: items.slice(startIndex, endIndex),
      startIndex,
      endIndex,
      totalHeight: items.length * itemHeight,
    };
  }, [items, itemHeight, containerHeight]);
}

/**
 * Hook pour optimiser les calculs coûteux
 */
export function useMemoizedValue<T>(factory: () => T, dependencies: React.DependencyList): T {
  return useMemo(factory, dependencies);
}

/**
 * Hook pour optimiser les callbacks
 */
export function useStableCallback<T extends (...args: any[]) => any>(callback: T): T {
  return useCallback(callback, [callback]);
}

/**
 * Hook pour détecter si un composant est visible dans le viewport
 */
export function useIntersectionObserver(options: IntersectionObserverInit = {}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [ref, setRef] = useState<Element | null>(null);

  useEffect(() => {
    if (!ref) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);

    observer.observe(ref);

    return () => {
      observer.disconnect();
    };
  }, [ref, options]);

  return [setRef, isIntersecting] as const;
}

/**
 * Hook pour optimiser les images avec lazy loading
 */
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || src);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setImageSrc(src);
      setIsLoading(false);
    };
    img.onerror = () => {
      setIsLoading(false);
    };
  }, [src]);

  return { imageSrc, isLoading };
}
