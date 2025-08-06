import React from 'react';

/**
 * Système de monitoring performance en temps réel pour AFROVIBZ
 */

export interface PerformanceMetrics {
  // Métriques de navigation
  navigationStart: number;
  loadEventEnd: number;
  domContentLoadedEventEnd: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;

  // Métriques personnalisées
  timeToInteractive: number;
  totalBlockingTime: number;
  speedIndex: number;

  // Métriques réseau
  networkRequests: number;
  totalTransferSize: number;
  cacheHitRatio: number;

  // Métriques mémoire
  memoryUsage: number;
  memoryLimit: number;

  // Métriques d'erreurs
  errorCount: number;
  errorTypes: string[];
}

export interface PerformanceObserver {
  onMetricUpdate: (metrics: PerformanceMetrics) => void;
  onError: (error: Error) => void;
}

class PerformanceMonitor {
  private observers: PerformanceObserver[] = [];
  private metrics: PerformanceMetrics;
  private isMonitoring = false;

  constructor() {
    this.metrics = this.initializeMetrics();
  }

  private initializeMetrics(): PerformanceMetrics {
    return {
      navigationStart: 0,
      loadEventEnd: 0,
      domContentLoadedEventEnd: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0,
      timeToInteractive: 0,
      totalBlockingTime: 0,
      speedIndex: 0,
      networkRequests: 0,
      totalTransferSize: 0,
      cacheHitRatio: 0,
      memoryUsage: 0,
      memoryLimit: 0,
      errorCount: 0,
      errorTypes: [],
    };
  }

  /**
   * Démarrer le monitoring
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.setupPerformanceObservers();
    this.setupErrorMonitoring();
    this.setupNetworkMonitoring();
    this.setupMemoryMonitoring();

    console.log('Performance monitoring started');
  }

  /**
   * Arrêter le monitoring
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    console.log('Performance monitoring stopped');
  }

  /**
   * Ajouter un observateur
   */
  addObserver(observer: PerformanceObserver): void {
    this.observers.push(observer);
  }

  /**
   * Supprimer un observateur
   */
  removeObserver(observer: PerformanceObserver): void {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
    }
  }

  /**
   * Configurer les observateurs de performance
   */
  private setupPerformanceObservers(): void {
    if (typeof window === 'undefined') return;

    // Observer pour First Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.firstContentfulPaint = entry.startTime;
              this.notifyObservers();
            }
          });
        });
        paintObserver.observe({ entryTypes: ['paint'] });
      } catch (error) {
        console.warn('Paint observer not supported:', error);
      }

      // Observer pour Largest Contentful Paint
      try {
        const lcpObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1];
          this.metrics.largestContentfulPaint = lastEntry.startTime;
          this.notifyObservers();
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
      } catch (error) {
        console.warn('LCP observer not supported:', error);
      }

      // Observer pour First Input Delay
      try {
        const fidObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            this.metrics.firstInputDelay = (entry as any).processingStart - entry.startTime;
            this.notifyObservers();
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });
      } catch (error) {
        console.warn('FID observer not supported:', error);
      }

      // Observer pour Cumulative Layout Shift
      try {
        const clsObserver = new PerformanceObserver(list => {
          let clsValue = 0;
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.metrics.cumulativeLayoutShift = clsValue;
          this.notifyObservers();
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      } catch (error) {
        console.warn('CLS observer not supported:', error);
      }
    }

    // Métriques de navigation
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType(
        'navigation'
      )[0] as PerformanceNavigationTiming;
      if (navigation) {
        this.metrics.navigationStart = navigation.startTime;
        this.metrics.loadEventEnd = navigation.loadEventEnd;
        this.metrics.domContentLoadedEventEnd = navigation.domContentLoadedEventEnd;
        this.calculateDerivedMetrics();
        this.notifyObservers();
      }
    });
  }

  /**
   * Configurer le monitoring d'erreurs
   */
  private setupErrorMonitoring(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', event => {
      this.metrics.errorCount++;
      this.metrics.errorTypes.push(event.error?.name || 'Unknown');
      this.notifyObservers();
    });

    window.addEventListener('unhandledrejection', event => {
      this.metrics.errorCount++;
      this.metrics.errorTypes.push('UnhandledPromiseRejection');
      this.notifyObservers();
    });
  }

  /**
   * Configurer le monitoring réseau
   */
  private setupNetworkMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Intercepter les requêtes fetch
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      const startTime = performance.now();
      this.metrics.networkRequests++;

      try {
        const response = await originalFetch(...args);
        const endTime = performance.now();

        // Calculer la taille de transfert si disponible
        if (response.headers.get('content-length')) {
          this.metrics.totalTransferSize += parseInt(response.headers.get('content-length') || '0');
        }

        this.notifyObservers();
        return response;
      } catch (error) {
        this.metrics.errorCount++;
        this.notifyObservers();
        throw error;
      }
    };
  }

  /**
   * Configurer le monitoring mémoire
   */
  private setupMemoryMonitoring(): void {
    if (typeof window === 'undefined') return;

    const updateMemoryMetrics = () => {
      if ('memory' in performance) {
        const memory = (performance as any).memory;
        this.metrics.memoryUsage = memory.usedJSHeapSize;
        this.metrics.memoryLimit = memory.jsHeapSizeLimit;
        this.notifyObservers();
      }
    };

    // Mettre à jour les métriques mémoire périodiquement
    setInterval(updateMemoryMetrics, 5000);
    updateMemoryMetrics();
  }

  /**
   * Calculer les métriques dérivées
   */
  private calculateDerivedMetrics(): void {
    // Time to Interactive (approximation)
    this.metrics.timeToInteractive =
      this.metrics.domContentLoadedEventEnd - this.metrics.navigationStart;

    // Speed Index (approximation basée sur FCP)
    this.metrics.speedIndex = this.metrics.firstContentfulPaint;

    // Total Blocking Time (approximation)
    this.metrics.totalBlockingTime = this.metrics.firstInputDelay;
  }

  /**
   * Notifier tous les observateurs
   */
  private notifyObservers(): void {
    this.observers.forEach(observer => {
      try {
        observer.onMetricUpdate({ ...this.metrics });
      } catch (error) {
        observer.onError(error as Error);
      }
    });
  }

  /**
   * Obtenir les métriques actuelles
   */
  getMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  /**
   * Réinitialiser les métriques
   */
  resetMetrics(): void {
    this.metrics = this.initializeMetrics();
    this.notifyObservers();
  }

  /**
   * Exporter les métriques pour analyse
   */
  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }
}

// Instance singleton
export const performanceMonitor = new PerformanceMonitor();

/**
 * Hook React pour utiliser le monitoring de performance
 */
export function usePerformanceMonitoring() {
  const [metrics, setMetrics] = React.useState<PerformanceMetrics>(performanceMonitor.getMetrics());

  React.useEffect(() => {
    const observer: PerformanceObserver = {
      onMetricUpdate: newMetrics => {
        setMetrics(newMetrics);
      },
      onError: error => {
        console.error('Performance monitoring error:', error);
      },
    };

    performanceMonitor.addObserver(observer);
    performanceMonitor.startMonitoring();

    return () => {
      performanceMonitor.removeObserver(observer);
    };
  }, []);

  return {
    metrics,
    startMonitoring: () => performanceMonitor.startMonitoring(),
    stopMonitoring: () => performanceMonitor.stopMonitoring(),
    resetMetrics: () => performanceMonitor.resetMetrics(),
    exportMetrics: () => performanceMonitor.exportMetrics(),
  };
}

/**
 * Composant pour afficher les métriques de performance
 */
export function PerformanceMetricsDisplay({ className = '' }: { className?: string }) {
  const { metrics } = usePerformanceMonitoring();

  return (
    <div className={`bg-white rounded-lg shadow p-4 ${className}`}>
      <h3 className='text-lg font-semibold mb-4'>Métriques de Performance</h3>

      <div className='grid grid-cols-2 gap-4 text-sm'>
        <div>
          <span className='font-medium'>FCP:</span> {metrics.firstContentfulPaint.toFixed(0)}ms
        </div>
        <div>
          <span className='font-medium'>LCP:</span> {metrics.largestContentfulPaint.toFixed(0)}ms
        </div>
        <div>
          <span className='font-medium'>FID:</span> {metrics.firstInputDelay.toFixed(0)}ms
        </div>
        <div>
          <span className='font-medium'>CLS:</span> {metrics.cumulativeLayoutShift.toFixed(3)}
        </div>
        <div>
          <span className='font-medium'>TTI:</span> {metrics.timeToInteractive.toFixed(0)}ms
        </div>
        <div>
          <span className='font-medium'>Erreurs:</span> {metrics.errorCount}
        </div>
      </div>
    </div>
  );
}
