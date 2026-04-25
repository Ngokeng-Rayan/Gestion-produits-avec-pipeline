# 📮 Guide d'utilisation Postman

## 📥 Importation dans Postman

### 1. Ouvrir Postman

### 2. Importer la Collection
1. Cliquer sur **Import** (en haut à gauche)
2. Sélectionner le fichier : `Laravel_Inventory_API.postman_collection.json`
3. Cliquer sur **Import**

### 3. Importer l'Environnement
1. Cliquer sur **Import**
2. Sélectionner le fichier : `Laravel_Inventory_Environment.postman_environment.json`
3. Cliquer sur **Import**

### 4. Activer l'Environnement
1. En haut à droite, dans le menu déroulant des environnements
2. Sélectionner **Laravel Inventory - Local**

---

## 🚀 Ordre de Test Recommandé

### Étape 1 : Authentification

#### 1. Register (Inscription)
- Dossier : **Authentication** → **Register**
- Cliquer sur **Send**
- ✅ Le token sera automatiquement sauvegardé dans l'environnement

#### 2. Login (Connexion)
- Dossier : **Authentication** → **Login**
- Utiliser les mêmes identifiants que lors de l'inscription
- Cliquer sur **Send**
- ✅ Le token sera mis à jour automatiquement

#### 3. Get User Profile (Me)
- Dossier : **Authentication** → **Get User Profile (Me)**
- Cliquer sur **Send**
- Vérifier que tu reçois tes informations utilisateur

---

### Étape 2 : Catégories

#### 1. List All Categories
- Dossier : **Categories** → **List All Categories**
- Cliquer sur **Send**
- Tu devrais voir 6 catégories (Informatique, Téléphonie, Accessoires, etc.)

#### 2. Get Category by ID
- Dossier : **Categories** → **Get Category by ID**
- Cliquer sur **Send**
- Affiche la catégorie avec ses produits

#### 3. Create Category
- Dossier : **Categories** → **Create Category**
- Cliquer sur **Send**
- ✅ L'ID de la catégorie créée sera sauvegardé automatiquement

#### 4. Update Category
- Dossier : **Categories** → **Update Category**
- Utilise l'ID de la catégorie créée précédemment
- Cliquer sur **Send**

#### 5. Delete Category (Optionnel)
- Dossier : **Categories** → **Delete Category**
- Cliquer sur **Send**

---

### Étape 3 : Produits

#### 1. List All Products
- Dossier : **Products** → **List All Products**
- Cliquer sur **Send**
- Affiche tous les produits avec pagination

#### 2. Create Product - MacBook
- Dossier : **Products** → **Create Product**
- Cliquer sur **Send**
- ✅ L'ID du produit sera sauvegardé automatiquement

#### 3. Create Product - iPhone
- Dossier : **Products** → **Create Product - iPhone**
- Cliquer sur **Send**

#### 4. Create Product - Gaming Mouse
- Dossier : **Products** → **Create Product - Gaming Mouse**
- Cliquer sur **Send**

#### 5. Get Product by ID
- Dossier : **Products** → **Get Product by ID**
- Cliquer sur **Send**

#### 6. Update Product
- Dossier : **Products** → **Update Product**
- Modifie le prix ou la quantité
- Cliquer sur **Send**

---

### Étape 4 : Recherche et Filtres

#### 1. Search Products
- Dossier : **Products** → **Search Products**
- Recherche par nom (ex: "laptop")
- Cliquer sur **Send**

#### 2. Filter by Category
- Dossier : **Products** → **Filter Products by Category**
- Filtre par catégorie (category_id=1)
- Cliquer sur **Send**

#### 3. Filter by Price Range
- Dossier : **Products** → **Filter Products by Price Range**
- Filtre entre 500€ et 2000€
- Cliquer sur **Send**

#### 4. Filter In Stock
- Dossier : **Products** → **Filter In Stock Products**
- Affiche uniquement les produits en stock
- Cliquer sur **Send**

#### 5. Sort by Price
- Dossier : **Products** → **Sort Products by Price**
- Trie par prix croissant
- Cliquer sur **Send**

#### 6. Advanced Filter (Combined)
- Dossier : **Products** → **Advanced Filter (Combined)**
- Combine tous les filtres
- Cliquer sur **Send**

---

### Étape 5 : Dashboard

#### 1. Get Dashboard Statistics
- Dossier : **Dashboard** → **Get Dashboard Statistics**
- Cliquer sur **Send**
- Affiche toutes les statistiques :
  - Total produits
  - Valeur totale de l'inventaire
  - Produits en rupture de stock
  - Produits à faible stock
  - Répartition par catégorie
  - Produits récents
  - Top produits par valeur

---

### Étape 6 : Nettoyage (Optionnel)

#### 1. Delete Product
- Dossier : **Products** → **Delete Product**
- Supprime le produit créé
- Cliquer sur **Send**

#### 2. Logout
- Dossier : **Authentication** → **Logout**
- Déconnexion
- Cliquer sur **Send**

---

## 🔑 Variables d'Environnement

Les variables suivantes sont automatiquement gérées :

| Variable | Description | Auto-remplie |
|----------|-------------|--------------|
| `base_url` | URL de base de l'API | ✅ (http://localhost:8000) |
| `auth_token` | Token d'authentification | ✅ (après Register/Login) |
| `user_id` | ID de l'utilisateur | ✅ (après Register/Login) |
| `product_id` | ID du dernier produit créé | ✅ (après Create Product) |
| `category_id` | ID de la dernière catégorie créée | ✅ (après Create Category) |

---

## 📊 Collection Complète

La collection contient **25 requêtes** organisées en 4 dossiers :

### 1. Authentication (4 requêtes)
- Register
- Login
- Get User Profile (Me)
- Logout

### 2. Categories (5 requêtes)
- List All Categories
- Get Category by ID
- Create Category
- Update Category
- Delete Category

### 3. Products (14 requêtes)
- List All Products
- Search Products
- Filter by Category
- Filter by Price Range
- Filter In Stock
- Sort by Price
- Advanced Filter (Combined)
- Get Product by ID
- Create Product (MacBook)
- Create Product (iPhone)
- Create Product (Gaming Mouse)
- Update Product
- Delete Product

### 4. Dashboard (1 requête)
- Get Dashboard Statistics

---

## 🎯 Scénarios de Test

### Scénario 1 : Flux Complet Utilisateur
1. Register → Login → Create Product → List Products → Logout

### Scénario 2 : Gestion d'Inventaire
1. Login → Create Category → Create Multiple Products → Get Dashboard Stats

### Scénario 3 : Recherche Avancée
1. Login → Create Products → Search → Filter by Category → Filter by Price → Sort

### Scénario 4 : Autorisation
1. Login User A → Create Product
2. Login User B → Try to Update/Delete Product A (devrait échouer avec 403)

---

## 🐛 Dépannage

### Erreur 401 Unauthorized
- Vérifier que l'environnement **Laravel Inventory - Local** est sélectionné
- Vérifier que le token est présent dans les variables d'environnement
- Refaire un Login pour obtenir un nouveau token

### Erreur 404 Not Found
- Vérifier que Docker est lancé : `docker ps`
- Vérifier que l'URL de base est correcte : `http://localhost:8000`
- Vérifier que les conteneurs sont actifs

### Erreur 500 Internal Server Error
- Vérifier les logs Docker : `docker-compose logs -f`
- Vérifier que les migrations sont exécutées
- Vérifier la connexion à la base de données

---

## 💡 Astuces

### Voir le Token
1. Cliquer sur l'icône "œil" à côté de l'environnement (en haut à droite)
2. Voir la valeur de `auth_token`

### Changer l'URL de base
1. Cliquer sur l'environnement
2. Modifier `base_url` (ex: pour production)

### Exporter les résultats
1. Après avoir exécuté toutes les requêtes
2. Cliquer sur **Runner** → **Run Collection**
3. Exporter les résultats

---

## 📚 Documentation API Complète

Pour plus de détails sur les endpoints, consulter :
- **API_COMPLETE.md** - Documentation complète de l'API
- **DOCKER_GUIDE.md** - Guide Docker

---

**Bon test ! 🚀**
