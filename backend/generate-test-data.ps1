# Script pour générer des données de test et des logs pour le monitoring
# Usage: .\generate-test-data.ps1

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Génération de Données de Test" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que le conteneur Laravel est démarré
$container = docker ps --filter "name=laravel-app" --format "{{.Names}}"
if (-not $container) {
    Write-Host "❌ Le conteneur Laravel n'est pas démarré" -ForegroundColor Red
    Write-Host "   Exécutez d'abord: docker-compose up -d" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Conteneur Laravel détecté" -ForegroundColor Green
Write-Host ""

# Exécuter les migrations
Write-Host "📦 Exécution des migrations..." -ForegroundColor Yellow
docker exec laravel-app php artisan migrate:fresh --force
Write-Host "✅ Migrations terminées" -ForegroundColor Green
Write-Host ""

# Générer des données de test
Write-Host "🌱 Génération des données de test..." -ForegroundColor Yellow
docker exec laravel-app php artisan db:seed --force
Write-Host "✅ Données générées" -ForegroundColor Green
Write-Host ""

# Générer des logs de test
Write-Host "📝 Génération de logs de test..." -ForegroundColor Yellow

# Créer un fichier temporaire avec les commandes PHP
$phpCommands = @'
Log::info('Application started successfully');
Log::info('Database connection established');
Log::info('User registered', ['user_id' => 1, 'email' => 'test@example.com']);
Log::info('Product created', ['product_id' => 1, 'name' => 'iPhone 15']);
Log::warning('Low stock alert', ['product_id' => 1, 'quantity' => 3]);
Log::warning('Slow query detected', ['duration' => 1.5, 'query' => 'SELECT * FROM products']);
Log::error('Payment failed', ['order_id' => 123, 'error' => 'Insufficient funds']);
Log::error('API rate limit exceeded', ['ip' => '192.168.1.100', 'endpoint' => '/api/products']);
echo 'Logs générés avec succès';
'@

# Exécuter les commandes dans Tinker
$phpCommands | docker exec -i laravel-app php artisan tinker

Write-Host "✅ Logs générés" -ForegroundColor Green
Write-Host ""

# Afficher les statistiques
Write-Host "📊 Statistiques:" -ForegroundColor Cyan
Write-Host ""

# Créer les commandes de statistiques
$statsCommands = @'
echo 'Utilisateurs: ' . \App\Models\User::count();
echo 'Produits: ' . \App\Models\Product::count();
echo 'Catégories: ' . \App\Models\Category::count();
echo 'Produits en stock: ' . \App\Models\Product::where('quantity', '>', 0)->count();
echo 'Produits en rupture: ' . \App\Models\Product::where('quantity', '=', 0)->count();
'@

# Exécuter les statistiques
$statsCommands | docker exec -i laravel-app php artisan tinker

Write-Host ""

# Tester l'endpoint métriques
Write-Host "🔍 Test de l'endpoint métriques..." -ForegroundColor Yellow
try {
    $metrics = Invoke-WebRequest -Uri "http://localhost:8000/metrics" -UseBasicParsing
    $lines = $metrics.Content -split "`n"
    $lines[0..19] | ForEach-Object { Write-Host $_ }
    Write-Host "..."
} catch {
    Write-Host "⚠️  Impossible d'accéder à l'endpoint métriques" -ForegroundColor Yellow
}
Write-Host ""

Write-Host "==========================================" -ForegroundColor Green
Write-Host "  ✅ Données de Test Générées !" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Vous pouvez maintenant:" -ForegroundColor Cyan
Write-Host "  - Voir les métriques:  http://localhost:8000/metrics" -ForegroundColor White
Write-Host "  - Voir Prometheus:     http://localhost:9090" -ForegroundColor White
Write-Host "  - Voir Grafana:        http://localhost:3000" -ForegroundColor White
Write-Host "  - Voir les logs:       http://localhost:5601" -ForegroundColor White
Write-Host ""
Write-Host "💡 Astuce: Attendez 15-30 secondes pour que Prometheus collecte les métriques" -ForegroundColor Yellow
Write-Host ""
