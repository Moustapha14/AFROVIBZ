import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware pour vérifier l'authentification
export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Token d\'accès requis' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Utilisateur non trouvé' });
    }

    req.user = user;
    next();
  } catch (error) {
    return res.status(403).json({ message: 'Token invalide' });
  }
};

// Middleware pour vérifier les rôles
export const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentification requise' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ 
        message: 'Permissions insuffisantes pour accéder à cette ressource' 
      });
    }

    next();
  };
};

// Middleware pour vérifier les permissions spécifiques
export const requirePermission = (permissions) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Authentification requise' });
    }

    // Super admin a toutes les permissions
    if (req.user.role === 'super_admin') {
      return next();
    }

    // Vérifier les permissions selon le rôle
    let userPermissions = [];
    
    if (req.user.role === 'vendeuse' && req.user.vendeuseInfo) {
      userPermissions = req.user.vendeuseInfo.permissions || [];
    } else if (req.user.role === 'super_admin' && req.user.superAdminInfo) {
      userPermissions = req.user.superAdminInfo.permissions || [];
    }

    const hasPermission = permissions.some(permission => 
      userPermissions.includes(permission)
    );

    if (!hasPermission) {
      return res.status(403).json({ 
        message: 'Permissions insuffisantes pour cette action' 
      });
    }

    next();
  };
};

// Middleware spécifique pour les vendeuses
export const requireVendeuse = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentification requise' });
  }

  if (req.user.role !== 'vendeuse' && req.user.role !== 'super_admin') {
    return res.status(403).json({ 
      message: 'Accès réservé aux vendeuses et super admins' 
    });
  }

  next();
};

// Middleware spécifique pour les super admins
export const requireSuperAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentification requise' });
  }

  if (req.user.role !== 'super_admin') {
    return res.status(403).json({ 
      message: 'Accès réservé aux super admins' 
    });
  }

  next();
};

// Middleware pour vérifier l'accès aux commandes
export const canAccessOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    
    if (!req.user) {
      return res.status(401).json({ message: 'Authentification requise' });
    }

    // Super admin peut accéder à toutes les commandes
    if (req.user.role === 'super_admin') {
      return next();
    }

    // Vendeuse peut accéder aux commandes qui lui sont assignées
    if (req.user.role === 'vendeuse') {
      const Order = (await import('../models/Order.js')).default;
      const order = await Order.findById(orderId);
      
      if (!order) {
        return res.status(404).json({ message: 'Commande non trouvée' });
      }

      if (order.assignedVendeuse && order.assignedVendeuse.toString() === req.user._id.toString()) {
        return next();
      }

      return res.status(403).json({ 
        message: 'Vous n\'êtes pas autorisé à accéder à cette commande' 
      });
    }

    // Utilisateur normal peut accéder à ses propres commandes
    const Order = (await import('../models/Order.js')).default;
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    if (order.user.toString() === req.user._id.toString()) {
      return next();
    }

    return res.status(403).json({ 
      message: 'Vous n\'êtes pas autorisé à accéder à cette commande' 
    });

  } catch (error) {
    return res.status(500).json({ message: 'Erreur lors de la vérification des permissions' });
  }
};

// Helper pour obtenir les permissions d'un utilisateur
export const getUserPermissions = (user) => {
  if (!user) return [];

  switch (user.role) {
    case 'super_admin':
      return user.superAdminInfo?.permissions || [
        'product_management',
        'inventory_management', 
        'promotion_management',
        'user_management',
        'analytics_access',
        'shipping_management',
        'site_settings'
      ];
    
    case 'vendeuse':
      return user.vendeuseInfo?.permissions || [
        'order_validation',
        'order_tracking',
        'order_history',
        'logistics_view'
      ];
    
    default:
      return [];
  }
}; 