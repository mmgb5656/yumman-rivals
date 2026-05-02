# Script para subir el proyecto a GitHub
# Ejecuta este script después de crear el repositorio en GitHub

param(
    [Parameter(Mandatory=$true)]
    [string]$RepoUrl
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  SUBIR PROYECTO A GITHUB" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar que estamos en un repositorio git
if (-not (Test-Path ".git")) {
    Write-Host "ERROR: No estás en un repositorio git" -ForegroundColor Red
    exit 1
}

# Verificar que hay commits
$commits = git log --oneline 2>$null
if (-not $commits) {
    Write-Host "ERROR: No hay commits en el repositorio" -ForegroundColor Red
    exit 1
}

Write-Host "Repositorio: $RepoUrl" -ForegroundColor Yellow
Write-Host ""

# Verificar si ya existe un remote
$existingRemote = git remote get-url origin 2>$null
if ($existingRemote) {
    Write-Host "Ya existe un remote configurado: $existingRemote" -ForegroundColor Yellow
    $response = Read-Host "Deseas reemplazarlo? (s/n)"
    if ($response -ne "s") {
        Write-Host "Operación cancelada" -ForegroundColor Red
        exit 0
    }
    git remote remove origin
}

Write-Host "[1/4] Agregando remote..." -ForegroundColor Green
git remote add origin $RepoUrl

Write-Host "[2/4] Verificando rama..." -ForegroundColor Green
$currentBranch = git branch --show-current
if ($currentBranch -ne "main") {
    git branch -M main
}

Write-Host "[3/4] Verificando conexión..." -ForegroundColor Green
try {
    git ls-remote origin 2>&1 | Out-Null
    Write-Host "Conexión exitosa" -ForegroundColor Green
} catch {
    Write-Host "ERROR: No se pudo conectar al repositorio" -ForegroundColor Red
    Write-Host "Verifica que:" -ForegroundColor Yellow
    Write-Host "1. El repositorio existe en GitHub" -ForegroundColor White
    Write-Host "2. Tienes permisos de escritura" -ForegroundColor White
    Write-Host "3. Tu autenticación está configurada" -ForegroundColor White
    exit 1
}

Write-Host "[4/4] Subiendo código..." -ForegroundColor Green
git push -u origin main

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  PROYECTO SUBIDO EXITOSAMENTE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Repositorio: $RepoUrl" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Preparar paquete de recursos:" -ForegroundColor White
Write-Host "   .\scripts\prepare-resources-package.ps1" -ForegroundColor Gray
Write-Host ""
Write-Host "2. Crear Release de recursos en GitHub:" -ForegroundColor White
Write-Host "   - Tag: v1.0.0-resources" -ForegroundColor Gray
Write-Host "   - Subir ZIP de recursos" -ForegroundColor Gray
Write-Host ""
Write-Host "3. Configurar Supabase:" -ForegroundColor White
Write-Host "   - Crear proyecto en supabase.com" -ForegroundColor Gray
Write-Host "   - Ejecutar docs/database-schema.sql" -ForegroundColor Gray
Write-Host "   - Agregar credenciales como GitHub Secrets" -ForegroundColor Gray
Write-Host ""
Write-Host "4. Implementar auto-updates:" -ForegroundColor White
Write-Host "   - Ver docs/AUTO-UPDATES-IMPLEMENTATION.md" -ForegroundColor Gray
Write-Host ""
