import mongoose from 'mongoose';

const promotionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  type: {
    type: String,
    enum: ['percentage', 'fixed', 'free_shipping'],
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    trim: true
  },
  // Conditions d'application
  conditions: {
    minimumOrderAmount: {
      type: Number,
      default: 0
    },
    maximumDiscount: {
      type: Number
    },
    applicableCategories: [{
      type: String
    }],
    applicableProducts: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product'
    }],
    userGroups: [{
      type: String,
      enum: ['all', 'new_users', 'returning_customers', 'vip']
    }],
    usageLimit: {
      type: Number,
      default: -1 // -1 = illimité
    },
    usagePerUser: {
      type: Number,
      default: 1
    }
  },
  // Dates de validité
  validFrom: {
    type: Date,
    required: true
  },
  validTo: {
    type: Date,
    required: true
  },
  // Statut
  isActive: {
    type: Boolean,
    default: true
  },
  // Statistiques
  usageCount: {
    type: Number,
    default: 0
  },
  totalDiscount: {
    type: Number,
    default: 0
  },
  // Créé par
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  // Tags pour le référencement
  seoTags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Index pour la recherche
promotionSchema.index({ code: 1 });
promotionSchema.index({ isActive: 1, validFrom: 1, validTo: 1 });

// Méthode pour vérifier si la promotion est valide
promotionSchema.methods.isValid = function() {
  const now = new Date();
  return this.isActive && 
         now >= this.validFrom && 
         now <= this.validTo &&
         (this.conditions.usageLimit === -1 || this.usageCount < this.conditions.usageLimit);
};

// Méthode pour calculer la réduction
promotionSchema.methods.calculateDiscount = function(orderAmount) {
  if (orderAmount < this.conditions.minimumOrderAmount) {
    return 0;
  }

  let discount = 0;
  
  switch (this.type) {
    case 'percentage':
      discount = (orderAmount * this.value) / 100;
      break;
    case 'fixed':
      discount = this.value;
      break;
    case 'free_shipping':
      // La logique sera gérée dans le calcul de livraison
      discount = 0;
      break;
  }

  // Appliquer le maximum de réduction si défini
  if (this.conditions.maximumDiscount && discount > this.conditions.maximumDiscount) {
    discount = this.conditions.maximumDiscount;
  }

  return Math.min(discount, orderAmount);
};

// Méthode pour incrémenter l'utilisation
promotionSchema.methods.incrementUsage = function(discountAmount) {
  this.usageCount += 1;
  this.totalDiscount += discountAmount;
  return this.save();
};

const Promotion = mongoose.model('Promotion', promotionSchema);

export default Promotion; 