# Script de démarrage du stack de monitoring pour Windows
# Usage: .\start-monitoring.ps1

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  Démarrage du Stack de Monitoring" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Vérifier que Docker est installé
try {
    docker --version | Out-Null
    Write-Host "✅ Docker est installé" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker n'est pas installé. Veuillez l'installer d'abord." -ForegroundColor Red
    exit 1
}

# Vérifier que Docker Compose est installé
try {
    docker-compose --version | Out-Null
    Write-Host "✅ Docker Compose est installé" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker Compose n'est pas installé. Veuillez l'installer d'abord." -ForegroundColor Red
    exit 1
}

Write-Host ""

# Configurer vm.max_map_count pour Elasticsearch (WSL2)
Write-Host "🔧 Configuration de vm.max_map_count pour Elasticsearch..." -ForegroundColor Yellow
try {
    wsl -d docker-desktop sysctl -w vm.max_map_count=262144
    Write-Host "✅ vm.max_map_count configuré" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Impossible de configurer vm.max_map_count automatiquement" -ForegroundColor Yellow
    Write-Host "   Si Elasticsearch ne démarre pas, exécutez manuellement:" -ForegroundColor Yellow
    Write-Host "   wsl -d docker-desktop" -ForegroundColor Yellow
    Write-Host "   sysctl -w vm.max_map_count=262144" -ForegroundColor Yellow
}

Write-Host ""

# Créer les dossiers nécessaires
Write-Host "📁 Création des dossiers de données..." -ForegroundColor Yellow
New-Item -ItemType Directory -Force -Path "elasticsearch\data" | Out-Null
New-Item -ItemType Directory -Force -Path "grafana\data" | Out-Null
New-Item -ItemType Directory -Force -Path "prometheus\data" | Out-Null
Write-Host "✅ Dossiers créés" -ForegroundColor Green

Write-Host ""

# Démarrer les services
Write-Host "🚀 Démarrage des services Docker..." -ForegroundColor Yellow
docker-compose up -d

Write-Host ""
Write-Host "⏳ Attente du démarrage des services (30 secondes)..." -ForegroundColor Yellow
Start-Sleep -Seconds 30

# Vérifier l'état des services
Write-Host ""
Write-Host "📊 État des services:" -ForegroundColor Cyan
docker-compose ps

Write-Host ""
Write-Host "==========================================" -ForegroundColor Green
Write-Host "  ✅ Stack de Monitoring Démarré !" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Accès aux services:" -ForegroundColor Cyan
Write-Host ""
Write-Host "  📱 Laravel API:        http://localhost:8000" -ForegroundColor White
Write-Host "  📊 Métriques:          http://localhost:8000/metrics" -ForegroundColor White
Write-Host "  🔍 Prometheus:         http://localhost:9090" -ForegroundColor White
Write-Host "  📈 Grafana:            http://localhost:3000" -ForegroundColor White
Write-Host "     └─ Login: admin / admin123" -ForegroundColor Gray
Write-Host "  📝 Kibana:             http://localhost:5601" -ForegroundColor White
Write-Host "  🗄️  phpMyAdmin:         http://localhost:8080" -ForegroundColor White
Write-Host ""
Write-Host "📚 Documentation:" -ForegroundColor Cyan
Write-Host "  - MONITORING_QUICKSTART.md : Démarrage rapide" -ForegroundColor White
Write-Host "  - MONITORING_GUIDE.md      : Guide complet" -ForegroundColor White
Write-Host "  - ALERTES_CONFIGURATION.md : Configuration des alertes" -ForegroundColor White
Write-Host ""
Write-Host "🔧 Commandes utiles:" -ForegroundColor Cyan
Write-Host "  - Voir les logs:       docker-compose logs -f" -ForegroundColor White
Write-Host "  - Arrêter:             docker-compose down" -ForegroundColor White
Write-Host "  - Redémarrer:          docker-compose restart" -ForegroundColor White
Write-Host ""
Write-Host "⚠️  Note: Kibana peut prendre 2-3 minutes pour être prêt" -ForegroundColor Yellow
Write-Host ""
