# Script para convertir icono a 256x256
Add-Type -AssemblyName System.Drawing

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CONVERTIR ICONO A 256x256" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Verificar si existe el icono
if (-not (Test-Path "icon.ico")) {
    Write-Host "Error: No se encontro icon.ico" -ForegroundColor Red
    Write-Host ""
    Write-Host "Por favor copia tu icono como icon.ico primero" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "Icono encontrado: icon.ico" -ForegroundColor Green

# Leer el icono actual
try {
    $icon = [System.Drawing.Icon]::new("icon.ico")
    Write-Host "Tamaño actual: $($icon.Width)x$($icon.Height)" -ForegroundColor Green
    
    # Convertir a bitmap
    $bitmap = $icon.ToBitmap()
    $icon.Dispose()
    
    Write-Host ""
    Write-Host "Redimensionando a 256x256..." -ForegroundColor Yellow
    
    # Crear nuevo bitmap de 256x256
    $newBitmap = New-Object System.Drawing.Bitmap(256, 256)
    $graphics = [System.Drawing.Graphics]::FromImage($newBitmap)
    
    # Configurar calidad alta
    $graphics.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $graphics.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $graphics.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality
    
    # Dibujar imagen redimensionada
    $graphics.DrawImage($bitmap, 0, 0, 256, 256)
    
    # Guardar como PNG temporal
    $newBitmap.Save("icon-256.png", [System.Drawing.Imaging.ImageFormat]::Png)
    
    # Limpiar
    $graphics.Dispose()
    $newBitmap.Dispose()
    $bitmap.Dispose()
    
    Write-Host "PNG creado: icon-256.png (256x256)" -ForegroundColor Green
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "  SIGUIENTE PASO" -ForegroundColor Cyan
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Ahora necesitas convertir el PNG a ICO:" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "1. Ve a: https://convertio.co/png-ico/" -ForegroundColor White
    Write-Host "2. Sube: icon-256.png" -ForegroundColor White
    Write-Host "3. Descarga como: icon.ico" -ForegroundColor White
    Write-Host "4. Reemplaza el icon.ico actual" -ForegroundColor White
    Write-Host "5. Ejecuta: npm run build:win" -ForegroundColor Green
    Write-Host ""
    Write-Host "Presiona Enter para abrir el convertidor..." -ForegroundColor Yellow
    pause
    
    Start-Process "https://convertio.co/png-ico/"
    
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host ""
    Write-Host "No se pudo convertir el icono automaticamente." -ForegroundColor Yellow
    Write-Host "Por favor usa una herramienta online:" -ForegroundColor Yellow
    Write-Host "https://convertio.co/png-ico/" -ForegroundColor Cyan
    pause
    exit 1
}
