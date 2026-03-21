# Script de test de l'API

Write-Host "🧪 Test de l'API Laravel" -ForegroundColor Cyan
Write-Host ""

# Test 1: Vérifier que l'API répond
Write-Host "1️⃣ Test de connexion à l'API..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:8000" -Method GET -ErrorAction Stop
    Write-Host "✅ API accessible (Status: $($response.StatusCode))" -ForegroundColor Green
} catch {
    Write-Host "❌ Erreur: L'API n'est pas accessible" -ForegroundColor Red
    Write-Host "   Vérifiez que Docker est lancé: docker ps" -ForegroundColor Yellow
    exit 1
}

Write-Host ""

# Test 2: Inscription
Write-Host "2️⃣ Test d'inscription..." -ForegroundColor Yellow
$registerData = @{
    name = "Test User"
    email = "test@example.com"
    password = "password123"
    password_confirmation = "password123"
} | ConvertTo-Json

try {
    $registerResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/register" `
        -Method POST `
        -Body $registerData `
        -ContentType "application/json" `
        -ErrorAction Stop
    
    $token = $registerResponse.token
    Write-Host "✅ Inscription réussie" -ForegroundColor Green
    Write-Host "   Utilisateur: $($registerResponse.user.name)" -ForegroundColor Gray
    Write-Host "   Email: $($registerResponse.user.email)" -ForegroundColor Gray
    Write-Host "   Token: $($token.Substring(0, 20))..." -ForegroundColor Gray
} catch {
    # Si l'utilisateur existe déjà, on se connecte
    Write-Host "⚠️  Utilisateur existe déjà, connexion..." -ForegroundColor Yellow
    
    $loginData = @{
        email = "test@example.com"
        password = "password123"
    } | ConvertTo-Json
    
    $loginResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/login" `
        -Method POST `
        -Body $loginData `
        -ContentType "application/json"
    
    $token = $loginResponse.token
    Write-Host "✅ Connexion réussie" -ForegroundColor Green
}

Write-Host ""

# Test 3: Profil utilisateur
Write-Host "3️⃣ Test du profil utilisateur..." -ForegroundColor Yellow
$headers = @{
    "Authorization" = "Bearer $token"
    "Accept" = "application/json"
}

$meResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/me" `
    -Method GET `
    -Headers $headers

Write-Host "✅ Profil récupéré" -ForegroundColor Green
Write-Host "   ID: $($meResponse.id)" -ForegroundColor Gray
Write-Host "   Nom: $($meResponse.name)" -ForegroundColor Gray
Write-Host "   Email: $($meResponse.email)" -ForegroundColor Gray

Write-Host ""

# Test 4: Liste des catégories
Write-Host "4️⃣ Test de la liste des catégories..." -ForegroundColor Yellow
$categoriesResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/categories" `
    -Method GET `
    -Headers $headers

Write-Host "✅ Catégories récupérées: $($categoriesResponse.Count)" -ForegroundColor Green
foreach ($category in $categoriesResponse | Select-Object -First 3) {
    Write-Host "   - $($category.name) ($($category.products_count) produits)" -ForegroundColor Gray
}

Write-Host ""

# Test 5: Créer un produit
Write-Host "5️⃣ Test de création d'un produit..." -ForegroundColor Yellow
$productData = @{
    name = "Test Product $(Get-Random -Maximum 1000)"
    description = "Produit de test créé via API"
    price = 99.99
    quantity = 10
    category_id = $categoriesResponse[0].id
} | ConvertTo-Json

$productResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/products" `
    -Method POST `
    -Body $productData `
    -ContentType "application/json" `
    -Headers $headers

Write-Host "✅ Produit créé" -ForegroundColor Green
Write-Host "   ID: $($productResponse.id)" -ForegroundColor Gray
Write-Host "   Nom: $($productResponse.name)" -ForegroundColor Gray
Write-Host "   Prix: $($productResponse.price) €" -ForegroundColor Gray
Write-Host "   Quantité: $($productResponse.quantity)" -ForegroundColor Gray

Write-Host ""

# Test 6: Liste des produits
Write-Host "6️⃣ Test de la liste des produits..." -ForegroundColor Yellow
$productsResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/products" `
    -Method GET `
    -Headers $headers

Write-Host "✅ Produits récupérés: $($productsResponse.total)" -ForegroundColor Green
Write-Host "   Page: $($productsResponse.current_page)/$([math]::Ceiling($productsResponse.total / $productsResponse.per_page))" -ForegroundColor Gray

Write-Host ""

# Test 7: Statistiques du dashboard
Write-Host "7️⃣ Test des statistiques..." -ForegroundColor Yellow
$statsResponse = Invoke-RestMethod -Uri "http://localhost:8000/api/dashboard/stats" `
    -Method GET `
    -Headers $headers

Write-Host "✅ Statistiques récupérées" -ForegroundColor Green
Write-Host "   Total produits: $($statsResponse.total_products)" -ForegroundColor Gray
Write-Host "   Valeur totale: $($statsResponse.total_value) €" -ForegroundColor Gray
Write-Host "   Quantité totale: $($statsResponse.total_quantity)" -ForegroundColor Gray
Write-Host "   Stock faible: $($statsResponse.low_stock_products)" -ForegroundColor Gray
Write-Host "   Rupture de stock: $($statsResponse.out_of_stock_products)" -ForegroundColor Gray

Write-Host ""
Write-Host "🎉 Tous les tests sont passés avec succès!" -ForegroundColor Green
Write-Host ""
Write-Host "📚 Ressources:" -ForegroundColor Cyan
Write-Host "   - API: http://localhost:8000" -ForegroundColor Gray
Write-Host "   - phpMyAdmin: http://localhost:8080" -ForegroundColor Gray
Write-Host "   - Documentation: API_COMPLETE.md" -ForegroundColor Gray
Write-Host ""
Write-Host "🔑 Token d'authentification:" -ForegroundColor Cyan
Write-Host "   $token" -ForegroundColor Gray
