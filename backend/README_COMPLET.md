# 🚀 API Backend Laravel - Système de Gestion d'Inventaire

Application backend complète avec authentification, gestion de produits et catégories, déployable avec Docker.

---

## ✨ Fonctionnalités

✅ **Authentification complète**
- Inscription (Register)
- Connexion (Login)
- Déconnexion (Logout)
- Profil utilisateur (Me)
- Tokens API sécurisés (Laravel Sanctum)

✅ **Gestion des produits**
- CRUD complet (Create, Read, Update, Delete)
- Recherche par nom
- Filtres avancés (catégorie, prix, stock)
- Tri personnalisable
- Pagination
- Autorisation (seul le propriétaire peut modifier/supprimer)

✅ **Gestion des catégories**
- CRUD complet
- Relations avec les produits
- Compteur de produits par catégorie

✅ **Dashboard & Statistiques**
- Total des produits
- Valeur totale de l'inventaire
- Produits en rupture de stock
- Produits à faible stock
- Répartition par catégorie
- Top produits par valeur

✅ **Sécurité**
- Mots de passe hashés (bcrypt)
- Validation des données
- Protection CSRF
- Middleware d'authentification
- Autorisation basée sur la propriété

---

## 🛠️ Technologies

- **Framework** : Laravel 11
- **Base de données** : MySQL 8.0
- **Authentification** : Laravel Sanctum
- **Conteneurisation** : Docker & Docker Compose
- **Serveur web** : Nginx
- **PHP** : 8.2-FPM

---

## 📦 Installation

### Option 1 : Avec Docker (Recommandé)

#### 1. Installer Docker Desktop
- Télécharger : https://www.docker.com/products/docker-desktop
- Installer et redémarrer l'ordinateur
- Lancer Docker Desktop

#### 2. Construire et démarrer
```powershell
# Construction des images
.\docker-commands.ps1 build

# Démarrage des conteneurs
.\docker-commands.ps1 up

# Installation des dépendances
.\docker-commands.ps1 composer install

# Configuration
.\docker-commands.ps1 artisan key:generate

# Migrations et seeders
.\docker-commands.ps1 migrate
.\docker-commands.ps1 artisan db:seed --class=CategorySeeder
```

#### 3. Accéder à l'application
- API : http://localhost:8000
- phpMyAdmin : http://localhost:8080

### Option 2 : Installation locale

```bash
# Installer les dépendances
composer install

# Configurer l'environnement
cp .env.example .env
php artisan key:generate

# Configurer la base de données dans .env
# Puis exécuter les migrations
php artisan migrate
php artisan db:seed --class=CategorySeeder

# Démarrer le serveur
php artisan serve
```

---

## 📖 Documentation API

Voir le fichier **API_COMPLETE.md** pour la documentation complète des endpoints.

### Endpoints principaux

#### Authentification
- `POST /api/register` - Inscription
- `POST /api/login` - Connexion
- `POST /api/logout` - Déconnexion
- `GET /api/me` - Profil utilisateur

#### Produits
- `GET /api/products` - Liste (avec filtres)
- `POST /api/products` - Créer
- `GET /api/products/{id}` - Afficher
- `PUT /api/products/{id}` - Modifier
- `DELETE /api/products/{id}` - Supprimer

#### Catégories
- `GET /api/categories` - Liste
- `POST /api/categories` - Créer
- `GET /api/categories/{id}` - Afficher
- `PUT /api/categories/{id}` - Modifier
- `DELETE /api/categories/{id}` - Supprimer

#### Dashboard
- `GET /api/dashboard/stats` - Statistiques

---

## 🧪 Tests rapides

### 1. Inscription
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"password123","password_confirmation":"password123"}'
```

### 2. Connexion
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### 3. Lister les catégories
```bash
curl http://localhost:8000/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 🐳 Commandes Docker

```powershell
# Démarrer
.\docker-commands.ps1 up

# Arrêter
.\docker-commands.ps1 down

# Voir les logs
.\docker-commands.ps1 logs

# Accéder au shell
.\docker-commands.ps1 shell

# Exécuter Artisan
.\docker-commands.ps1 artisan migrate
.\docker-commands.ps1 artisan cache:clear

# Reset complet de la DB
.\docker-commands.ps1 fresh
```

---

## 📁 Structure du Projet

```
learning_laravel_2/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── ProductController.php
│   │   │   ├── CategoryController.php
│   │   │   └── DashboardController.php
│   │   └── Middleware/
│   └── Models/
│       ├── User.php
│       ├── Product.php
│       └── Category.php
├── database/
│   ├── migrations/
│   └── seeders/
│       ├── CategorySeeder.php
│       └── ProductSeeder.php
├── routes/
│   └── api.php
├── docker/
│   └── nginx/
│       └── default.conf
├── Dockerfile
├── docker-compose.yml
├── docker-commands.ps1
├── API_COMPLETE.md
├── DOCKER_GUIDE.md
└── README_COMPLET.md
```

---

## 🗄️ Base de Données

### Tables

**users**
- id, name, email, password, timestamps

**categories**
- id, name, slug, description, timestamps

**products**
- id, name, description, price, quantity, category_id, image, user_id, timestamps

**personal_access_tokens** (Sanctum)
- Gestion des tokens API

### Relations

- User → hasMany → Products
- Category → hasMany → Products
- Product → belongsTo → User
- Product → belongsTo → Category

---

## 🔒 Sécurité

- Authentification par tokens (Sanctum)
- Validation stricte des données
- Autorisation sur les ressources
- Mots de passe hashés
- Protection CSRF
- Middleware d'authentification

---

## 📚 Documentation

- **API_COMPLETE.md** - Documentation complète de l'API
- **DOCKER_GUIDE.md** - Guide de déploiement Docker
- **API_PRODUCTS.md** - Documentation initiale des produits

---

## 🚀 Déploiement en Production

### Checklist

- [ ] Changer `APP_ENV=production`
- [ ] Désactiver `APP_DEBUG=false`
- [ ] Changer tous les mots de passe
- [ ] Configurer HTTPS
- [ ] Optimiser l'application
  ```bash
  php artisan config:cache
  php artisan route:cache
  php artisan view:cache
  composer install --optimize-autoloader --no-dev
  ```
- [ ] Configurer les backups
- [ ] Mettre en place le monitoring
- [ ] Configurer les logs

---

## 🤝 Contribution

Ce projet est un exemple d'apprentissage. N'hésite pas à l'améliorer !

### Améliorations possibles

- Upload d'images réelles
- Gestion des rôles (admin, user)
- Historique des modifications
- Notifications
- Export des données (CSV, PDF)
- Tests automatisés
- Documentation Swagger/OpenAPI
- Rate limiting
- Cache avec Redis

---

## 📝 Licence

Ce projet est open source et disponible pour l'apprentissage.

---

## 👨‍💻 Auteur

Créé pour l'apprentissage de Laravel et Docker.

---

## 🆘 Support

En cas de problème :

1. Vérifier les logs : `.\docker-commands.ps1 logs`
2. Consulter **DOCKER_GUIDE.md** section Dépannage
3. Vérifier que Docker Desktop est lancé
4. Reconstruire les conteneurs : `docker-compose down -v && docker-compose up -d --build`

---

**Bon développement ! 🚀**
