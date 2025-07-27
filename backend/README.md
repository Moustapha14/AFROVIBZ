# AFRO🗼VIBZ Backend API

Backend REST API pour la plateforme e-commerce AFRO🗼VIBZ.

## 🚀 Installation

1. **Installer les dépendances :**
```bash
npm install
```

2. **Configurer les variables d'environnement :**
```bash
cp env.example .env
```
Puis éditez le fichier `.env` avec vos configurations.

3. **Démarrer le serveur de développement :**
```bash
npm run dev
```

## 📋 Prérequis

- Node.js 18+
- MongoDB
- Variables d'environnement configurées

## 🔧 Configuration

### Variables d'environnement requises :

```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/afrovibz
JWT_SECRET=votre_jwt_secret_tres_securise
FRONTEND_URL=http://localhost:3000
```

## 📡 API Endpoints

### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur
- `POST /api/auth/logout` - Déconnexion

### Utilisateurs
- `GET /api/users/profile` - Profil utilisateur

### Produits
- `GET /api/products` - Liste des produits
- `GET /api/products/:id` - Détails d'un produit

### Panier
- `GET /api/cart` - Panier utilisateur

### Commandes
- `GET /api/orders` - Commandes utilisateur

## 🛠️ Scripts disponibles

- `npm run dev` - Démarrer en mode développement
- `npm start` - Démarrer en mode production
- `npm run build` - Build du projet

## 🔒 Sécurité

- Helmet.js pour la sécurité des headers
- Rate limiting pour prévenir les attaques
- Validation des données avec express-validator
- JWT pour l'authentification
- CORS configuré

## 📦 Structure du projet

```
src/
├── config/          # Configuration (DB, etc.)
├── controllers/     # Contrôleurs des routes
├── middleware/      # Middlewares (auth, validation)
├── models/          # Modèles Mongoose
├── routes/          # Définition des routes
├── utils/           # Utilitaires
└── index.js         # Point d'entrée
``` 