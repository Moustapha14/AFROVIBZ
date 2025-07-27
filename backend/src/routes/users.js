import express from 'express';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Route temporaire - à implémenter plus tard
router.get('/profile', auth, (req, res) => {
  res.json({ message: 'Profil utilisateur - à implémenter' });
});

export default router; 