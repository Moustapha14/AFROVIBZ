import React from 'react';

/**
 * Système de monitoring de production pour AFROVIBZ
 */

export interface ProductionMetrics {
  // Métriques de performance
  pageLoadTime: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;

  // Métriques d'erreurs
  errorCount: number;
  errorTypes: string[];
  errorStackTraces: string[];

  // Métriques utilisateur
  sessionDuration: number;
  pageViews: number;
  userAgent: string;
  viewport: { width: number; height: number };

  // Métriques réseau
  networkRequests: number;
  failedRequests: number;
  averageResponseTime: number;

  // Métriques métier
  conversionRate: number;
  cartAbandonment: number;
  productViews: number;
}

export interface AlertConfig {
  threshold: number;
  metric: keyof ProductionMetrics;
  condition: 'gt' | 'lt' | 'eq';
  message: string;
}

class ProductionMonitor {
  private metrics: ProductionMetrics;
  private alerts: AlertConfig[];
  private isMonitoring = false;
  private sessionStart: number;

  constructor() {
    this.metrics = this.initializeMetrics();
    this.alerts = this.initializeAlerts();
    this.sessionStart = Date.now();
  }

  private initializeMetrics(): ProductionMetrics {
    return {
      pageLoadTime: 0,
      firstContentfulPaint: 0,
      largestContentfulPaint: 0,
      firstInputDelay: 0,
      cumulativeLayoutShift: 0,
      errorCount: 0,
      errorTypes: [],
      errorStackTraces: [],
      sessionDuration: 0,
      pageViews: 0,
      userAgent: '',
      viewport: { width: 0, height: 0 },
      networkRequests: 0,
      failedRequests: 0,
      averageResponseTime: 0,
      conversionRate: 0,
      cartAbandonment: 0,
      productViews: 0,
    };
  }

  private initializeAlerts(): AlertConfig[] {
    return [
      {
        threshold: 3000,
        metric: 'pageLoadTime',
        condition: 'gt',
        message: 'Page load time exceeds 3 seconds',
      },
      {
        threshold: 1800,
        metric: 'firstContentfulPaint',
        condition: 'gt',
        message: 'First Contentful Paint exceeds 1.8 seconds',
      },
      {
        threshold: 2500,
        metric: 'largestContentfulPaint',
        condition: 'gt',
        message: 'Largest Contentful Paint exceeds 2.5 seconds',
      },
      {
        threshold: 100,
        metric: 'firstInputDelay',
        condition: 'gt',
        message: 'First Input Delay exceeds 100ms',
      },
      {
        threshold: 0.1,
        metric: 'cumulativeLayoutShift',
        condition: 'gt',
        message: 'Cumulative Layout Shift exceeds 0.1',
      },
      {
        threshold: 5,
        metric: 'errorCount',
        condition: 'gt',
        message: 'Error count exceeds 5 in this session',
      },
    ];
  }

  /**
   * Démarrer le monitoring de production
   */
  startMonitoring(): void {
    if (this.isMonitoring) return;

    this.isMonitoring = true;
    this.setupErrorMonitoring();
    this.setupPerformanceMonitoring();
    this.setupUserMonitoring();
    this.setupNetworkMonitoring();
    this.setupBusinessMetrics();

    console.log('Production monitoring started');
  }

  /**
   * Arrêter le monitoring
   */
  stopMonitoring(): void {
    this.isMonitoring = false;
    console.log('Production monitoring stopped');
  }

  /**
   * Configurer le monitoring d'erreurs
   */
  private setupErrorMonitoring(): void {
    if (typeof window === 'undefined') return;

    window.addEventListener('error', event => {
      this.metrics.errorCount++;
      this.metrics.errorTypes.push(event.error?.name || 'Unknown');
      this.metrics.errorStackTraces.push(event.error?.stack || '');

      this.checkAlerts();
      this.sendErrorToAnalytics(event);
    });

    window.addEventListener('unhandledrejection', event => {
      this.metrics.errorCount++;
      this.metrics.errorTypes.push('UnhandledPromiseRejection');
      this.metrics.errorStackTraces.push(event.reason?.stack || '');

      this.checkAlerts();
      this.sendErrorToAnalytics(event);
    });
  }

  /**
   * Configurer le monitoring de performance
   */
  private setupPerformanceMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Observer pour First Contentful Paint
    if ('PerformanceObserver' in window) {
      try {
        const paintObserver = new PerformanceObserver(list => {
          const entries = list.getEntries();
          entries.forEach(entry => {
            if (entry.name === 'first-contentful-paint') {
              this.metrics.firstContentfulPaint = entry.startTime;
              this.checkAlerts();
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
          this.checkAlerts();
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
            this.checkAlerts();
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
          this.checkAlerts();
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
        this.metrics.pageLoadTime = navigation.loadEventEnd - navigation.startTime;
        this.checkAlerts();
      }
    });
  }

  /**
   * Configurer le monitoring utilisateur
   */
  private setupUserMonitoring(): void {
    if (typeof window === 'undefined') return;

    // Informations utilisateur
    this.metrics.userAgent = navigator.userAgent;
    this.metrics.viewport = {
      width: window.innerWidth,
      height: window.innerHeight,
    };

    // Durée de session
    setInterval(() => {
      this.metrics.sessionDuration = Date.now() - this.sessionStart;
    }, 1000);

    // Compteur de pages vues
    let pageViews = 0;
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;

    history.pushState = function (...args) {
      originalPushState.apply(history, args);
      pageViews++;
    };

    history.replaceState = function (...args) {
      originalReplaceState.apply(history, args);
      pageViews++;
    };

    // Mettre à jour les pages vues
    setInterval(() => {
      this.metrics.pageViews = pageViews;
    }, 5000);
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

        // Calculer le temps de réponse moyen
        const responseTime = endTime - startTime;
        this.metrics.averageResponseTime =
          (this.metrics.averageResponseTime * (this.metrics.networkRequests - 1) + responseTime) /
          this.metrics.networkRequests;

        return response;
      } catch (error) {
        this.metrics.failedRequests++;
        throw error;
      }
    };
  }

  /**
   * Configurer les métriques métier
   */
  private setupBusinessMetrics(): void {
    if (typeof window === 'undefined') return;

    // Écouter les événements métier
    window.addEventListener('product-view', () => {
      this.metrics.productViews++;
    });

    window.addEventListener('add-to-cart', () => {
      // Logique pour calculer le taux de conversion
    });

    window.addEventListener('cart-abandon', () => {
      this.metrics.cartAbandonment++;
    });
  }

  /**
   * Vérifier les alertes
   */
  private checkAlerts(): void {
    this.alerts.forEach(alert => {
      const value = this.metrics[alert.metric];
      let shouldAlert = false;

      // Vérifier que la valeur est un nombre pour les comparaisons
      if (typeof value === 'number') {
        switch (alert.condition) {
          case 'gt':
            shouldAlert = value > alert.threshold;
            break;
          case 'lt':
            shouldAlert = value < alert.threshold;
            break;
          case 'eq':
            shouldAlert = value === alert.threshold;
            break;
        }
        if (shouldAlert) {
          this.sendAlert(alert, value);
        }
      }
    });
  }

  /**
   * Envoyer une alerte
   */
  private sendAlert(alert: AlertConfig, value: number): void {
    const alertData = {
      message: alert.message,
      metric: alert.metric,
      value,
      threshold: alert.threshold,
      timestamp: new Date().toISOString(),
      userAgent: this.metrics.userAgent,
      sessionId: this.getSessionId(),
    };

    // Envoyer à l'API d'alertes
    this.sendToAlertAPI(alertData);

    // Log local
    console.warn('Production Alert:', alertData);
  }

  /**
   * Envoyer une erreur aux analytics
   */
  private sendErrorToAnalytics(error: ErrorEvent | PromiseRejectionEvent): void {
    const errorData = {
      type: error instanceof ErrorEvent ? 'error' : 'unhandledrejection',
      message: error instanceof ErrorEvent ? error.message : error.reason,
      stack: error instanceof ErrorEvent ? error.error?.stack : error.reason?.stack,
      timestamp: new Date().toISOString(),
      userAgent: this.metrics.userAgent,
      sessionId: this.getSessionId(),
    };

    // Envoyer à l'API d'analytics
    this.sendToAnalyticsAPI(errorData);
  }

  /**
   * Envoyer à l'API d'alertes
   */
  private async sendToAlertAPI(data: any): Promise<void> {
    try {
      await fetch('/api/alerts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Failed to send alert:', error);
    }
  }

  /**
   * Envoyer à l'API d'analytics
   */
  private async sendToAnalyticsAPI(data: any): Promise<void> {
    try {
      await fetch('/api/analytics', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
    } catch (error) {
      console.error('Failed to send analytics:', error);
    }
  }

  /**
   * Obtenir l'ID de session
   */
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('sessionId');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('sessionId', sessionId);
    }
    return sessionId;
  }

  /**
   * Obtenir les métriques actuelles
   */
  getMetrics(): ProductionMetrics {
    return { ...this.metrics };
  }

  /**
   * Exporter les métriques
   */
  exportMetrics(): string {
    return JSON.stringify(this.metrics, null, 2);
  }

  /**
   * Ajouter une alerte personnalisée
   */
  addAlert(alert: AlertConfig): void {
    this.alerts.push(alert);
  }

  /**
   * Réinitialiser les métriques
   */
  resetMetrics(): void {
    this.metrics = this.initializeMetrics();
    this.sessionStart = Date.now();
  }
}

// Instance singleton
export const productionMonitor = new ProductionMonitor();

/**
 * Hook React pour utiliser le monitoring de production
 */
export function useProductionMonitoring() {
  const [metrics, setMetrics] = React.useState<ProductionMetrics>(productionMonitor.getMetrics());

  React.useEffect(() => {
    productionMonitor.startMonitoring();

    const interval = setInterval(() => {
      setMetrics(productionMonitor.getMetrics());
    }, 5000);

    return () => {
      clearInterval(interval);
      productionMonitor.stopMonitoring();
    };
  }, []);

  return {
    metrics,
    startMonitoring: () => productionMonitor.startMonitoring(),
    stopMonitoring: () => productionMonitor.stopMonitoring(),
    resetMetrics: () => productionMonitor.resetMetrics(),
    exportMetrics: () => productionMonitor.exportMetrics(),
    addAlert: (alert: AlertConfig) => productionMonitor.addAlert(alert),
  };
}
