# API Backend Complet - Système de Gestion d'Inventaire

## 🚀 Fonctionnalités

✅ Authentification complète (Register, Login, Logout)
✅ Gestion des produits (CRUD complet)
✅ Gestion des catégories (CRUD complet)
✅ Relations entre utilisateurs, produits et catégories
✅ Recherche et filtres avancés
✅ Statistiques du dashboard
✅ Autorisation (propriété des produits)
✅ Pagination
✅ Validation des données

---

## 📦 Installation

### 1. Exécuter les migrations
```bash
php artisan migrate
```

### 2. Remplir la base avec des données de test
```bash
php artisan db:seed --class=CategorySeeder
```

### 3. Démarrer le serveur
```bash
php artisan serve
```

Base URL: `http://localhost:8000/api`

---

## 🔐 Authentification

### Register
```http
POST /api/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

### Login
```http
POST /api/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

**Réponse:**
```json
{
  "user": {...},
  "token": "1|abcdef...",
  "token_type": "Bearer"
}
```

### Me (Profil)
```http
GET /api/me
Authorization: Bearer {token}
```

### Logout
```http
POST /api/logout
Authorization: Bearer {token}
```

---

## 📊 Dashboard

### Statistiques
```http
GET /api/dashboard/stats
Authorization: Bearer {token}
```

**Réponse:**
```json
{
  "total_products": 25,
  "total_value": 45000.50,
  "total_quantity": 150,
  "low_stock_products": 5,
  "out_of_stock_products": 2,
  "categories_count": 6,
  "products_by_category": [...],
  "recent_products": [...],
  "top_value_products": [...]
}
```

---

## 🏷️ Catégories

### Lister toutes les catégories
```http
GET /api/categories
Authorization: Bearer {token}
```

**Réponse:**
```json
[
  {
    "id": 1,
    "name": "Informatique",
    "slug": "informatique",
    "description": "Ordinateurs, laptops...",
    "products_count": 15,
    "created_at": "...",
    "updated_at": "..."
  }
]
```

### Afficher une catégorie avec ses produits
```http
GET /api/categories/{id}
Authorization: Bearer {token}
```

### Créer une catégorie
```http
POST /api/categories
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Électronique",
  "slug": "electronique",
  "description": "Appareils électroniques divers"
}
```

### Mettre à jour une catégorie
```http
PUT /api/categories/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "Électronique Grand Public"
}
```

### Supprimer une catégorie
```http
DELETE /api/categories/{id}
Authorization: Bearer {token}
```

---

## 📦 Produits

### Lister tous les produits (avec filtres)
```http
GET /api/products?search=laptop&category_id=1&min_price=500&max_price=2000&in_stock=true&sort_by=price&sort_order=asc&per_page=20
Authorization: Bearer {token}
```

**Paramètres de requête:**
- `search` - Recherche par nom
- `category_id` - Filtrer par catégorie
- `min_price` - Prix minimum
- `max_price` - Prix maximum
- `in_stock` - Seulement les produits en stock (true/false)
- `sort_by` - Trier par (name, price, quantity, created_at)
- `sort_order` - Ordre (asc, desc)
- `per_page` - Nombre d'éléments par page (défaut: 10)

**Réponse:**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "name": "Laptop Dell XPS 15",
      "description": "...",
      "price": "1299.99",
      "quantity": 15,
      "category_id": 1,
      "image": "laptop.jpg",
      "user_id": 1,
      "created_at": "...",
      "updated_at": "...",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      },
      "category": {
        "id": 1,
        "name": "Informatique",
        "slug": "informatique"
      }
    }
  ],
  "per_page": 10,
  "total": 25
}
```

### Afficher un produit
```http
GET /api/products/{id}
Authorization: Bearer {token}
```

### Créer un produit
```http
POST /api/products
Authorization: Bearer {token}
Content-Type: application/json

{
  "name": "MacBook Pro M3",
  "description": "Ordinateur portable Apple avec puce M3",
  "price": 2499.99,
  "quantity": 10,
  "category_id": 1,
  "image": "macbook-pro.jpg"
}
```

**Champs requis:**
- `name` (string, max 255)
- `price` (numeric, min 0)
- `quantity` (integer, min 0)

**Champs optionnels:**
- `description` (string)
- `category_id` (integer, doit exister dans categories)
- `image` (string, max 255)

### Mettre à jour un produit
```http
PUT /api/products/{id}
Authorization: Bearer {token}
Content-Type: application/json

{
  "price": 2399.99,
  "quantity": 8
}
```

**Note:** Seul le propriétaire peut modifier son produit.

### Supprimer un produit
```http
DELETE /api/products/{id}
Authorization: Bearer {token}
```

**Note:** Seul le propriétaire peut supprimer son produit.

---

## 🧪 Tests avec cURL

### 1. S'inscrire
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","password_confirmation":"password123"}'
```

### 2. Se connecter
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"john@example.com","password":"password123"}'
```

**Copier le token de la réponse**

### 3. Voir les statistiques
```bash
curl http://localhost:8000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 4. Lister les catégories
```bash
curl http://localhost:8000/api/categories \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### 5. Créer un produit
```bash
curl -X POST http://localhost:8000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"name":"iPad Pro","description":"Tablette Apple","price":1099.99,"quantity":20,"category_id":4}'
```

### 6. Rechercher des produits
```bash
curl "http://localhost:8000/api/products?search=laptop&min_price=1000" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📋 Structure de la base de données

### Table: users
- id (bigint)
- name (string)
- email (string, unique)
- password (string, hashed)
- created_at, updated_at

### Table: categories
- id (bigint)
- name (string, unique)
- slug (string, unique)
- description (text, nullable)
- created_at, updated_at

### Table: products
- id (bigint)
- name (string)
- description (text, nullable)
- price (decimal 10,2)
- quantity (integer)
- category_id (bigint, foreign key, nullable)
- image (string, nullable)
- user_id (bigint, foreign key)
- created_at, updated_at

### Table: personal_access_tokens (Sanctum)
- Gère les tokens d'authentification API

---

## 🔒 Sécurité

- Mots de passe hashés avec bcrypt
- Tokens API sécurisés avec Laravel Sanctum
- Validation des données sur toutes les requêtes
- Autorisation basée sur la propriété des ressources
- Protection CSRF pour les routes web
- Middleware d'authentification sur les routes protégées

---

## 📈 Améliorations possibles

- Upload d'images réelles
- Gestion des rôles (admin, user)
- Historique des modifications
- Notifications
- Export des données (CSV, PDF)
- API de recherche avancée avec Elasticsearch
- Cache avec Redis
- Rate limiting
- Webhooks
- Documentation Swagger/OpenAPI
