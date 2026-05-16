# ✅ YUMMAN RIVALS — Estado Final del Proyecto

**Versión:** 1.0.1  
**Fecha:** Mayo 2026  
**Estado:** ✅ FUNCIONAL Y LISTO PARA DISTRIBUIR

---

## 🎮 ¿Qué es YUMMAN RIVALS?

Aplicación de escritorio para Windows que modifica las texturas y cielos del juego **Roblox Rivals**.  
Construida con **Electron + Next.js**. El usuario abre la app, elige un cielo o activa las texturas negras, y los cambios se aplican automáticamente en Roblox.

---

## ✅ ¿Funciona?

**Sí. Todo lo principal funciona:**

| Función | Estado |
|---------|--------|
| 25+ skyboxes predefinidos | ✅ Funciona |
| Texturas negras (Ruptic Dark) | ✅ Funciona |
| Protección de archivos (solo lectura) | ✅ Funciona |
| Multi-ejecutor: Roblox, Fishtrap, Bloxtrap | ✅ Funciona |
| Descarga automática de recursos (358 MB) | ✅ Funciona |
| Auto-updates desde GitHub | ✅ Funciona |
| Interfaz bilingüe ES / EN | ✅ Funciona |
| Onboarding de configuración inicial | ✅ Funciona |
| Instalador NSIS + versión portable | ✅ Funciona |

---

## 📦 Archivos compilados listos

```
dist/
├── YUMMAN RIVALS-Setup-1.0.0.exe     (76.87 MB) — Instalador completo
└── YUMMAN RIVALS-Portable-1.0.0.exe  (76.65 MB) — Sin instalación
```

Los recursos (skyboxes, texturas) se descargan automáticamente desde GitHub Releases la primera vez (~358 MB).

---

## 🗂️ Qué necesita la app para funcionar

Estos son los archivos y carpetas que la app **necesita obligatoriamente** para arrancar y funcionar:

### Archivos de código (raíz)
```
main.js                  — Proceso principal de Electron (backend)
preload.js               — Bridge seguro entre UI y backend
rbxStorageManager.js     — Aplica skyboxes vía rbx-storage
atmosphereManager.js     — Gestiona neblina/atmósfera
skyConverter.js          — Convierte imágenes a formato skybox
resourceDownloader.js    — Descarga recursos desde GitHub
updater.js               — Sistema de auto-updates
package.json             — Configuración y dependencias
icon.ico                 — Icono de la app
LICENSE.txt              — Licencia (requerida por el instalador NSIS)
installer-script.nsh     — Script personalizado del instalador
```

### Interfaz de usuario
```
b_W1nO7XZBZq9/out/       — Build estático de Next.js (la UI compilada)
```
> ⚠️ Si no existe esta carpeta, hay que generarla con:
> ```bash
> cd b_W1nO7XZBZq9
> npm run build
> ```

### Recursos (se descargan automáticamente en producción)
```
resources/
├── assets/              — Archivos hash para rbx-storage (cielo oscuro)
├── skyboxes/            — 25 skyboxes con 6 archivos .tex cada uno
├── textures/            — Texturas Ruptic Dark (21 materiales)
├── ui-images/           — Previews PNG de los skyboxes
├── move-silent.bat      — Script silencioso para aplicar cielos
└── paths.json           — Configuración de rutas
```

### Dependencias npm (se instalan con `npm install`)
```
electron          — Framework de escritorio
electron-builder  — Compilar instaladores
electron-updater  — Auto-updates
fs-extra          — Manejo de archivos
jimp              — Procesamiento de imágenes
adm-zip           — Descomprimir recursos descargados
axios             — Peticiones HTTP (descarga de recursos)
electron-log      — Logs de la app
uuid              — IDs únicos para analytics
```

---

## 🚀 Cómo reorganizar el proyecto en una carpeta limpia

El workspace actual tiene **más de 100 archivos .md**, scripts .bat sueltos, archivos de diagnóstico, y código de prueba mezclado con el código real. Lo ideal es mover solo lo necesario a una carpeta nueva y limpia.

### Estructura recomendada para la carpeta nueva

```
yumman-rivals-clean/
│
├── src/                          ← Código fuente de Electron
│   ├── main.js
│   ├── preload.js
│   ├── rbxStorageManager.js
│   ├── atmosphereManager.js
│   ├── skyConverter.js
│   ├── resourceDownloader.js
│   └── updater.js
│
├── ui/                           ← Código fuente de la interfaz (Next.js)
│   └── (contenido de b_W1nO7XZBZq9/ sin node_modules ni .next)
│
├── resources/                    ← Recursos de la app
│   ├── assets/
│   ├── skyboxes/
│   ├── textures/
│   ├── ui-images/
│   ├── move-silent.bat
│   └── paths.json
│
├── build/                        ← Configuración de compilación
│   ├── installer-script.nsh
│   └── icon.ico
│
├── docs/                         ← Solo documentación útil
│   ├── README.md
│   ├── COMO_FUNCIONA.md
│   ├── GUIA-USUARIO-FINAL.md
│   └── CONTRIBUTING.md
│
├── dist/                         ← Instaladores compilados (generado)
│
├── .env.example
├── .gitignore
├── LICENSE.txt
└── package.json
```

### Archivos que NO necesitas mover (se pueden eliminar o ignorar)

```
❌ Todos los *.md de diagnóstico y soluciones (100+ archivos)
❌ Scripts .bat de diagnóstico (diagnostico-*.bat, comparar-pcs.bat, etc.)
❌ Archivos de prueba (test-*.js, verify-setup.js)
❌ Scripts de creación de iconos (createIcon.js, createIcon256.js, etc.)
❌ b_T3CMYRoNfAY/ (versión antigua de la UI, ya no se usa)
❌ obfuscated/ (generado automáticamente al compilar)
❌ resources-encrypted/ (generado automáticamente al compilar)
❌ encryption-key.txt (¡NUNCA distribuir!)
❌ diagnostico-*.txt (archivos de diagnóstico de otras PCs)
❌ renderer.js (código legacy, reemplazado por la UI de Next.js)
❌ app.asar (build antiguo suelto en la raíz)
❌ *.zip (archivos de distribución, no van en el repo)
❌ roblox-scripts/ (scripts de otro proyecto, no de YUMMAN RIVALS)
```

---

## 📋 Pasos para crear la carpeta limpia

```bash
# 1. Crear carpeta nueva
mkdir yumman-rivals-clean

# 2. Copiar archivos de código
copy main.js yumman-rivals-clean\
copy preload.js yumman-rivals-clean\
copy rbxStorageManager.js yumman-rivals-clean\
copy atmosphereManager.js yumman-rivals-clean\
copy skyConverter.js yumman-rivals-clean\
copy resourceDownloader.js yumman-rivals-clean\
copy updater.js yumman-rivals-clean\
copy package.json yumman-rivals-clean\
copy icon.ico yumman-rivals-clean\
copy LICENSE.txt yumman-rivals-clean\
copy installer-script.nsh yumman-rivals-clean\
copy .env.example yumman-rivals-clean\
copy .gitignore yumman-rivals-clean\

# 3. Copiar la UI (sin node_modules)
xcopy /E /I /Y b_W1nO7XZBZq9 yumman-rivals-clean\ui /EXCLUDE:excluir.txt
# (excluir.txt debe contener: node_modules, .next)

# 4. Copiar recursos
xcopy /E /I /Y resources yumman-rivals-clean\resources

# 5. Instalar dependencias en la carpeta nueva
cd yumman-rivals-clean
npm install
cd ui
npm install
cd ..

# 6. Compilar la UI
cd ui && npm run build && cd ..

# 7. Probar
npm start
```

---

## ⚙️ Comandos principales

```bash
# Desarrollo
npm start                  # Iniciar app en modo desarrollo

# Compilar interfaz
cd b_W1nO7XZBZq9
npm run build

# Compilar instaladores
npm run build:win          # Genera Setup + Portable en dist/
```

---

## 🔑 Requisitos del sistema para desarrollar

- **Node.js** 18 o superior
- **npm** 9 o superior
- **Windows 10/11** (la app solo funciona en Windows)
- **Git** (para clonar y subir cambios)

---

## 🌐 Repositorio

- **GitHub:** https://github.com/mmgb5656/yumman-rivals
- **Releases:** https://github.com/mmgb5656/yumman-rivals/releases

---

## 💡 Resumen en una línea

> La app funciona. El único trabajo pendiente es limpiar el workspace moviendo solo los archivos necesarios a una carpeta nueva y organizada, dejando atrás los 100+ .md de diagnóstico, scripts de prueba y código legacy.
