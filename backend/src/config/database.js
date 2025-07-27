import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/afrovibz', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log(`📦 MongoDB connecté: ${conn.connection.host}`);
  } catch (error) {
    console.error('❌ Erreur de connexion MongoDB:', error.message);
    process.exit(1);
  }
};

export default connectDB; 