# 🤝 10. Workflow et collaboration

> **Temps de lecture** : 15-20 minutes

## 🔄 Processus de développement

### Git Flow

Nous utilisons une version simplifiée de Git Flow adaptée aux projets modernes.

#### Branches principales

```bash
# Branche principale (production)
main

# Branche de développement
develop

# Branches de fonctionnalités
feature/nom-de-la-fonctionnalite

# Branches de correction
hotfix/nom-du-bug

# Branches de release
release/version-x.x.x
```

#### Workflow typique

```bash
# 1. Commencer une nouvelle fonctionnalité
git checkout develop
git pull origin develop
git checkout -b feature/ajout-panier

# 2. Développer et commiter
git add .
git commit -m "feat: ajouter la fonctionnalité panier"

# 3. Pousser et créer une Pull Request
git push origin feature/ajout-panier
# Créer PR sur GitHub/GitLab

# 4. Après review et merge
git checkout develop
git pull origin develop
git branch -d feature/ajout-panier
```

### Conventions de branches

| Type        | Format            | Exemple                       | Description               |
| ----------- | ----------------- | ----------------------------- | ------------------------- |
| **Feature** | `feature/nom`     | `feature/user-authentication` | Nouvelles fonctionnalités |
| **Bugfix**  | `fix/nom`         | `fix/login-error`             | Corrections de bugs       |
| **Hotfix**  | `hotfix/nom`      | `hotfix/security-patch`       | Corrections urgentes      |
| **Release** | `release/version` | `release/v1.2.0`              | Préparation de release    |
| **Chore**   | `chore/nom`       | `chore/update-dependencies`   | Tâches de maintenance     |

### Scripts Git utiles

```bash
# .git/hooks/pre-commit
#!/bin/sh
npm run lint
npm run type-check
npm run test

# .git/hooks/commit-msg
#!/bin/sh
# Vérifier le format du message de commit
npx commitlint --edit $1
```

---

## 👥 Code review

### Checklist de review

#### Fonctionnalité

- [ ] **La fonctionnalité fonctionne** comme attendu
- [ ] **Les tests passent** et couvrent les cas d'usage
- [ ] **Les erreurs sont gérées** correctement
- [ ] **La performance** n'est pas dégradée

#### Code

- [ ] **Le code est lisible** et bien structuré
- [ ] **Les conventions** sont respectées
- [ ] **Pas de duplication** de code
- [ ] **Les types TypeScript** sont corrects
- [ ] **Les imports** sont organisés

#### Sécurité

- [ ] **Pas de vulnérabilités** évidentes
- [ ] **Les données sensibles** ne sont pas exposées
- [ ] **La validation** des entrées est présente

#### Documentation

- [ ] **Le code est commenté** si nécessaire
- [ ] **La documentation** est mise à jour
- [ ] **Les changements** sont documentés

### Template de Pull Request

```markdown
## 📝 Description

Bref résumé des changements apportés.

## 🎯 Type de changement

- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation
- [ ] Refactoring

## 🔍 Tests

- [ ] Tests unitaires ajoutés/mis à jour
- [ ] Tests d'intégration ajoutés/mis à jour
- [ ] Tests manuels effectués

## 📸 Captures d'écran (si applicable)

Ajoutez des captures d'écran pour les changements UI.

## ✅ Checklist

- [ ] Mon code suit les conventions du projet
- [ ] J'ai effectué une auto-review de mon code
- [ ] J'ai commenté mon code, particulièrement dans les zones difficiles
- [ ] J'ai apporté les changements correspondants à la documentation
- [ ] Mes changements ne génèrent pas de nouveaux warnings
- [ ] J'ai ajouté des tests qui prouvent que ma correction fonctionne
- [ ] Mes tests passent avec mes nouveaux et anciens changements

## 🔗 Issues liées

Closes #123
Relates to #456
```

### Commentaires de review

#### Exemples de commentaires constructifs

````markdown
# ✅ Bon commentaire

Cette fonction pourrait être simplifiée en utilisant `Array.reduce()`.
Voici un exemple :

```typescript
const total = items.reduce((sum, item) => sum + item.price, 0);
```
````

# ❌ Mauvais commentaire

Ce code est mauvais, refais-le.

````

#### Utilisation des emojis

```markdown
# 🎯 Suggestions d'amélioration
# 🐛 Problème à corriger
# ✅ Approuvé
# ❌ Rejeté
# 💡 Idée intéressante
# 🔍 À vérifier
# 📝 Documentation manquante
````

---

## 🚀 Déploiement

### Environnements

| Environnement   | URL                    | Branche   | Usage                  |
| --------------- | ---------------------- | --------- | ---------------------- |
| **Development** | `dev.afrovibz.com`     | `develop` | Tests et développement |
| **Staging**     | `staging.afrovibz.com` | `main`    | Tests finaux           |
| **Production**  | `afrovibz.com`         | `main`    | Utilisateurs finaux    |

### Configuration Vercel

```json
// vercel.json
{
  "version": 2,
  "builds": [
    {
      "src": "package.json",
      "use": "@vercel/next"
    }
  ],
  "env": {
    "NEXT_PUBLIC_API_URL": "@api-url",
    "NEXT_PUBLIC_FIREBASE_API_KEY": "@firebase-api-key"
  },
  "functions": {
    "src/app/api/**/*.ts": {
      "maxDuration": 10
    }
  }
}
```

### Variables d'environnement

```bash
# .env.local (développement)
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=your_dev_key

# .env.production (production)
NEXT_PUBLIC_API_URL=https://api.afrovibz.com
NEXT_PUBLIC_FIREBASE_API_KEY=your_prod_key
```

### Pipeline CI/CD

```yaml
# .github/workflows/deploy.yml
name: Deploy

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linting
        run: npm run lint

      - name: Run type checking
        run: npm run type-check

      - name: Run tests
        run: npm run test

      - name: Build application
        run: npm run build

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'

    steps:
      - uses: actions/checkout@v3

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 💬 Communication backend

### API Contract

```typescript
// types/api.ts
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
  timestamp: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  code: string;
  details?: any;
}
```

### Endpoints documentés

```typescript
// lib/api/products.ts
/**
 * Récupère la liste des produits
 * @param params - Paramètres de filtrage et pagination
 * @returns Promise<PaginatedResponse<Product>>
 */
export const getProducts = async (params?: ProductFilters): Promise<PaginatedResponse<Product>> => {
  const queryString = new URLSearchParams(params as Record<string, string>).toString();
  const response = await fetch(`/api/products?${queryString}`);

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};

/**
 * Crée un nouveau produit
 * @param product - Données du produit à créer
 * @returns Promise<ApiResponse<Product>>
 */
export const createProduct = async (
  product: CreateProductRequest
): Promise<ApiResponse<Product>> => {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(product),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
```

### Gestion des erreurs

```typescript
// utils/apiErrorHandler.ts
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export const handleApiError = (error: unknown): ApiError => {
  if (error instanceof ApiError) {
    return error;
  }

  if (error instanceof Response) {
    return new ApiError(`HTTP ${error.status}: ${error.statusText}`, error.status, 'HTTP_ERROR');
  }

  return new ApiError("Une erreur inattendue s'est produite", 500, 'UNKNOWN_ERROR');
};
```

---

## 📚 Ressources utiles

### Documentation officielle

- **[Next.js](https://nextjs.org/docs)** - Documentation officielle
- **[React](https://react.dev/)** - Guide React moderne
- **[TypeScript](https://www.typescriptlang.org/docs/)** - Documentation TypeScript
- **[Tailwind CSS](https://tailwindcss.com/docs)** - Documentation Tailwind

### Outils de développement

- **[React DevTools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi)** - Extension Chrome
- **[Vercel](https://vercel.com/docs)** - Plateforme de déploiement
- **[GitHub](https://docs.github.com/)** - Gestion de code source

### Communautés

- **[Reactiflux](https://discord.gg/reactiflux)** - Discord React
- **[Next.js Discord](https://discord.gg/nextjs)** - Discord Next.js
- **[Stack Overflow](https://stackoverflow.com/questions/tagged/reactjs)** - Questions/Réponses

### Blogs et tutoriels

- **[Kent C. Dodds](https://kentcdodds.com/blog)** - Blog React/Testing
- **[Josh Comeau](https://www.joshwcomeau.com/)** - CSS et React
- **[Overreacted](https://overreacted.io/)** - Blog de Dan Abramov

### Outils recommandés

| Outil          | Usage           | Lien                                                                                             |
| -------------- | --------------- | ------------------------------------------------------------------------------------------------ |
| **VS Code**    | Éditeur de code | [vscode.dev](https://vscode.dev)                                                                 |
| **Postman**    | Tests API       | [postman.com](https://postman.com)                                                               |
| **Figma**      | Design          | [figma.com](https://figma.com)                                                                   |
| **Lighthouse** | Performance     | [developers.google.com/web/tools/lighthouse](https://developers.google.com/web/tools/lighthouse) |

---

## 📞 Contacts et support

### Équipe de développement

| Rôle                   | Contact             | Responsabilités              |
| ---------------------- | ------------------- | ---------------------------- |
| **Lead Frontend**      | lead@afrovibz.com   | Architecture, code review    |
| **Développeur Senior** | senior@afrovibz.com | Mentorat, développement      |
| **Développeur Junior** | junior@afrovibz.com | Développement, apprentissage |

### Canaux de communication

- **Slack** : `#frontend-dev` - Questions techniques
- **Slack** : `#general` - Discussions générales
- **Email** : `dev@afrovibz.com` - Questions importantes
- **GitHub Issues** : Bugs et fonctionnalités

### Réunions

- **Daily Standup** : 9h00 - 9h15 (Slack)
- **Code Review** : 14h00 - 15h00 (Mercredi)
- **Rétrospective** : 16h00 - 17h00 (Vendredi)

---

## 🎯 Checklist d'onboarding

### Première semaine

- [ ] **Environnement configuré** et fonctionnel
- [ ] **Documentation lue** et comprise
- [ ] **Premier commit** effectué
- [ ] **Code review** participée
- [ ] **Tests écrits** pour une fonctionnalité

### Première quinzaine

- [ ] **Fonctionnalité complète** développée
- [ ] **Pull Request** créée et mergée
- [ ] **Déploiement** observé
- [ ] **Feedback** reçu et intégré

### Premier mois

- [ ] **Autonomie** sur les tâches courantes
- [ ] **Code review** d'autres développeurs
- [ ] **Documentation** mise à jour
- [ ] **Processus** maîtrisé

---

<div align="center">

**🎉 Félicitations ! Vous êtes maintenant prêt à contribuer efficacement au projet AFROVIBZ.**

_N'hésitez pas à poser des questions et à partager vos idées d'amélioration !_

</div>
