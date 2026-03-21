# ⚡ Installation Rapide - 5 Minutes

## Étape 1 : Docker Desktop (si pas encore installé)

1. Télécharger : https://www.docker.com/products/docker-desktop
2. Installer et redémarrer l'ordinateur
3. Lancer Docker Desktop (attendre l'icône verte)

## Étape 2 : Vérifier Docker

```powershell
docker --version
docker-compose --version
```

## Étape 3 : Construire et démarrer

```powershell
# Construction (première fois seulement, ~5 minutes)
docker-compose build

# Démarrage
docker-compose up -d

# Installation des dépendances
docker-compose exec app composer install

# Configuration
docker-compose exec app php artisan key:generate

# Base de données
docker-compose exec app php artisan migrate
docker-compose exec app php artisan db:seed --class=CategorySeeder
```

## Étape 4 : Tester

Ouvrir dans le navigateur :
- API : http://localhost:8000
- phpMyAdmin : http://localhost:8080

## Étape 5 : Premier test API

```powershell
# Inscription
curl -X POST http://localhost:8000/api/register -H "Content-Type: application/json" -d "{\"name\":\"Test\",\"email\":\"test@test.com\",\"password\":\"password123\",\"password_confirmation\":\"password123\"}"

# Connexion (copier le token de la réponse)
curl -X POST http://localhost:8000/api/login -H "Content-Type: application/json" -d "{\"email\":\"test@test.com\",\"password\":\"password123\"}"

# Lister les catégories (remplacer YOUR_TOKEN)
curl http://localhost:8000/api/categories -H "Authorization: Bearer YOUR_TOKEN"
```

## ✅ C'est prêt !

- API disponible sur http://localhost:8000
- Documentation complète dans **API_COMPLETE.md**
- Guide Docker dans **DOCKER_GUIDE.md**

## 🛑 Arrêter l'application

```powershell
docker-compose down
```

## 🔄 Redémarrer

```powershell
docker-compose up -d
```
