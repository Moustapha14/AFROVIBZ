# AFRO🗼VIBZ — Plateforme E-commerce Moderne

Plateforme e-commerce moderne pour l'Afrique, inspirée de SHEIN, avec une architecture monorepo séparée frontend/backend.

## 🏗️ Architecture

Le projet utilise une architecture monorepo avec deux applications distinctes :

- **Frontend** : Application Next.js 14 avec TypeScript et Tailwind CSS
- **Backend** : API REST Express.js avec MongoDB et JWT

## 📁 Structure du Projet

```
AFROVIBZ/
├── frontend/               # Application Next.js
│   ├── src/
│   │   ├── app/           # Pages et routes
│   │   ├── components/    # Composants React
│   │   ├── lib/          # Utilitaires et hooks
│   │   │   ├── api/      # Services API
│   │   │   └── hooks/    # Hooks personnalisés
│   │   └── types/        # Types TypeScript
│   ├── public/           # Assets statiques
│   ├── package.json      # Dépendances frontend
│   └── ...
├── backend/               # API Express.js
│   ├── src/
│   │   ├── config/       # Configuration
│   │   ├── controllers/  # Contrôleurs
│   │   ├── middleware/   # Middlewares
│   │   ├── models/       # Modèles MongoDB
│   │   ├── routes/       # Routes API
│   │   └── utils/        # Utilitaires
│   ├── package.json      # Dépendances backend
│   └── ...
├── package.json          # Configuration monorepo
└── README.md
```

## 🚀 Installation et Démarrage

### Prérequis

- Node.js 18+
- MongoDB
- npm ou yarn

### 1. Installation complète

```bash
# Installer toutes les dépendances (frontend + backend)
npm run install:all
```

### 2. Configuration

#### Frontend
```bash
cd frontend
cp env.example .env.local
```

Variables importantes :
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

#### Backend
```bash
cd backend
cp env.example .env
```

Variables importantes :
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/afrovibz
JWT_SECRET=votre_jwt_secret_tres_securise
FRONTEND_URL=http://localhost:3000
```

### 3. Démarrage de MongoDB

#### Option 1 : Avec Docker Compose (recommandé)
```bash
# Démarrer MongoDB et Mongo Express
docker-compose up -d

# Mongo Express sera disponible sur http://localhost:8081
# (admin/password)
```

#### Option 2 : Avec le script
```bash
./start-mongodb.sh
```

#### Option 3 : MongoDB local
```bash
# Si MongoDB est installé localement
mongod
```

### 4. Démarrage des Applications

#### Option 1 : Démarrer les deux applications ensemble
```bash
npm run dev
```

#### Option 2 : Démarrer séparément
```bash
# Terminal 1 - Frontend
npm run dev:frontend

# Terminal 2 - Backend
npm run dev:backend
```

## 🛠️ Scripts Disponibles

### Scripts Monorepo (racine)
```bash
npm run dev              # Démarrer frontend + backend
npm run build            # Build frontend + backend
npm run start            # Démarrer en production
npm run install:all      # Installer toutes les dépendances
npm run lint             # Linter frontend + backend
npm run clean            # Nettoyer node_modules
```

### Scripts Frontend
```bash
cd frontend
npm run dev              # Développement
npm run build            # Build de production
npm run start            # Démarrer en production
npm run lint             # Linter
```

### Scripts Backend
```bash
cd backend
npm run dev              # Développement
npm run build            # Build de production
npm run start            # Démarrer en production
```

## 🔗 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur
- `POST /api/auth/logout` - Déconnexion

### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails d'un produit

### Panier
- `GET /api/cart` - Panier utilisateur

### Commandes
- `GET /api/orders` - Commandes utilisateur

## 🛠️ Technologies Utilisées

### Frontend
- **Next.js 14** - Framework React
- **TypeScript** - Typage statique
- **Tailwind CSS** - Framework CSS
- **React Query** - Gestion d'état serveur
- **React Hook Form** - Gestion des formulaires
- **Zod** - Validation de schémas

### Backend
- **Express.js** - Framework Node.js
- **MongoDB** - Base de données
- **Mongoose** - ODM pour MongoDB
- **JWT** - Authentification
- **bcryptjs** - Hashage des mots de passe
- **express-validator** - Validation des données

## 🔒 Sécurité

- **JWT** pour l'authentification
- **bcryptjs** pour le hashage des mots de passe
- **Helmet.js** pour la sécurité des headers
- **Rate limiting** pour prévenir les attaques
- **CORS** configuré
- **Validation** des données côté serveur

## 📱 Fonctionnalités

- ✅ Authentification (inscription/connexion)
- ✅ Gestion des utilisateurs
- ✅ Catalogue de produits
- ✅ Panier d'achat
- ✅ Interface responsive
- ✅ Design moderne inspiré de SHEIN

## 🚧 Fonctionnalités en Développement

- 🔄 Système de commandes
- 🔄 Paiements en ligne
- 🔄 Gestion des stocks
- 🔄 Système de reviews
- 🔄 Panel administrateur

## 🧪 Tests

Voir le fichier `test-separation.md` pour les instructions de test détaillées.

## 🤝 Contribution

1. Fork le projet
2. Créez une branche pour votre fonctionnalité
3. Committez vos changements
4. Poussez vers la branche
5. Ouvrez une Pull Request

## 📄 Licence

Ce projet est sous licence MIT.

---

**AFRO🗼VIBZ** - Révolutionner le e-commerce en Afrique 🌍
