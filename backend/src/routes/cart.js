import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Route temporaire - à implémenter plus tard
router.get('/', auth, (req, res) => {
  res.json({ message: 'Panier utilisateur - à implémenter' });
});

export default router; 