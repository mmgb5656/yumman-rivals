# Subir Release v1.0.0 a GitHub

## Archivos Compilados Listos

✅ `dist/YUMMAN RIVALS-Setup-1.0.0.exe` (137 MB)
✅ `dist/YUMMAN RIVALS-Portable-1.0.0.exe` (137 MB)
✅ `dist/latest.yml` (archivo de configuración para auto-updates)

## Pasos para Subir a GitHub

### 1. Crear Tag v1.0.0

```powershell
git tag v1.0.0
git push origin v1.0.0
```

### 2. Crear Release en GitHub

1. **Abre tu navegador** y ve a:
   ```
   https://github.com/mmgb5656/yumman-rivals/releases/new
   ```

2. **Selecciona el tag**: `v1.0.0` (debería aparecer en el dropdown)

3. **Release title**: 
   ```
   YUMMAN RIVALS v1.0.0
   ```

4. **Descripción** (copia y pega):

```markdown
# 🎉 Primera Versión Oficial de YUMMAN RIVALS

## Características Principales

### 🎨 Personalización Completa
- **25+ skyboxes personalizados** - Cambia el cielo de Rivals con un click
- **Texturas Ruptic Dark** - Negro completo para mejor visibilidad
- **Conversión de imágenes** - Convierte cualquier imagen a skybox
- **Preview en tiempo real** - Ve cómo se verá antes de aplicar

### 🚀 Soporte Multi-Ejecutor
- ✅ Roblox oficial
- ✅ Fishtrap
- ✅ Bloxtrap
- 🔍 Detección automática de versiones

### ⚡ Método rbx-storage
- Sin permisos de administrador
- Aplicación rápida
- Compatible con todas las versiones
- Menos propenso a ser bloqueado

### 🔄 Auto-Updates Automáticos
- Verifica actualizaciones al iniciar
- Verifica cada 30 minutos
- Descarga e instala automáticamente
- Sin intervención manual

### 🎨 Interfaz Moderna
- Diseño profesional con Next.js
- Tema oscuro
- Componentes UI modernos (shadcn/ui)
- Experiencia fluida

## 📥 Instalación

### Opción 1: Instalador (Recomendado)
1. Descarga `YUMMAN-RIVALS-Setup-1.0.0.exe`
2. Ejecuta el instalador
3. Sigue las instrucciones
4. ¡Listo para usar!

### Opción 2: Versión Portable
1. Descarga `YUMMAN-RIVALS-Portable-1.0.0.exe`
2. Ejecuta directamente (no requiere instalación)
3. Guarda en cualquier carpeta

## 🎮 Uso

1. Abre YUMMAN RIVALS
2. Selecciona tu ejecutor (Roblox, Fishtrap, Bloxtrap)
3. Elige un skybox de la galería
4. Click en "Aplicar"
5. Abre Roblox Rivals y disfruta

## 📋 Requisitos

- Windows 10/11 (64-bit)
- 200 MB de espacio libre
- Conexión a internet (solo primera vez)

## 🔧 Características Técnicas

- **Tamaño del instalador**: 137 MB (incluye todos los recursos)
- **Método de aplicación**: rbx-storage (rápido y seguro)
- **Auto-updates**: Automático cada 30 minutos
- **Soporte**: Roblox, Fishtrap, Bloxtrap

## ⚠️ Notas Importantes

- **Primera ejecución**: La app está lista para usar inmediatamente
- **Actualizaciones**: Se descargan e instalan automáticamente
- **Antivirus**: Algunos antivirus pueden dar falsos positivos (es seguro)
- **Permisos**: No requiere permisos de administrador

## 🐛 Reportar Problemas

Si encuentras algún problema:
1. Ve a [Issues](https://github.com/mmgb5656/yumman-rivals/issues)
2. Describe el problema
3. Incluye capturas de pantalla si es posible

## 📝 Changelog

### Añadido
- Sistema de skyboxes personalizados (25+)
- Texturas Ruptic Dark
- Soporte multi-ejecutor
- Auto-updates automáticos
- Interfaz moderna con Next.js
- Método rbx-storage
- Conversión de imágenes a skybox
- Preview en tiempo real

### Mejorado
- Detección automática de ejecutores
- Velocidad de aplicación de texturas
- Experiencia de usuario

## 🙏 Créditos

- **Desarrollador**: YUMMAN
- **UI Components**: shadcn/ui
- **Framework**: Electron + Next.js
- **Comunidad**: Gracias por el apoyo

## 📄 Licencia

MIT License - Ver [LICENSE](https://github.com/mmgb5656/yumman-rivals/blob/main/LICENSE) para más detalles

---

**Versión**: 1.0.0  
**Fecha**: 2 de Mayo, 2026  
**Build**: Estable  
**Tamaño**: 137 MB
```

5. **Subir Archivos**:
   - Arrastra o selecciona estos 3 archivos desde la carpeta `dist/`:
     - `YUMMAN RIVALS-Setup-1.0.0.exe`
     - `YUMMAN RIVALS-Portable-1.0.0.exe`
     - `latest.yml`

6. **Configuración**:
   - ✅ Marca "Set as the latest release"
   - ❌ NO marques "Set as a pre-release"

7. **Publicar**:
   - Click en el botón verde **"Publish release"**

## Verificación

Después de publicar, verifica que:

1. Los 3 archivos se subieron correctamente
2. El release aparece en: https://github.com/mmgb5656/yumman-rivals/releases
3. Los usuarios pueden descargar los archivos
4. El tag v1.0.0 está visible

## Probar Auto-Updates

Para probar que el auto-update funciona:

1. Instala la versión 1.0.0
2. Cambia la versión en `package.json` a 1.0.1
3. Compila nueva versión: `npm run build:win`
4. Crea release v1.0.1 en GitHub
5. Abre la app v1.0.0
6. Debería detectar la actualización automáticamente

## Distribución

Una vez publicado, puedes compartir el link:

```
https://github.com/mmgb5656/yumman-rivals/releases/latest
```

Este link siempre apunta a la última versión.

## Próximos Pasos

1. ✅ Compilar app (HECHO)
2. ⏳ Crear tag v1.0.0
3. ⏳ Subir release a GitHub
4. ⏳ Probar instalador
5. ⏳ Distribuir a usuarios

---

¡Todo listo para publicar!
