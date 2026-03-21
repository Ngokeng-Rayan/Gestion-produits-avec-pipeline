# API Backend Complet - Gestionnaire de Produits avec Authentification

## Installation et Configuration

### 1. Exécuter les migrations
```bash
php artisan migrate
```

### 2. Démarrer le serveur
```bash
php artisan serve
```

Base URL: `http://localhost:8000/api`

---

## Authentification

### 1. Inscription (Register)
Créer un nouveau compte utilisateur.

**Endpoint:** `POST /api/register`

**Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "password_confirmation": "password123"
}
```

**Réponse (201):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "created_at": "2026-02-21T09:00:00.000000Z",
    "updated_at": "2026-02-21T09:00:00.000000Z"
  },
  "token": "1|abcdef123456...",
  "token_type": "Bearer"
}
```

### 2. Connexion (Login)
Se connecter avec un compte existant.

**Endpoint:** `POST /api/login`

**Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Réponse (200):**
```json
{
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com"
  },
  "token": "2|xyz789...",
  "token_type": "Bearer"
}
```

### 3. Profil utilisateur (Me)
Obtenir les informations de l'utilisateur connecté.

**Endpoint:** `GET /api/me`

**Headers:**
```
Authorization: Bearer {token}
```

**Réponse (200):**
```json
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "created_at": "2026-02-21T09:00:00.000000Z",
  "updated_at": "2026-02-21T09:00:00.000000Z"
}
```

### 4. Déconnexion (Logout)
Se déconnecter et invalider le token.

**Endpoint:** `POST /api/logout`

**Headers:**
```
Authorization: Bearer {token}
```

**Réponse (200):**
```json
{
  "message": "Déconnexion réussie"
}
```

---

## Gestion des Produits (CRUD)

**Note:** Toutes les routes produits nécessitent l'authentification (token Bearer).

### 1. Lister tous les produits
**Endpoint:** `GET /api/products`

**Headers:**
```
Authorization: Bearer {token}
```

**Réponse (200):**
```json
{
  "current_page": 1,
  "data": [
    {
      "id": 1,
      "name": "Laptop Dell XPS 15",
      "description": "Ordinateur portable haute performance",
      "price": "1299.99",
      "quantity": 15,
      "category": "Informatique",
      "image": "laptop-dell.jpg",
      "user_id": 1,
      "created_at": "2026-02-21T09:00:00.000000Z",
      "updated_at": "2026-02-21T09:00:00.000000Z",
      "user": {
        "id": 1,
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "per_page": 10,
  "total": 5
}
```

### 2. Afficher un produit
**Endpoint:** `GET /api/products/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

### 3. Créer un produit
**Endpoint:** `POST /api/products`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "MacBook Pro M3",
  "description": "Ordinateur portable Apple avec puce M3",
  "price": 2499.99,
  "quantity": 10,
  "category": "Informatique",
  "image": "macbook-pro.jpg"
}
```

**Champs requis:**
- `name` (string, max 255)
- `price` (numeric, min 0)
- `quantity` (integer, min 0)

**Champs optionnels:**
- `description` (string)
- `category` (string, max 255)
- `image` (string, max 255)

**Réponse (201):**
Le produit créé avec l'utilisateur associé.

### 4. Mettre à jour un produit
**Endpoint:** `PUT /api/products/{id}`

**Headers:**
```
Authorization: Bearer {token}
Content-Type: application/json
```

**Body:**
```json
{
  "name": "MacBook Pro M3 (Mise à jour)",
  "price": 2399.99,
  "quantity": 8
}
```

**Note:** Seul le propriétaire du produit peut le modifier.

**Réponse (403) si non autorisé:**
```json
{
  "message": "Non autorisé"
}
```

### 5. Supprimer un produit
**Endpoint:** `DELETE /api/products/{id}`

**Headers:**
```
Authorization: Bearer {token}
```

**Note:** Seul le propriétaire du produit peut le supprimer.

**Réponse (200):**
```json
{
  "message": "Product deleted successfully"
}
```

---

## Tests avec cURL

### Inscription
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"John Doe\",\"email\":\"john@example.com\",\"password\":\"password123\",\"password_confirmation\":\"password123\"}"
```

### Connexion
```bash
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"john@example.com\",\"password\":\"password123\"}"
```

### Créer un produit (avec token)
```bash
curl -X POST http://localhost:8000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"iPad Pro\",\"description\":\"Tablette Apple\",\"price\":1099.99,\"quantity\":20,\"category\":\"Tablettes\"}"
```

### Lister les produits
```bash
curl http://localhost:8000/api/products \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## Fonctionnalités

✅ Authentification complète avec Laravel Sanctum
✅ Inscription et connexion utilisateur
✅ Tokens API sécurisés
✅ CRUD complet des produits
✅ Relation User-Product (un utilisateur peut avoir plusieurs produits)
✅ Protection des routes (middleware auth:sanctum)
✅ Autorisation (seul le propriétaire peut modifier/supprimer son produit)
✅ Validation des données
✅ Pagination des résultats
✅ Réponses JSON structurées

## Structure de la base de données

### Table: users
| Colonne | Type | Description |
|---------|------|-------------|
| id | bigint | Identifiant unique |
| name | string | Nom de l'utilisateur |
| email | string | Email (unique) |
| password | string | Mot de passe hashé |
| created_at | timestamp | Date de création |
| updated_at | timestamp | Date de modification |

### Table: products
| Colonne | Type | Description |
|---------|------|-------------|
| id | bigint | Identifiant unique |
| name | string | Nom du produit |
| description | text | Description détaillée |
| price | decimal(10,2) | Prix du produit |
| quantity | integer | Quantité en stock |
| category | string | Catégorie du produit |
| image | string | Nom du fichier image |
| user_id | bigint | ID de l'utilisateur propriétaire |
| created_at | timestamp | Date de création |
| updated_at | timestamp | Date de modification |
