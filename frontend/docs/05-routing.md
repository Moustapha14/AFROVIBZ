# 🧭 5. Navigation et routing

> **Temps de lecture** : 20-30 minutes

## ⚙️ Configuration App Router

### Structure des routes

Next.js 13+ utilise l'App Router basé sur les dossiers. Voici comment organiser vos routes :

```
src/app/
├── page.tsx                    # Route: /
├── layout.tsx                  # Layout racine
├── globals.css                 # Styles globaux
├── favicon.ico                 # Icône du site
├── auth/                       # Route: /auth
│   ├── login/
│   │   └── page.tsx           # Route: /auth/login
│   └── register/
│       └── page.tsx           # Route: /auth/register
├── products/                   # Route: /products
│   ├── page.tsx               # Route: /products
│   └── [category]/            # Route dynamique: /products/robes
│       └── page.tsx
├── product/                    # Route: /product
│   └── [id]/                  # Route dynamique: /product/123
│       ├── page.tsx
│       └── tracking/          # Route: /product/123/tracking
│           └── page.tsx
├── cart/                       # Route: /cart
│   └── page.tsx
├── checkout/                   # Route: /checkout
│   └── page.tsx
├── admin/                      # Route: /admin
│   ├── layout.tsx             # Layout admin
│   ├── page.tsx               # Route: /admin
│   ├── products/              # Route: /admin/products
│   │   └── page.tsx
│   └── orders/                # Route: /admin/orders
│       └── page.tsx
└── api/                        # API Routes
    ├── products/
    │   └── route.ts           # Route: /api/products
    └── auth/
        └── route.ts           # Route: /api/auth
```

### Fichiers spéciaux

| Fichier | Rôle | Exemple |
|---------|------|---------|
| `page.tsx` | Page de la route | `/products/page.tsx` → `/products` |
| `layout.tsx` | Layout partagé | `/admin/layout.tsx` → Layout admin |
| `loading.tsx` | Page de chargement | Affichée pendant le chargement |
| `error.tsx` | Page d'erreur | Gestion des erreurs |
| `not-found.tsx` | Page 404 | Page non trouvée |
| `route.ts` | API Route | Endpoints API |

---

## 🛣️ Structure des routes

### Routes statiques

```typescript
// src/app/products/page.tsx
export default function ProductsPage() {
  return (
    <div className="container mx-auto">
      <h1>Nos produits</h1>
      <ProductList />
    </div>
  );
}
```

### Routes dynamiques

```typescript
// src/app/product/[id]/page.tsx
interface ProductPageProps {
  params: {
    id: string;
  };
  searchParams: {
    variant?: string;
    size?: string;
  };
}

export default async function ProductPage({ 
  params, 
  searchParams 
}: ProductPageProps) {
  const { id } = params;
  const { variant, size } = searchParams;

  // Récupérer les données du produit
  const product = await fetchProduct(id);

  return (
    <div className="product-page">
      <ProductDetails 
        product={product} 
        selectedVariant={variant}
        selectedSize={size}
      />
    </div>
  );
}
```

### Routes avec segments multiples

```typescript
// src/app/admin/products/[id]/images/page.tsx
interface ProductImagesPageProps {
  params: {
    id: string;
  };
}

export default function ProductImagesPage({ params }: ProductImagesPageProps) {
  const { id } = params;

  return (
    <div className="product-images">
      <h1>Images du produit {id}</h1>
      <ImageUpload productId={id} />
    </div>
  );
}
```

---

## 🧭 Navigation programmatique

### Hook useRouter

```typescript
// Navigation simple
import { useRouter } from 'next/navigation';

export const ProductCard = ({ product }) => {
  const router = useRouter();

  const handleProductClick = () => {
    router.push(`/product/${product.id}`);
  };

  const handleBack = () => {
    router.back();
  };

  const handleRefresh = () => {
    router.refresh();
  };

  return (
    <div onClick={handleProductClick}>
      <h3>{product.name}</h3>
    </div>
  );
};
```

### Navigation avec paramètres

```typescript
// Navigation avec query params
export const ProductFilters = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateFilters = (newFilters: FilterParams) => {
    const params = new URLSearchParams(searchParams);
    
    // Mettre à jour les paramètres
    Object.entries(newFilters).forEach(([key, value]) => {
      if (value) {
        params.set(key, value.toString());
      } else {
        params.delete(key);
      }
    });

    // Naviguer avec les nouveaux paramètres
    router.push(`/products?${params.toString()}`);
  };

  return (
    <div className="filters">
      <select onChange={(e) => updateFilters({ category: e.target.value })}>
        <option value="">Toutes les catégories</option>
        <option value="robes">Robes</option>
        <option value="pantalons">Pantalons</option>
      </select>
    </div>
  );
};
```

### Navigation avec état

```typescript
// Navigation avec état temporaire
export const CheckoutButton = () => {
  const router = useRouter();

  const handleCheckout = () => {
    // Sauvegarder l'état avant navigation
    sessionStorage.setItem('checkout-data', JSON.stringify({
      items: cart.items,
      total: cart.total
    }));

    // Naviguer vers la page de checkout
    router.push('/checkout');
  };

  return (
    <button onClick={handleCheckout}>
      Procéder au paiement
    </button>
  );
};
```

---

## 🚨 Gestion des erreurs

### Page d'erreur globale

```typescript
// src/app/error.tsx
'use client';

import { useEffect } from 'react';

interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorPageProps) {
  useEffect(() => {
    // Log l'erreur pour le debugging
    console.error('Page error:', error);
  }, [error]);

  return (
    <div className="error-page">
      <div className="error-content">
        <h1>Oups ! Quelque chose s'est mal passé</h1>
        <p>Une erreur inattendue s'est produite.</p>
        
        <div className="error-actions">
          <button 
            onClick={reset}
            className="btn btn-primary"
          >
            Réessayer
          </button>
          
          <button 
            onClick={() => window.location.href = '/'}
            className="btn btn-secondary"
          >
            Retour à l'accueil
          </button>
        </div>

        {process.env.NODE_ENV === 'development' && (
          <details className="error-details">
            <summary>Détails de l'erreur</summary>
            <pre>{error.message}</pre>
            <pre>{error.stack}</pre>
          </details>
        )}
      </div>
    </div>
  );
}
```

### Page 404 personnalisée

```typescript
// src/app/not-found.tsx
import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="not-found-page">
      <div className="not-found-content">
        <h1>404 - Page non trouvée</h1>
        <p>La page que vous recherchez n'existe pas.</p>
        
        <div className="not-found-actions">
          <Link href="/" className="btn btn-primary">
            Retour à l'accueil
          </Link>
          
          <Link href="/products" className="btn btn-secondary">
            Voir nos produits
          </Link>
        </div>
      </div>
    </div>
  );
}
```

### Gestion d'erreurs par route

```typescript
// src/app/admin/products/error.tsx
'use client';

export default function AdminProductsError({ 
  error, 
  reset 
}: { 
  error: Error; 
  reset: () => void; 
}) {
  return (
    <div className="admin-error">
      <h2>Erreur dans la gestion des produits</h2>
      <p>Impossible de charger la liste des produits.</p>
      
      <button onClick={reset} className="btn btn-primary">
        Réessayer
      </button>
    </div>
  );
}
```

---

## 🔍 SEO et métadonnées

### Métadonnées statiques

```typescript
// src/app/products/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Nos produits - AFROVIBZ',
  description: 'Découvrez notre collection de vêtements africains modernes',
  keywords: ['mode', 'africaine', 'vêtements', 'style'],
  openGraph: {
    title: 'Produits AFROVIBZ',
    description: 'Collection de vêtements africains',
    images: ['/og-image.jpg'],
  },
};

export default function ProductsPage() {
  return <ProductList />;
}
```

### Métadonnées dynamiques

```typescript
// src/app/product/[id]/page.tsx
import { Metadata } from 'next';

interface GenerateMetadataProps {
  params: { id: string };
}

export async function generateMetadata({ 
  params 
}: GenerateMetadataProps): Promise<Metadata> {
  const product = await fetchProduct(params.id);

  return {
    title: `${product.name} - AFROVIBZ`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
    },
  };
}

export default function ProductPage({ params }: { params: { id: string } }) {
  return <ProductDetails productId={params.id} />;
}
```

### Métadonnées avec layout

```typescript
// src/app/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | AFROVIBZ',
    default: 'AFROVIBZ - Mode africaine moderne',
  },
  description: 'Plateforme e-commerce de mode africaine moderne',
  keywords: ['mode', 'africaine', 'e-commerce', 'vêtements'],
  authors: [{ name: 'AFROVIBZ Team' }],
  creator: 'AFROVIBZ',
  publisher: 'AFROVIBZ',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
```

---

## 🔄 Redirections et rewrites

### Redirections dans next.config.js

```javascript
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      // Redirection simple
      {
        source: '/old-products',
        destination: '/products',
        permanent: true, // 308
      },
      
      // Redirection avec paramètres
      {
        source: '/product/:id',
        destination: '/products/:id',
        permanent: false, // 307
      },
      
      // Redirection conditionnelle
      {
        source: '/admin',
        destination: '/admin/dashboard',
        permanent: false,
        has: [
          {
            type: 'header',
            key: 'x-admin-token',
          },
        ],
      },
    ];
  },

  async rewrites() {
    return [
      // Rewrite pour masquer l'API
      {
        source: '/api/products/:path*',
        destination: '/api/v1/products/:path*',
      },
    ];
  },
};

module.exports = nextConfig;
```

### Redirections programmatiques

```typescript
// Redirection côté client
import { redirect } from 'next/navigation';

export default function ProtectedPage() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    redirect('/auth/login');
  }

  return <div>Page protégée</div>;
}

// Redirection côté serveur
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await fetchProduct(params.id);

  if (!product) {
    redirect('/products');
  }

  return <ProductDetails product={product} />;
}
```

---

## 🎯 Prochaines étapes

Maintenant que vous maîtrisez le routing :

1. **📊 [Gérer l'état](./06-state-management.md)** pour comprendre la gestion des données
2. **🎨 [Styling et UI](./07-styling.md)** pour créer de belles interfaces
3. **✅ [Bonnes pratiques](./08-best-practices.md)** pour coder proprement

---

<div align="center">

**💡 Conseil** : Utilisez les layouts pour partager des éléments communs entre les pages. Cela évite la duplication de code !

</div> 