# Script para hacer push a GitHub con token
$token = "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"
$repo = "mmgb5656/yumman-rivals"

Write-Host "Configurando credenciales..." -ForegroundColor Yellow

# Configurar URL con token
git remote set-url origin "https://$token@github.com/$repo.git"

Write-Host "Haciendo push a GitHub..." -ForegroundColor Yellow

# Hacer push
git push -u origin main

if ($LASTEXITCODE -eq 0) {
    Write-Host "`nExito! Codigo subido a GitHub" -ForegroundColor Green
    Write-Host "Ver en: https://github.com/$repo" -ForegroundColor Cyan
} else {
    Write-Host "`nError al hacer push" -ForegroundColor Red
}
