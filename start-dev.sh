#!/bin/bash

echo "🚀 Démarrage de l'environnement de développement AFRO🗼VIBZ"
echo "=================================================="

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker d'abord."
    exit 1
fi

# Vérifier si les dépendances sont installées
if [ ! -d "frontend/node_modules" ] || [ ! -d "backend/node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm run install:all
fi

# Démarrer MongoDB
echo "🐳 Démarrage de MongoDB..."
docker-compose up -d mongodb

# Attendre que MongoDB soit prêt
echo "⏳ Attente que MongoDB soit prêt..."
sleep 10

# Vérifier que MongoDB fonctionne
if docker ps --format 'table {{.Names}}' | grep -q "afrovibz-mongodb"; then
    echo "✅ MongoDB est démarré"
else
    echo "❌ Erreur lors du démarrage de MongoDB"
    exit 1
fi

echo ""
echo "🎉 Environnement prêt !"
echo "=================================================="
echo "📱 Frontend: http://localhost:3000"
echo "🔗 Backend API: http://localhost:5000/api"
echo "🗄️  MongoDB: localhost:27017"
echo "📊 Mongo Express: http://localhost:8081 (admin/password)"
echo ""
echo "🚀 Démarrage des applications..."
echo "=================================================="

# Démarrer les applications
npm run dev 