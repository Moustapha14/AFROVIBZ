import express from 'express';
import { authenticateToken, requireVendeuse, canAccessOrder } from '../middleware/authorization.js';
import Order from '../models/Order.js';
import User from '../models/User.js';

const router = express.Router();

// Appliquer l'authentification et les permissions vendeuse à toutes les routes
router.use(authenticateToken);
router.use(requireVendeuse);

// GET /api/vendeuse/dashboard - Tableau de bord vendeuse
router.get('/dashboard', async (req, res) => {
  try {
    const userId = req.user._id;
    
    // Statistiques des commandes assignées
    const stats = await Order.aggregate([
      {
        $match: {
          assignedVendeuse: userId
        }
      },
      {
        $group: {
          _id: '$logisticsStatus',
          count: { $sum: 1 }
        }
      }
    ]);

    // Commandes récentes à traiter
    const recentOrders = await Order.find({
      assignedVendeuse: userId,
      logisticsStatus: { $in: ['à préparer', 'en cours d\'expédition'] }
    })
    .populate('user', 'displayName email phone')
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 })
    .limit(10);

    // Commandes en attente de validation
    const pendingOrders = await Order.find({
      assignedVendeuse: userId,
      orderStatus: 'pending'
    })
    .populate('user', 'displayName email phone')
    .populate('items.product', 'name images')
    .sort({ createdAt: -1 });

    res.json({
      stats: stats.reduce((acc, stat) => {
        acc[stat._id] = stat.count;
        return acc;
      }, {}),
      recentOrders,
      pendingOrders: pendingOrders.length
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du chargement du tableau de bord' });
  }
});

// GET /api/vendeuse/orders - Liste des commandes assignées
router.get('/orders', async (req, res) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const userId = req.user._id;
    
    const filter = { assignedVendeuse: userId };
    if (status) {
      filter.logisticsStatus = status;
    }

    const orders = await Order.find(filter)
      .populate('user', 'displayName email phone')
      .populate('items.product', 'name images price')
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

// GET /api/vendeuse/orders/:orderId - Détails d'une commande
router.get('/orders/:orderId', canAccessOrder, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('user', 'displayName email phone')
      .populate('items.product', 'name images price description')
      .populate('assignedVendeuse', 'displayName');

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du chargement de la commande' });
  }
});

// PUT /api/vendeuse/orders/:orderId/validate - Valider une commande
router.put('/orders/:orderId/validate', canAccessOrder, async (req, res) => {
  try {
    const { notes } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Mettre à jour le statut de la commande
    await order.updateStatus('confirmed', req.user._id, notes);
    
    // Mettre à jour le statut logistique
    await order.updateLogisticsStatus('à préparer', req.user._id, 'Commande validée par la vendeuse');

    res.json({ message: 'Commande validée avec succès', order });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la validation de la commande' });
  }
});

// PUT /api/vendeuse/orders/:orderId/logistics - Mettre à jour le statut logistique
router.put('/orders/:orderId/logistics', canAccessOrder, async (req, res) => {
  try {
    const { status, trackingNumber, carrier, notes } = req.body;
    const order = await Order.findById(req.params.orderId);

    if (!order) {
      return res.status(404).json({ message: 'Commande non trouvée' });
    }

    // Mettre à jour le statut logistique
    await order.updateLogisticsStatus(status, req.user._id, notes);

    // Mettre à jour les informations de suivi si fournies
    if (trackingNumber || carrier) {
      order.trackingInfo = {
        ...order.trackingInfo,
        trackingNumber: trackingNumber || order.trackingInfo.trackingNumber,
        carrier: carrier || order.trackingInfo.carrier
      };
      await order.save();
    }

    // Mettre à jour le statut de commande selon le statut logistique
    let orderStatus = order.orderStatus;
    switch (status) {
      case 'en cours d\'expédition':
        orderStatus = 'shipped';
        break;
      case 'livré':
        orderStatus = 'delivered';
        break;
    }

    if (orderStatus !== order.orderStatus) {
      await order.updateStatus(orderStatus, req.user._id, `Statut logistique mis à jour: ${status}`);
    }

    res.json({ message: 'Statut logistique mis à jour avec succès', order });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut logistique' });
  }
});

// GET /api/vendeuse/logistics - Tableau de suivi logistique
router.get('/logistics', async (req, res) => {
  try {
    const userId = req.user._id;
    const { status } = req.query;

    const filter = { assignedVendeuse: userId };
    if (status) {
      filter.logisticsStatus = status;
    }

    const orders = await Order.find(filter)
      .populate('user', 'displayName email phone')
      .populate('items.product', 'name images')
      .sort({ createdAt: -1 });

    // Grouper par statut logistique
    const groupedOrders = orders.reduce((acc, order) => {
      const status = order.logisticsStatus;
      if (!acc[status]) {
        acc[status] = [];
      }
      acc[status].push(order);
      return acc;
    }, {});

    res.json({
      orders: groupedOrders,
      summary: {
        total: orders.length,
        'à préparer': groupedOrders['à préparer']?.length || 0,
        'en cours d\'expédition': groupedOrders['en cours d\'expédition']?.length || 0,
        'livré': groupedOrders['livré']?.length || 0,
        'retourné': groupedOrders['retourné']?.length || 0
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du chargement du suivi logistique' });
  }
});

// GET /api/vendeuse/history - Historique des commandes
router.get('/history', async (req, res) => {
  try {
    const { page = 1, limit = 20, startDate, endDate } = req.query;
    const userId = req.user._id;
    
    const filter = { assignedVendeuse: userId };
    
    if (startDate && endDate) {
      filter.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const orders = await Order.find(filter)
      .populate('user', 'displayName email phone')
      .populate('items.product', 'name images price')
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
    res.status(500).json({ message: 'Erreur lors du chargement de l\'historique' });
  }
});

// GET /api/vendeuse/profile - Profil de la vendeuse
router.get('/profile', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .select('-password')
      .populate('vendeuseInfo.supervisor', 'displayName email');

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erreur lors du chargement du profil' });
  }
});

export default router; 