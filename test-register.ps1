# Test de l'endpoint Register

$body = @{
    name = "Rayan"
    email = "rayanngokeng1@gmail.com"
    password = "R@y@n2005"
    password_confirmation = "R@y@n2005"
} | ConvertTo-Json

$response = Invoke-RestMethod -Uri "http://localhost:8000/api/register" -Method Post -Body $body -ContentType "application/json"

Write-Host "✅ Inscription réussie !" -ForegroundColor Green
Write-Host "Token: $($response.token)" -ForegroundColor Cyan
Write-Host "User ID: $($response.user.id)" -ForegroundColor Cyan
Write-Host "Email: $($response.user.email)" -ForegroundColor Cyan
