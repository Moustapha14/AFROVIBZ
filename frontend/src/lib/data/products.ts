export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  category: string;
  subcategory?: string;
  images: string[];
  sizes: string[];
  colors: Color[];
  stock: number;
  tags: string[];
  isActive: boolean;
  rating: number;
  reviews: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Color {
  name: string;
  hex: string;
  stock: number;
}

// Toutes les images de sacs disponibles
const allBagImages = [
  '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (10).jpeg',
  '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (9).jpeg',
  '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (8).jpeg',
  '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (7).jpeg',
  '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (6).jpeg',
  '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (5).jpeg',
  '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (4).jpeg',
  '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (3).jpeg',
  '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (2).jpeg',
  '/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (1).jpeg',
  '/images/products/WhatsApp Image 2025-07-27 at 14.52.58.jpeg',
  '/images/products/WhatsApp Image 2025-07-27 at 14.52.57.jpeg',
  '/images/products/WhatsApp Image 2025-07-27 at 02.05.36.jpeg',
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Sac Hexagonal Élégant',
    description: 'Sac hexagonal en osier avec détails dorés et chaîne décorative. Parfait pour les occasions élégantes.',
    price: 25000,
    originalPrice: 35000,
    category: 'accessoires',
    subcategory: 'sacs',
    images: ['/images/products/sac-hexagonal.jpg'],
    sizes: ['Unique'],
    colors: [
      { name: 'Naturel', hex: '#f4e4c1', stock: 15 },
      { name: 'Brun', hex: '#8b4513', stock: 8 }
    ],
    stock: 23,
    tags: ['osier', 'hexagonal', 'doré', 'élégant'],
    isActive: true,
    rating: 4.5,
    reviews: 128,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '2',
    name: 'Sac Noir Moderne',
    description: 'Sac noir moderne avec fermeture élégante et poignée confortable. Style contemporain et polyvalent.',
    price: 18000,
    originalPrice: 25000,
    category: 'accessoires',
    subcategory: 'sacs',
    images: ['/images/products/sac-noir.jpg'],
    sizes: ['Unique'],
    colors: [
      { name: 'Noir', hex: '#000000', stock: 20 },
      { name: 'Gris', hex: '#808080', stock: 12 }
    ],
    stock: 32,
    tags: ['noir', 'moderne', 'polyvalent', 'élégant'],
    isActive: true,
    rating: 4.8,
    reviews: 95,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '3',
    name: 'Sac Blanc Poignée Dorée',
    description: 'Sac blanc avec poignée dorée sculpturale et texture plissée. Design sophistiqué et raffiné.',
    price: 12000,
    originalPrice: 18000,
    category: 'accessoires',
    subcategory: 'sacs',
    images: ['/images/products/sac-blanc.jpg'],
    sizes: ['Unique'],
    colors: [
      { name: 'Blanc', hex: '#ffffff', stock: 18 },
      { name: 'Crème', hex: '#f5f5dc', stock: 10 }
    ],
    stock: 28,
    tags: ['blanc', 'doré', 'sculptural', 'raffiné'],
    isActive: true,
    rating: 4.3,
    reviews: 67,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '4',
    name: 'Sac Rouge Charme Cerise',
    description: 'Sac rouge avec fermeture ondulée et charme cerise décoratif. Style festif et original.',
    price: 45000,
    originalPrice: 60000,
    category: 'accessoires',
    subcategory: 'sacs',
    images: ['/images/products/sac-rouge.jpg'],
    sizes: ['Unique'],
    colors: [
      { name: 'Rouge', hex: '#ff0000', stock: 12 },
      { name: 'Bordeaux', hex: '#800020', stock: 8 }
    ],
    stock: 20,
    tags: ['rouge', 'cerise', 'festif', 'original'],
    isActive: true,
    rating: 4.7,
    reviews: 156,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '5',
    name: 'Sac Rose Élégant',
    description: 'Sac rose avec finitions délicates et design féminin. Parfait pour les occasions spéciales.',
    price: 85000,
    originalPrice: 95000,
    category: 'accessoires',
    subcategory: 'sacs',
    images: ['/images/products/sac-rose.jpg'],
    sizes: ['Unique'],
    colors: [
      { name: 'Rose', hex: '#ffc0cb', stock: 15 },
      { name: 'Rose foncé', hex: '#ff69b4', stock: 9 }
    ],
    stock: 24,
    tags: ['rose', 'féminin', 'élégant', 'délicat'],
    isActive: true,
    rating: 4.9,
    reviews: 342,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '6',
    name: 'Sac Vert Naturel',
    description: 'Sac vert avec matériaux naturels et design écologique. Style bohème et durable.',
    price: 120000,
    originalPrice: 135000,
    category: 'accessoires',
    subcategory: 'sacs',
    images: ['/images/products/sac-vert.jpg'],
    sizes: ['Unique'],
    colors: [
      { name: 'Vert', hex: '#228b22', stock: 10 },
      { name: 'Vert olive', hex: '#808000', stock: 6 }
    ],
    stock: 16,
    tags: ['vert', 'naturel', 'bohème', 'durable'],
    isActive: true,
    rating: 4.8,
    reviews: 189,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Produits Femmes
  {
    id: '7',
    name: 'Robe Africaine Élégante',
    description: 'Robe traditionnelle africaine avec motifs wax authentiques. Parfaite pour les cérémonies.',
    price: 45000,
    originalPrice: 55000,
    category: 'femmes',
    subcategory: 'robes',
    images: ['/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (1).jpeg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'Wax Rouge', hex: '#ff0000', stock: 8 },
      { name: 'Wax Bleu', hex: '#0000ff', stock: 6 }
    ],
    stock: 14,
    tags: ['robe', 'africaine', 'wax', 'traditionnel'],
    isActive: true,
    rating: 4.6,
    reviews: 89,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '8',
    name: 'Boubou Moderne',
    description: 'Boubou contemporain avec broderies délicates. Style élégant et confortable.',
    price: 35000,
    originalPrice: 42000,
    category: 'femmes',
    subcategory: 'boubous',
    images: ['/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (2).jpeg'],
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Blanc', hex: '#ffffff', stock: 12 },
      { name: 'Crème', hex: '#f5f5dc', stock: 8 }
    ],
    stock: 20,
    tags: ['boubou', 'moderne', 'broderies', 'élégant'],
    isActive: true,
    rating: 4.7,
    reviews: 156,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Produits Hommes
  {
    id: '9',
    name: 'Chemise Africaine',
    description: 'Chemise africaine avec motifs traditionnels. Style casual et élégant.',
    price: 28000,
    originalPrice: 35000,
    category: 'hommes',
    subcategory: 'chemises',
    images: ['/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (3).jpeg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: [
      { name: 'Wax Vert', hex: '#228b22', stock: 15 },
      { name: 'Wax Jaune', hex: '#ffff00', stock: 10 }
    ],
    stock: 25,
    tags: ['chemise', 'africaine', 'wax', 'casual'],
    isActive: true,
    rating: 4.5,
    reviews: 203,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '10',
    name: 'Pantalon Africain',
    description: 'Pantalon africain avec coupe moderne et motifs traditionnels.',
    price: 32000,
    originalPrice: 38000,
    category: 'hommes',
    subcategory: 'pantalons',
    images: ['/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (4).jpeg'],
    sizes: ['30', '32', '34', '36', '38'],
    colors: [
      { name: 'Wax Bleu', hex: '#0000ff', stock: 18 },
      { name: 'Wax Rouge', hex: '#ff0000', stock: 12 }
    ],
    stock: 30,
    tags: ['pantalon', 'africain', 'wax', 'moderne'],
    isActive: true,
    rating: 4.8,
    reviews: 167,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Produits Enfants
  {
    id: '11',
    name: 'Ensemble Enfant',
    description: 'Ensemble africain pour enfant avec motifs colorés et coupe confortable.',
    price: 18000,
    originalPrice: 22000,
    category: 'enfants',
    subcategory: 'ensembles',
    images: ['/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (5).jpeg'],
    sizes: ['2A', '4A', '6A', '8A', '10A'],
    colors: [
      { name: 'Multicolore', hex: '#ff69b4', stock: 20 },
      { name: 'Wax Jaune', hex: '#ffff00', stock: 15 }
    ],
    stock: 35,
    tags: ['enfant', 'ensemble', 'coloré', 'confortable'],
    isActive: true,
    rating: 4.9,
    reviews: 234,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '12',
    name: 'Robe Fille Africaine',
    description: 'Robe africaine pour petite fille avec broderies délicates.',
    price: 15000,
    originalPrice: 18000,
    category: 'enfants',
    subcategory: 'robes',
    images: ['/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (6).jpeg'],
    sizes: ['2A', '4A', '6A', '8A'],
    colors: [
      { name: 'Rose', hex: '#ffc0cb', stock: 25 },
      { name: 'Blanc', hex: '#ffffff', stock: 18 }
    ],
    stock: 43,
    tags: ['fille', 'robe', 'africaine', 'broderies'],
    isActive: true,
    rating: 4.7,
    reviews: 189,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Produits Tech
  {
    id: '13',
    name: 'iPhone 15 Pro Max',
    description: 'Smartphone Apple dernière génération avec puce A17 Pro.',
    price: 850000,
    originalPrice: 950000,
    category: 'tech',
    subcategory: 'smartphones',
    images: ['/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (7).jpeg'],
    sizes: ['128GB', '256GB', '512GB', '1TB'],
    colors: [
      { name: 'Titanium Naturel', hex: '#8B7355', stock: 8 },
      { name: 'Titanium Bleu', hex: '#4169E1', stock: 6 }
    ],
    stock: 14,
    tags: ['iphone', 'smartphone', 'apple', '5g'],
    isActive: true,
    rating: 4.9,
    reviews: 456,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '14',
    name: 'MacBook Air M2',
    description: 'Ordinateur portable Apple avec puce M2 et design ultra-fin.',
    price: 650000,
    originalPrice: 750000,
    category: 'tech',
    subcategory: 'ordinateurs',
    images: ['/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (8).jpeg'],
    sizes: ['13"', '15"'],
    colors: [
      { name: 'Argent', hex: '#C0C0C0', stock: 5 },
      { name: 'Or', hex: '#FFD700', stock: 3 }
    ],
    stock: 8,
    tags: ['macbook', 'apple', 'm2', 'portable'],
    isActive: true,
    rating: 4.8,
    reviews: 312,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: '15',
    name: 'Samsung Galaxy S24 Ultra',
    description: 'Smartphone Samsung haut de gamme avec S Pen intégré.',
    price: 750000,
    originalPrice: 850000,
    category: 'tech',
    subcategory: 'smartphones',
    images: ['/images/products/WhatsApp Image 2025-07-27 at 14.52.58 (9).jpeg'],
    sizes: ['256GB', '512GB', '1TB'],
    colors: [
      { name: 'Noir', hex: '#000000', stock: 12 },
      { name: 'Violet', hex: '#800080', stock: 8 }
    ],
    stock: 20,
    tags: ['samsung', 'smartphone', 'android', '5g'],
    isActive: true,
    rating: 4.7,
    reviews: 278,
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

export const getProductsByCategory = (category: string) => {
  return products.filter(product => product.category === category);
};

export const getProductById = (id: string) => {
  return products.find(product => product.id === id);
};

export const getAllProducts = () => {
  return products;
}; 