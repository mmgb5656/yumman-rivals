# Instrucciones para Subir a GitHub

## Estado Actual

El repositorio local está listo con el commit inicial. Todos los archivos confidenciales han sido excluidos del repositorio.

## Archivos Excluidos (NO están en el repositorio)

### Archivos Confidenciales
- `encryption-key.txt` - Clave de encriptación
- `encryptResources.js` - Script de encriptación
- `resourceDecryptor.js` - Desencriptador de recursos
- `obfuscate.js` - Script de ofuscación
- `obfuscated/` - Código ofuscado
- `resources-encrypted/` - Recursos encriptados

### Recursos Pesados (170 MB)
- `resources/skyboxes/` - 25 skyboxes personalizados
- `resources/textures/` - Texturas Ruptic Dark
- `resources/ui-images/` - Previews de skyboxes
- Todos los archivos `.tex`, `.dds`, `.png`, `.jpg`

### Archivos Temporales
- Todos los archivos `.bat` de diagnóstico
- Archivos de documentación temporal (`.md` de desarrollo)
- Carpetas de desarrollo antiguas (`b_T3CMYRoNfAY/`)

## Pasos para Subir a GitHub

### 1. Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre del repositorio: `yumman-rivals` (o el que prefieras)
3. Descripción: `YUMMAN RIVALS - Roblox Texture Manager`
4. Visibilidad: **Privado** (recomendado) o Público
5. NO inicialices con README, .gitignore o LICENSE (ya los tenemos)
6. Click en "Create repository"

### 2. Conectar Repositorio Local con GitHub

Copia los comandos que GitHub te muestra (opción "push an existing repository"):

```bash
git remote add origin https://github.com/TU-USUARIO/yumman-rivals.git
git branch -M main
git push -u origin main
```

O si prefieres SSH:

```bash
git remote add origin git@github.com:TU-USUARIO/yumman-rivals.git
git branch -M main
git push -u origin main
```

### 3. Verificar que Todo se Subió Correctamente

1. Ve a tu repositorio en GitHub
2. Verifica que NO aparezcan:
   - Carpeta `resources-encrypted/`
   - Carpeta `obfuscated/`
   - Archivo `encryption-key.txt`
   - Archivos `.bat`
   - Carpeta `resources/skyboxes/` con contenido
3. Verifica que SÍ aparezcan:
   - `README.md`
   - `LICENSE`
   - `package.json`
   - `main.js`, `preload.js`, etc.
   - Carpeta `b_W1nO7XZBZq9/` (UI)
   - `docs/` con documentación

## Próximos Pasos

### 1. Subir Recursos a GitHub Releases

Los recursos (170 MB) deben distribuirse via GitHub Releases:

1. Ve a tu repositorio en GitHub
2. Click en "Releases" → "Create a new release"
3. Tag: `v1.0.0-resources`
4. Title: `Resources Package v1.0.0`
5. Description:
   ```
   Recursos para YUMMAN RIVALS v1.0.0
   
   Incluye:
   - 25 skyboxes personalizados
   - Texturas Ruptic Dark
   - Previews de UI
   
   Extrae este archivo en la carpeta `resources/` del proyecto.
   ```
6. Sube un archivo ZIP con:
   - `resources/skyboxes/` (con todos los skyboxes)
   - `resources/textures/` (texturas Ruptic Dark)
   - `resources/ui-images/` (previews)

### 2. Configurar GitHub Actions para Auto-Build

Crea el archivo `.github/workflows/build.yml`:

```yaml
name: Build and Release

on:
  push:
    tags:
      - 'v*'

jobs:
  build:
    runs-on: windows-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm install
      
      - name: Install UI dependencies
        run: |
          cd b_W1nO7XZBZq9
          npm install
      
      - name: Build UI
        run: npm run build:ui
      
      - name: Build Electron App
        run: npm run build:win
      
      - name: Upload artifacts
        uses: actions/upload-artifact@v3
        with:
          name: yumman-rivals-windows
          path: dist/*.exe
      
      - name: Create Release
        uses: softprops/action-gh-release@v1
        if: startsWith(github.ref, 'refs/tags/')
        with:
          files: dist/*.exe
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 3. Configurar Supabase para Analytics

1. Crea cuenta en https://supabase.com
2. Crea nuevo proyecto
3. Ejecuta el SQL de `docs/database-schema.sql`
4. Copia las credenciales (URL y API Key)
5. Agrégalas como GitHub Secrets:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`

### 4. Implementar electron-updater

Instala la dependencia:

```bash
npm install electron-updater
```

Modifica `main.js` para agregar auto-updates (ver documentación de electron-updater).

## Comandos Útiles

```bash
# Ver estado del repositorio
git status

# Ver archivos ignorados
git status --ignored

# Ver log de commits
git log --oneline

# Ver archivos en el último commit
git show --name-only

# Ver diferencias
git diff

# Agregar remote (si no lo hiciste)
git remote add origin https://github.com/TU-USUARIO/yumman-rivals.git

# Ver remotes configurados
git remote -v

# Push a GitHub
git push -u origin main

# Crear tag para release
git tag v1.0.0
git push origin v1.0.0
```

## Notas Importantes

1. **Nunca subas archivos confidenciales**
   - Si accidentalmente subes algo confidencial, NO basta con borrarlo en un nuevo commit
   - Debes reescribir el historial de git o eliminar el repositorio y crear uno nuevo

2. **Recursos pesados**
   - Los recursos (170 MB) NO van en el repositorio
   - Se distribuyen via GitHub Releases
   - Los usuarios los descargan en la primera ejecución

3. **Versiones**
   - Usa tags semánticos: `v1.0.0`, `v1.1.0`, etc.
   - Cada tag puede tener su propio Release con binarios

4. **Privacidad**
   - Si el repo es público, cualquiera puede ver el código
   - Si es privado, solo tú y colaboradores autorizados

## Verificación Final

Antes de hacer público el repositorio, verifica:

- [ ] No hay archivos confidenciales
- [ ] No hay claves de encriptación
- [ ] No hay recursos pesados (solo estructura vacía)
- [ ] README.md está completo
- [ ] LICENSE está presente
- [ ] .gitignore funciona correctamente
- [ ] Documentación está actualizada

## Soporte

Si tienes problemas:

1. Revisa que el remote esté configurado: `git remote -v`
2. Verifica tu autenticación con GitHub
3. Si usas HTTPS, puede pedirte usuario/contraseña o token
4. Si usas SSH, verifica que tu clave SSH esté configurada

---

Repositorio listo para subir a GitHub.
