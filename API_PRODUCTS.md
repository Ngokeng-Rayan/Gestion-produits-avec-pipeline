# API Gestionnaire de Produits (Inventaire)

## Configuration

### 1. Exécuter la migration
```bash
php artisan migrate
```

### 2. Remplir la base de données avec des données de test
```bash
php artisan db:seed --class=ProductSeeder
```

### 3. Démarrer le serveur
```bash
php artisan serve
```

## Endpoints API

Base URL: `http://localhost:8000/api`

### 1. Lister tous les produits (GET)
```
GET /api/products
```

**Réponse:**
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
      "created_at": "2026-02-21T08:53:52.000000Z",
      "updated_at": "2026-02-21T08:53:52.000000Z"
    }
  ],
  "total": 5
}
```

### 2. Afficher un produit spécifique (GET)
```
GET /api/products/{id}
```

**Exemple:**
```
GET /api/products/1
```

### 3. Créer un nouveau produit (POST)
```
POST /api/products
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Casque Sony WH-1000XM5",
  "description": "Casque audio sans fil avec réduction de bruit",
  "price": 399.99,
  "quantity": 30,
  "category": "Audio",
  "image": "casque-sony.jpg"
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

### 4. Mettre à jour un produit (PUT/PATCH)
```
PUT /api/products/{id}
Content-Type: application/json
```

**Exemple:**
```json
{
  "name": "Laptop Dell XPS 15 (Mise à jour)",
  "price": 1199.99,
  "quantity": 10
}
```

### 5. Supprimer un produit (DELETE)
```
DELETE /api/products/{id}
```

**Réponse:**
```json
{
  "message": "Product deleted successfully"
}
```

## Tests avec cURL

### Lister les produits
```bash
curl http://localhost:8000/api/products
```

### Créer un produit
```bash
curl -X POST http://localhost:8000/api/products \
  -H "Content-Type: application/json" \
  -d "{\"name\":\"Tablette iPad Pro\",\"description\":\"Tablette Apple 12.9 pouces\",\"price\":1099.99,\"quantity\":20,\"category\":\"Tablettes\"}"
```

### Afficher un produit
```bash
curl http://localhost:8000/api/products/1
```

### Mettre à jour un produit
```bash
curl -X PUT http://localhost:8000/api/products/1 \
  -H "Content-Type: application/json" \
  -d "{\"price\":1099.99,\"quantity\":12}"
```

### Supprimer un produit
```bash
curl -X DELETE http://localhost:8000/api/products/1
```

## Structure de la base de données

Table: `products`

| Colonne | Type | Description |
|---------|------|-------------|
| id | bigint | Identifiant unique |
| name | string | Nom du produit |
| description | text | Description détaillée |
| price | decimal(10,2) | Prix du produit |
| quantity | integer | Quantité en stock |
| category | string | Catégorie du produit |
| image | string | Nom du fichier image |
| created_at | timestamp | Date de création |
| updated_at | timestamp | Date de modification |
