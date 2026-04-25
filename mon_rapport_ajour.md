# RAPPORT TECHNIQUE — GESTION PRODUITS AVEC PIPELINE CI/CD

---

## Informations générales

| Champ | Valeur |
|---|---|
| **Projet** | Gestion Produits avec Pipeline CI/CD (StockPro) |
| **Dépôt GitHub** | github.com/Ngokeng-Rayan/Gestion-produits-avec-pipeline |
| **Étudiant** | NGOKENG FOFACK Rayan |
| **Filière / Classe** | CDWFS — Semestre 6 |
| **Enseignant** | Dr NKONJOH NGOMADE Armel |
| **Année académique** | 2025/2026 |
| **Stack backend** | Laravel 12 · PHP 8.2 · MySQL 8.0 |
| **Stack frontend** | React 19 · TypeScript · Vite 6 |
| **CI/CD** | GitHub Actions (7 jobs) |
| **Déploiement** | o2switch (FTP) + Docker Hub |
| **Observabilité** | Prometheus · Grafana · Alertmanager · ELK Stack |
| **Qualité** | SonarCloud · PHPStan (Larastan) · Laravel Pint |
| **URL de production** | https://ngokeng.cdwfs.net |

---

## I. Présentation du projet

### 1.1 Contexte et objectif

StockPro est une application web fullstack de gestion d'inventaire (produits et catégories) développée dans le cadre du projet CI/CD. Elle expose une API REST Laravel consommée par une interface React/TypeScript. L'objectif principal est de démontrer la maîtrise d'une chaîne DevOps complète : intégration continue, déploiement continu, conteneurisation, monitoring et centralisation des logs.

### 1.2 Architecture globale

```
┌─────────────────────────────────────────────────────────────────┐
│  DÉVELOPPEUR  ──push──►  GitHub  ──trigger──►  GitHub Actions   │
└─────────────────────────────────────────────────────────────────┘
                                                        │
              ┌─────────────────────────────────────────┤
              │                                         │
              ▼                                         ▼
     ┌─────────────────┐                    ┌──────────────────────┐
     │  Docker Hub     │                    │  o2switch (prod)     │
     │  (image:latest) │                    │  ngokeng.cdwfs.net   │
     └─────────────────┘                    └──────────────────────┘
                                                        │
         ┌────────────────────────────────────────────────────────┐
         │              STACK LOCAL / DOCKER COMPOSE              │
         │                                                        │
         │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
         │  │  app     │  │  nginx   │  │ frontend  │            │
         │  │ (PHP-FPM)│  │ :8000    │  │  :5173   │            │
         │  └──────────┘  └──────────┘  └──────────┘            │
         │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
         │  │  MySQL   │  │ phpmyadm.│  │Prometheus│            │
         │  │  :3307   │  │  :8080   │  │  :9090   │            │
         │  └──────────┘  └──────────┘  └──────────┘            │
         │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
         │  │  Grafana │  │Alertmgr  │  │Node-Exp. │            │
         │  │  :3000   │  │  :9093   │  │  :9100   │            │
         │  └──────────┘  └──────────┘  └──────────┘            │
         │  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
         │  │Elasticsr.│  │ Logstash │  │  Kibana  │            │
         │  │  :9200   │  │  :5000   │  │  :5601   │            │
         │  └──────────┘  └──────────┘  └──────────┘            │
         └────────────────────────────────────────────────────────┘
```

### 1.3 Stack technique détaillée

| Composant | Technologie | Version | Rôle |
|---|---|---|---|
| Backend | Laravel + PHP | 12.x / 8.2 | API REST, logique métier, exposition des métriques |
| Frontend | React + TypeScript + Vite | 19 / 5.7 / 6.3 | Interface de gestion (SPA) |
| Base de données | MySQL | 8.0 | Stockage des produits, catégories, utilisateurs |
| Auth | Laravel Sanctum | 4.0 | Tokens API stateless |
| Proxy | Nginx (Alpine) | latest | Reverse proxy vers PHP-FPM |
| Conteneurs | Docker + Docker Compose | — | Isolation de tous les services |
| CI/CD | GitHub Actions | — | Automatisation complète |
| Registry | Docker Hub | — | Stockage des images Docker |
| Déploiement | FTP-Deploy-Action | v4.3.5 | Push vers o2switch |
| Métriques | Prometheus | latest | Scrape /metrics toutes les 10-15s |
| Visualisation | Grafana | latest | Dashboards opérationnels |
| Alertes | Alertmanager | latest | Notifications email (Gmail SMTP) |
| Métr. système | Node Exporter | latest | CPU, RAM, disque, réseau |
| Logs | ELK Stack | 8.11.0 | Centralisation et visualisation des logs |
| Qualité | SonarCloud | — | Analyse statique, couverture, duplication |
| Analyse PHP | PHPStan/Larastan | level 5 | Analyse statique du backend |
| Style PHP | Laravel Pint | latest | Conformité PSR-12 |

---

## II. Structure du projet

### 2.1 Arborescence principale

```
learning_laravel_2/
├── .github/
│   └── workflows/
│       └── ci-cd.yml              ← Pipeline GitHub Actions (7 jobs)
├── backend/
│   ├── app/
│   │   ├── Http/Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── CategoryController.php
│   │   │   ├── DashboardController.php
│   │   │   ├── MetricsController.php  ← Expose /metrics pour Prometheus
│   │   │   └── ProductController.php
│   │   └── Models/
│   │       ├── Category.php
│   │       ├── Product.php
│   │       └── User.php
│   ├── tests/
│   │   ├── Feature/
│   │   │   ├── AuthTest.php        ← 6 tests d'authentification
│   │   │   ├── CategoryTest.php    ← CRUD catégories
│   │   │   ├── DashboardTest.php   ← Stats tableau de bord
│   │   │   ├── MonitoringTest.php  ← Tests endpoint /metrics
│   │   │   └── ProductTest.php     ← CRUD produits + pagination
│   │   └── Unit/
│   │       ├── CategoryTest.php
│   │       ├── ProductTest.php
│   │       └── UserTest.php
│   ├── alertmanager/
│   │   └── alertmanager.yml        ← Config alertes email
│   ├── grafana/provisioning/       ← Auto-provisioning datasources
│   ├── logstash/pipeline/
│   │   └── logstash.conf           ← Pipeline Logstash
│   ├── prometheus/
│   │   ├── prometheus.yml          ← Config scraping
│   │   └── alerts/
│   │       └── laravel-alerts.yml  ← 11 règles d'alerte
│   ├── docker/nginx/default.conf   ← Config Nginx
│   ├── Dockerfile                  ← Multi-stage build
│   ├── phpstan.neon                ← Config analyse statique
│   └── phpunit.xml                 ← Config tests
├── frontend/
│   ├── src/
│   │   ├── App.tsx                 ← Routing (ProtectedRoute/GuestRoute)
│   │   ├── components/
│   │   │   ├── Layout.tsx          ← Sidebar + topbar
│   │   │   ├── ProtectedRoute.tsx
│   │   │   ├── ConfirmModal.tsx    ← Modale confirmation réutilisable
│   │   │   └── ModalWrapper.tsx    ← Wrapper overlay modal
│   │   ├── context/
│   │   │   └── AuthContext.tsx     ← Gestion état auth (useMemo)
│   │   ├── pages/
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── CategoriesPage.tsx
│   │   │   └── ProductsPage.tsx
│   │   └── api/
│   │       ├── client.ts           ← Axios configuré
│   │       └── inventory.ts        ← Appels API
│   └── package.json
├── docker-compose.yml              ← Orchestration 9 services
└── sonar-project.properties        ← Config SonarCloud
```

### 2.2 API REST — Routes backend

```
POST   /api/register          ← Inscription (public)
POST   /api/login             ← Connexion (public)
GET    /metrics               ← Métriques Prometheus (public)

── Protégées par Sanctum ──────────────────────────────────
POST   /api/logout
GET    /api/me
GET    /api/dashboard/stats

GET|POST          /api/products
GET|PUT|DELETE    /api/products/{id}
GET|POST          /api/categories
GET|PUT|DELETE    /api/categories/{id}
```

---

## III. Partie 1 — Pipeline CI/CD

### 3.1 Déclencheurs

```yaml
on:
  push:
    branches: [ main, develop, 'feature/**' ]
  pull_request:
    branches: [ main, develop ]
```

Le pipeline se déclenche sur tout push vers `main`, `develop` ou une branche `feature/*`, ainsi que sur les pull requests vers `main` ou `develop`.

### 3.2 Vue d'ensemble des 7 jobs

```
backend-ci ──┐
             ├──► docker-build    ──► (Docker Hub)
frontend-ci ─┤
             ├──► deploy-frontend ──► (o2switch FTP)
             ├──► deploy-backend  ──► (o2switch FTP)
             ├──► sonarcloud      ──► (SonarCloud scan + coverage)
             │
             └──► (deploy-frontend + deploy-backend) ──► healthcheck
```

Les jobs `docker-build`, `deploy-frontend`, `deploy-backend` et `healthcheck` ne s'exécutent que sur la branche `main` lors d'un `push`.

### 3.3 Job 1 — Backend CI (`backend-ci`)

**Service MySQL éphémère :**
```yaml
services:
  mysql:
    image: mysql:8.0
    env:
      MYSQL_DATABASE: testing_db
      MYSQL_USER: testing_user
      MYSQL_PASSWORD: testing_password
    ports: ["3306:3306"]
    options: --health-cmd="mysqladmin ping"
```

**Étapes dans l'ordre :**

| Étape | Outil | Rôle | Continue on error |
|---|---|---|---|
| Setup PHP 8.2 | shivammathur/setup-php | Extensions + Composer v2 | Non |
| Cache Composer | actions/cache | Accélérer les builds | Non |
| Install deps | `composer install --prefer-dist` | Dépendances PHP | Non |
| Lint | `php vendor/bin/pint --test` | Style PSR-12 | Oui |
| Analyse statique | `php vendor/bin/phpstan --memory-limit=2G` | Larastan level 5 | Oui |
| Audit sécurité | `composer audit` | Vulnérabilités dépendances | Oui |
| Préparer .env | Génération APP_KEY + SQLite | Environnement de test | Non |
| Migrations SQLite | `php artisan migrate` | Schéma de test rapide | Non |
| Tests unitaires | `php artisan test --testsuite=Unit` | Sur SQLite | Non |
| Migrations MySQL | `php artisan migrate` | Base réaliste | Non |
| Seed MySQL | `php artisan db:seed` | Données de test | Non |
| Tests Feature | `php artisan test --testsuite=Feature --exclude-group=monitoring` | Sur MySQL | Non |
| Upload logs | actions/upload-artifact (en cas d'échec) | Diagnostic | Sur failure |

**PHPStan configuration (`phpstan.neon`) :**
```neon
includes:
    - vendor/larastan/larastan/extension.neon
parameters:
    paths: [app, routes, config, database]
    level: 5
    checkMissingIterableValueType: false
```

### 3.4 Job 2 — Frontend CI (`frontend-ci`)

```yaml
- name: Setup Node.js 20
  uses: actions/setup-node@v4
  with:
    node-version: '20'
    cache: 'npm'
    cache-dependency-path: frontend/package-lock.json

- name: Install dependencies
  working-directory: frontend
  run: npm ci

- name: TypeScript check + Build
  working-directory: frontend
  run: npm run build   # tsc && vite build

- name: Upload build artifact
  uses: actions/upload-artifact@v4
  with:
    name: frontend-dist-${{ github.sha }}
    path: frontend/dist/
    retention-days: 7
```

La commande `npm run build` exécute `tsc && vite build`, ce qui vérifie les types TypeScript ET produit le bundle de production.

### 3.5 Job 3 — Docker Build & Push (`docker-build`)

```yaml
needs: [backend-ci, frontend-ci]
if: github.ref == 'refs/heads/main' && github.event_name == 'push'
```

**Dockerfile multi-stage (backend) :**

```dockerfile
# Stage 1 — Build des dépendances Composer
FROM composer:latest AS composer-builder
WORKDIR /app
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist
COPY . .
RUN composer dump-autoload --optimize --no-dev

# Stage 2 — Image de production PHP-FPM
FROM php:8.2-fpm
ARG user=laravel
ARG uid=1000
RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev libzip-dev \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip
RUN useradd -G www-data,root -u $uid -d /home/$user $user
WORKDIR /var/www
COPY --from=composer-builder --chown=$user:$user /app /var/www
RUN chown -R $user:www-data /var/www/storage /var/www/bootstrap/cache \
    && chmod -R 775 /var/www/storage /var/www/bootstrap/cache
USER $user
EXPOSE 9000
CMD ["php-fpm"]
```

Le build multi-stage réduit la taille de l'image finale en excluant Composer et les dépendances de build. Les tags générés sont : `sha`, `latest` et `v{date}`.

### 3.6 Job 4 — Déploiement Frontend (`deploy-frontend`)

```yaml
needs: [backend-ci, frontend-ci]
if: github.ref == 'refs/heads/main' && github.event_name == 'push'
```

Étapes :
1. Build du frontend avec `VITE_API_BASEURL=https://ngokeng.cdwfs.net/api`
2. Déploiement du dossier `frontend/dist/` vers o2switch via FTP-Deploy-Action

### 3.7 Job 5 — Déploiement Backend (`deploy-backend`)

1. Génération du `.env` de production à partir des **GitHub Secrets** (`APP_KEY`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`)
2. Push du dossier `backend/` vers o2switch via FTP, en excluant `vendor/`, `node_modules/`, `.git/`

Secrets utilisés :
- `APP_KEY`, `DB_DATABASE`, `DB_USERNAME`, `DB_PASSWORD`
- `O2SWITCH_FTP_HOST`, `O2SWITCH_FTP_USER`, `O2SWITCH_FTP_PASSWORD`
- `O2SWITCH_FRONTEND_FTP_PATH`, `O2SWITCH_BACKEND_FTP_PATH`
- `DOCKER_USERNAME`, `DOCKER_PASSWORD`
- `SONAR_TOKEN`

### 3.8 Job 6 — SonarCloud avec couverture PHP (`sonarcloud`)

Ce job génère la couverture de code PHP **avant** le scan SonarCloud, afin d'alimenter la métrique Coverage.

```yaml
# 1. Setup PHP avec PCOV (driver de couverture rapide)
- name: Setup PHP avec PCOV
  uses: shivammathur/setup-php@v2
  with:
    php-version: '8.2'
    coverage: pcov    # PCOV plus rapide que Xdebug

# 2. Installer les dépendances
- run: composer install --prefer-dist --no-interaction

# 3. Préparer .env SQLite
- run: |
    printf '...' > .env
    php artisan key:generate

# 4. Générer le rapport Clover XML
- name: Générer la couverture PHP
  continue-on-error: true
  run: |
    touch database/database.sqlite
    php artisan migrate --force
    php artisan test --coverage-clover=coverage.xml --exclude-group=monitoring

# 5. Scan SonarCloud (lit le rapport coverage.xml)
- uses: SonarSource/sonarcloud-github-action@master
```

**Configuration `sonar-project.properties` :**
```properties
sonar.organization=ngokeng-rayan
sonar.projectKey=Ngokeng-Rayan_Gestion-produits-avec-pipeline
sonar.projectName=Gestion Produits Pipeline

sonar.sources=backend/app,backend/routes,frontend/src
sonar.tests=backend/tests
sonar.exclusions=backend/vendor/**,backend/storage/**,frontend/node_modules/**,frontend/dist/**

sonar.php.coverage.reportPaths=backend/coverage.xml
sonar.coverage.exclusions=backend/database/**,backend/config/**,backend/resources/**,backend/routes/**,frontend/**
```

Le frontend TypeScript est exclu du calcul de couverture car il n'a pas de tests unitaires.

### 3.9 Job 7 — Healthcheck (`healthcheck`)

```yaml
needs: [deploy-frontend, deploy-backend]
if: github.ref == 'refs/heads/main' && github.event_name == 'push'
```

Après 30 secondes d'attente post-déploiement :
1. Vérification que le frontend répond HTTP 200/301/302 sur `https://ngokeng.cdwfs.net`
2. Vérification que l'API backend répond (code non-nul) sur `POST /api/login`

### 3.10 Stratégie de gestion des branches (GitHub Flow)

| Branche | Rôle | Déclenche CI | Déclenche CD |
|---|---|---|---|
| `main` | Production | ✅ | ✅ |
| `develop` | Intégration | ✅ | ❌ |
| `feature/**` | Nouvelles fonctionnalités | ✅ | ❌ |

Convention de commits : `feat:`, `fix:`, `ci:`, `docs:`, `refactor:`

---

## IV. Conteneurisation Docker

### 4.1 Docker Compose — 9 services

Le fichier `docker-compose.yml` orchestre l'ensemble de la stack sur un seul hôte :

```yaml
services:
  app:          # PHP-FPM 8.2 (Laravel)       — build depuis Dockerfile
  nginx:        # Reverse proxy                — port 8000:80
  frontend:     # Node 20 Alpine (React/Vite)  — port 5173:5173
  db:           # MySQL 8.0                    — port 3307:3306
  phpmyadmin:   # Interface MySQL              — port 8080:80
  alertmanager: # Gestion des alertes          — port 9093:9093
  prometheus:   # Collecte des métriques       — port 9090:9090
  grafana:      # Visualisation                — port 3000:3000
  node-exporter:# Métriques système            — port 9100:9100
  elasticsearch:# Stockage logs               — port 9200:9200
  logstash:     # Transformation logs          — port 5000:5000
  kibana:       # Visualisation logs           — port 5601:5601
```

**Volumes persistants :**
- `dbdata` — données MySQL
- `prometheus-data` — séries temporelles Prometheus
- `grafana-data` — dashboards Grafana
- `alertmanager-data` — état Alertmanager
- `elasticsearch-data` — index de logs

**Configuration Nginx (`docker/nginx/default.conf`) :**
```nginx
server {
    listen 80;
    root /var/www/public;
    location ~ \.php$ {
        fastcgi_pass app:9000;    # Redirection vers PHP-FPM
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
    location / {
        try_files $uri $uri/ /index.php?$query_string;
        gzip_static on;
    }
}
```

---

## V. Tests

### 5.1 Architecture des tests

Les tests sont organisés en deux suites distinctes (`phpunit.xml`) :
- **Unit** — SQLite en mémoire (`:memory:`), rapides
- **Feature** — SQLite (CI rapide) ou MySQL (CI complète), avec `RefreshDatabase`

### 5.2 Tests Feature

**AuthTest (6 tests) :**
```php
✓ test_user_can_register                          → POST /api/register → 201
✓ test_user_cannot_register_with_existing_email   → 422 + validation
✓ test_user_cannot_register_with_invalid_password → 422 + validation
✓ test_user_can_login_with_valid_credentials      → POST /api/login → 200 + token
✓ test_user_cannot_login_with_invalid_credentials → 422
✓ test_authenticated_user_can_logout              → POST /api/logout → 200
✓ test_authenticated_user_can_get_profile         → GET /api/me → 200
✓ test_unauthenticated_user_cannot_access_routes  → 401
```

**ProductTest** — CRUD complet avec pagination, filtres (catégorie, stock, prix, tri)

**CategoryTest** — CRUD avec vérification de l'unicité du slug

**DashboardTest** — Vérification des statistiques agrégées

**MonitoringTest (`@group monitoring`)** — Tests de l'endpoint `/metrics` :
- Accessibilité (HTTP 200, Content-Type `text/plain; version=0.0.4`)
- Présence des métriques attendues (`laravel_products_total`, `laravel_users_total`, etc.)
- Ce groupe est exclu des jobs CI classiques (`--exclude-group=monitoring`)

### 5.3 Tests Unit

```
Unit/UserTest.php      → Attributs du modèle, mot de passe hashé, tokens
Unit/ProductTest.php   → Attributs, relations, calculs de stock
Unit/CategoryTest.php  → Attributs, slug, relation produits
```

---

## VI. Partie 2 — Monitoring & Observabilité

### 6.1 Métriques applicatives — MetricsController

L'endpoint `GET /metrics` expose les données au format texte Prometheus (Exposition Format 0.0.4). Ce contrôleur est appelé par Prometheus toutes les 10 secondes.

**Métriques exposées :**

| Métrique | Type | Description |
|---|---|---|
| `laravel_users_total` | gauge | Nombre d'utilisateurs |
| `laravel_products_total` | gauge | Nombre de produits |
| `laravel_categories_total` | gauge | Nombre de catégories |
| `laravel_products_in_stock` | gauge | Produits avec stock > 0 |
| `laravel_products_out_of_stock` | gauge | Produits en rupture |
| `laravel_stock_value_total` | gauge | Valeur totale stock (price × quantity) |
| `laravel_products_avg_price` | gauge | Prix moyen |
| `laravel_products_avg_quantity` | gauge | Quantité moyenne |
| `laravel_products_by_category` | gauge | Produits par catégorie (label: category_id) |
| `laravel_database_size_bytes` | gauge | Taille DB (information_schema) |
| `laravel_version` | gauge | Version Laravel (label: version) |
| `laravel_environment` | gauge | Environnement (label: env) |
| `laravel_debug_mode` | gauge | Debug activé (1) ou non (0) |
| `laravel_request_duration_seconds` | gauge | Durée de génération des métriques |
| `laravel_memory_usage_bytes` | gauge | RAM utilisée |
| `laravel_memory_peak_bytes` | gauge | Pic RAM |
| `laravel_http_requests_total` | counter | Total requêtes HTTP (depuis cache) |
| `laravel_http_errors_4xx` | counter | Erreurs client |
| `laravel_http_errors_5xx` | counter | Erreurs serveur |
| `laravel_http_error_rate` | gauge | Taux d'erreur (%) |
| `laravel_response_time_avg_seconds` | gauge | Temps de réponse moyen |
| `laravel_response_time_max_seconds` | gauge | Temps de réponse maximum |

### 6.2 Configuration Prometheus (`prometheus.yml`)

```yaml
global:
  scrape_interval: 15s
  evaluation_interval: 15s
  external_labels:
    monitor: 'laravel-api-monitor'
    environment: 'production'

alerting:
  alertmanagers:
    - static_configs:
        - targets: ['alertmanager:9093']

rule_files:
  - "alerts/*.yml"

scrape_configs:
  # Prometheus lui-même
  - job_name: 'prometheus'
    static_configs:
      - targets: ['localhost:9090']

  # API Laravel — scrape toutes les 10s
  - job_name: 'laravel-api-local'
    scrape_interval: 10s
    metrics_path: '/metrics'
    static_configs:
      - targets: ['host.docker.internal:8000']
        labels:
          service: 'laravel-api'
          environment: 'local'

  # Node Exporter — métriques système
  - job_name: 'node-exporter'
    static_configs:
      - targets: ['node-exporter:9100']
        labels:
          service: 'system'
          instance: 'laravel-server'
```

**Node Exporter** expose les métriques système avec les collectors suivants : `processes`, `tcpstat`, `interrupts`, `network_route`, `ntp`, `buddyinfo`, `sockstat`, `vmstat`, `pressure`, `cpu.info`.

### 6.3 Règles d'alerte (`laravel-alerts.yml`) — 11 règles

**Groupe système (`system_alerts`) :**

| Alerte | Expression PromQL | Seuil | Durée | Sévérité |
|---|---|---|---|---|
| `HighCPUUsage` | `100 - avg(rate(node_cpu_seconds_total{mode="idle"}[5m])) * 100` | > 85% | 2 min | warning |
| `CriticalCPUUsage` | idem | > 95% | 1 min | critical |
| `HighMemoryUsage` | `(1 - MemAvailable/MemTotal) * 100` | > 90% | 2 min | warning |
| `CriticalMemoryUsage` | idem | > 95% | 1 min | critical |

**Groupe application (`laravel_alerts`) :**

| Alerte | Expression PromQL | Seuil | Durée | Sévérité |
|---|---|---|---|---|
| `LaravelAPIDown` | `up{job="laravel-api-local"} == 0` | — | 1 min | critical |
| `HighStockOutage` | `laravel_products_out_of_stock` | > 10 | 5 min | warning |
| `CriticalStockOutage` | idem | > 20 | 2 min | critical |
| `SlowResponseTime` | `laravel_response_time_avg_seconds` | > 2s | 3 min | warning |
| `CriticalResponseTime` | idem | > 5s | 1 min | critical |
| `DebugModeEnabled` | `laravel_debug_mode == 1` | — | 5 min | warning |
| `LargeDatabaseSize` | `laravel_database_size_bytes` | > 10 Go | 10 min | info |

**Groupe Prometheus (`prometheus_alerts`) :**

| Alerte | Expression PromQL | Sévérité |
|---|---|---|
| `PrometheusScrapeFailing` | `up{job="laravel-api-local"} == 0` | warning |
| `PrometheusHighLoad` | `rate(prometheus_engine_query_duration_seconds_sum[5m]) > 0.5` | warning |

### 6.4 Configuration Alertmanager (`alertmanager.yml`)

```yaml
global:
  smtp_smarthost: 'smtp.gmail.com:587'
  smtp_from: 'naassarl98@gmail.com'
  smtp_require_tls: true

route:
  group_by: ['alertname', 'category', 'severity']
  group_wait: 30s
  group_interval: 5m
  repeat_interval: 4h
  receiver: 'email-rayan'
  routes:
    - match: { severity: critical }
      receiver: 'email-rayan-critical'
      group_wait: 10s       # Envoi quasi-immédiat
      repeat_interval: 1h
    - match: { severity: warning }
      group_wait: 30s
      repeat_interval: 4h
    - match: { severity: info }
      group_wait: 1h
      repeat_interval: 24h
```

**Deux receivers :**
- `email-rayan` — template HTML bleu pour warnings (fond `#f9f9f9`, header `#3498db`)
- `email-rayan-critical` — template HTML rouge avec bandeau `INTERVENTION URGENTE NÉCESSAIRE` (header `#e74c3c`)

**Règle d'inhibition :** si une alerte `critical` est active, l'alerte `warning` du même `alertname` et `category` est supprimée pour éviter les doublons.

### 6.5 Grafana — Dashboards

Grafana est configuré avec provisioning automatique depuis `backend/grafana/provisioning/`. Les dashboards opérationnels incluent :

**Dashboard Opérationnel (équipe technique) :**
- Jauge taux d'erreur HTTP (seuil 5% → alerte)
- Courbe temps de réponse moyen (ms)
- Compteurs produits en stock / rupture
- Utilisation CPU et RAM (depuis Node Exporter)
- Taille de la base de données

**Dashboard Métier (KPIs) :**
- Nombre total de produits et catégories
- Valeur totale du stock (price × quantity)
- Prix moyen des produits
- Répartition produits par catégorie

---

## VII. Partie 2 — Centralisation des logs (ELK Stack)

### 7.1 Architecture ELK

```
Application Laravel
       │
       ▼
[Fichiers de logs]        [TCP/UDP port 5000]
/var/www/storage/logs/    (logs en temps réel)
laravel*.log
       │                          │
       └──────────┬───────────────┘
                  ▼
           ┌─────────────┐
           │   LOGSTASH  │
           │  (parser,   │
           │  transform) │
           └──────┬──────┘
                  ▼
         ┌──────────────────┐
         │  ELASTICSEARCH   │
         │ laravel-logs-*   │
         │  (index daily)   │
         └────────┬─────────┘
                  ▼
           ┌─────────────┐
           │    KIBANA   │
           │  (Discover, │
           │  Dashboards)│
           └─────────────┘
```

### 7.2 Pipeline Logstash (`logstash.conf`)

**INPUT — 3 sources :**

```ruby
# Source 1 : lecture des fichiers de logs Laravel
file {
  path => "/var/www/storage/logs/laravel*.log"
  start_position => "beginning"
  sincedb_path => "/dev/null"
  codec => multiline {
    pattern => "^\[\d{4}-\d{2}-\d{2}"
    negate => true
    what => "previous"
  }
  tags => ["laravel", "application"]
}

# Source 2 : logs en temps réel via TCP
tcp { port => 5000; codec => json; tags => ["laravel", "tcp"] }

# Source 3 : logs en temps réel via UDP
udp { port => 5000; codec => json; tags => ["laravel", "udp"] }
```

Le codec `multiline` regroupe les lignes de stack trace (qui ne commencent pas par `[date]`) avec le message d'erreur précédent.

**FILTER — transformation des logs :**

```ruby
filter {
  if "laravel" in [tags] {

    # 1. Parser le format Laravel standard
    grok {
      match => {
        "message" => "\[%{TIMESTAMP_ISO8601:timestamp}\] %{DATA:environment}\.%{DATA:level}: %{GREEDYDATA:message}"
      }
      overwrite => ["message"]
    }

    # 2. Parser le JSON si le message est un objet JSON
    if [message] =~ /^\{.*\}$/ {
      json { source => "message"; target => "log_data" }
    }

    # 3. Normalisation du niveau de log
    mutate { lowercase => ["level"] }

    # 4. Enrichissement — champs métier
    mutate {
      add_field => {
        "application" => "laravel-api"
        "service" => "gestion-produit"
      }
    }

    # 5. Parsing de la date pour @timestamp
    date {
      match => ["timestamp", "yyyy-MM-dd HH:mm:ss", "ISO8601"]
      target => "@timestamp"
    }

    # 6. Extraction du contexte (user_id, request_id, ip)
    if [log_data][context] {
      mutate {
        add_field => {
          "user_id"    => "%{[log_data][context][user_id]}"
          "request_id" => "%{[log_data][context][request_id]}"
          "ip_address" => "%{[log_data][context][ip]}"
        }
      }
    }
  }

  # Nettoyage des champs inutiles
  mutate { remove_field => ["host", "path"] }
}
```

**OUTPUT :**

```ruby
output {
  # Envoi vers Elasticsearch avec index journalier
  elasticsearch {
    hosts => ["elasticsearch:9200"]
    index => "laravel-logs-%{+YYYY.MM.dd}"
  }

  # Débogage dans la console Logstash (à désactiver en production)
  stdout { codec => rubydebug }
}
```

### 7.3 Elasticsearch

- Image : `docker.elastic.co/elasticsearch/elasticsearch:8.11.0`
- Mode : `single-node` (développement/staging)
- Sécurité xpack désactivée pour faciliter l'accès local
- JVM : 512 MB heap (Xms/Xmx)
- Index pattern : `laravel-logs-YYYY.MM.dd` (rotation quotidienne)
- Healthcheck : `curl -f http://localhost:9200/_cluster/health`

### 7.4 Kibana

- Image : `docker.elastic.co/kibana/kibana:8.11.0`
- Port : `5601`
- Connecté à Elasticsearch sur `http://elasticsearch:9200`
- Vue **Discover** : filtrage et recherche full-text sur les logs Laravel structurés
- Champs indexés : `@timestamp`, `level`, `message`, `environment`, `application`, `service`, `user_id`, `request_id`, `ip_address`

---

## VIII. Qualité du code — SonarCloud

### 8.1 Résultats après corrections

À l'issue du projet et des itérations de correction, les métriques SonarCloud ont atteint :

| Métrique | Résultat |
|---|---|
| **Security Rating** | A (0 vulnérabilités) |
| **Security Review Rating** | A (0 hotspots) |
| **Reliability Rating** | Améliorée (corrections accessibilité React) |
| **Maintainability Rating** | A (-85% sur 30 jours) |
| **Duplications** | Réduites à < 3% grâce à `ConfirmModal` + `ModalWrapper` |
| **Coverage** | Rapport PHP Clover XML généré via PCOV |

### 8.2 Corrections appliquées

**Backend PHP :**
- Suppression du code commenté dans `User.php`
- Suppression des espaces en fin de ligne dans `MetricsController.php`

**Frontend React/TypeScript :**
- Props marquées `Readonly<{}>` dans `App.tsx`, `ProtectedRoute.tsx`, `AuthContext.tsx`
- `useMemo` sur la valeur du `AuthContext.Provider` pour éviter les re-renders inutiles
- Suppression de `role="button"` sur des éléments `<div>` non interactifs (`Layout.tsx`)
- Suppression du heading vide (`<h2>`) remplacé puis supprimé
- Remplacement des modales `<div onClick>` par `<div role="document">` sans listeners sur éléments non interactifs
- Extraction des ternaires imbriqués en conditions claires
- Labels `htmlFor` associés aux champs de formulaire via attribut `id`
- Création de `ConfirmModal.tsx` et `ModalWrapper.tsx` pour éliminer la duplication de code

---

## IX. Frontend React — Architecture

### 9.1 Structure applicative

```
App.tsx
├── GuestRoute (redirige si connecté)
│   ├── /login    → LoginPage
│   └── /register → RegisterPage
└── ProtectedRoute (redirige si non connecté)
    └── Layout (sidebar + topbar)
        ├── /dashboard  → DashboardPage
        ├── /products   → ProductsPage
        └── /categories → CategoriesPage
```

### 9.2 Gestion de l'authentification

`AuthContext.tsx` expose via `useMemo` :
- `user` (objet utilisateur ou null)
- `loading` (boolean)
- `login(email, password)` — POST /api/login
- `register(name, email, password)` — POST /api/register
- `logout()` — POST /api/logout

L'état d'authentification est persisté dans `localStorage` via le token Sanctum.

### 9.3 Fonctionnalités principales

**ProductsPage :**
- Listing paginé avec filtres : recherche textuelle, catégorie, tri (prix, nom, date), ordre (asc/desc), stock uniquement
- CRUD complet via modales (`ModalWrapper` + formulaires avec labels `htmlFor`)
- Confirmation de suppression via `ConfirmModal`

**CategoriesPage :**
- Listing en grille avec compteur de produits par catégorie
- Génération automatique du slug à partir du nom
- CRUD via modales et `ConfirmModal`

**DashboardPage :**
- Statistiques agrégées depuis `GET /api/dashboard/stats`
- Graphiques recharts

---

## X. Difficultés rencontrées et solutions

| Difficulté | Solution apportée |
|---|---|
| **Coverage 0.0% SonarCloud** | Ajout de PCOV dans le job SonarCloud, génération du rapport Clover XML avec `--coverage-clover=coverage.xml` |
| **Duplication > 3% (4.82%)** | Extraction de `ConfirmModal.tsx` puis `ModalWrapper.tsx` pour centraliser le pattern modal |
| **Issues accessibilité React** | Remplacement de `<dialog onClick>` par `<div role="document">` sans listeners, labels associés par `htmlFor`/`id` |
| **Quality Gate Failed** | Exclusion du frontend de `sonar.coverage.exclusions`, réduction des duplications |
| **Push Git échoué (connection reset)** | Retry de la commande push |
| **Node Exporter sur Windows** | Montage `/proc:/host/proc:ro` (nécessite WSL2 ou Linux) |
| **Multiline logs Logstash** | Utilisation du codec `multiline` avec pattern `^\[\d{4}-\d{2}-\d{2}` pour regrouper les stack traces |

---

## XI. Conclusion

Le projet StockPro réalise une chaîne DevOps complète couvrant les parties 1 et 2 des consignes :

**Partie 1 — CI/CD :**
✅ Repository GitHub avec branches structurées (main/develop/feature/*)  
✅ Pipeline CI : lint (Pint), analyse statique (PHPStan/Larastan level 5), audit sécurité (composer audit), tests unitaires et d'intégration (PHPUnit sur SQLite + MySQL)  
✅ Build TypeScript + Vite pour le frontend  
✅ Conteneurisation Docker multi-stage (PHP-FPM 8.2)  
✅ Docker Compose pour l'orchestration locale complète  
✅ Déploiement automatique en production (o2switch via FTP)  
✅ Image Docker publiée sur Docker Hub (taggée sha/latest/date)  
✅ Healthcheck post-déploiement  

**Partie 2 — Monitoring & Logs :**
✅ Prometheus : scrape /metrics toutes les 10s, 22 métriques applicatives custom  
✅ Node Exporter : CPU, RAM, réseau, disque, pression système  
✅ Grafana : dashboards opérationnels et KPI métier  
✅ 11 règles d'alerte Prometheus (système, application, monitoring)  
✅ Alertmanager : notifications email HTML différenciées (warning/critique)  
✅ ELK Stack 8.11 : Logstash (3 inputs, grok + JSON parsing), Elasticsearch (index journalier), Kibana (Discover)  

**Bonus réalisés :**
✅ DevSecOps : SonarCloud (qualité + sécurité), PHPStan, Pint  
✅ Intégration frontend + backend complète  
✅ Déploiement multi-environnement (local Docker / production o2switch)  
✅ Dashboard métier (KPI stock, valeur, catégories)  
✅ Couverture de code PHP (PCOV + rapport Clover XML vers SonarCloud)  

---

*Rapport généré le 25 avril 2026 — NGOKENG FOFACK Rayan — CDWFS Semestre 6*
