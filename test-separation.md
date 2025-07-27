# Test de la Séparation Frontend/Backend

## 🧪 Tests à Effectuer

### 0. Installation complète
```bash
# Installer toutes les dépendances
npm run install:all
```

### 1. Test du Backend

1. **Démarrer MongoDB localement :**
```bash
# Si MongoDB est installé localement
mongod

# Ou utiliser Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

2. **Configurer le backend :**
```bash
cd backend
cp env.example .env
# Éditer .env avec vos configurations
```

3. **Démarrer le backend :**
```bash
cd backend
npm run dev
```

4. **Tester l'API :**
```bash
# Test de santé
curl http://localhost:5000/api/health

# Test d'inscription
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123",
    "displayName": "Test User"
  }'
```

### 2. Test du Frontend

1. **Configurer le frontend :**
```bash
cd frontend
cp env.example .env.local
# Ajouter NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

2. **Démarrer le frontend :**
```bash
cd frontend
npm run dev
```

3. **Tester l'authentification :**
- Aller sur http://localhost:3000
- Tester l'inscription et la connexion
- Vérifier que les tokens sont stockés dans localStorage

### 3. Test de Communication

1. **Vérifier les requêtes API :**
- Ouvrir les DevTools (F12)
- Aller dans l'onglet Network
- Effectuer une action d'authentification
- Vérifier que les requêtes vont vers http://localhost:5000/api

2. **Vérifier l'authentification :**
- Se connecter
- Vérifier que le token est dans localStorage
- Vérifier que les requêtes suivantes incluent le header Authorization

## ✅ Checklist de Validation

- [ ] Backend démarre sans erreur
- [ ] MongoDB est connecté
- [ ] API répond sur /api/health
- [ ] Frontend démarre sans erreur
- [ ] Frontend peut communiquer avec l'API
- [ ] Authentification fonctionne
- [ ] Tokens JWT sont générés et stockés
- [ ] Requêtes authentifiées fonctionnent

## 🐛 Résolution des Problèmes

### Erreur de connexion MongoDB
```bash
# Vérifier que MongoDB est démarré
sudo systemctl status mongod

# Ou redémarrer
sudo systemctl restart mongod
```

### Erreur CORS
- Vérifier que FRONTEND_URL est correct dans .env du backend
- Vérifier que le frontend fait des requêtes vers la bonne URL

### Erreur JWT
- Vérifier que JWT_SECRET est défini dans .env du backend
- Vérifier que les tokens sont correctement stockés dans localStorage

## 📝 Notes

- Le backend utilise MongoDB au lieu de Firebase
- L'authentification utilise JWT au lieu de Firebase Auth
- Les données sont maintenant stockées dans MongoDB
- Le frontend communique via API REST au lieu de SDK Firebase 