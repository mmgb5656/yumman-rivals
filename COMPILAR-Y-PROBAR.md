# Compilar y Probar YUMMAN RIVALS

## Sistema Implementado

### ✅ Auto-Updates
- Verifica actualizaciones al iniciar la app
- Verifica cada 30 minutos automáticamente
- Descarga e instala actualizaciones con un click
- Notificaciones visuales al usuario

### ✅ Descarga Automática de Recursos
- Detecta si faltan recursos al iniciar
- Descarga automáticamente desde GitHub Releases
- Ventana de progreso visual
- Extrae y configura todo automáticamente

### ✅ Instalador Ligero
- Solo 5-10 MB (sin recursos)
- Descarga recursos en primera ejecución
- Instalador NSIS profesional

## Pasos para Compilar

### 0. Generar Imágenes del Instalador (Primera vez)

Si es la primera vez que compilas o quieres regenerar las imágenes:

```powershell
node create-installer-images.js
```

Esto creará:
- `installer-header.bmp` (150x57 pixels) - Header del instalador
- `installer-sidebar.bmp` (164x314 pixels) - Sidebar del instalador

Con diseño moderno y gradiente morado/azul (#667eea → #764ba2)

### 1. Compilar la Interfaz

```powershell
cd b_W1nO7XZBZq9
npm run build
cd ..
```

### 2. Compilar la Aplicación

```powershell
npm run build:win
```

Esto creará:
- `dist/YUMMAN RIVALS-Setup-1.0.0.exe` - Instalador NSIS con diseño personalizado (137 MB)
- `dist/YUMMAN RIVALS-Portable-1.0.0.exe` - Versión portable (137 MB)
- `dist/latest.yml` - Archivo de configuración para auto-updates

El instalador incluye:
- Diseño moderno con gradiente morado/azul
- Header y sidebar personalizados
- Interfaz en español
- Previews de skyboxes incluidos
- Auto-updates integrado

## Probar Localmente

### Probar en Modo Desarrollo

```powershell
npm start
```

Esto:
1. Usa los recursos locales (carpeta `resources/`)
2. NO verifica actualizaciones
3. Abre DevTools automáticamente

### Probar el Instalador

1. Instala el `.exe` generado
2. La app se instalará en: `C:\Users\[USER]\AppData\Local\Programs\yumman-rivals\`
3. Al abrir por primera vez:
   - Mostrará ventana de descarga
   - Descargará recursos desde GitHub (358 MB)
   - Extraerá en: `C:\Users\[USER]\AppData\Roaming\yumman-rivals\resources\`
4. Verificará actualizaciones automáticamente

## Subir Release a GitHub

### 1. Crear Tag

```powershell
git tag v1.0.0
git push origin v1.0.0
```

### 2. Crear Release en GitHub

1. Ve a: https://github.com/mmgb5656/yumman-rivals/releases/new
2. Tag: `v1.0.0`
3. Title: `YUMMAN RIVALS v1.0.0`
4. Description:
```
Primera versión oficial de YUMMAN RIVALS

Características:
- 25+ skyboxes personalizados
- Texturas Ruptic Dark
- Soporte multi-ejecutor (Roblox, Fishtrap, Bloxtrap)
- Auto-updates automáticos
- Descarga de recursos en primera ejecución

Instalación:
1. Descarga YUMMAN-RIVALS-Setup-1.0.0.exe
2. Ejecuta el instalador
3. La app descargará los recursos automáticamente
4. ¡Listo para usar!

Tamaño del instalador: ~5 MB
Tamaño de recursos: ~358 MB (se descargan automáticamente)
```

5. Sube los archivos:
   - `YUMMAN-RIVALS-Setup-1.0.0.exe`
   - `YUMMAN-RIVALS-Portable-1.0.0.exe`
   - `latest.yml`

6. Click "Publish release"

## Cómo Funciona el Auto-Update

### Para el Usuario:

1. **Primera Instalación**:
   - Descarga instalador (5 MB)
   - Instala
   - App descarga recursos (358 MB) automáticamente
   - Listo para usar

2. **Actualizaciones Posteriores**:
   - App verifica updates al iniciar
   - Si hay nueva versión: muestra notificación
   - Usuario click "Descargar"
   - Descarga en segundo plano
   - Al terminar: "¿Reiniciar ahora?"
   - Se actualiza automáticamente

3. **Verificación Automática**:
   - Cada 30 minutos verifica si hay updates
   - No interrumpe al usuario
   - Solo notifica si hay actualización disponible

### Para el Desarrollador:

1. **Hacer Cambios**:
   - Modifica código
   - Actualiza versión en `package.json`
   - Commit y push

2. **Crear Nueva Versión**:
   ```powershell
   # Actualizar versión
   npm version patch  # 1.0.0 -> 1.0.1
   # o
   npm version minor  # 1.0.0 -> 1.1.0
   # o
   npm version major  # 1.0.0 -> 2.0.0
   
   # Compilar
   npm run build:win
   
   # Crear tag
   git push origin v1.0.1
   ```

3. **Subir a GitHub**:
   - Crear release con el nuevo tag
   - Subir archivos `.exe` y `latest.yml`
   - Publicar

4. **Usuarios se Actualizan Automáticamente**:
   - Al abrir la app, detecta nueva versión
   - Descarga e instala automáticamente
   - Sin intervención manual

## Estructura de Archivos

### En Desarrollo:
```
yumman-rivals/
├── resources/          # Recursos locales (170 MB)
├── main.js            # Proceso principal
├── updater.js         # Auto-updates
├── resourceDownloader.js  # Descarga de recursos
└── ...
```

### En Producción (Instalado):
```
C:\Users\[USER]\AppData\Local\Programs\yumman-rivals\
├── YUMMAN RIVALS.exe  # Ejecutable (5 MB)
├── resources/         # (vacío, no incluido)
└── ...

C:\Users\[USER]\AppData\Roaming\yumman-rivals\
├── resources/         # Recursos descargados (358 MB)
│   ├── skyboxes/
│   ├── textures/
│   └── ui-images/
└── logs/             # Logs de la app
```

## Verificar que Todo Funciona

### Checklist:

- [ ] Generar imágenes del instalador: `node create-installer-images.js`
- [ ] Verificar que existen `installer-header.bmp` y `installer-sidebar.bmp`
- [ ] Compilar interfaz: `npm run build:ui`
- [ ] Compilar app: `npm run build:win`
- [ ] Instalar el `.exe` generado
- [ ] Verificar diseño del instalador (gradiente morado/azul, texto visible)
- [ ] Verificar que descarga recursos automáticamente
- [ ] Verificar que la app funciona correctamente
- [ ] Crear release en GitHub con tag v1.0.0
- [ ] Subir archivos `.exe` y `latest.yml`
- [ ] Cambiar versión a 1.0.1 en `package.json`
- [ ] Compilar nueva versión
- [ ] Crear release v1.0.1
- [ ] Abrir app v1.0.0 y verificar que detecta actualización

## Solución de Problemas

### "No se pueden descargar recursos"
- Verifica conexión a internet
- Verifica que el release v1.0.0-resources existe en GitHub
- Verifica la URL en `resourceDownloader.js`

### "No detecta actualizaciones"
- Verifica que `latest.yml` está en el release
- Verifica que el tag es correcto (v1.0.0, no 1.0.0)
- Verifica que `publish` está configurado en `package.json`

### "Error al instalar actualización"
- Verifica que el usuario tiene permisos de administrador
- Verifica que no hay antivirus bloqueando

## Próximos Pasos

1. Compilar y probar localmente
2. Crear release v1.0.0 en GitHub
3. Distribuir a usuarios
4. Monitorear logs y feedback
5. Implementar analytics con Supabase (opcional)

---

Todo listo para compilar y distribuir!
