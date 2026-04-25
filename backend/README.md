# 🛍️ Gestion Produit API - Laravel 12

API REST complète pour la gestion de produits avec authentification, monitoring et CI/CD.

## 📋 Table des Matières

- [Fonctionnalités](#fonctionnalités)
- [Stack Technique](#stack-technique)
- [Installation Rapide](#installation-rapide)
- [Monitoring](#monitoring)
- [CI/CD](#cicd)
- [Documentation](#documentation)
- [Tests](#tests)

---

## ✨ Fonctionnalités

### API REST
- **Authentification** : Inscription, connexion, déconnexion (Laravel Sanctum)
- **Gestion des Produits** : CRUD complet avec filtres et recherche
- **Gestion des Catégories** : CRUD complet
- **Dashboard** : Statistiques globales
- **Autorisations** : Ownership des produits

### Monitoring Complet
- **Prometheus** : Collecte de métriques en temps réel
- **Grafana** : Dashboards de visualisation
- **ELK Stack** : Gestion centralisée des logs
- **Alertes** : Notifications automatiques

### CI/CD
- **GitHub Actions** : Pipeline automatisé
- **Tests** : 43 tests (unitaires + intégration)
- **Qualité** : PHPStan, Laravel Pint
- **Docker** : Déploiement automatique sur Docker Hub

---

## 🛠️ Stack Technique

### Backend
- **PHP** 8.2
- **Laravel** 12
- **MySQL** 8.0
- **Laravel Sanctum** (API Authentication)

### Monitoring
- **Prometheus** (Métriques)
- **Grafana** (Visualisation)
- **Elasticsearch** (Stockage logs)
- **Logstash** (Collecte logs)
- **Kibana** (Interface logs)
- **Node Exporter** (Métriques système)

### DevOps
- **Docker** & **Docker Compose**
- **GitHub Actions** (CI/CD)
- **PHPUnit** (Tests)
- **PHPStan** (Analyse statique)
- **Laravel Pint** (Style de code)

---

## 🚀 Installation Rapide

### Prérequis
- Docker & Docker Compose
- Git
- 4 GB RAM minimum

### Démarrage

```bash
# 1. Cloner le projet
git clone <repository-url>
cd learning_laravel_2

# 2. Copier le fichier .env
cp .env.example .env

# 3. Démarrer tous les services (API + Monitoring)
# Windows
.\start-monitoring.ps1

# Linux/Mac
chmod +x start-monitoring.sh
./start-monitoring.sh

# 4. Générer des données de test
# Windows
.\generate-test-data.ps1

# Linux/Mac
chmod +x generate-test-data.sh
./generate-test-data.sh
```

### Accès aux Services

| Service | URL | Credentials |
|---------|-----|-------------|
| **Laravel API** | http://localhost:8000 | - |
| **phpMyAdmin** | http://localhost:8080 | root / [DB_PASSWORD] |
| **Grafana** | http://localhost:3000 | admin / admin123 |
| **Prometheus** | http://localhost:9090 | - |
| **Kibana** | http://localhost:5601 | - |

---

## 📊 Monitoring

### Démarrage Rapide

```bash
# Démarrer le monitoring
./start-monitoring.sh  # ou .ps1 sur Windows

# Accéder à Grafana
http://localhost:3000
Login: admin / admin123
```

### Métriques Disponibles

- **Métriques Métier** : Utilisateurs, Produits, Catégories, Stock
- **Métriques Système** : CPU, RAM, Disque, Réseau
- **Métriques Performance** : Temps de réponse, Utilisation mémoire

### Documentation Monitoring

- **[MONITORING_ONEPAGE.md](MONITORING_ONEPAGE.md)** : Guide ultra-rapide (1 page)
- **[MONITORING_QUICKSTART.md](MONITORING_QUICKSTART.md)** : Démarrage rapide (5 min)
- **[MONITORING_GUIDE.md](MONITORING_GUIDE.md)** : Documentation complète
- **[ALERTES_CONFIGURATION.md](ALERTES_CONFIGURATION.md)** : Configuration des alertes
- **[LIVRABLES_MONITORING.md](LIVRABLES_MONITORING.md)** : Checklist des livrables

---

## 🔄 CI/CD

### Pipeline GitHub Actions

Le pipeline s'exécute automatiquement sur chaque push et comprend :

1. **Préparation** : Installation des dépendances
2. **Vérification du Style** : Laravel Pint
3. **Analyse de Sécurité** : PHPStan + Composer Audit
4. **Tests** : 43 tests (unitaires + intégration)
5. **Construction Docker** : Build et push sur Docker Hub

### Documentation CI/CD

- **[DOCUMENTATION_PIPELINE_CICD.md](DOCUMENTATION_PIPELINE_CICD.md)** : Documentation complète du pipeline

### Exécuter les Tests Localement

```bash
# Tous les tests
docker exec laravel-app php artisan test

# Tests unitaires uniquement
docker exec laravel-app php artisan test --testsuite=Unit

# Tests d'intégration uniquement
docker exec laravel-app php artisan test --testsuite=Feature

# Tests de monitoring
docker exec laravel-app php artisan test --filter=MonitoringTest
```

---

## 📚 Documentation

### Documentation Principale

| Document | Description |
|----------|-------------|
| **README.md** | Ce fichier - Vue d'ensemble du projet |
| **API_DOCUMENTATION.md** | Documentation complète de l'API |
| **INSTALLATION_RAPIDE.md** | Guide d'installation détaillé |
| **DOCKER_GUIDE.md** | Guide Docker complet |

### Documentation Monitoring

| Document | Description |
|----------|-------------|
| **MONITORING_ONEPAGE.md** | Guide ultra-rapide (1 page) |
| **MONITORING_QUICKSTART.md** | Démarrage rapide (5 min) |
| **MONITORING_GUIDE.md** | Documentation complète |
| **ALERTES_CONFIGURATION.md** | Configuration des alertes |
| **LIVRABLES_MONITORING.md** | Checklist des livrables |

### Documentation CI/CD

| Document | Description |
|----------|-------------|
| **DOCUMENTATION_PIPELINE_CICD.md** | Documentation complète du pipeline |
| **TESTS_README.md** | Documentation des tests |

---

## 🧪 Tests

### Couverture des Tests

- **Tests Unitaires** : 13 tests (Modèles, Relations, Validations)
- **Tests d'Intégration** : 30 tests (API, Authentification, Autorisations)
- **Tests de Monitoring** : 8 tests (Métriques, Logs, Performance)
- **Total** : 43 tests avec ~85% de couverture

### Exécuter les Tests

```bash
# Tous les tests
php artisan test

# Avec couverture
php artisan test --coverage

# Tests spécifiques
php artisan test --filter=ProductTest
php artisan test --filter=MonitoringTest
```

---

## 🔧 Commandes Utiles

### Docker

```bash
# Démarrer tous les services
docker-compose up -d

# Voir l'état des services
docker-compose ps

# Voir les logs
docker-compose logs -f

# Arrêter tous les services
docker-compose down

# Redémarrer un service
docker-compose restart app
```

### Laravel

```bash
# Accéder au conteneur
docker exec -it laravel-app bash

# Migrations
php artisan migrate
php artisan migrate:fresh --seed

# Cache
php artisan cache:clear
php artisan config:clear
php artisan view:clear

# Tests
php artisan test
```

### Monitoring

```bash
# Voir les métriques
curl http://localhost:8000/metrics

# Vérifier Prometheus
curl http://localhost:9090/-/healthy

# Vérifier Elasticsearch
curl http://localhost:9200/_cluster/health
```

---

## 📦 Structure du Projet

```
learning_laravel_2/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── ProductController.php
│   │   │   ├── CategoryController.php
│   │   │   ├── DashboardController.php
│   │   │   └── MetricsController.php
│   │   ├── Middleware/
│   │   └── Requests/
│   └── Models/
│       ├── User.php
│       ├── Product.php
│       └── Category.php
├── database/
│   ├── factories/
│   ├── migrations/
│   └── seeders/
├── tests/
│   ├── Unit/
│   └── Feature/
├── prometheus/
│   └── prometheus.yml
├── grafana/
│   └── provisioning/
├── logstash/
│   └── pipeline/
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── docker-compose.yml
└── Dockerfile
```

---

## 🐛 Dépannage

### Elasticsearch ne démarre pas

```bash
# Windows (WSL2)
wsl -d docker-desktop
sysctl -w vm.max_map_count=262144

# Linux/Mac
sudo sysctl -w vm.max_map_count=262144
```

### Kibana : "Server not ready"

Attendre 2-3 minutes que Elasticsearch soit complètement démarré.

### Prometheus ne collecte pas les métriques

```bash
# Vérifier l'endpoint
curl http://localhost:8000/metrics

# Vérifier les targets
http://localhost:9090/targets
```

---

## 🤝 Contribution

1. Fork le projet
2. Créer une branche (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

---

## 📄 Licence

Ce projet est sous licence MIT.

---

## 📞 Support

Pour toute question :
1. Consulter la documentation
2. Vérifier les logs : `docker-compose logs -f`
3. Ouvrir une issue sur GitHub

---

**Version** : 1.0.0  
**Dernière mise à jour** : 21 Mars 2026

---

## About Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling. Laravel takes the pain out of development by easing common tasks used in many web projects, such as:

- [Simple, fast routing engine](https://laravel.com/docs/routing).
- [Powerful dependency injection container](https://laravel.com/docs/container).
- Multiple back-ends for [session](https://laravel.com/docs/session) and [cache](https://laravel.com/docs/cache) storage.
- Expressive, intuitive [database ORM](https://laravel.com/docs/eloquent).
- Database agnostic [schema migrations](https://laravel.com/docs/migrations).
- [Robust background job processing](https://laravel.com/docs/queues).
- [Real-time event broadcasting](https://laravel.com/docs/broadcasting).

Laravel is accessible, powerful, and provides tools required for large, robust applications.

## Learning Laravel

Laravel has the most extensive and thorough [documentation](https://laravel.com/docs) and video tutorial library of all modern web application frameworks, making it a breeze to get started with the framework. You can also check out [Laravel Learn](https://laravel.com/learn), where you will be guided through building a modern Laravel application.

If you don't feel like reading, [Laracasts](https://laracasts.com) can help. Laracasts contains thousands of video tutorials on a range of topics including Laravel, modern PHP, unit testing, and JavaScript. Boost your skills by digging into our comprehensive video library.

## Laravel Sponsors

We would like to extend our thanks to the following sponsors for funding Laravel development. If you are interested in becoming a sponsor, please visit the [Laravel Partners program](https://partners.laravel.com).

### Premium Partners

- **[Vehikl](https://vehikl.com)**
- **[Tighten Co.](https://tighten.co)**
- **[Kirschbaum Development Group](https://kirschbaumdevelopment.com)**
- **[64 Robots](https://64robots.com)**
- **[Curotec](https://www.curotec.com/services/technologies/laravel)**
- **[DevSquad](https://devsquad.com/hire-laravel-developers)**
- **[Redberry](https://redberry.international/laravel-development)**
- **[Active Logic](https://activelogic.com)**

## Contributing

Thank you for considering contributing to the Laravel framework! The contribution guide can be found in the [Laravel documentation](https://laravel.com/docs/contributions).

## Code of Conduct

In order to ensure that the Laravel community is welcoming to all, please review and abide by the [Code of Conduct](https://laravel.com/docs/contributions#code-of-conduct).

## Security Vulnerabilities

If you discover a security vulnerability within Laravel, please send an e-mail to Taylor Otwell via [taylor@laravel.com](mailto:taylor@laravel.com). All security vulnerabilities will be promptly addressed.

## License

The Laravel framework is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).
