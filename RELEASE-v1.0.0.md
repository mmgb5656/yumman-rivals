# YUMMAN RIVALS v1.0.0 - Release Notes

## 🎉 Primera Versión Oficial

### Archivos Compilados

✅ **Instalador NSIS**: `YUMMAN RIVALS-Setup-1.0.0.exe` (137 MB)
✅ **Versión Portable**: `YUMMAN RIVALS-Portable-1.0.0.exe` (137 MB)
✅ **Auto-Update Config**: `latest.yml`

### Características Principales

#### 🎨 Personalización de Texturas
- 25+ skyboxes personalizados
- Texturas Ruptic Dark (negro completo)
- Conversión de imágenes a skybox
- Preview en tiempo real

#### 🚀 Soporte Multi-Ejecutor
- Roblox oficial
- Fishtrap
- Bloxtrap
- Detección automática de versiones

#### ⚡ Método rbx-storage
- Aplicación rápida sin permisos de administrador
- Compatible con todas las versiones de Roblox
- Menos propenso a ser bloqueado por antivirus

#### 🔄 Auto-Updates Automáticos
- Verifica actualizaciones al iniciar
- Verifica cada 30 minutos automáticamente
- Descarga e instala con un click
- Notificaciones visuales

#### 📦 Descarga Automática de Recursos
- Instalador ligero (137 MB incluye todo)
- Interfaz moderna con Next.js + shadcn/ui
- Tema oscuro profesional

### Instalación

1. Descarga `YUMMAN RIVALS-Setup-1.0.0.exe`
2. Ejecuta el instalador
3. Sigue las instrucciones
4. ¡Listo para usar!

### Uso

1. Abre YUMMAN RIVALS
2. Selecciona tu ejecutor (Roblox, Fishtrap, Bloxtrap)
3. Elige un skybox de la galería
4. Click en "Aplicar"
5. Abre Roblox Rivals y disfruta

### Requisitos del Sistema

- Windows 10/11 (64-bit)
- 200 MB de espacio libre
- Conexión a internet (para primera ejecución)

### Notas Técnicas

#### Estructura de Instalación

```
C:\Users\[USER]\AppData\Local\Programs\yumman-rivals\
├── YUMMAN RIVALS.exe
├── resources/
└── ...
```

#### Auto-Updates

La aplicación verifica automáticamente si hay nuevas versiones:
- Al iniciar la app
- Cada 30 minutos mientras está abierta

Cuando hay una actualización disponible:
1. Muestra notificación
2. Usuario acepta descargar
3. Descarga en segundo plano
4. Instala al cerrar la app

#### Recursos

Los recursos están incluidos en el instalador:
- 25 skyboxes personalizados
- Texturas Ruptic Dark
- Previews de UI
- Total: ~130 MB

### Próximas Actualizaciones

- [ ] Analytics con Supabase
- [ ] Más skyboxes
- [ ] Editor de skybox integrado
- [ ] Presets de atmósfera personalizados
- [ ] Soporte para más ejecutores

### Soporte

- **Issues**: https://github.com/mmgb5656/yumman-rivals/issues
- **Discussions**: https://github.com/mmgb5656/yumman-rivals/discussions

### Licencia

MIT License - Ver LICENSE para más detalles

### Créditos

- **Desarrollador**: YUMMAN
- **UI Components**: shadcn/ui
- **Framework**: Electron + Next.js
- **Icons**: Lucide Icons

---

## Para Desarrolladores

### Compilar desde Código Fuente

```powershell
# Clonar repositorio
git clone https://github.com/mmgb5656/yumman-rivals.git
cd yumman-rivals

# Instalar dependencias
npm install
cd b_W1nO7XZBZq9
npm install
cd ..

# Compilar
npm run build:win
```

### Estructura del Proyecto

```
yumman-rivals/
├── main.js                    # Proceso principal
├── updater.js                 # Auto-updates
├── resourceDownloader.js      # Descarga de recursos
├── skyConverter.js            # Conversión de imágenes
├── rbxStorageManager.js       # Método rbx-storage
├── atmosphereManager.js       # Gestor de atmósfera
├── preload.js                 # Bridge IPC
├── b_W1nO7XZBZq9/            # Interfaz Next.js
└── resources/                 # Recursos (skyboxes, texturas)
```

### Tecnologías Utilizadas

- **Electron 28** - Framework de aplicaciones
- **Next.js 14** - Framework React
- **shadcn/ui** - Componentes UI
- **Tailwind CSS** - Estilos
- **electron-updater** - Auto-updates
- **electron-builder** - Compilación

---

**Fecha de Release**: 2 de Mayo, 2026
**Versión**: 1.0.0
**Build**: Estable
