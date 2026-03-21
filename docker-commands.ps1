# Script PowerShell pour gérer Docker

param(
    [Parameter(Mandatory=$true)]
    [ValidateSet('build', 'up', 'down', 'restart', 'logs', 'shell', 'composer', 'artisan', 'migrate', 'seed', 'fresh')]
    [string]$Command,
    
    [Parameter(ValueFromRemainingArguments=$true)]
    [string[]]$Args
)

switch ($Command) {
    'build' {
        Write-Host "🔨 Construction des images Docker..." -ForegroundColor Cyan
        docker-compose build --no-cache
    }
    'up' {
        Write-Host "🚀 Démarrage des conteneurs..." -ForegroundColor Green
        docker-compose up -d
        Write-Host "✅ Application démarrée sur http://localhost:8000" -ForegroundColor Green
        Write-Host "✅ phpMyAdmin disponible sur http://localhost:8080" -ForegroundColor Green
    }
    'down' {
        Write-Host "🛑 Arrêt des conteneurs..." -ForegroundColor Yellow
        docker-compose down
    }
    'restart' {
        Write-Host "🔄 Redémarrage des conteneurs..." -ForegroundColor Cyan
        docker-compose restart
    }
    'logs' {
        Write-Host "📋 Affichage des logs..." -ForegroundColor Cyan
        docker-compose logs -f
    }
    'shell' {
        Write-Host "🐚 Connexion au conteneur..." -ForegroundColor Cyan
        docker-compose exec app bash
    }
    'composer' {
        Write-Host "📦 Exécution de Composer..." -ForegroundColor Cyan
        docker-compose exec app composer $Args
    }
    'artisan' {
        Write-Host "🎨 Exécution d'Artisan..." -ForegroundColor Cyan
        docker-compose exec app php artisan $Args
    }
    'migrate' {
        Write-Host "🗄️ Exécution des migrations..." -ForegroundColor Cyan
        docker-compose exec app php artisan migrate
    }
    'seed' {
        Write-Host "🌱 Exécution des seeders..." -ForegroundColor Cyan
        docker-compose exec app php artisan db:seed
    }
    'fresh' {
        Write-Host "🔄 Reset complet de la base de données..." -ForegroundColor Yellow
        docker-compose exec app php artisan migrate:fresh --seed
    }
}
