import express from 'express';
import { authenticateToken, requireSuperAdmin, requirePermission } from '../middleware/authorization.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Promotion from '../models/Promotion.js';

const router = express.Router();

// Appliquer l'authentification et les permissions super admin à toutes les routes
router.use(authenticateToken);
router.use(requireSuperAdmin);

// ===== DASHBOARD ET ANALYTICS =====

// GET /api/super-admin/dashboard - Tableau de bord principal
router.get('/dashboard', requirePermission(['analytics_access']), async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfYear = new Date(now.getFullYear(), 0, 1);

    // Statistiques générales
    const totalUsers = await User.countDocuments({ role: 'user' });
    const totalVendeuses = await User.countDocuments({ role: 'vendeuse' });
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    // Chiffre d'affaires
    const monthlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfMonth },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);

    const yearlyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startOfYear },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          total: { $sum: '$total' }
        }
      }
    ]);

    // Commandes par statut
    const ordersByStatus = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Produits les plus vendus
    const topProducts = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          totalSold: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
        }
      },
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: '_id',
          as: 'product'
        }
      },
      { $unwind: '$product' },
      {
        $project: {
          name: '$product.name',
          totalSold: 1,
          totalRevenue: 1
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 10 }
    ]);

    // Vendeuses les plus performantes
    const topVendeuses = await Order.aggregate([
      {
        $match: {
          assignedVendeuse: { $exists: true, $ne: null }
        }
      },
      {
        $group: {
          _id: '$assignedVendeuse',
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' }
        }
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'vendeuse'
        }
      },
      { $unwind: '$vendeuse' },
      {
        $project: {
          name: '$vendeuse.displayName',
          totalOrders: 1,
          totalRevenue: 1
        }
      },
      { $sort: { totalRevenue: -1 } },
      { $limit: 5 }
    ]);

    res.json({
      stats: {
        totalUsers,
        totalVendeuses,
        totalOrders,
        totalProducts,
        monthlyRevenue: monthlyRevenue[0]?.total || 0,
        yearlyRevenue: yearlyRevenue[0]?.total || 0
      },
      ordersByStatus: ordersByStatus.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      topProducts,
      topVendeuses
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du chargement du tableau de bord' });
  }
});

// ===== GESTION DES UTILISATEURS =====

// GET /api/super-admin/users - Liste des utilisateurs
router.get('/users', requirePermission(['user_management']), async (req, res) => {
  try {
    const { role, page = 1, limit = 20, search } = req.query;
    
    const filter = {};
    if (role) filter.role = role;
    if (search) {
      filter.$or = [
        { displayName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const users = await User.find(filter)
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du chargement des utilisateurs' });
  }
});

// POST /api/super-admin/users - Créer un nouvel utilisateur
router.post('/users', requirePermission(['user_management']), async (req, res) => {
  try {
    const { email, password, displayName, role, vendeuseInfo, superAdminInfo } = req.body;

    // Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé' });
    }

    const userData = {
      email,
      password,
      displayName,
      role,
      isVerified: true
    };

    // Ajouter les informations spécifiques selon le rôle
    if (role === 'vendeuse' && vendeuseInfo) {
      userData.vendeuseInfo = vendeuseInfo;
    } else if (role === 'super_admin' && superAdminInfo) {
      userData.superAdminInfo = superAdminInfo;
    }

    const user = new User(userData);
    await user.save();

    res.status(201).json({
      message: 'Utilisateur créé avec succès',
      user: user.toPublicJSON()
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de l\'utilisateur' });
  }
});

// PUT /api/super-admin/users/:userId - Modifier un utilisateur
router.put('/users/:userId', requirePermission(['user_management']), async (req, res) => {
  try {
    const { displayName, role, isVerified, vendeuseInfo, superAdminInfo } = req.body;
    
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Mettre à jour les champs de base
    if (displayName) user.displayName = displayName;
    if (role) user.role = role;
    if (typeof isVerified === 'boolean') user.isVerified = isVerified;

    // Mettre à jour les informations spécifiques selon le rôle
    if (role === 'vendeuse' && vendeuseInfo) {
      user.vendeuseInfo = vendeuseInfo;
    } else if (role === 'super_admin' && superAdminInfo) {
      user.superAdminInfo = superAdminInfo;
    }

    await user.save();

    res.json({
      message: 'Utilisateur mis à jour avec succès',
      user: user.toPublicJSON()
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de l\'utilisateur' });
  }
});

// DELETE /api/super-admin/users/:userId - Supprimer un utilisateur
router.delete('/users/:userId', requirePermission(['user_management']), async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      return res.status(404).json({ message: 'Utilisateur non trouvé' });
    }

    // Empêcher la suppression de son propre compte
    if (user._id.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Vous ne pouvez pas supprimer votre propre compte' });
    }

    await User.findByIdAndDelete(req.params.userId);

    res.json({ message: 'Utilisateur supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de l\'utilisateur' });
  }
});

// ===== GESTION DES PRODUITS =====

// GET /api/super-admin/products - Liste des produits
router.get('/products', requirePermission(['product_management']), async (req, res) => {
  try {
    const { page = 1, limit = 20, category, search } = req.query;
    
    const filter = {};
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const products = await Product.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Product.countDocuments(filter);

    res.json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du chargement des produits' });
  }
});

// POST /api/super-admin/products - Créer un nouveau produit
router.post('/products', requirePermission(['product_management']), async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();

    res.status(201).json({
      message: 'Produit créé avec succès',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création du produit' });
  }
});

// PUT /api/super-admin/products/:productId - Modifier un produit
router.put('/products/:productId', requirePermission(['product_management']), async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.productId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json({
      message: 'Produit mis à jour avec succès',
      product
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du produit' });
  }
});

// DELETE /api/super-admin/products/:productId - Supprimer un produit
router.delete('/products/:productId', requirePermission(['product_management']), async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.productId);
    
    if (!product) {
      return res.status(404).json({ message: 'Produit non trouvé' });
    }

    res.json({ message: 'Produit supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression du produit' });
  }
});

// ===== GESTION DES PROMOTIONS =====

// GET /api/super-admin/promotions - Liste des promotions
router.get('/promotions', requirePermission(['promotion_management']), async (req, res) => {
  try {
    const { page = 1, limit = 20, isActive } = req.query;
    
    const filter = {};
    if (typeof isActive === 'boolean') filter.isActive = isActive;

    const promotions = await Promotion.find(filter)
      .populate('createdBy', 'displayName')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Promotion.countDocuments(filter);

    res.json({
      promotions,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du chargement des promotions' });
  }
});

// POST /api/super-admin/promotions - Créer une nouvelle promotion
router.post('/promotions', requirePermission(['promotion_management']), async (req, res) => {
  try {
    const promotionData = {
      ...req.body,
      createdBy: req.user._id
    };

    const promotion = new Promotion(promotionData);
    await promotion.save();

    res.status(201).json({
      message: 'Promotion créée avec succès',
      promotion
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la création de la promotion' });
  }
});

// PUT /api/super-admin/promotions/:promotionId - Modifier une promotion
router.put('/promotions/:promotionId', requirePermission(['promotion_management']), async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndUpdate(
      req.params.promotionId,
      req.body,
      { new: true, runValidators: true }
    );

    if (!promotion) {
      return res.status(404).json({ message: 'Promotion non trouvée' });
    }

    res.json({
      message: 'Promotion mise à jour avec succès',
      promotion
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour de la promotion' });
  }
});

// DELETE /api/super-admin/promotions/:promotionId - Supprimer une promotion
router.delete('/promotions/:promotionId', requirePermission(['promotion_management']), async (req, res) => {
  try {
    const promotion = await Promotion.findByIdAndDelete(req.params.promotionId);
    
    if (!promotion) {
      return res.status(404).json({ message: 'Promotion non trouvée' });
    }

    res.json({ message: 'Promotion supprimée avec succès' });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la suppression de la promotion' });
  }
});

// ===== GESTION DES COMMANDES =====

// GET /api/super-admin/orders - Liste des commandes
router.get('/orders', requirePermission(['analytics_access']), async (req, res) => {
  try {
    const { status, page = 1, limit = 20, startDate, endDate } = req.query;
    
    const filter = {};
    if (status) filter.orderStatus = status;
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const orders = await Order.find(filter)
      .populate('user', 'displayName email')
      .populate('assignedVendeuse', 'displayName')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Order.countDocuments(filter);

    res.json({
      orders,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du chargement des commandes' });
  }
});

// PUT /api/super-admin/orders/:orderId/assign - Assigner une commande à une vendeuse
router.put('/orders/:orderId/assign', requirePermission(['analytics_access']), async (req, res) => {
  try {
    const { vendeuseId } = req.body;
    
    const order = await Order.findById(req.params.orderId);
    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Vérifier que l'utilisateur est bien une vendeuse
    const vendeuse = await User.findById(vendeuseId);
    if (!vendeuse || vendeuse.role !== 'vendeuse') {
      return res.status(400).json({ message: 'Utilisateur invalide ou non vendeuse' });
    }

    order.assignedVendeuse = vendeuseId;
    await order.save();

    res.json({
      message: 'Commande assignée avec succès',
      order
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de l\'assignation de la commande' });
  }
});

export default router; 