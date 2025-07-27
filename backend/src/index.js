import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import productRoutes from './routes/products.js';
import cartRoutes from './routes/cart.js';
import orderRoutes from './routes/orders.js';
import vendeuseRoutes from './routes/vendeuse.js';
import superAdminRoutes from './routes/super-admin.js';

// Charger les variables d'environnement
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connexion à la base de données
connectDB();

// Middleware de sécurité
app.use(helmet());

// Configuration CORS
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limite chaque IP à 100 requêtes par fenêtre
  message: 'Trop de requêtes depuis cette IP, veuillez réessayer plus tard.'
});
app.use('/api/', limiter);

// Middleware de logging
app.use(morgan('combined'));

// Middleware pour parser le JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Routes d'administration
app.use('/api/vendeuse', vendeuseRoutes);
app.use('/api/super-admin', superAdminRoutes);

// Route de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AFRO🗼VIBZ API est opérationnelle',
    timestamp: new Date().toISOString()
  });
});

// Middleware de gestion d'erreurs
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Erreur interne du serveur',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Une erreur est survenue'
  });
});

// Route 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route non trouvée' });
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur AFRO🗼VIBZ démarré sur le port ${PORT}`);
  console.log(`📱 API disponible sur http://localhost:${PORT}/api`);
  console.log(`🔗 Frontend: ${process.env.FRONTEND_URL || 'http://localhost:3000'}`);
}); 