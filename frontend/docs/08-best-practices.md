# ✅ 8. Bonnes pratiques et standards

> **Temps de lecture** : 30-40 minutes

## 📝 Conventions de code

### Règles ESLint

```javascript
// .eslintrc.js
module.exports = {
  extends: ['next/core-web-vitals', '@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint', 'react-hooks'],
  rules: {
    // TypeScript
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',

    // React
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 'off', // On utilise TypeScript
    'react/react-in-jsx-scope': 'off', // Next.js 13+

    // Général
    'no-console': 'warn',
    'no-debugger': 'error',
    'prefer-const': 'error',
    'no-var': 'error',

    // Import/Export
    'import/order': [
      'error',
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

### Configuration Prettier

```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "bracketSameLine": false,
  "arrowParens": "avoid",
  "endOfLine": "lf",
  "quoteProps": "as-needed",
  "jsxSingleQuote": true,
  "proseWrap": "preserve"
}
```

### Scripts package.json

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "lint:fix": "next lint --fix",
    "format": "prettier --write .",
    "format:check": "prettier --check .",
    "type-check": "tsc --noEmit",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "prepare": "husky install"
  }
}
```

---

## 🔧 Structure des commits

### Convention Conventional Commits

```bash
# Format général
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types de commits

| Type       | Description                 | Exemple                                              |
| ---------- | --------------------------- | ---------------------------------------------------- |
| `feat`     | Nouvelle fonctionnalité     | `feat: ajouter la pagination des produits`           |
| `fix`      | Correction de bug           | `fix: corriger l'affichage du panier vide`           |
| `docs`     | Documentation               | `docs: mettre à jour le README`                      |
| `style`    | Formatage, style            | `style: formater le code avec Prettier`              |
| `refactor` | Refactoring                 | `refactor: simplifier la logique d'authentification` |
| `test`     | Tests                       | `test: ajouter des tests pour ProductCard`           |
| `chore`    | Tâches de maintenance       | `chore: mettre à jour les dépendances`               |
| `perf`     | Amélioration de performance | `perf: optimiser le chargement des images`           |
| `ci`       | Configuration CI/CD         | `ci: configurer GitHub Actions`                      |
| `build`    | Build système               | `build: configurer Vercel`                           |

### Exemples de commits

```bash
# Commit simple
feat: ajouter la fonctionnalité de recherche

# Commit avec scope
feat(products): ajouter le filtrage par catégorie

# Commit avec description détaillée
feat: ajouter la pagination des produits

- Implémenter la pagination côté client
- Ajouter les contrôles de navigation
- Optimiser les performances avec la virtualisation

Closes #123

# Commit de correction
fix(auth): corriger la redirection après connexion

Le problème était causé par une mauvaise gestion du state
dans le contexte d'authentification.

Fixes #456
```

### Configuration Husky

```json
// .husky/pre-commit
#!/bin/sh
. "$(dirname "$0")/_/husky.sh"

npm run lint
npm run type-check
npm run test
```

---

## 🧪 Tests

### Configuration Jest

```javascript
// jest.config.js
const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './',
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.stories.{js,jsx,ts,tsx}',
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

module.exports = createJestConfig(customJestConfig);
```

### Tests unitaires

```typescript
// __tests__/components/ProductCard.test.tsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProductCard } from '@/components/ProductCard';
import { mockProduct } from '@/__mocks__/product';

// Mock des hooks
jest.mock('@/hooks/useCart', () => ({
  useCart: () => ({
    addToCart: jest.fn(),
    isInCart: jest.fn(),
  }),
}));

describe('ProductCard', () => {
  const defaultProps = {
    product: mockProduct,
    onAddToCart: jest.fn(),
  };

  it('affiche les informations du produit', () => {
    render(<ProductCard {...defaultProps} />);

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.price.toString())).toBeInTheDocument();
    expect(screen.getByAltText(mockProduct.name)).toBeInTheDocument();
  });

  it('appelle onAddToCart quand on clique sur le bouton', async () => {
    render(<ProductCard {...defaultProps} />);

    const addButton = screen.getByRole('button', { name: /ajouter au panier/i });
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(defaultProps.onAddToCart).toHaveBeenCalledWith(mockProduct.id);
    });
  });

  it('affiche un état de chargement', () => {
    render(<ProductCard {...defaultProps} loading={true} />);

    expect(screen.getByText(/chargement/i)).toBeInTheDocument();
  });

  it('gère les erreurs d\'image', () => {
    const productWithBrokenImage = {
      ...mockProduct,
      image: 'broken-image.jpg',
    };

    render(<ProductCard {...defaultProps} product={productWithBrokenImage} />);

    const image = screen.getByAltText(mockProduct.name);
    fireEvent.error(image);

    expect(image).toHaveAttribute('src', '/placeholder.jpg');
  });
});
```

### Tests d'intégration

```typescript
// __tests__/pages/products.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { rest } from 'msw';
import { setupServer } from 'msw/node';
import ProductsPage from '@/app/products/page';

// Mock du serveur
const server = setupServer(
  rest.get('/api/products', (req, res, ctx) => {
    return res(
      ctx.json([
        { id: '1', name: 'Robe africaine', price: 89.99 },
        { id: '2', name: 'Pantalon wax', price: 129.99 },
      ])
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ProductsPage', () => {
  it('affiche la liste des produits', async () => {
    render(<ProductsPage />);

    await waitFor(() => {
      expect(screen.getByText('Robe africaine')).toBeInTheDocument();
      expect(screen.getByText('Pantalon wax')).toBeInTheDocument();
    });
  });

  it('gère les erreurs de chargement', async () => {
    server.use(
      rest.get('/api/products', (req, res, ctx) => {
        return res(ctx.status(500));
      })
    );

    render(<ProductsPage />);

    await waitFor(() => {
      expect(screen.getByText(/erreur de chargement/i)).toBeInTheDocument();
    });
  });
});
```

### Tests des hooks

```typescript
// __tests__/hooks/useCart.test.ts
import { renderHook, act } from '@testing-library/react';
import { useCart } from '@/hooks/useCart';

describe('useCart', () => {
  it('ajoute un produit au panier', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart({ id: '1', name: 'Test', price: 10 });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0].id).toBe('1');
  });

  it("met à jour la quantité d'un produit existant", () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart({ id: '1', name: 'Test', price: 10 });
      result.current.addToCart({ id: '1', name: 'Test', price: 10 });
    });

    expect(result.current.items[0].quantity).toBe(2);
  });

  it('calcule le total correctement', () => {
    const { result } = renderHook(() => useCart());

    act(() => {
      result.current.addToCart({ id: '1', name: 'Test', price: 10 });
      result.current.addToCart({ id: '2', name: 'Test2', price: 20 });
    });

    expect(result.current.total).toBe(30);
  });
});
```

---

## ⚡ Performance

### Optimisation des images

```typescript
// components/OptimizedImage.tsx
import Image from 'next/image';
import { useState } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  className?: string;
  priority?: boolean;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <Image
        src={error ? '/placeholder.jpg' : src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className={`
          duration-700 ease-in-out
          ${isLoading ? 'scale-110 blur-2xl grayscale' : 'scale-100 blur-0 grayscale-0'}
        `}
        onLoadingComplete={() => setIsLoading(false)}
        onError={() => setError(true)}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />
    </div>
  );
};
```

### Lazy loading des composants

```typescript
// hooks/useLazyLoad.ts
import { useState, useEffect, useRef } from 'react';

export const useLazyLoad = (threshold = 0.1) => {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, [threshold]);

  return { ref, isVisible };
};

// Utilisation
export const LazyProductCard = ({ product }: { product: Product }) => {
  const { ref, isVisible } = useLazyLoad();

  return (
    <div ref={ref}>
      {isVisible ? (
        <ProductCard product={product} />
      ) : (
        <ProductCardSkeleton />
      )}
    </div>
  );
};
```

### Memoization des composants

```typescript
// Composant optimisé avec React.memo
export const ProductCard = React.memo<ProductCardProps>(({
  product,
  onAddToCart,
  variant = 'default'
}) => {
  const handleAddToCart = useCallback(() => {
    onAddToCart?.(product.id);
  }, [product.id, onAddToCart]);

  const formattedPrice = useMemo(() => {
    return formatPrice(product.price);
  }, [product.price]);

  return (
    <div className={`product-card ${variant}`}>
      <OptimizedImage
        src={product.image}
        alt={product.name}
        width={300}
        height={400}
      />
      <h3>{product.name}</h3>
      <p>{formattedPrice}</p>
      <Button onClick={handleAddToCart}>
        Ajouter au panier
      </Button>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';
```

### Bundle splitting

```typescript
// Lazy loading des pages
import dynamic from 'next/dynamic';

const AdminDashboard = dynamic(() => import('@/app/admin/page'), {
  loading: () => <AdminDashboardSkeleton />,
  ssr: false, // Désactiver le SSR pour les pages admin
});

const ProductModal = dynamic(() => import('@/components/ProductModal'), {
  loading: () => <ModalSkeleton />,
});

// Lazy loading des composants lourds
const Chart = dynamic(() => import('@/components/Chart'), {
  loading: () => <ChartSkeleton />,
  ssr: false,
});
```

---

## ♿ Accessibilité

### Composants accessibles

```typescript
// components/AccessibleButton.tsx
interface AccessibleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  'aria-describedby'?: string;
}

export const AccessibleButton: React.FC<AccessibleButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  ...props
}) => {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-busy={loading}
      {...props}
    >
      {loading && (
        <span className="sr-only">Chargement en cours</span>
      )}
      {children}
    </button>
  );
};
```

### Navigation au clavier

```typescript
// hooks/useKeyboardNavigation.ts
import { useEffect, useRef } from 'react';

export const useKeyboardNavigation = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const container = containerRef.current;
      if (!container) return;

      const focusableElements = container.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      const currentIndex = Array.from(focusableElements).findIndex(
        el => el === document.activeElement
      );

      switch (event.key) {
        case 'ArrowDown':
        case 'ArrowRight':
          event.preventDefault();
          const nextIndex = (currentIndex + 1) % focusableElements.length;
          (focusableElements[nextIndex] as HTMLElement)?.focus();
          break;

        case 'ArrowUp':
        case 'ArrowLeft':
          event.preventDefault();
          const prevIndex = currentIndex <= 0 ? focusableElements.length - 1 : currentIndex - 1;
          (focusableElements[prevIndex] as HTMLElement)?.focus();
          break;

        case 'Home':
          event.preventDefault();
          (focusableElements[0] as HTMLElement)?.focus();
          break;

        case 'End':
          event.preventDefault();
          (focusableElements[focusableElements.length - 1] as HTMLElement)?.focus();
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return containerRef;
};
```

### Tests d'accessibilité

```typescript
// __tests__/accessibility/ProductCard.test.tsx
import { render, screen } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { ProductCard } from '@/components/ProductCard';

expect.extend(toHaveNoViolations);

describe('ProductCard Accessibility', () => {
  it('should not have accessibility violations', async () => {
    const { container } = render(
      <ProductCard
        product={mockProduct}
        onAddToCart={jest.fn()}
      />
    );

    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('should have proper ARIA labels', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={jest.fn()}
      />
    );

    expect(screen.getByRole('button', { name: /ajouter au panier/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: mockProduct.name })).toBeInTheDocument();
  });

  it('should be keyboard navigable', () => {
    render(
      <ProductCard
        product={mockProduct}
        onAddToCart={jest.fn()}
      />
    );

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('tabindex', '0');
  });
});
```

---

## 🔒 Sécurité

### Validation des données

```typescript
// lib/validation.ts
import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom est trop long'),
  price: z.number().positive('Le prix doit être positif'),
  description: z.string().max(500, 'La description est trop longue'),
  category: z.enum(['robes', 'pantalons', 'accessoires']),
  images: z.array(z.string().url('URL invalide')).min(1, 'Au moins une image requise'),
});

export const userSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Le mot de passe doit contenir au moins 8 caractères'),
  name: z.string().min(2, 'Le nom doit contenir au moins 2 caractères'),
});

// Utilisation
export const validateProduct = (data: unknown) => {
  try {
    return productSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation failed: ${error.errors.map(e => e.message).join(', ')}`);
    }
    throw error;
  }
};
```

### Protection XSS

```typescript
// utils/sanitize.ts
import DOMPurify from 'dompurify';

export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a'],
    ALLOWED_ATTR: ['href'],
  });
};

// Composant sécurisé
export const SafeHtml: React.FC<{ content: string }> = ({ content }) => {
  const sanitizedContent = useMemo(() => sanitizeHtml(content), [content]);

  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizedContent }}
      className="prose prose-sm max-w-none"
    />
  );
};
```

### Protection CSRF

```typescript
// hooks/useCsrf.ts
import { useState, useEffect } from 'react';

export const useCsrf = () => {
  const [csrfToken, setCsrfToken] = useState<string | null>(null);

  useEffect(() => {
    // Récupérer le token CSRF depuis le serveur
    fetch('/api/csrf')
      .then(res => res.json())
      .then(data => setCsrfToken(data.csrfToken));
  }, []);

  const makeAuthenticatedRequest = async (url: string, options: RequestInit = {}) => {
    if (!csrfToken) {
      throw new Error('CSRF token not available');
    }

    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'X-CSRF-Token': csrfToken,
        'Content-Type': 'application/json',
      },
    });
  };

  return { csrfToken, makeAuthenticatedRequest };
};
```

---

## 🎯 Prochaines étapes

Maintenant que vous maîtrisez les bonnes pratiques :

1. **🐛 [Debugging](./09-debugging.md)** pour résoudre les problèmes
2. **🤝 [Workflow](./10-workflow.md)** pour collaborer efficacement
3. **📚 [Ressources](./README.md)** pour approfondir vos connaissances

---

<div align="center">

**💡 Conseil** : Appliquez ces bonnes pratiques progressivement. La qualité du code s'améliore avec le temps et l'expérience !

</div>
