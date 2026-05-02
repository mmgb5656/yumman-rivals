# Instalador NSIS Personalizado

## Descripción

El instalador de YUMMAN RIVALS usa NSIS (Nullsoft Scriptable Install System) con diseño personalizado moderno.

## Características del Instalador

### Diseño Visual
- **Header personalizado** (150x57 pixels): Gradiente morado/azul con logo
- **Sidebar personalizado** (164x314 pixels): Branding completo con colores del tema
- **Colores del tema**: Gradiente de #667eea (morado) a #764ba2 (morado oscuro)
- **Tipografía**: Sans-serif moderna y limpia

### Funcionalidades
- Instalación en directorio personalizable
- Acceso directo en escritorio y menú inicio
- Desinstalador incluido
- Idioma: Español
- Ejecutar app al finalizar instalación
- Requiere permisos de administrador (para modificar texturas de Roblox)

## Archivos del Instalador

### Imágenes Personalizadas
- `installer-header.bmp` - Header superior del instalador (150x57 px)
- `installer-sidebar.bmp` - Barra lateral del instalador (164x314 px)

### Configuración
La configuración del instalador está en `package.json` bajo la sección `build.nsis`:

```json
{
  "nsis": {
    "oneClick": false,
    "allowToChangeInstallationDirectory": true,
    "createDesktopShortcut": true,
    "createStartMenuShortcut": true,
    "shortcutName": "YUMMAN RIVALS",
    "license": "LICENSE.txt",
    "installerIcon": "icon.ico",
    "uninstallerIcon": "icon.ico",
    "installerHeader": "installer-header.bmp",
    "installerSidebar": "installer-sidebar.bmp",
    "uninstallerSidebar": "installer-sidebar.bmp",
    "installerHeaderIcon": "icon.ico",
    "deleteAppDataOnUninstall": false,
    "displayLanguageSelector": false,
    "multiLanguageInstaller": false,
    "language": "es_ES",
    "warningsAsErrors": false,
    "perMachine": false,
    "allowElevation": true,
    "runAfterFinish": true,
    "menuCategory": true
  }
}
```

## Regenerar Imágenes del Instalador

Si necesitas regenerar las imágenes (por ejemplo, para cambiar el diseño):

### Opción 1: Usar el Script Automático

```powershell
node create-installer-images.js
```

Este script:
1. Crea `installer-header.bmp` con gradiente y texto "YUMMAN RIVALS"
2. Crea `installer-sidebar.bmp` con gradiente y branding completo
3. Usa los colores del tema (#667eea → #764ba2)

### Opción 2: Crear Manualmente

Puedes crear las imágenes manualmente con cualquier editor de imágenes (Photoshop, GIMP, etc.):

**installer-header.bmp:**
- Tamaño: 150x57 pixels
- Formato: BMP (24-bit)
- Diseño: Gradiente horizontal morado/azul + texto "YUMMAN RIVALS"

**installer-sidebar.bmp:**
- Tamaño: 164x314 pixels
- Formato: BMP (24-bit)
- Diseño: Gradiente vertical morado/azul + logo + texto

### Colores del Tema
- Morado claro: `#667eea` (RGB: 102, 126, 234)
- Morado oscuro: `#764ba2` (RGB: 118, 75, 162)

## Compilar el Instalador

Una vez que las imágenes están listas:

```powershell
# 1. Compilar interfaz
cd b_W1nO7XZBZq9
npm run build
cd ..

# 2. Compilar instalador
npm run build:win
```

Esto generará:
- `dist/YUMMAN RIVALS-Setup-1.0.0.exe` - Instalador con diseño personalizado
- `dist/YUMMAN RIVALS-Portable-1.0.0.exe` - Versión portable
- `dist/latest.yml` - Configuración para auto-updates

## Probar el Instalador

1. Ejecuta el `.exe` generado
2. Verifica que:
   - El header muestra el gradiente y texto correctamente
   - El sidebar muestra el branding completo
   - La instalación funciona correctamente
   - Los accesos directos se crean
   - La app se ejecuta al finalizar

## Personalización Adicional

### Cambiar Colores

Edita `create-installer-images.js` y modifica los valores RGB:

```javascript
// Color inicial (morado claro)
const r1 = 102, g1 = 126, b1 = 234;

// Color final (morado oscuro)
const r2 = 118, g2 = 75, b2 = 162;
```

### Cambiar Texto

Edita las líneas de `print()` en el script:

```javascript
// Header
header.print(font, 10, 20, 'TU TEXTO AQUI', 130);

// Sidebar
sidebar.print(fontBig, 10, 100, 'TU TEXTO\nAQUI', 144);
```

### Agregar Logo/Imagen

Si tienes un logo en formato PNG/JPG, puedes agregarlo:

```javascript
const logo = await Jimp.read('tu-logo.png');
logo.resize(100, 100); // Redimensionar
sidebar.composite(logo, 32, 30); // Posicionar en sidebar
```

## Solución de Problemas

### "Las imágenes no se ven en el instalador"
- Verifica que los archivos `.bmp` existen en la raíz del proyecto
- Verifica que el formato es BMP de 24-bit (no 32-bit con alpha)
- Verifica que los tamaños son exactos (150x57 y 164x314)

### "Error al compilar el instalador"
- Verifica que `electron-builder` está instalado
- Verifica que las rutas en `package.json` son correctas
- Ejecuta `npm install` para asegurar dependencias

### "El texto no se ve bien"
- Ajusta las posiciones X/Y en el script
- Prueba con diferentes fuentes de Jimp
- Considera crear las imágenes manualmente con un editor gráfico

## Recursos

- [NSIS Documentation](https://nsis.sourceforge.io/Docs/)
- [electron-builder NSIS Options](https://www.electron.build/configuration/nsis)
- [Jimp Documentation](https://github.com/jimp-dev/jimp)

---

Instalador personalizado creado para YUMMAN RIVALS
