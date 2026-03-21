# 🧪 Guide des Tests - Gestion Produit API

## 📋 Table des Matières
- [Structure des Tests](#structure-des-tests)
- [Exécution des Tests](#exécution-des-tests)
- [Couverture des Tests](#couverture-des-tests)
- [Types de Tests](#types-de-tests)

## 📁 Structure des Tests

```
tests/
├── Unit/                      # Tests unitaires (logique métier isolée)
│   ├── ProductTest.php       # Tests du modèle Product
│   ├── CategoryTest.php      # Tests du modèle Category
│   └── UserTest.php          # Tests du modèle User
│
├── Feature/                   # Tests d'intégration (endpoints API)
│   ├── AuthTest.php          # Tests d'authentification
│   ├── ProductTest.php       # Tests CRUD produits
│   ├── CategoryTest.php      # Tests CRUD catégories
│   └── DashboardTest.php     # Tests du dashboard
│
└── TestCase.php              # Classe de base pour tous les tests
```

## 🚀 Exécution des Tests

### Tous les Tests
```bash
php artisan test
```

### Tests Unitaires Uniquement
```bash
php artisan test --testsuite=Unit
```

### Tests d'Intégration Uniquement
```bash
php artisan test --testsuite=Feature
```

### Test Spécifique
```bash
# Par fichier
php artisan test tests/Unit/ProductTest.php

# Par méthode
php artisan test --filter test_product_belongs_to_user
```

### Avec Couverture de Code
```bash
php artisan test --coverage
```

### Mode Verbose (Détaillé)
```bash
php artisan test --verbose
```

## 📊 Couverture des Tests

### Tests Unitaires (3 fichiers, 13 tests)

#### ProductTest.php
- ✅ test_product_belongs_to_user
- ✅ test_product_belongs_to_category
- ✅ test_product_can_be_created_with_valid_data
- ✅ test_product_price_is_cast_to_decimal
- ✅ test_product_quantity_is_cast_to_integer

#### CategoryTest.php
- ✅ test_category_has_many_products
- ✅ test_category_can_be_created_with_valid_data
- ✅ test_category_slug_is_unique

#### UserTest.php
- ✅ test_user_has_many_products
- ✅ test_user_password_is_hashed
- ✅ test_user_email_is_unique
- ✅ test_user_hidden_attributes_are_not_visible

### Tests d'Intégration (4 fichiers, 30+ tests)

#### AuthTest.php (8 tests)
- ✅ test_user_can_register
- ✅ test_user_cannot_register_with_existing_email
- ✅ test_user_cannot_register_with_invalid_password
- ✅ test_user_can_login_with_valid_credentials
- ✅ test_user_cannot_login_with_invalid_credentials
- ✅ test_authenticated_user_can_logout
- ✅ test_authenticated_user_can_get_profile
- ✅ test_unauthenticated_user_cannot_access_protected_routes

#### ProductTest.php (14 tests)
- ✅ test_can_list_all_products
- ✅ test_can_search_products_by_name
- ✅ test_can_filter_products_by_category
- ✅ test_can_filter_products_by_price_range
- ✅ test_can_filter_in_stock_products
- ✅ test_authenticated_user_can_create_product
- ✅ test_unauthenticated_user_cannot_create_product
- ✅ test_cannot_create_product_with_invalid_data
- ✅ test_can_show_single_product
- ✅ test_owner_can_update_their_product
- ✅ test_non_owner_cannot_update_product
- ✅ test_owner_can_delete_their_product
- ✅ test_non_owner_cannot_delete_product

#### CategoryTest.php (6 tests)
- ✅ test_can_list_all_categories
- ✅ test_authenticated_user_can_create_category
- ✅ test_cannot_create_category_with_duplicate_slug
- ✅ test_can_show_single_category_with_products
- ✅ test_authenticated_user_can_update_category
- ✅ test_authenticated_user_can_delete_category

#### DashboardTest.php (2 tests)
- ✅ test_authenticated_user_can_get_dashboard_statistics
- ✅ test_unauthenticated_user_cannot_access_dashboard

## 🎯 Types de Tests

### 1. Tests Unitaires
Testent la logique métier isolée (modèles, relations, casts, etc.)

**Exemple :**
```php
public function test_product_belongs_to_user(): void
{
    $user = User::factory()->create();
    $product = Product::factory()->create(['user_id' => $user->id]);

    $this->assertInstanceOf(User::class, $product->user);
}
```

### 2. Tests d'Intégration (Feature)
Testent les endpoints API complets avec base de données

**Exemple :**
```php
public function test_authenticated_user_can_create_product(): void
{
    [$user, $token] = $this->authenticatedUser();

    $response = $this->withHeader('Authorization', 'Bearer '.$token)
        ->postJson('/api/products', [
            'name' => 'New Product',
            'price' => 99.99,
        ]);

    $response->assertStatus(201);
}
```

## 🔧 Configuration des Tests

### phpunit.xml
```xml
<testsuites>
    <testsuite name="Unit">
        <directory>tests/Unit</directory>
    </testsuite>
    <testsuite name="Feature">
        <directory>tests/Feature</directory>
    </testsuite>
</testsuites>

<php>
    <env name="APP_ENV" value="testing"/>
    <env name="DB_CONNECTION" value="sqlite"/>
    <env name="DB_DATABASE" value=":memory:"/>
</php>
```

## 📝 Bonnes Pratiques

### 1. Nommage des Tests
```php
// ✅ Bon : Descriptif et clair
public function test_authenticated_user_can_create_product(): void

// ❌ Mauvais : Trop vague
public function test_create(): void
```

### 2. Utilisation de RefreshDatabase
```php
use Illuminate\Foundation\Testing\RefreshDatabase;

class ProductTest extends TestCase
{
    use RefreshDatabase; // Réinitialise la DB entre chaque test
}
```

### 3. Factories pour les Données de Test
```php
// ✅ Bon : Utilise les factories
$product = Product::factory()->create();

// ❌ Mauvais : Données en dur
$product = Product::create([...]);
```

### 4. Assertions Claires
```php
// ✅ Bon : Assertions spécifiques
$response->assertStatus(201);
$response->assertJsonFragment(['name' => 'Product']);

// ❌ Mauvais : Assertions vagues
$this->assertTrue($response->isSuccessful());
```

## 🐛 Debugging des Tests

### Afficher les Erreurs Détaillées
```bash
php artisan test --verbose
```

### Afficher les Requêtes SQL
```php
\DB::enableQueryLog();
// ... votre test
dd(\DB::getQueryLog());
```

### Afficher la Réponse JSON
```php
$response = $this->getJson('/api/products');
dd($response->json());
```

## 📈 Statistiques des Tests

| Métrique | Valeur |
|----------|--------|
| **Total Tests** | 43+ |
| **Tests Unitaires** | 13 |
| **Tests d'Intégration** | 30+ |
| **Couverture Estimée** | ~85% |

## 🚦 CI/CD Integration

Les tests sont automatiquement exécutés dans le pipeline GitHub Actions :

```yaml
# .github/workflows/ci-cd.yml
- name: Exécution des Tests Unitaires
  run: php artisan test --testsuite=Unit

- name: Exécution des Tests d'Intégration
  run: php artisan test --testsuite=Feature
```

## 📞 Support

Pour toute question sur les tests :
- Consultez la documentation Laravel Testing : https://laravel.com/docs/testing
- Ouvrez une issue sur GitHub
