import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  originalPrice: {
    type: Number,
    min: 0
  },
  images: [{
    url: {
      type: String,
      required: true
    },
    alt: String,
    isMain: {
      type: Boolean,
      default: false
    }
  }],
  category: {
    type: String,
    required: true,
    enum: ['vêtements', 'chaussures', 'accessoires', 'beauté', 'maison', 'sport']
  },
  subcategory: {
    type: String,
    trim: true
  },
  brand: {
    type: String,
    trim: true
  },
  colors: [{
    name: String,
    code: String,
    available: {
      type: Boolean,
      default: true
    }
  }],
  sizes: [{
    name: String,
    available: {
      type: Boolean,
      default: true
    }
  }],
  stock: {
    type: Number,
    default: 0,
    min: 0
  },
  sku: {
    type: String,
    unique: true,
    sparse: true
  },
  tags: [String],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  isOnSale: {
    type: Boolean,
    default: false
  },
  salePercentage: {
    type: Number,
    min: 0,
    max: 100
  },
  weight: {
    type: Number,
    min: 0
  },
  dimensions: {
    length: Number,
    width: Number,
    height: Number
  },
  shipping: {
    free: {
      type: Boolean,
      default: false
    },
    cost: {
      type: Number,
      default: 0
    }
  },
  specifications: [{
    name: String,
    value: String
  }],
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    comment: String,
    createdAt: {
      type: Date,
      default: Date.now
    }
  }]
}, {
  timestamps: true
});

// Index pour la recherche
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ isFeatured: 1, isActive: 1 });

// Méthode pour calculer le prix de vente
productSchema.methods.getSalePrice = function() {
  if (this.isOnSale && this.salePercentage) {
    return this.price * (1 - this.salePercentage / 100);
  }
  return this.price;
};

// Méthode pour vérifier la disponibilité
productSchema.methods.isAvailable = function() {
  return this.isActive && this.stock > 0;
};

const Product = mongoose.model('Product', productSchema);

export default Product; 