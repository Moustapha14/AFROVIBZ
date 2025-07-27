import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  photoURL: {
    type: String
  },
  role: {
    type: String,
    enum: ['user', 'vendeuse', 'super_admin'],
    default: 'user'
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  // Champs spécifiques aux vendeuses
  vendeuseInfo: {
    employeeId: String,
    department: String,
    supervisor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    permissions: [{
      type: String,
      enum: ['order_validation', 'order_tracking', 'order_history', 'logistics_view']
    }]
  },
  // Champs spécifiques aux super admins
  superAdminInfo: {
    accessLevel: {
      type: String,
      enum: ['full', 'limited'],
      default: 'full'
    },
    permissions: [{
      type: String,
      enum: [
        'product_management',
        'inventory_management', 
        'promotion_management',
        'user_management',
        'analytics_access',
        'shipping_management',
        'site_settings'
      ]
    }]
  },
  addresses: [{
    type: {
      type: String,
      enum: ['home', 'work', 'other'],
      default: 'home'
    },
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: {
      type: String,
      default: 'Côte d\'Ivoire'
    },
    isDefault: {
      type: Boolean,
      default: false
    }
  }],
  preferences: {
    language: {
      type: String,
      default: 'fr'
    },
    currency: {
      type: String,
      default: 'XOF'
    },
    notifications: {
      email: {
        type: Boolean,
        default: true
      },
      sms: {
        type: Boolean,
        default: false
      },
      push: {
        type: Boolean,
        default: true
      }
    }
  }
}, {
  timestamps: true
});

// Hash du mot de passe avant sauvegarde
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(parseInt(process.env.BCRYPT_ROUNDS) || 12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Méthode pour comparer les mots de passe
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Méthode pour obtenir les données publiques de l'utilisateur
userSchema.methods.toPublicJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

const User = mongoose.model('User', userSchema);

export default User; 