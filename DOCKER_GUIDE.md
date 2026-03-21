# 🐳 Guide de Déploiement Docker - Laravel API

## 📋 Prérequis

### 1. Installation de Docker Desktop (Windows)

1. **Télécharger Docker Desktop**
   - Aller sur : https://www.docker.com/products/docker-desktop
   - Télécharger la version Windows
   - Taille : ~500 MB

2. **Installer Docker Desktop**
   - Double-cliquer sur l'installeur
   - Suivre les instructions
   - Activer WSL 2 si demandé
   - Redémarrer l'ordinateur

3. **Vérifier l'installation**
   ```powershell
   docker --version
   docker-compose --version
   ```

4. **Démarrer Docker Desktop**
   - Lancer l'application Docker Desktop
   - Attendre que l'icône Docker soit verte dans la barre des tâches

---

## 🚀 Déploiement de l'Application

### Méthode 1 : Avec le script PowerShell (Recommandé)

#### 1. Construction des images Docker
```powershell
.\docker-commands.ps1 build
```

#### 2. Démarrage des conteneurs
```powershell
.\docker-commands.ps1 up
```

#### 3. Installation des dépendances
```powershell
.\docker-commands.ps1 composer install
```

#### 4. Génération de la clé d'application
```powershell
.\docker-commands.ps1 artisan key:generate
```

#### 5. Exécution des migrations
```powershell
.\docker-commands.ps1 migrate
```

#### 6. Remplissage de la base de données
```powershell
.\docker-commands.ps1 seed
```

---

### Méthode 2 : Commandes Docker manuelles

#### 1. Construction des images
```powershell
docker-compose build --no-cache
```

#### 2. Démarrage des conteneurs
```powershell
docker-compose up -d
```

#### 3. Installation des dépendances
```powershell
docker-compose exec app composer install
```

#### 4. Génération de la clé
```powershell
docker-compose exec app php artisan key:generate
```

#### 5. Migrations
```powershell
docker-compose exec app php artisan migrate
```

#### 6. Seeders
```powershell
docker-compose exec app php artisan db:seed --class=CategorySeeder
```

---

## 🌐 Accès aux Services

Une fois les conteneurs démarrés :

- **API Laravel** : http://localhost:8000
- **phpMyAdmin** : http://localhost:8080
  - Serveur : `db`
  - Utilisateur : `laravel_user`
  - Mot de passe : `laravel_password`

---

## 📝 Commandes Utiles

### Avec le script PowerShell

```powershell
# Démarrer les conteneurs
.\docker-commands.ps1 up

# Arrêter les conteneurs
.\docker-commands.ps1 down

# Redémarrer les conteneurs
.\docker-commands.ps1 restart

# Voir les logs
.\docker-commands.ps1 logs

# Accéder au shell du conteneur
.\docker-commands.ps1 shell

# Exécuter Composer
.\docker-commands.ps1 composer install
.\docker-commands.ps1 composer update

# Exécuter Artisan
.\docker-commands.ps1 artisan migrate
.\docker-commands.ps1 artisan db:seed
.\docker-commands.ps1 artisan cache:clear

# Reset complet de la DB
.\docker-commands.ps1 fresh
```

### Commandes Docker directes

```powershell
# Voir les conteneurs actifs
docker ps

# Voir tous les conteneurs
docker ps -a

# Voir les logs d'un conteneur
docker logs laravel-app
docker logs laravel-nginx
docker logs laravel-db

# Accéder au shell
docker-compose exec app bash

# Exécuter des commandes Artisan
docker-compose exec app php artisan migrate
docker-compose exec app php artisan db:seed
docker-compose exec app php artisan cache:clear
docker-compose exec app php artisan config:clear

# Exécuter Composer
docker-compose exec app composer install
docker-compose exec app composer update
docker-compose exec app composer dump-autoload

# Arrêter et supprimer tout
docker-compose down -v
```

---

## 🧪 Tester l'API

### 1. Créer un utilisateur
```powershell
curl -X POST http://localhost:8000/api/register `
  -H "Content-Type: application/json" `
  -d '{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\",\"password_confirmation\":\"password123\"}'
```

### 2. Se connecter
```powershell
curl -X POST http://localhost:8000/api/login `
  -H "Content-Type: application/json" `
  -d '{\"email\":\"john@example.com\",\"password\":\"password123\"}'
```

### 3. Lister les catégories
```powershell
curl http://localhost:8000/api/categories `
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🏗️ Architecture Docker

### Services déployés :

1. **app** (PHP 8.2-FPM)
   - Application Laravel
   - Port interne : 9000

2. **nginx** (Nginx Alpine)
   - Serveur web
   - Port : 8000 → 80

3. **db** (MySQL 8.0)
   - Base de données
   - Port : 3306
   - Volume persistant : `dbdata`

4. **phpmyadmin**
   - Interface de gestion MySQL
   - Port : 8080

### Volumes :

- `./:/var/www` - Code source de l'application
- `./docker/nginx:/etc/nginx/conf.d` - Configuration Nginx
- `dbdata:/var/lib/mysql` - Données MySQL persistantes

---

## 🔧 Configuration

### Variables d'environnement (.env)

```env
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=learning_laravel_2
DB_USERNAME=laravel_user
DB_PASSWORD=laravel_password
```

### Modifier la configuration

1. Éditer le fichier `.env`
2. Redémarrer les conteneurs :
   ```powershell
   .\docker-commands.ps1 restart
   ```

---

## 🐛 Dépannage

### Les conteneurs ne démarrent pas

```powershell
# Voir les logs
docker-compose logs

# Reconstruire les images
docker-compose build --no-cache
docker-compose up -d
```

### Erreur de connexion à la base de données

```powershell
# Vérifier que le conteneur MySQL est actif
docker ps

# Voir les logs MySQL
docker logs laravel-db

# Attendre que MySQL soit prêt (peut prendre 30-60 secondes)
```

### Erreur de permissions

```powershell
# Donner les permissions sur storage et bootstrap/cache
docker-compose exec app chmod -R 777 storage bootstrap/cache
```

### Reset complet

```powershell
# Arrêter et supprimer tout
docker-compose down -v

# Reconstruire
docker-compose build --no-cache

# Redémarrer
docker-compose up -d

# Réinstaller
docker-compose exec app composer install
docker-compose exec app php artisan key:generate
docker-compose exec app php artisan migrate:fresh --seed
```

---

## 📊 Monitoring

### Voir l'utilisation des ressources
```powershell
docker stats
```

### Voir les logs en temps réel
```powershell
docker-compose logs -f
```

### Inspecter un conteneur
```powershell
docker inspect laravel-app
```

---

## 🛑 Arrêt de l'Application

### Arrêt simple
```powershell
.\docker-commands.ps1 down
```

### Arrêt avec suppression des volumes
```powershell
docker-compose down -v
```

---

## 🚀 Déploiement en Production

Pour un déploiement en production, considère :

1. **Sécurité**
   - Changer les mots de passe
   - Désactiver le debug (`APP_DEBUG=false`)
   - Utiliser HTTPS
   - Configurer un firewall

2. **Performance**
   - Activer le cache (`php artisan config:cache`)
   - Optimiser Composer (`composer install --optimize-autoloader --no-dev`)
   - Utiliser Redis pour le cache et les sessions

3. **Monitoring**
   - Configurer les logs
   - Mettre en place des alertes
   - Utiliser un service de monitoring (New Relic, Datadog)

4. **Backup**
   - Sauvegarder régulièrement la base de données
   - Sauvegarder les fichiers uploadés

---

## 📚 Ressources

- [Documentation Docker](https://docs.docker.com/)
- [Documentation Laravel](https://laravel.com/docs)
- [Docker Compose](https://docs.docker.com/compose/)
- [Laravel Sail](https://laravel.com/docs/sail) (alternative officielle)
