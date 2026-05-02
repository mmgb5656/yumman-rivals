# 📁 RECURSOS DE YUMMAN RIVALS

Esta carpeta contiene todos los recursos que se empaquetarán con la aplicación.

## 📂 Estructura

```
resources/
├── skyboxes/           # Todos los skyboxes disponibles
│   └── all-skyboxes/
│       └── ALL SKYBOXES/
│           └── ALL SKYBOXES/
│               ├── Night/
│               ├── Aurora/
│               ├── Moonlight/
│               └── ... (25 skyboxes en total)
│
├── textures/           # Texturas personalizadas
│   └── ruptic-dark/
│       └── Ruptic Dark/
│           ├── grass/
│           ├── wood/
│           ├── metal/
│           └── ... (21 materiales)
│
├── ui-images/          # Imágenes para la interfaz
│   ├── night.png
│   ├── aurora.png
│   └── ... (25 previews de skyboxes)
│
└── paths.json          # Configuración de rutas
```

## 🎯 Propósito

### Skyboxes (`skyboxes/`)
Contiene todos los skyboxes que los usuarios pueden aplicar en Roblox. Cada skybox tiene:
- 6 archivos `.tex` (sky512_bk, sky512_dn, sky512_ft, sky512_lf, sky512_rt, sky512_up)
- 1 archivo `! SCREENSHOT.png` (preview)

### Texturas (`textures/`)
Contiene las texturas oscuras de Ruptic Dark que se aplican a los materiales del juego para mejorar la visibilidad.

### UI Images (`ui-images/`)
Contiene las imágenes de preview de los skyboxes que se muestran en la interfaz de usuario.

## 🔧 Uso en el Código

Las rutas están centralizadas en `paths.json` y se acceden desde:
- `main.js` - Backend de Electron
- `b_W1nO7XZBZq9/lib/skyboxes.ts` - Lista de skyboxes para la UI

## 📦 Empaquetado

Al crear el instalador con `electron-builder`, esta carpeta completa se incluirá en el paquete final. Las rutas se resolverán automáticamente usando `__dirname` en Electron.

## ⚠️ Importante

- **NO** mover archivos fuera de esta estructura
- **NO** renombrar carpetas sin actualizar `paths.json`
- **NO** eliminar archivos, todos son necesarios para la app
