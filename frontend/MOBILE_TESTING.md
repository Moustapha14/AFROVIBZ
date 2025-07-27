# 📱 Guide de Test Mobile - AFRO🗼VIBZ

## 🎯 Breakpoints de Test

### 📱 Mobile (320px - 767px)
- **iPhone SE** (375×667) - `320px` minimum
- **iPhone 14 Pro** (393×852) - `393px`
- **Pixel 5** (393×851) - `393px`
- **Galaxy S21** (384×854) - `384px`

### 📱 Tablet (768px - 1023px)
- **iPad Mini** (768×1024) - `768px`
- **iPad Air** (820×1180) - `820px`

### 💻 Desktop (1024px+)
- **Desktop Standard** (1024×768) - `1024px`
- **Large Desktop** (1280×720) - `1280px`

## ✅ Checklist de Test

### 🏠 Page d'Accueil
- [ ] Hero section responsive (texte et boutons)
- [ ] Grille des catégories (2 colonnes sur mobile)
- [ ] Grille des produits (1→2→3→4 colonnes)
- [ ] Boutons avec hauteur minimum 44px
- [ ] Pas de scroll horizontal

### 🛍️ Page Produits
- [ ] Filtres empilés verticalement sur mobile
- [ ] Bouton "Filtres" pleine largeur
- [ ] Grille adaptative (1→2→3→4 colonnes)
- [ ] Vue liste optimisée mobile
- [ ] Pagination touch-friendly

### 🔐 Pages d'Authentification
- [ ] Formulaire centré et responsive
- [ ] Boutons pleine largeur sur mobile
- [ ] Toggle email/téléphone adaptatif
- [ ] PasswordInput fonctionnel

### 🛒 Panier et Checkout
- [ ] Liste des articles responsive
- [ ] Options de livraison empilées
- [ ] Formulaire d'adresse mobile-friendly
- [ ] Résumé de commande adaptatif

### 🧭 Navigation
- [ ] Menu hamburger fonctionnel
- [ ] Overlay plein écran
- [ ] Fermeture par clic extérieur
- [ ] Logo et titre adaptatifs

### 🎨 Composants UI
- [ ] ProductModal plein écran sur mobile
- [ ] Boutons avec touch targets 44px+
- [ ] Typographie lisible sans zoom
- [ ] Espacement cohérent

## 🧪 Tests Fonctionnels

### 📱 Interactions Tactiles
- [ ] Tous les boutons cliquables facilement
- [ ] Pas de double-tap requis
- [ ] Feedback visuel sur touch
- [ ] Pas de zoom automatique sur inputs

### 🔄 Responsive Behavior
- [ ] Transitions fluides entre breakpoints
- [ ] Contenu reste lisible
- [ ] Pas d'éléments coupés
- [ ] Grilles s'adaptent correctement

### ⚡ Performance
- [ ] Chargement rapide sur mobile
- [ ] Images optimisées
- [ ] Pas de layout shift
- [ ] Animations fluides

## 🛠️ Outils de Test

### 🌐 Navigateurs
- Chrome DevTools (Device Toolbar)
- Firefox Responsive Design Mode
- Safari Web Inspector (iOS Simulator)

### 📱 Émulateurs
- iOS Simulator (iPhone SE, iPhone 14 Pro)
- Android Studio (Pixel 5, Galaxy S21)
- Chrome DevTools (Device presets)

### 🔍 Tests Manuels
- Redimensionnement de fenêtre
- Rotation d'écran
- Test sur vrais appareils

## 🚨 Problèmes Courants

### ❌ À Éviter
- Scroll horizontal
- Éléments trop petits pour toucher
- Texte illisible sans zoom
- Boutons hors d'écran
- Grilles cassées

### ✅ Solutions
- `overflow-x-hidden` sur body
- `min-height: 44px` sur boutons
- `text-sm sm:text-base` pour typographie
- `w-full` sur conteneurs
- `grid-cols-1 sm:grid-cols-2` pour grilles

## 📊 Métriques de Performance

### 🎯 Objectifs Mobile
- **First Contentful Paint** < 1.5s
- **Largest Contentful Paint** < 2.5s
- **Cumulative Layout Shift** < 0.1
- **First Input Delay** < 100ms

### 📈 Tests Lighthouse
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 95+

## 🔄 Workflow de Test

1. **Test Desktop** → Redimensionner vers mobile
2. **Test Mobile** → Vérifier tous les breakpoints
3. **Test Fonctionnel** → Navigation et interactions
4. **Test Performance** → Lighthouse et métriques
5. **Test Cross-Browser** → Chrome, Firefox, Safari
6. **Test Réel** → Vrais appareils si possible 