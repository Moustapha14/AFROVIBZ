import express from 'express';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

// Route temporaire - à implémenter plus tard
router.get('/', optionalAuth, (req, res) => {
  res.json({ message: 'Liste des produits - à implémenter' });
});

router.get('/:id', optionalAuth, (req, res) => {
  res.json({ message: `Détails du produit ${req.params.id} - à implémenter` });
});

export default router; 