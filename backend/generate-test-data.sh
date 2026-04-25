#!/bin/bash

# Script pour générer des données de test et des logs pour le monitoring
# Usage: ./generate-test-data.sh

echo "=========================================="
echo "  Génération de Données de Test"
echo "=========================================="
echo ""

# Vérifier que le conteneur Laravel est démarré
if ! docker ps | grep -q laravel-app; then
    echo "❌ Le conteneur Laravel n'est pas démarré"
    echo "   Exécutez d'abord: docker-compose up -d"
    exit 1
fi

echo "✅ Conteneur Laravel détecté"
echo ""

# Exécuter les migrations
echo "📦 Exécution des migrations..."
docker exec laravel-app php artisan migrate:fresh --force
echo "✅ Migrations terminées"
echo ""

# Générer des données de test
echo "🌱 Génération des données de test..."
docker exec laravel-app php artisan db:seed --force
echo "✅ Données générées"
echo ""

# Générer des logs de test
echo "📝 Génération de logs de test..."
docker exec laravel-app php artisan tinker --execute="
Log::info('Application started successfully');
Log::info('Database connection established');
Log::info('User registered', ['user_id' => 1, 'email' => 'test@example.com']);
Log::info('Product created', ['product_id' => 1, 'name' => 'iPhone 15']);
Log::warning('Low stock alert', ['product_id' => 1, 'quantity' => 3]);
Log::warning('Slow query detected', ['duration' => 1.5, 'query' => 'SELECT * FROM products']);
Log::error('Payment failed', ['order_id' => 123, 'error' => 'Insufficient funds']);
Log::error('API rate limit exceeded', ['ip' => '192.168.1.100', 'endpoint' => '/api/products']);
echo 'Logs générés avec succès';
"
echo "✅ Logs générés"
echo ""

# Afficher les statistiques
echo "📊 Statistiques:"
echo ""
docker exec laravel-app php artisan tinker --execute="
echo 'Utilisateurs: ' . \App\Models\User::count();
echo 'Produits: ' . \App\Models\Product::count();
echo 'Catégories: ' . \App\Models\Category::count();
echo 'Produits en stock: ' . \App\Models\Product::where('quantity', '>', 0)->count();
echo 'Produits en rupture: ' . \App\Models\Product::where('quantity', '=', 0)->count();
"
echo ""

# Tester l'endpoint métriques
echo "🔍 Test de l'endpoint métriques..."
curl -s http://localhost:8000/metrics | head -n 20
echo ""
echo "..."
echo ""

echo "=========================================="
echo "  ✅ Données de Test Générées !"
echo "=========================================="
echo ""
echo "🌐 Vous pouvez maintenant:"
echo "  - Voir les métriques:  http://localhost:8000/metrics"
echo "  - Voir Prometheus:     http://localhost:9090"
echo "  - Voir Grafana:        http://localhost:3000"
echo "  - Voir les logs:       http://localhost:5601"
echo ""
echo "💡 Astuce: Attendez 15-30 secondes pour que Prometheus collecte les métriques"
echo ""
