#!/bin/bash

# Script de démarrage du stack de monitoring
# Usage: ./start-monitoring.sh

echo "=========================================="
echo "  Démarrage du Stack de Monitoring"
echo "=========================================="
echo ""

# Vérifier que Docker est installé
if ! command -v docker &> /dev/null; then
    echo "❌ Docker n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

# Vérifier que Docker Compose est installé
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose n'est pas installé. Veuillez l'installer d'abord."
    exit 1
fi

echo "✅ Docker et Docker Compose sont installés"
echo ""

# Configurer vm.max_map_count pour Elasticsearch (Linux/Mac)
if [[ "$OSTYPE" == "linux-gnu"* ]] || [[ "$OSTYPE" == "darwin"* ]]; then
    echo "🔧 Configuration de vm.max_map_count pour Elasticsearch..."
    sudo sysctl -w vm.max_map_count=262144
    echo "✅ vm.max_map_count configuré"
    echo ""
fi

# Créer les dossiers nécessaires
echo "📁 Création des dossiers de données..."
mkdir -p elasticsearch/data
mkdir -p grafana/data
mkdir -p prometheus/data
chmod -R 777 elasticsearch/data grafana/data prometheus/data
echo "✅ Dossiers créés"
echo ""

# Démarrer les services
echo "🚀 Démarrage des services Docker..."
docker-compose up -d

echo ""
echo "⏳ Attente du démarrage des services (30 secondes)..."
sleep 30

# Vérifier l'état des services
echo ""
echo "📊 État des services:"
docker-compose ps

echo ""
echo "=========================================="
echo "  ✅ Stack de Monitoring Démarré !"
echo "=========================================="
echo ""
echo "🌐 Accès aux services:"
echo ""
echo "  📱 Laravel API:        http://localhost:8000"
echo "  📊 Métriques:          http://localhost:8000/metrics"
echo "  🔍 Prometheus:         http://localhost:9090"
echo "  📈 Grafana:            http://localhost:3000"
echo "     └─ Login: admin / admin123"
echo "  📝 Kibana:             http://localhost:5601"
echo "  🗄️  phpMyAdmin:         http://localhost:8080"
echo ""
echo "📚 Documentation:"
echo "  - MONITORING_QUICKSTART.md : Démarrage rapide"
echo "  - MONITORING_GUIDE.md      : Guide complet"
echo "  - ALERTES_CONFIGURATION.md : Configuration des alertes"
echo ""
echo "🔧 Commandes utiles:"
echo "  - Voir les logs:       docker-compose logs -f"
echo "  - Arrêter:             docker-compose down"
echo "  - Redémarrer:          docker-compose restart"
echo ""
echo "⚠️  Note: Kibana peut prendre 2-3 minutes pour être prêt"
echo ""
