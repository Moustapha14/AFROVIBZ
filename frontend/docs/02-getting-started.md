# 🚀 2. Guide de démarrage rapide

> **Temps de lecture** : 30 minutes

## 📋 Prérequis système

### Versions requises

| Logiciel | Version minimale | Version recommandée | Comment vérifier |
|----------|------------------|-------------------|------------------|
| **Node.js** | 18.0.0 | 20.x.x | `node --version` |
| **npm** | 8.0.0 | 10.x.x | `npm --version` |
| **Git** | 2.30.0 | 3.x.x | `git --version` |

### Vérification rapide

```bash
# Vérifiez vos versions
node --version
npm --version
git --version

# Si une version est manquante ou obsolète, installez-la
```

### Installation des prérequis

#### Sur Ubuntu/Debian
```bash
# Node.js via NodeSource
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Git
sudo apt-get install git
```

#### Sur macOS
```bash
# Avec Homebrew
brew install node@20
brew install git
```

#### Sur Windows
1. Téléchargez Node.js depuis [nodejs.org](https://nodejs.org)
2. Téléchargez Git depuis [git-scm.com](https://git-scm.com)

---

## 🔧 Installation étape par étape

### 1. Cloner le repository

```bash
# Clonez le projet
git clone <url-du-repository>
cd AFROVIBZ

# Vérifiez la structure
ls -la
```

### 2. Installer les dépendances

```bash
# Installation des dépendances frontend
cd frontend
npm install

# Installation des dépendances backend (optionnel)
cd ../backend
npm install
cd ../frontend
```

### 3. Configuration de l'environnement

#### Créer le fichier .env.local

```bash
# Dans le dossier frontend
cp env.example .env.local
```

#### Configurer les variables d'environnement

```bash
# Ouvrez .env.local et configurez :
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

### 4. Lancer le serveur de développement

```bash
# Lancer le frontend uniquement
npm run dev

# Lancer le frontend + backend
npm run dev:full
```

---

## ✅ Vérification et tests

### Checklist de vérification

- [ ] **Serveur frontend** : `http://localhost:3000` accessible
- [ ] **Serveur backend** : `http://localhost:5000` accessible (si lancé)
- [ ] **Page d'accueil** : S'affiche sans erreur
- [ ] **Console navigateur** : Aucune erreur JavaScript
- [ ] **Console terminal** : Aucune erreur de compilation

### Tests rapides

#### 1. Test de la page d'accueil
```bash
# Ouvrez http://localhost:3000
# Vérifiez que :
# - La page se charge rapidement
# - Les images s'affichent
# - La navigation fonctionne
```

#### 2. Test de l'authentification
```bash
# Cliquez sur "Se connecter"
# Vérifiez que la page de login s'affiche
```

#### 3. Test des produits
```bash
# Naviguez vers /products
# Vérifiez que les produits s'affichent
```

### Commandes utiles

```bash
# Lancer en mode développement
npm run dev

# Lancer avec le backend
npm run dev:full

# Build de production
npm run build

# Lancer en production
npm run start

# Linting
npm run lint

# Installer les dépendances backend
npm run install:backend
```

---

## 🐛 Résolution des problèmes courants

### Problème 1 : Port déjà utilisé

**Symptôme** : `Error: listen EADDRINUSE: address already in use :::3000`

**Solution** :
```bash
# Trouver le processus qui utilise le port
lsof -i :3000

# Tuer le processus
kill -9 <PID>

# Ou utiliser un autre port
npm run dev -- -p 3001
```

### Problème 2 : Erreurs de dépendances

**Symptôme** : `Module not found` ou `Cannot resolve module`

**Solution** :
```bash
# Nettoyer le cache
rm -rf node_modules package-lock.json
npm install

# Ou forcer la réinstallation
npm install --force
```

### Problème 3 : Erreurs TypeScript

**Symptôme** : Erreurs de typage dans la console

**Solution** :
```bash
# Vérifier les types
npx tsc --noEmit

# Régénérer les types Next.js
rm -rf .next
npm run dev
```

### Problème 4 : Images qui ne se chargent pas

**Symptôme** : Images cassées ou qui ne s'affichent pas

**Solution** :
```bash
# Vérifier la configuration Next.js
cat next.config.js

# Vérifier les variables d'environnement
cat .env.local
```

### Problème 5 : Erreurs Firebase

**Symptôme** : Erreurs d'authentification ou de configuration Firebase

**Solution** :
```bash
# Vérifier la configuration Firebase
cat src/lib/firebase/config.ts

# Vérifier les variables d'environnement
echo $NEXT_PUBLIC_FIREBASE_API_KEY
```

---

## 🎯 Prochaines étapes

Une fois votre environnement configuré et fonctionnel :

1. **🏗️ [Explorer l'architecture](./03-architecture.md)** pour comprendre l'organisation du code
2. **🧩 [Découvrir les composants](./04-components.md)** pour voir comment coder
3. **🧭 [Comprendre le routing](./05-routing.md)** pour naviguer dans l'application

---

## 📞 Support

Si vous rencontrez des problèmes non résolus :

1. **Consultez les logs** : Console du navigateur et terminal
2. **Vérifiez la documentation** : Cette section et les autres guides
3. **Créez une issue** : Sur le repository avec les détails du problème
4. **Contactez l'équipe** : Via Slack/Teams avec les logs d'erreur

---

<div align="center">

**🎉 Félicitations ! Votre environnement est prêt pour le développement.**

*Vous pouvez maintenant commencer à coder sur AFROVIBZ !*

</div> 