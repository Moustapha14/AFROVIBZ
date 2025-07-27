#!/bin/bash

# Script pour démarrer MongoDB avec Docker

echo "🐳 Démarrage de MongoDB avec Docker..."

# Vérifier si Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez installer Docker d'abord."
    exit 1
fi

# Vérifier si le conteneur MongoDB existe déjà
if docker ps -a --format 'table {{.Names}}' | grep -q "mongodb"; then
    echo "📦 Conteneur MongoDB trouvé, démarrage..."
    docker start mongodb
else
    echo "📦 Création et démarrage du conteneur MongoDB..."
    docker run -d \
        --name mongodb \
        -p 27017:27017 \
        -e MONGO_INITDB_ROOT_USERNAME=admin \
        -e MONGO_INITDB_ROOT_PASSWORD=password \
        -e MONGO_INITDB_DATABASE=afrovibz \
        mongo:latest
fi

# Attendre que MongoDB soit prêt
echo "⏳ Attente que MongoDB soit prêt..."
sleep 5

# Vérifier que MongoDB fonctionne
if docker ps --format 'table {{.Names}}' | grep -q "mongodb"; then
    echo "✅ MongoDB est démarré et accessible sur localhost:27017"
    echo "🔗 URL de connexion: mongodb://admin:password@localhost:27017/afrovibz"
else
    echo "❌ Erreur lors du démarrage de MongoDB"
    exit 1
fi

echo ""
echo "🚀 Vous pouvez maintenant démarrer le backend avec:"
echo "   npm run dev:backend"
echo ""
echo "🔗 Ou démarrer les deux applications avec:"
echo "   npm run dev" 