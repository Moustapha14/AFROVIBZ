# 📝 Snippets utiles - AFROVIBZ

> **Collection de snippets de code réutilisables pour le développement**

## 🧩 Composants React

### Composant de base avec TypeScript

```typescript
// Snippet: react-component
import React from 'react';

interface ComponentNameProps {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export const ComponentName: React.FC<ComponentNameProps> = ({
  title,
  children,
  className = '',
}) => {
  return (
    <div className={`component-name ${className}`}>
      <h2>{title}</h2>
      {children}
    </div>
  );
};

export default ComponentName;
```

### Composant avec état local

```typescript
// Snippet: react-component-with-state
import React, { useState, useEffect } from 'react';

interface ComponentWithStateProps {
  initialValue?: string;
}

export const ComponentWithState: React.FC<ComponentWithStateProps> = ({
  initialValue = '',
}) => {
  const [value, setValue] = useState(initialValue);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Effet au montage
    console.log('Component mounted');

    return () => {
      // Cleanup au démontage
      console.log('Component unmounted');
    };
  }, []);

  const handleChange = (newValue: string) => {
    setValue(newValue);
  };

  return (
    <div className="component-with-state">
      <input
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="Entrez une valeur"
      />
      {loading && <span>Chargement...</span>}
    </div>
  );
};
```

### Composant avec hooks personnalisés

```typescript
// Snippet: react-component-with-hooks
import React from 'react';
import { useApi } from '@/hooks/useApi';
import { useLocalStorage } from '@/hooks/useLocalStorage';

interface ComponentWithHooksProps {
  id: string;
}

export const ComponentWithHooks: React.FC<ComponentWithHooksProps> = ({ id }) => {
  const { data, loading, error } = useApi(`/api/items/${id}`);
  const [preferences, setPreferences] = useLocalStorage('preferences', {});

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;

  return (
    <div className="component-with-hooks">
      <h3>{data?.title}</h3>
      <p>{data?.description}</p>
    </div>
  );
};
```

---

## 🎣 Hooks personnalisés

### Hook pour les requêtes API

```typescript
// Snippet: use-api-hook
import { useState, useEffect } from 'react';

interface UseApiOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

export const useApi = <T>(url: string, options: UseApiOptions = {}) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(url, {
          method: options.method || 'GET',
          headers: {
            'Content-Type': 'application/json',
            ...options.headers,
          },
          body: options.body ? JSON.stringify(options.body) : undefined,
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url, options.method, options.body]);

  return { data, loading, error };
};
```

### Hook pour le localStorage

```typescript
// Snippet: use-local-storage-hook
import { useState, useEffect } from 'react';

export const useLocalStorage = <T>(key: string, initialValue: T): [T, (value: T) => void] => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    try {
      setStoredValue(value);
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
};
```

### Hook pour les formulaires

```typescript
// Snippet: use-form-hook
import { useState, useCallback } from 'react';

interface UseFormOptions<T> {
  initialValues: T;
  onSubmit: (values: T) => void | Promise<void>;
  validation?: (values: T) => Partial<Record<keyof T, string>>;
}

export const useForm = <T extends Record<string, any>>({
  initialValues,
  onSubmit,
  validation,
}: UseFormOptions<T>) => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = useCallback(
    (name: keyof T, value: T[keyof T]) => {
      setValues(prev => ({ ...prev, [name]: value }));

      // Clear error when user starts typing
      if (errors[name]) {
        setErrors(prev => ({ ...prev, [name]: '' }));
      }
    },
    [errors]
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (validation) {
        const validationErrors = validation(values);
        setErrors(validationErrors);

        if (Object.keys(validationErrors).length > 0) {
          return;
        }
      }

      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (error) {
        console.error('Form submission error:', error);
      } finally {
        setIsSubmitting(false);
      }
    },
    [values, validation, onSubmit]
  );

  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
  }, [initialValues]);

  return {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    reset,
  };
};
```

---

## 🎨 Styling et UI

### Classes Tailwind communes

```typescript
// Snippet: tailwind-classes
export const tailwindClasses = {
  // Layout
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  grid: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6',
  flex: 'flex items-center justify-between',

  // Cards
  card: 'bg-white rounded-lg shadow-sm border border-gray-200 p-6',
  cardHover: 'hover:shadow-md transition-shadow duration-200',

  // Buttons
  button:
    'inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm',
  buttonPrimary:
    'text-white bg-primary-600 hover:bg-primary-700 focus:ring-2 focus:ring-offset-2 focus:ring-primary-500',
  buttonSecondary: 'text-gray-700 bg-white border-gray-300 hover:bg-gray-50',

  // Forms
  input:
    'block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm',
  label: 'block text-sm font-medium text-gray-700',
  error: 'mt-2 text-sm text-red-600',

  // Text
  heading: 'text-2xl font-bold text-gray-900',
  subheading: 'text-lg font-medium text-gray-700',
  body: 'text-sm text-gray-600',

  // Spacing
  section: 'py-12',
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
};
```

### Composant de loading

```typescript
// Snippet: loading-component
import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export const Loading: React.FC<LoadingProps> = ({
  size = 'md',
  text = 'Chargement...',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <svg
        className={`animate-spin ${sizeClasses[size]} text-primary-600`}
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      {text && <span className="ml-2 text-sm text-gray-600">{text}</span>}
    </div>
  );
};
```

### Composant d'erreur

```typescript
// Snippet: error-component
import React from 'react';

interface ErrorProps {
  error: Error | string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorDisplay: React.FC<ErrorProps> = ({
  error,
  onRetry,
  className = '',
}) => {
  const message = typeof error === 'string' ? error : error.message;

  return (
    <div className={`text-center py-8 ${className}`}>
      <div className="text-red-600 mb-4">
        <svg
          className="mx-auto h-12 w-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
          />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Une erreur s'est produite
      </h3>
      <p className="text-sm text-gray-600 mb-4">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
        >
          Réessayer
        </button>
      )}
    </div>
  );
};
```

---

## 🔧 Utilitaires

### Formatage des dates

```typescript
// Snippet: date-utils
export const formatDate = (date: Date | string, options?: Intl.DateTimeFormatOptions) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  };

  return new Intl.DateTimeFormat('fr-FR', {
    ...defaultOptions,
    ...options,
  }).format(dateObj);
};

export const formatRelativeTime = (date: Date | string) => {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (diffInSeconds < 60) return "À l'instant";
  if (diffInSeconds < 3600) return `Il y a ${Math.floor(diffInSeconds / 60)} min`;
  if (diffInSeconds < 86400) return `Il y a ${Math.floor(diffInSeconds / 3600)}h`;
  if (diffInSeconds < 2592000) return `Il y a ${Math.floor(diffInSeconds / 86400)}j`;

  return formatDate(dateObj);
};
```

### Formatage des prix

```typescript
// Snippet: price-utils
export const formatPrice = (price: number, currency: string = 'EUR', locale: string = 'fr-FR') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(price);
};

export const formatPriceRange = (minPrice: number, maxPrice: number, currency: string = 'EUR') => {
  if (minPrice === maxPrice) {
    return formatPrice(minPrice, currency);
  }

  return `${formatPrice(minPrice, currency)} - ${formatPrice(maxPrice, currency)}`;
};
```

### Validation des formulaires

```typescript
// Snippet: validation-utils
export const validators = {
  required: (value: any) => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return 'Ce champ est requis';
    }
    return '';
  },

  email: (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      return 'Email invalide';
    }
    return '';
  },

  minLength: (min: number) => (value: string) => {
    if (value && value.length < min) {
      return `Minimum ${min} caractères`;
    }
    return '';
  },

  maxLength: (max: number) => (value: string) => {
    if (value && value.length > max) {
      return `Maximum ${max} caractères`;
    }
    return '';
  },

  phone: (value: string) => {
    const phoneRegex = /^(\+33|0)[1-9](\d{8})$/;
    if (value && !phoneRegex.test(value.replace(/\s/g, ''))) {
      return 'Numéro de téléphone invalide';
    }
    return '';
  },

  password: (value: string) => {
    if (value && value.length < 8) {
      return 'Le mot de passe doit contenir au moins 8 caractères';
    }
    if (value && !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
      return 'Le mot de passe doit contenir au moins une minuscule, une majuscule et un chiffre';
    }
    return '';
  },
};
```

---

## 🧪 Tests

### Test de composant

```typescript
// Snippet: component-test
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ComponentName } from './ComponentName';

describe('ComponentName', () => {
  const defaultProps = {
    title: 'Test Title',
  };

  it('renders correctly', () => {
    render(<ComponentName {...defaultProps} />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('handles user interaction', async () => {
    const mockOnClick = jest.fn();
    render(<ComponentName {...defaultProps} onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockOnClick).toHaveBeenCalledTimes(1);
    });
  });

  it('displays loading state', () => {
    render(<ComponentName {...defaultProps} loading={true} />);
    expect(screen.getByText('Chargement...')).toBeInTheDocument();
  });

  it('displays error state', () => {
    const error = new Error('Test error');
    render(<ComponentName {...defaultProps} error={error} />);
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });
});
```

### Test de hook

```typescript
// Snippet: hook-test
import { renderHook, act, waitFor } from '@testing-library/react';
import { useApi } from './useApi';

// Mock fetch
global.fetch = jest.fn();

describe('useApi', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockData,
    });

    const { result } = renderHook(() => useApi('/api/test'));

    expect(result.current.loading).toBe(true);
    expect(result.current.data).toBe(null);

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toEqual(mockData);
    expect(result.current.error).toBe(null);
  });

  it('handles errors', async () => {
    const error = new Error('Network error');
    (fetch as jest.Mock).mockRejectedValueOnce(error);

    const { result } = renderHook(() => useApi('/api/test'));

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.error).toEqual(error);
    expect(result.current.data).toBe(null);
  });
});
```

---

## 📱 Responsive Design

### Hook pour les breakpoints

```typescript
// Snippet: use-breakpoint
import { useState, useEffect } from 'react';

type Breakpoint = 'sm' | 'md' | 'lg' | 'xl' | '2xl';

const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
};

export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>('sm');
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      const windowWidth = window.innerWidth;
      setWidth(windowWidth);

      if (windowWidth >= breakpoints['2xl']) {
        setBreakpoint('2xl');
      } else if (windowWidth >= breakpoints.xl) {
        setBreakpoint('xl');
      } else if (windowWidth >= breakpoints.lg) {
        setBreakpoint('lg');
      } else if (windowWidth >= breakpoints.md) {
        setBreakpoint('md');
      } else {
        setBreakpoint('sm');
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { breakpoint, width };
};
```

### Composant responsive

```typescript
// Snippet: responsive-component
import React from 'react';
import { useBreakpoint } from '@/hooks/useBreakpoint';

interface ResponsiveComponentProps {
  children: React.ReactNode;
  mobile?: React.ReactNode;
  tablet?: React.ReactNode;
  desktop?: React.ReactNode;
}

export const ResponsiveComponent: React.FC<ResponsiveComponentProps> = ({
  children,
  mobile,
  tablet,
  desktop,
}) => {
  const { breakpoint } = useBreakpoint();

  // Rendu conditionnel basé sur le breakpoint
  if (breakpoint === 'sm' && mobile) {
    return <>{mobile}</>;
  }

  if ((breakpoint === 'md' || breakpoint === 'lg') && tablet) {
    return <>{tablet}</>;
  }

  if ((breakpoint === 'xl' || breakpoint === '2xl') && desktop) {
    return <>{desktop}</>;
  }

  return <>{children}</>;
};
```

---

<div align="center">

**💡 Conseil** : Utilisez ces snippets comme point de départ et adaptez-les à vos besoins spécifiques !

_N'hésitez pas à contribuer vos propres snippets à cette collection._

</div>
