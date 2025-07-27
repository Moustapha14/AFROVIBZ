# Guide de Test - Interface d'Administration AFRO🗼VIBZ

## 🎯 Objectif
Ce guide vous permet de tester l'interface d'administration d'AFRO🗼VIBZ avec des données mockées, sans avoir besoin de MongoDB.

## 🚀 Démarrage Rapide

### 1. Accéder à l'application
- Ouvrez votre navigateur
- Allez sur `http://localhost:3004`

### 2. Se connecter avec un compte de test
- Cliquez sur "Connexion" dans le header
- Ou allez directement sur `http://localhost:3004/auth/login`

## 👥 Comptes de Test Disponibles

### 🔥 **Super Administrateur** (Accès complet)
- **Email :** `superadmin@afrovibz.com`
- **Mot de passe :** `admin123`
- **Rôle :** `super_admin`
- **Accès :** Toutes les fonctionnalités d'administration

### 👩‍💼 **Vendeuse 1** (Gestion des commandes)
- **Email :** `vendeuse1@afrovibz.com`
- **Mot de passe :** `vendeuse123`
- **Rôle :** `vendeuse`
- **Accès :** Dashboard vendeuse, gestion des commandes assignées

### 👩‍💼 **Vendeuse 2** (Gestion des commandes)
- **Email :** `vendeuse2@afrovibz.com`
- **Mot de passe :** `vendeuse123`
- **Rôle :** `vendeuse`
- **Accès :** Dashboard vendeuse, gestion des commandes assignées

### 👤 **Client** (Utilisateur standard)
- **Email :** `client@afrovibz.com`
- **Mot de passe :** `client123`
- **Rôle :** `user`
- **Accès :** Fonctionnalités client normales

## 🧪 Tests à Effectuer

### Test 1 : Connexion Super Admin
1. Allez sur `/auth/login`
2. Cliquez sur "Tester avec Super Admin" (remplit automatiquement les champs)
3. Cliquez sur "Se connecter"
4. Vérifiez que vous êtes connecté (nom affiché dans le header)
5. Allez sur `/admin`
6. Vérifiez que vous voyez le dashboard super admin

### Test 2 : Connexion Vendeuse
1. Allez sur `/auth/login`
2. Cliquez sur "Tester avec Vendeuse" (remplit automatiquement les champs)
3. Cliquez sur "Se connecter"
4. Vérifiez que vous êtes connecté
5. Allez sur `/admin`
6. Vérifiez que vous voyez le dashboard vendeuse

### Test 3 : Connexion Client
1. Allez sur `/auth/login`
2. Cliquez sur "Tester avec Client" (remplit automatiquement les champs)
3. Cliquez sur "Se connecter"
4. Vérifiez que vous êtes connecté
5. Essayez d'accéder à `/admin`
6. Vérifiez que vous êtes redirigé vers la page d'accueil

### Test 4 : Déconnexion
1. Connectez-vous avec n'importe quel compte
2. Cliquez sur votre nom dans le header
3. Cliquez sur "Se déconnecter"
4. Vérifiez que vous êtes déconnecté et redirigé

### Test 5 : Inscription Nouveau Compte
1. Allez sur `/auth/register`
2. Remplissez le formulaire avec de nouvelles informations
3. Cliquez sur "Créer un compte"
4. Vérifiez que vous êtes automatiquement connecté
5. Vérifiez que le nouveau compte a le rôle `user`

## 🔧 Fonctionnalités Testées

### ✅ Authentification Mockée
- Connexion avec différents rôles
- Déconnexion
- Inscription de nouveaux comptes
- Persistance de session (localStorage)

### ✅ Interface d'Administration
- **Super Admin :** Dashboard complet avec toutes les fonctionnalités
- **Vendeuse :** Dashboard spécifique aux vendeuses
- **Client :** Redirection vers la page d'accueil

### ✅ Navigation
- Menu utilisateur dans le header
- Affichage du nom et du rôle
- Bouton de déconnexion
- Accès à l'administration selon le rôle

### ✅ Responsive Design
- Interface adaptée mobile/desktop
- Menu hamburger sur mobile
- Dropdowns fonctionnels

## 🐛 Problèmes Connus

### Limitations des Données Mockées
- Les données ne persistent pas entre les rechargements de page
- Les nouveaux comptes créés ne sont pas sauvegardés définitivement
- Les fonctionnalités backend (API) ne sont pas disponibles

### Solutions Temporaires
- Utilisez les comptes de test prédéfinis
- Les données sont stockées en localStorage
- L'interface fonctionne entièrement côté frontend

## 🔄 Retour à la Production

Pour revenir à l'authentification réelle avec MongoDB :

1. **Démarrer MongoDB :**
   ```bash
   ./start-mongodb.sh
   ```

2. **Créer les comptes de test :**
   ```bash
   cd backend && node create-test-accounts.js
   ```

3. **Restaurer useAuth.ts original :**
   - Remplacez le contenu de `frontend/src/lib/hooks/useAuth.ts` par la version originale

4. **Redémarrer l'application :**
   ```bash
   npm run dev:full
   ```

## 📝 Notes Importantes

- **Sécurité :** Cette implémentation est uniquement pour les tests
- **Données :** Toutes les données sont temporaires et en mémoire
- **Performance :** L'interface est entièrement fonctionnelle
- **Compatibilité :** Fonctionne sur tous les navigateurs modernes

## 🎉 Résultat Attendu

Après avoir suivi ce guide, vous devriez pouvoir :
- ✅ Vous connecter avec différents rôles
- ✅ Accéder aux interfaces d'administration appropriées
- ✅ Tester la navigation et les fonctionnalités
- ✅ Vérifier le responsive design
- ✅ Comprendre la hiérarchie des rôles

---

**Développé avec ❤️ pour AFRO🗼VIBZ** 