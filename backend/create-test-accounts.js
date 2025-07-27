import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './src/models/User.js';

dotenv.config();

const createTestAccounts = async () => {
  try {
    // Connexion à MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/afrovibz');
    console.log('✅ Connecté à MongoDB');

    // Vérifier et créer le Super Admin
    const existingSuperAdmin = await User.findOne({ email: 'superadmin@afrovibz.com' });
    if (!existingSuperAdmin) {
      const superAdmin = new User({
        email: 'superadmin@afrovibz.com',
        password: 'superadmin123',
        displayName: 'Super Administrateur AFROVIBZ',
        role: 'super_admin',
        isVerified: true,
        superAdminInfo: {
          accessLevel: 'full',
          permissions: [
            'product_management',
            'inventory_management', 
            'promotion_management',
            'user_management',
            'analytics_access',
            'shipping_management',
            'site_settings'
          ]
        }
      });

      await superAdmin.save();
      console.log('👑 Compte Super Admin créé avec succès !');
      console.log('   Email: superadmin@afrovibz.com');
      console.log('   Mot de passe: superadmin123');
    } else {
      console.log('👑 Compte Super Admin existe déjà');
    }

    // Vérifier et créer la Vendeuse 1
    const existingVendeuse1 = await User.findOne({ email: 'vendeuse1@afrovibz.com' });
    if (!existingVendeuse1) {
      const vendeuse1 = new User({
        email: 'vendeuse1@afrovibz.com',
        password: 'vendeuse123',
        displayName: 'Marie Vendeuse',
        role: 'vendeuse',
        isVerified: true,
        vendeuseInfo: {
          employeeId: 'V001',
          department: 'Ventes',
          permissions: [
            'order_validation',
            'order_tracking',
            'order_history',
            'logistics_view'
          ]
        }
      });

      await vendeuse1.save();
      console.log('👩‍💼 Compte Vendeuse 1 créé avec succès !');
      console.log('   Email: vendeuse1@afrovibz.com');
      console.log('   Mot de passe: vendeuse123');
    } else {
      console.log('👩‍💼 Compte Vendeuse 1 existe déjà');
    }

    // Vérifier et créer la Vendeuse 2
    const existingVendeuse2 = await User.findOne({ email: 'vendeuse2@afrovibz.com' });
    if (!existingVendeuse2) {
      const vendeuse2 = new User({
        email: 'vendeuse2@afrovibz.com',
        password: 'vendeuse123',
        displayName: 'Sophie Vendeuse',
        role: 'vendeuse',
        isVerified: true,
        vendeuseInfo: {
          employeeId: 'V002',
          department: 'Ventes',
          permissions: [
            'order_validation',
            'order_tracking',
            'order_history',
            'logistics_view'
          ]
        }
      });

      await vendeuse2.save();
      console.log('👩‍💼 Compte Vendeuse 2 créé avec succès !');
      console.log('   Email: vendeuse2@afrovibz.com');
      console.log('   Mot de passe: vendeuse123');
    } else {
      console.log('👩‍💼 Compte Vendeuse 2 existe déjà');
    }

    // Créer un utilisateur normal de test
    const existingUser = await User.findOne({ email: 'client@afrovibz.com' });
    if (!existingUser) {
      const user = new User({
        email: 'client@afrovibz.com',
        password: 'client123',
        displayName: 'Client Test',
        role: 'user',
        isVerified: true
      });

      await user.save();
      console.log('👤 Compte Client Test créé avec succès !');
      console.log('   Email: client@afrovibz.com');
      console.log('   Mot de passe: client123');
    } else {
      console.log('👤 Compte Client Test existe déjà');
    }

    console.log('\n📋 Récapitulatif des comptes de test :');
    console.log('=====================================');
    console.log('👑 Super Admin:');
    console.log('   Email: superadmin@afrovibz.com');
    console.log('   Mot de passe: superadmin123');
    console.log('   Permissions: Toutes les permissions');
    console.log('');
    console.log('👩‍💼 Vendeuses:');
    console.log('   Email: vendeuse1@afrovibz.com');
    console.log('   Mot de passe: vendeuse123');
    console.log('   Permissions: Validation commandes, suivi logistique');
    console.log('');
    console.log('   Email: vendeuse2@afrovibz.com');
    console.log('   Mot de passe: vendeuse123');
    console.log('   Permissions: Validation commandes, suivi logistique');
    console.log('');
    console.log('👤 Client Test:');
    console.log('   Email: client@afrovibz.com');
    console.log('   Mot de passe: client123');
    console.log('   Permissions: Utilisateur normal');

  } catch (error) {
    console.error('❌ Erreur lors de la création des comptes de test :', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Déconnecté de MongoDB');
  }
};

createTestAccounts(); 