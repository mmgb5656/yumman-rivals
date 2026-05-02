# 📦 Estructura de Recursos

Los recursos (skyboxes, texturas) **NO están incluidos** en el repositorio de GitHub por su tamaño (~170 MB).

## 📁 Estructura Completa

```
resources/
├── skyboxes/
│   └── all-skyboxes/
│       └── ALL SKYBOXES/
│           ├── Aurora/
│           │   ├── assets/                    # Archivos hash para rbx-storage
│           │   │   ├── a564ec8aeef3614e788d02f0090089d8
│           │   │   ├── 7328622d2d509b95dd4dd2c721d1ca8b
│           │   │   ├── a50f6563c50ca4d5dcb255ee5cfab097
│           │   │   ├── 6c94b9385e52d221f0538aadaceead2d
│           │   │   ├── 9244e00ff9fd6cee0bb40a262bb35d31
│           │   │   └── 78cb2e93aee0cdbd79b15a866bc93a54
│           │   ├── ! SCREENSHOT.png           # Preview del skybox
│           │   ├── sky512_bk.tex              # Back
│           │   ├── sky512_dn.tex              # Down
│           │   ├── sky512_ft.tex              # Front
│           │   ├── sky512_lf.tex              # Left
│           │   ├── sky512_rt.tex              # Right
│           │   └── sky512_up.tex              # Up
│           ├── Beautiful/
│           ├── Blue/
│           ├── Chill gray/
│           ├── Chill pink/
│           ├── ChromaKey/
│           ├── Cyan/
│           ├── Emo/
│           ├── Goodnight/
│           ├── Hades/
│           ├── Hazy/
│           ├── Light Blue/
│           ├── Light pink/
│           ├── Moonlight/
│           ├── NeonSky/
│           ├── NeonSky2/
│           ├── Night/
│           ├── Orange/
│           ├── Overcast/
│           ├── Pandora/
│           ├── Pink Sunrise/
│           ├── Red/
│           ├── Space Blue/
│           ├── Spooky/
│           └── Universe/
│
├── textures/
│   └── ruptic-dark/
│       └── Ruptic Dark/
│           ├── sky/                           # Cielo negro
│           │   ├── diffuse.dds
│           │   ├── indoor512_bk.tex
│           │   ├── indoor512_dn.tex
│           │   ├── indoor512_ft.tex
│           │   ├── indoor512_lf.tex
│           │   ├── indoor512_rt.tex
│           │   ├── indoor512_up.tex
│           │   ├── sky512_bk.tex
│           │   ├── sky512_dn.tex
│           │   ├── sky512_ft.tex
│           │   ├── sky512_lf.tex
│           │   ├── sky512_rt.tex
│           │   └── sky512_up.tex
│           ├── aluminum/
│           ├── brick/
│           ├── cobblestone/
│           ├── concrete/
│           ├── diamondplate/
│           ├── fabric/
│           ├── glass/
│           ├── granite/
│           ├── grass/
│           ├── ice/
│           ├── marble/
│           ├── metal/
│           ├── pebble/
│           ├── plastic/
│           ├── rust/
│           ├── sand/
│           ├── slate/
│           ├── water/
│           ├── wood/
│           ├── woodplanks/
│           ├── brdfLUT.dds
│           ├── studs.dds
│           └── wangIndex.dds
│
└── ui-images/                                 # Previews para la UI
    ├── aurora.png
    ├── beautiful.png
    ├── blue.png
    ├── chill-gray.png
    ├── chill-pink.png
    ├── chromakey.png
    ├── cyan.png
    ├── emo.png
    ├── goodnight.png
    ├── hades.png
    ├── hazy.png
    ├── light-blue.png
    ├── light-pink.png
    ├── moonlight.png
    ├── neonsky.png
    ├── neonsky2.png
    ├── night.png
    ├── orange.png
    ├── overcast.png
    ├── pandora.png
    ├── pink-sunrise.png
    ├── red.png
    ├── space-blue.png
    ├── spooky.png
    └── universe.png
```

## 📊 Tamaños

| Recurso | Tamaño Aproximado |
|---------|-------------------|
| **Skyboxes** (25 carpetas) | ~150 MB |
| **Ruptic Dark** (texturas negras) | ~15 MB |
| **UI Images** (previews) | ~5 MB |
| **Total** | **~170 MB** |

## 🔧 Cómo Obtener los Recursos

### Para Usuarios

Los recursos se descargan automáticamente la primera vez que abres la app.

### Para Desarrolladores

1. **Opción 1: Descargar desde Releases**
   ```bash
   # Descarga skyboxes.zip desde GitHub Releases
   # Extrae en la carpeta resources/
   ```

2. **Opción 2: Crear tus propios recursos**
   - Coloca tus skyboxes en la estructura correcta
   - Ejecuta `CREAR-ASSETS-SKYBOXES.bat` para generar archivos hash

## 🎨 Agregar Nuevos Skyboxes

### Requisitos

Cada skybox debe tener:
- 6 archivos `.tex` (bk, dn, ft, lf, rt, up)
- 1 screenshot `! SCREENSHOT.png`
- Carpeta `assets/` con archivos hash

### Proceso

1. **Crear carpeta**:
   ```
   resources/skyboxes/all-skyboxes/ALL SKYBOXES/Mi Skybox/
   ```

2. **Agregar archivos .tex**:
   - `sky512_bk.tex` (back)
   - `sky512_dn.tex` (down)
   - `sky512_ft.tex` (front)
   - `sky512_lf.tex` (left)
   - `sky512_rt.tex` (right)
   - `sky512_up.tex` (up)

3. **Agregar screenshot**:
   - `! SCREENSHOT.png` (1920x1080 recomendado)

4. **Generar assets**:
   ```bash
   # Ejecutar script
   CREAR-ASSETS-SKYBOXES.bat
   ```

5. **Agregar preview para UI**:
   ```
   resources/ui-images/mi-skybox.png
   ```

## 🔐 Archivos Hash (rbx-storage)

Los archivos en la carpeta `assets/` son copias de los archivos `.tex` con nombres hash específicos que Roblox usa en su sistema de caché.

### Mapeo de Hashes

| Archivo Original | Hash (Nombre en assets/) |
|------------------|--------------------------|
| `sky512_ft.tex` | `a564ec8aeef3614e788d02f0090089d8` |
| `sky512_bk.tex` | `7328622d2d509b95dd4dd2c721d1ca8b` |
| `sky512_lf.tex` | `a50f6563c50ca4d5dcb255ee5cfab097` |
| `sky512_rt.tex` | `6c94b9385e52d221f0538aadaceead2d` |
| `sky512_up.tex` | `9244e00ff9fd6cee0bb40a262bb35d31` |
| `sky512_dn.tex` | `78cb2e93aee0cdbd79b15a866bc93a54` |

Estos hashes son **fijos** y no cambian entre skyboxes.

## 📦 Empaquetar Recursos para Release

```bash
# Comprimir recursos
cd resources
zip -r ../skyboxes.zip skyboxes/
zip -r ../textures.zip textures/
zip -r ../ui-images.zip ui-images/

# O todo junto
zip -r ../resources.zip .
```

## 🚀 Distribución

Los recursos se distribuyen de dos formas:

1. **Instalador completo** (~175 MB)
   - Incluye app + recursos
   - Para usuarios que prefieren descarga única

2. **Instalador ligero** (~5 MB) + descarga de recursos
   - App descarga recursos al iniciar
   - Más rápido de distribuir
   - Recomendado

## ❓ FAQ

### ¿Por qué no están en el repo?

GitHub tiene límite de 100 MB por archivo y los repos grandes son lentos de clonar.

### ¿Puedo usar mis propios skyboxes?

Sí, solo sigue la estructura y genera los assets.

### ¿Los recursos tienen copyright?

Los skyboxes son de la comunidad. Verifica la licencia de cada uno antes de redistribuir.

### ¿Cómo actualizo los recursos?

Publica una nueva versión en GitHub Releases con los recursos actualizados.
