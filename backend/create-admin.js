import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const createAdminUser = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/afrovibz');
    console.log('Connecté à MongoDB');

    // Vérifier si l'admin existe déjà
    const existingAdmin = await User.findOne({ email: 'admin@afrovibz.com' });
    
    if (existingAdmin) {
      console.log('L\'administrateur existe déjà');
      return;
    }

    // Créer l'utilisateur admin
    const adminUser = new User({
      email: 'admin@afrovibz.com',
      password: 'admin123',
      displayName: 'Administrateur AFROVIBZ',
      role: 'admin',
      isVerified: true
    });

    await adminUser.save();
    console.log('Compte administrateur créé avec succès !');
    console.log('Email: admin@afrovibz.com');
    console.log('Mot de passe: admin123');

  } catch (error) {
    console.error('Erreur lors de la création de l\'administrateur:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Déconnecté de MongoDB');
  }
};

createAdminUser(); 