import express from 'express';
import { body } from 'express-validator';
import { register, login, getMe, logout } from '../controllers/authController.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// Validation pour l'inscription
const registerValidation = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Le mot de passe doit contenir au moins 6 caractères'),
  body('displayName')
    .trim()
    .isLength({ min: 2, max: 50 })
    .withMessage('Le nom d\'affichage doit contenir entre 2 et 50 caractères'),
  body('phone')
    .optional()
    .isMobilePhone()
    .withMessage('Numéro de téléphone invalide')
];

// Validation pour la connexion
const loginValidation = [
  body('email')
    .isEmail()
    .withMessage('Email invalide')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Le mot de passe est requis')
];

// Routes
router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', auth, getMe);
router.post('/logout', auth, logout);

export default router; 