# 🎯 Header AFRO🗼VIBZ - Inspiré de Shein

## 📋 Vue d'ensemble

Reproduction fidèle du design et des fonctionnalités de l'en-tête Shein, adapté pour AFRO🗼VIBZ avec une approche moderne et responsive.

## 🎨 Caractéristiques principales

### **1. Top Bar Promotionnelle**

- **Couleur** : Fond noir avec texte blanc
- **Contenu** : Messages promotionnels (livraison gratuite, retours, offres)
- **Responsive** : Affichage adaptatif selon la taille d'écran
- **Icônes** : Truck, Shield, Gift de Lucide React

### **2. Header Principal Sticky**

- **Effet sticky** : Reste fixe lors du scroll avec transition fluide
- **Ombre dynamique** : Apparition/disparition selon le scroll
- **Hauteur adaptative** : `h-16` (mobile) → `h-20` (desktop)

### **3. Logo et Branding**

- **Logo AV** : Gradient rose-rouge avec texte blanc
- **Texte AFRO🗼VIBZ** : Typographie bold, responsive
- **Espacement** : Optimisé pour tous les écrans

### **4. Navigation Desktop**

- **Catégories** : FEMMES, HOMMES, ENFANTS, TECH
- **Dropdowns interactifs** : Menus déroulants avec sous-catégories
- **Animations** : ChevronDown avec rotation 180°
- **Hover effects** : Transitions de couleur fluides

### **5. Barre de Recherche**

- **Focus state** : Bordure rose avec shadow au focus
- **Clear button** : Bouton X pour effacer le texte
- **Responsive** : Cachée sur mobile, visible sur desktop
- **Auto-complétion** : Prête pour intégration future

### **6. Actions Utilisateur**

- **Sélecteur de langue** : Globe + FR + ChevronDown
- **Wishlist** : Icône Heart avec hover effect
- **Panier** : ShoppingBag avec badge de quantité
- **Menu utilisateur** : Dropdown avec options personnalisées

## 🎭 Interactions et Animations

### **Effets de Scroll**

```typescript
const [isScrolled, setIsScrolled] = useState(false);

useEffect(() => {
  const handleScroll = () => {
    const scrollTop = window.scrollY;
    setIsScrolled(scrollTop > 50);
  };
  window.addEventListener('scroll', handleScroll);
  return () => window.removeEventListener('scroll', handleScroll);
}, []);
```

### **Dropdowns Interactifs**

```typescript
const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

const toggleDropdown = (dropdown: string) => {
  setActiveDropdown(activeDropdown === dropdown ? null : dropdown);
};
```

### **Focus de la Recherche**

```typescript
const [isSearchFocused, setIsSearchFocused] = useState(false);

// Classes conditionnelles pour l'input
className={`pl-10 pr-4 py-2 border-2 transition-all duration-200 ${
  isSearchFocused ? 'border-pink-500 shadow-lg' : 'border-gray-300 hover:border-gray-400'
}`}
```

## 📱 Responsive Design

### **Breakpoints Tailwind**

- **xs** : 475px+ (très petits écrans)
- **sm** : 640px+ (petits écrans)
- **md** : 768px+ (tablettes)
- **lg** : 1024px+ (desktop)
- **xl** : 1280px+ (grands écrans)

### **Adaptations Mobile**

- **Menu hamburger** : Bouton avec animation X/Menu
- **Navigation mobile** : Sidebar avec overlay
- **Recherche mobile** : Barre dédiée sous le header
- **Actions simplifiées** : Icônes uniquement sur très petits écrans

### **Menu Mobile**

```typescript
{isMobileMenuOpen && (
  <div className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-50">
    <div className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl">
      {/* Contenu du menu mobile */}
    </div>
  </div>
)}
```

## 🎨 Palette de Couleurs

### **Couleurs Principales**

- **Rose Shein** : `pink-500` (#ec4899)
- **Rose Hover** : `pink-600` (#db2777)
- **Noir** : `black` (#000000)
- **Gris clair** : `gray-200` (#e5e7eb)
- **Gris moyen** : `gray-400` (#9ca3af)
- **Gris foncé** : `gray-700` (#374151)

### **Gradients**

- **Logo** : `from-pink-500 to-red-500`
- **Boutons** : `bg-pink-500 hover:bg-pink-600`

## 🔧 Fonctionnalités Techniques

### **Gestion d'État**

- **useState** : Menus, recherche, scroll, dropdowns
- **useEffect** : Event listeners, cleanup
- **useRef** : Références DOM pour les interactions

### **Accessibilité**

- **ARIA labels** : Tous les boutons et liens
- **Navigation clavier** : Support complet
- **Contrastes** : Respect des standards WCAG
- **Focus visible** : Indicateurs de focus clairs

### **Performance**

- **Event listeners optimisés** : Cleanup automatique
- **Re-renders minimisés** : États locaux
- **Animations CSS** : Utilisation de transform/opacity
- **Lazy loading** : Composants chargés à la demande

## 📊 Structure des Données

### **Catégories**

```typescript
const categories = [
  {
    name: 'FEMMES',
    subcategories: [
      { name: 'Nouveautés', items: ['Nouveautés', 'Tendances', 'Collections'] },
      { name: 'Vêtements', items: ['Robes', 'Tops', 'Pantalons', 'Jupes', 'Vestes', 'Manteaux'] },
      { name: 'Chaussures', items: ['Talons', 'Sneakers', 'Sandales', 'Bottes'] },
      { name: 'Accessoires', items: ['Sacs', 'Bijoux', 'Écharpes', 'Ceintures'] },
    ],
  },
  {
    name: 'TECH',
    subcategories: [
      {
        name: 'Ordinateurs',
        items: ['PC Portables', 'PC Bureaux', 'MacBook', 'iMac', 'Moniteurs', 'Claviers', 'Souris'],
      },
      {
        name: 'Smartphones',
        items: ['iPhone', 'Samsung', 'Xiaomi', 'Huawei', 'Oppo', 'Accessoires Téléphone'],
      },
      {
        name: 'Tablettes',
        items: ['iPad', 'Samsung Galaxy Tab', 'Tablettes Android', 'Accessoires Tablettes'],
      },
      { name: 'Audio', items: ['Écouteurs', 'Casques', 'Enceintes Bluetooth', 'Microphones'] },
      { name: 'Gaming', items: ['Consoles', 'Manettes', 'Écouteurs Gaming', 'Accessoires Gaming'] },
    ],
  },
  // ... autres catégories
];
```

## 🚀 Intégration

### **Installation**

1. Le composant est déjà intégré dans `layout.tsx`
2. Remplace automatiquement l'ancien Header
3. Compatible avec tous les hooks existants

### **Personnalisation**

- **Couleurs** : Modifier les classes Tailwind
- **Catégories** : Éditer le tableau `categories`
- **Messages** : Adapter les textes promotionnels
- **Icônes** : Remplacer les icônes Lucide React

## 🎯 Fonctionnalités Futures

### **À Implémenter**

- [ ] Auto-complétion de recherche
- [ ] Historique de recherche
- [ ] Suggestions de produits
- [ ] Notifications push
- [ ] Mode sombre
- [ ] Animations plus avancées

### **Optimisations**

- [ ] Lazy loading des images
- [ ] Service Worker pour le cache
- [ ] Analytics intégrés
- [ ] A/B testing des layouts

## 📈 Métriques de Performance

### **Objectifs**

- **First Contentful Paint** : < 1.5s
- **Largest Contentful Paint** : < 2.5s
- **Cumulative Layout Shift** : < 0.1
- **First Input Delay** : < 100ms

### **Monitoring**

- **Core Web Vitals** : Surveillance continue
- **User Experience** : Feedback utilisateur
- **Conversion Rate** : Impact sur les ventes
- **Accessibility Score** : Tests automatisés

---

_Header inspiré de Shein, optimisé pour AFRO🗼VIBZ avec une approche moderne et performante._
