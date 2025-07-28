# 🐛 9. Debugging et outils

> **Temps de lecture** : 20-30 minutes

## 🛠️ Outils de debug

### React DevTools

React DevTools est l'outil essentiel pour déboguer les composants React.

#### Installation
```bash
# Extension Chrome/Firefox
# Téléchargez depuis le Chrome Web Store ou Firefox Add-ons

# Ou installez globalement
npm install -g react-devtools
```

#### Utilisation
```typescript
// Dans votre composant, ajoutez des points de debug
export const ProductCard = ({ product, onAddToCart }) => {
  // Debug avec React DevTools
  console.log('ProductCard render:', { product, onAddToCart });

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <button onClick={() => {
        console.log('Add to cart clicked:', product.id);
        onAddToCart(product.id);
      }}>
        Ajouter au panier
      </button>
    </div>
  );
};
```

#### Fonctionnalités utiles
- **Components** : Inspecter la hiérarchie des composants
- **Profiler** : Analyser les performances
- **Settings** : Configurer l'affichage

### Chrome DevTools

#### Network Tab
```typescript
// Debug des requêtes API
const fetchProducts = async () => {
  console.log('Fetching products...');
  
  try {
    const response = await fetch('/api/products');
    console.log('Response status:', response.status);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log('Products data:', data);
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
```

#### Console Tab
```typescript
// Utilisation avancée de console
export const debugComponent = (componentName: string, props: any) => {
  console.group(`🔍 ${componentName} Debug`);
  console.log('Props:', props);
  console.log('Timestamp:', new Date().toISOString());
  console.trace('Component stack trace');
  console.groupEnd();
};

// Utilisation
export const ProductCard = (props) => {
  debugComponent('ProductCard', props);
  // ... reste du composant
};
```

#### Sources Tab
```typescript
// Points d'arrêt dans le code
export const handleAddToCart = (productId: string) => {
  // Point d'arrêt ici pour inspecter productId
  debugger;
  
  if (!productId) {
    console.warn('ProductId is missing');
    return;
  }
  
  // Logique d'ajout au panier
  addToCart(productId);
};
```

---

## 🔍 Techniques de debugging

### Debugging des hooks

```typescript
// Hook personnalisé pour le debugging
export const useDebug = (name: string, value: any) => {
  useEffect(() => {
    console.log(`🔍 ${name}:`, value);
  }, [name, value]);
};

// Hook pour tracer les re-renders
export const useRenderCount = (componentName: string) => {
  const renderCount = useRef(0);
  
  useEffect(() => {
    renderCount.current += 1;
    console.log(`🔄 ${componentName} rendered ${renderCount.current} times`);
  });
  
  return renderCount.current;
};

// Utilisation
export const ProductCard = ({ product }) => {
  useRenderCount('ProductCard');
  useDebug('ProductCard props', { product });
  
  return <div>{product.name}</div>;
};
```

### Debugging des erreurs

```typescript
// Boundary d'erreur avec debugging
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('🚨 Error caught by boundary:', error);
    console.error('Error info:', errorInfo);
    
    // Log détaillé pour le debugging
    console.group('🔍 Error Details');
    console.log('Error message:', error.message);
    console.log('Error stack:', error.stack);
    console.log('Component stack:', errorInfo.componentStack);
    console.log('Current URL:', window.location.href);
    console.log('User agent:', navigator.userAgent);
    console.groupEnd();
    
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <h2>Une erreur s'est produite</h2>
          {process.env.NODE_ENV === 'development' && (
            <details>
              <summary>Détails de l'erreur</summary>
              <pre>{this.state.error?.toString()}</pre>
              <pre>{this.state.errorInfo?.componentStack}</pre>
            </details>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}
```

### Debugging des performances

```typescript
// Hook pour mesurer les performances
export const usePerformance = (name: string) => {
  const startTime = useRef(performance.now());
  
  useEffect(() => {
    const endTime = performance.now();
    const duration = endTime - startTime.current;
    
    console.log(`⏱️ ${name} took ${duration.toFixed(2)}ms`);
    
    // Avertissement si trop lent
    if (duration > 16) { // Plus de 16ms = moins de 60fps
      console.warn(`🐌 ${name} is slow: ${duration.toFixed(2)}ms`);
    }
  });
};

// Profiler de composant
export const withProfiler = (WrappedComponent: React.ComponentType, name: string) => {
  return React.forwardRef((props, ref) => {
    usePerformance(name);
    
    return (
      <React.Profiler id={name} onRender={(id, phase, actualDuration) => {
        console.log(`📊 ${id} ${phase}: ${actualDuration.toFixed(2)}ms`);
      }}>
        <WrappedComponent {...props} ref={ref} />
      </React.Profiler>
    );
  });
};
```

---

## 📊 Logs et monitoring

### Système de logging

```typescript
// utils/logger.ts
type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  data?: any;
  userId?: string;
  sessionId?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;

  private log(level: LogLevel, message: string, data?: any) {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      data,
      userId: this.getUserId(),
      sessionId: this.getSessionId(),
    };

    this.logs.push(entry);
    
    // Limiter le nombre de logs en mémoire
    if (this.logs.length > this.maxLogs) {
      this.logs = this.logs.slice(-this.maxLogs);
    }

    // Afficher dans la console
    console[level](`[${level.toUpperCase()}] ${message}`, data || '');
    
    // Envoyer au serveur en production
    if (process.env.NODE_ENV === 'production') {
      this.sendToServer(entry);
    }
  }

  debug(message: string, data?: any) {
    this.log('debug', message, data);
  }

  info(message: string, data?: any) {
    this.log('info', message, data);
  }

  warn(message: string, data?: any) {
    this.log('warn', message, data);
  }

  error(message: string, data?: any) {
    this.log('error', message, data);
  }

  private getUserId(): string | undefined {
    // Récupérer l'ID utilisateur depuis le contexte d'auth
    return localStorage.getItem('user-id') || undefined;
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('session-id');
    if (!sessionId) {
      sessionId = Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('session-id', sessionId);
    }
    return sessionId;
  }

  private async sendToServer(entry: LogEntry) {
    try {
      await fetch('/api/logs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(entry),
      });
    } catch (error) {
      console.error('Failed to send log to server:', error);
    }
  }

  // Récupérer les logs pour le debugging
  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  // Exporter les logs
  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }

  // Vider les logs
  clearLogs() {
    this.logs = [];
  }
}

export const logger = new Logger();
```

### Monitoring des erreurs

```typescript
// utils/errorMonitor.ts
interface ErrorReport {
  message: string;
  stack?: string;
  componentStack?: string;
  url: string;
  userAgent: string;
  timestamp: string;
  userId?: string;
  sessionId?: string;
}

class ErrorMonitor {
  private errors: ErrorReport[] = [];
  private maxErrors = 100;

  captureError(error: Error, componentStack?: string) {
    const report: ErrorReport = {
      message: error.message,
      stack: error.stack,
      componentStack,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString(),
      userId: localStorage.getItem('user-id') || undefined,
      sessionId: sessionStorage.getItem('session-id') || undefined,
    };

    this.errors.push(report);
    
    if (this.errors.length > this.maxErrors) {
      this.errors = this.errors.slice(-this.maxErrors);
    }

    // Envoyer au serveur
    this.sendErrorReport(report);
  }

  private async sendErrorReport(report: ErrorReport) {
    try {
      await fetch('/api/errors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });
    } catch (error) {
      console.error('Failed to send error report:', error);
    }
  }

  getErrors(): ErrorReport[] {
    return [...this.errors];
  }
}

export const errorMonitor = new ErrorMonitor();

// Hook pour capturer les erreurs
export const useErrorBoundary = () => {
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      const error = new Error(event.message);
      error.stack = event.error?.stack;
      
      errorMonitor.captureError(error);
      setError(error);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = new Error('Unhandled promise rejection');
      error.stack = event.reason?.stack;
      
      errorMonitor.captureError(error);
      setError(error);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', handleUnhandledRejection);

    return () => {
      window.removeEventListener('error', handleError);
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
    };
  }, []);

  return { error, setError };
};
```

---

## 🚨 Erreurs fréquentes

### Erreurs React courantes

#### 1. "Cannot read property of undefined"

```typescript
// ❌ Problématique
export const ProductCard = ({ product }) => {
  return (
    <div>
      <h3>{product.name}</h3> {/* Erreur si product est undefined */}
    </div>
  );
};

// ✅ Solution
export const ProductCard = ({ product }) => {
  if (!product) {
    return <div>Produit non trouvé</div>;
  }

  return (
    <div>
      <h3>{product.name}</h3>
    </div>
  );
};

// ✅ Solution avec optional chaining
export const ProductCard = ({ product }) => {
  return (
    <div>
      <h3>{product?.name || 'Nom inconnu'}</h3>
    </div>
  );
};
```

#### 2. "Maximum update depth exceeded"

```typescript
// ❌ Problématique
export const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, [products]); // Dépendance incorrecte

  return <div>{/* ... */}</div>;
};

// ✅ Solution
export const ProductList = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts().then(setProducts);
  }, []); // Dépendances vides

  return <div>{/* ... */}</div>;
};
```

#### 3. "Warning: Can't perform a React state update on an unmounted component"

```typescript
// ❌ Problématique
export const ProductDetails = ({ productId }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    fetchProduct(productId).then(setProduct);
  }, [productId]);

  return <div>{/* ... */}</div>;
};

// ✅ Solution avec cleanup
export const ProductDetails = ({ productId }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetchProduct(productId).then((data) => {
      if (isMounted) {
        setProduct(data);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [productId]);

  return <div>{/* ... */}</div>;
};
```

### Erreurs Next.js courantes

#### 1. "Hydration mismatch"

```typescript
// ❌ Problématique
export const ProductCard = ({ product }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <div>
      {isClient ? (
        <span>Client: {product.name}</span>
      ) : (
        <span>Server: {product.name}</span>
      )}
    </div>
  );
};

// ✅ Solution
export const ProductCard = ({ product }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div>Chargement...</div>;
  }

  return (
    <div>
      <span>{product.name}</span>
    </div>
  );
};
```

#### 2. "Module not found"

```typescript
// ❌ Problématique
import { Button } from '@/components/Button'; // Fichier inexistant

// ✅ Solution
// Vérifier que le fichier existe
import { Button } from '@/components/ui/Button';

// Ou créer le fichier manquant
// components/ui/Button.tsx
```

### Erreurs TypeScript courantes

#### 1. "Type 'undefined' is not assignable to type 'string'"

```typescript
// ❌ Problématique
interface Product {
  name: string;
  price: number;
}

const product: Product = {
  name: undefined, // Erreur TypeScript
  price: 100,
};

// ✅ Solution
interface Product {
  name: string;
  price: number;
}

const product: Product = {
  name: 'Produit', // Valeur valide
  price: 100,
};

// Ou rendre optionnel
interface Product {
  name?: string;
  price: number;
}
```

#### 2. "Property does not exist on type"

```typescript
// ❌ Problématique
const product = { name: 'Test', price: 100 };
console.log(product.description); // Erreur

// ✅ Solution
interface Product {
  name: string;
  price: number;
  description?: string;
}

const product: Product = { name: 'Test', price: 100 };
console.log(product.description || 'Aucune description');
```

---

## 📈 Profiling

### Profiling des performances

```typescript
// utils/performance.ts
class PerformanceMonitor {
  private metrics: Map<string, number[]> = new Map();

  startTimer(name: string): () => void {
    const start = performance.now();
    
    return () => {
      const duration = performance.now() - start;
      this.recordMetric(name, duration);
    };
  }

  private recordMetric(name: string, duration: number) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, []);
    }
    
    this.metrics.get(name)!.push(duration);
    
    // Garder seulement les 100 dernières mesures
    const metrics = this.metrics.get(name)!;
    if (metrics.length > 100) {
      metrics.splice(0, metrics.length - 100);
    }
  }

  getMetrics(name: string) {
    const metrics = this.metrics.get(name) || [];
    if (metrics.length === 0) return null;

    const avg = metrics.reduce((a, b) => a + b, 0) / metrics.length;
    const min = Math.min(...metrics);
    const max = Math.max(...metrics);

    return { avg, min, max, count: metrics.length };
  }

  printReport() {
    console.group('📊 Performance Report');
    
    for (const [name, metrics] of this.metrics) {
      const report = this.getMetrics(name);
      if (report) {
        console.log(`${name}:`, report);
      }
    }
    
    console.groupEnd();
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Hook pour mesurer les performances
export const usePerformanceMonitor = (name: string) => {
  const endTimer = useRef<(() => void) | null>(null);

  useEffect(() => {
    endTimer.current = performanceMonitor.startTimer(name);
    
    return () => {
      endTimer.current?.();
    };
  }, [name]);

  return performanceMonitor.getMetrics(name);
};
```

---

## 🎯 Prochaines étapes

Maintenant que vous maîtrisez le debugging :

1. **🤝 [Workflow](./10-workflow.md)** pour collaborer efficacement
2. **📚 [Ressources](./README.md)** pour approfondir vos connaissances
3. **🚀 [Démarrage](./02-getting-started.md)** pour commencer à coder

---

<div align="center">

**💡 Conseil** : Utilisez les outils de debug régulièrement. Un bon debugging fait gagner beaucoup de temps !

</div> 