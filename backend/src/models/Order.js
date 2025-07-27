import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema({
  orderNumber: {
    type: String,
    required: true,
    unique: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [{
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    price: {
      type: Number,
      required: true
    },
    selectedSize: String,
    selectedColor: String
  }],
  shippingAddress: {
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    address: String,
    city: String,
    postalCode: String,
    country: String
  },
  deliveryOption: {
    type: String,
    enum: ['standard', 'express', 'pickup', 'same-day', 'self-pickup'],
    required: true
  },
  deliveryCost: {
    type: Number,
    default: 0
  },
  subtotal: {
    type: Number,
    required: true
  },
  total: {
    type: Number,
    required: true
  },
  paymentMethod: {
    type: String,
    enum: ['card', 'mobile_money', 'bank_transfer'],
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled', 'returned'],
    default: 'pending'
  },
  // Statuts de suivi logistique
  logisticsStatus: {
    type: String,
    enum: ['à préparer', 'en cours d\'expédition', 'livré', 'retourné'],
    default: 'à préparer'
  },
  // Informations de suivi
  trackingInfo: {
    trackingNumber: String,
    carrier: String,
    estimatedDelivery: Date,
    actualDelivery: Date,
    notes: String
  },
  // Assignation à une vendeuse
  assignedVendeuse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  // Historique des actions
  statusHistory: [{
    status: String,
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    updatedAt: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  // Codes promo appliqués
  appliedPromotions: [{
    code: String,
    discount: Number,
    type: {
      type: String,
      enum: ['percentage', 'fixed']
    }
  }],
  notes: String
}, {
  timestamps: true
});

// Génération automatique du numéro de commande
orderSchema.pre('save', async function(next) {
  if (this.isNew) {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    
    // Compter les commandes du jour
    const todayOrders = await this.constructor.countDocuments({
      createdAt: {
        $gte: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
        $lt: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1)
      }
    });
    
    this.orderNumber = `CMD-${year}${month}${day}-${String(todayOrders + 1).padStart(3, '0')}`;
  }
  next();
});

// Méthode pour mettre à jour le statut
orderSchema.methods.updateStatus = function(newStatus, updatedBy, notes = '') {
  this.orderStatus = newStatus;
  this.statusHistory.push({
    status: newStatus,
    updatedBy,
    notes
  });
  return this.save();
};

// Méthode pour mettre à jour le statut logistique
orderSchema.methods.updateLogisticsStatus = function(newStatus, updatedBy, notes = '') {
  this.logisticsStatus = newStatus;
  this.statusHistory.push({
    status: `Logistics: ${newStatus}`,
    updatedBy,
    notes
  });
  return this.save();
};

const Order = mongoose.model('Order', orderSchema);

export default Order; 