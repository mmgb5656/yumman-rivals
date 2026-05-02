# Script para preparar el paquete de recursos para GitHub Releases
# Este script crea un ZIP con todos los recursos necesarios

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  PREPARAR PAQUETE DE RECURSOS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Configuración
$version = "1.0.0"
$outputFile = "yumman-rivals-resources-v$version.zip"
$tempDir = "temp-resources-package"

# Verificar que existan los recursos
if (-not (Test-Path "resources/skyboxes")) {
    Write-Host "ERROR: No se encontró la carpeta resources/skyboxes" -ForegroundColor Red
    exit 1
}

Write-Host "[1/5] Creando carpeta temporal..." -ForegroundColor Yellow
if (Test-Path $tempDir) {
    Remove-Item -Recurse -Force $tempDir
}
New-Item -ItemType Directory -Path $tempDir | Out-Null
New-Item -ItemType Directory -Path "$tempDir/resources" | Out-Null

Write-Host "[2/5] Copiando skyboxes..." -ForegroundColor Yellow
Copy-Item -Recurse "resources/skyboxes" "$tempDir/resources/"

Write-Host "[3/5] Copiando texturas..." -ForegroundColor Yellow
if (Test-Path "resources/textures") {
    Copy-Item -Recurse "resources/textures" "$tempDir/resources/"
}

Write-Host "[4/5] Copiando imágenes de UI..." -ForegroundColor Yellow
if (Test-Path "resources/ui-images") {
    Copy-Item -Recurse "resources/ui-images" "$tempDir/resources/"
}

Write-Host "[5/7] Copiando assets del cielo..." -ForegroundColor Yellow
if (Test-Path "resources/assets") {
    Copy-Item -Recurse "resources/assets" "$tempDir/resources/"
} else {
    Write-Host "  ADVERTENCIA: No se encontró resources/assets" -ForegroundColor Red
}

Write-Host "[6/7] Copiando move-silent.bat..." -ForegroundColor Yellow
if (Test-Path "resources/move-silent.bat") {
    Copy-Item "resources/move-silent.bat" "$tempDir/resources/"
} else {
    Write-Host "  ADVERTENCIA: No se encontró resources/move-silent.bat" -ForegroundColor Red
}

# Crear README para el paquete
$readmeContent = @"
# YUMMAN RIVALS - Resources Package v$version

Este paquete contiene todos los recursos necesarios para YUMMAN RIVALS.

## Contenido

- **skyboxes/** - 25 skyboxes personalizados
- **textures/** - Texturas Ruptic Dark
- **ui-images/** - Previews de skyboxes para la interfaz

## Instalación

1. Extrae este archivo ZIP
2. Copia la carpeta `resources/` a la raíz del proyecto
3. La estructura debe quedar así:
   ```
   yumman-rivals/
   ├── resources/
   │   ├── skyboxes/
   │   ├── textures/
   │   └── ui-images/
   ├── main.js
   ├── package.json
   └── ...
   ```

## Tamaño

- Skyboxes: ~150 MB
- Texturas: ~15 MB
- UI Images: ~5 MB
- **Total: ~170 MB**

## Notas

- Estos recursos NO están incluidos en el repositorio de GitHub por su tamaño
- Se distribuyen por separado via GitHub Releases
- Son necesarios para que la aplicación funcione correctamente

---

YUMMAN RIVALS v$version
"@

Set-Content -Path "$tempDir/README.txt" -Value $readmeContent

Write-Host "[7/7] Creando archivo ZIP..." -ForegroundColor Yellow
if (Test-Path $outputFile) {
    Remove-Item $outputFile
}

Compress-Archive -Path "$tempDir/*" -DestinationPath $outputFile -CompressionLevel Optimal

# Limpiar
Remove-Item -Recurse -Force $tempDir

# Mostrar resultado
$fileSize = (Get-Item $outputFile).Length / 1MB
Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "  PAQUETE CREADO EXITOSAMENTE" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "Archivo: $outputFile" -ForegroundColor Cyan
Write-Host "Tamaño: $([math]::Round($fileSize, 2)) MB" -ForegroundColor Cyan
Write-Host ""
Write-Host "Próximos pasos:" -ForegroundColor Yellow
Write-Host "1. Ve a GitHub → Releases → Create a new release" -ForegroundColor White
Write-Host "2. Tag: v$version-resources" -ForegroundColor White
Write-Host "3. Sube el archivo: $outputFile" -ForegroundColor White
Write-Host "4. Publica el release" -ForegroundColor White
Write-Host ""
