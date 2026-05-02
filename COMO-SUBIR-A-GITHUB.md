# Como Subir a GitHub - Guía Simple

## Paso 1: Crear Repositorio en GitHub

1. Ve a https://github.com/new
2. Nombre: `yumman-rivals`
3. Descripción: `YUMMAN RIVALS - Roblox Texture Manager`
4. Visibilidad: **Privado** (recomendado)
5. NO marques ninguna opción (README, .gitignore, LICENSE)
6. Click en "Create repository"

## Paso 2: Copiar URL del Repositorio

GitHub te mostrará una página con comandos. Copia la URL que aparece, será algo como:

```
https://github.com/TU-USUARIO/yumman-rivals.git
```

## Paso 3: Ejecutar Script de Subida

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
.\scripts\upload-to-github.ps1 -RepoUrl "https://github.com/TU-USUARIO/yumman-rivals.git"
```

Reemplaza `TU-USUARIO` con tu nombre de usuario de GitHub.

## Paso 4: Verificar

1. Ve a tu repositorio en GitHub
2. Deberías ver todos los archivos
3. Verifica que NO aparezcan:
   - Carpeta `resources-encrypted/`
   - Carpeta `obfuscated/`
   - Archivo `encryption-key.txt`
   - Archivos `.bat`

## Alternativa: Comandos Manuales

Si prefieres hacerlo manualmente:

```bash
# Agregar remote
git remote add origin https://github.com/TU-USUARIO/yumman-rivals.git

# Verificar rama
git branch -M main

# Subir código
git push -u origin main
```

## Problemas Comunes

### Error: "remote origin already exists"

```bash
git remote remove origin
git remote add origin https://github.com/TU-USUARIO/yumman-rivals.git
git push -u origin main
```

### Error: "Authentication failed"

Si usas HTTPS, GitHub puede pedirte un token de acceso personal:

1. Ve a GitHub → Settings → Developer settings → Personal access tokens
2. Generate new token (classic)
3. Marca: `repo` (Full control of private repositories)
4. Copia el token
5. Úsalo como contraseña cuando git te lo pida

### Error: "Permission denied"

Si usas SSH, verifica que tu clave SSH esté configurada:

```bash
ssh -T git@github.com
```

Si no funciona, configura SSH:
https://docs.github.com/en/authentication/connecting-to-github-with-ssh

## Próximos Pasos

Una vez subido el código:

### 1. Preparar Recursos

```powershell
.\scripts\prepare-resources-package.ps1
```

Esto crea: `yumman-rivals-resources-v1.0.0.zip` (~170 MB)

### 2. Subir Recursos a GitHub

1. Ve a tu repositorio en GitHub
2. Click en "Releases" → "Create a new release"
3. Tag: `v1.0.0-resources`
4. Title: `Resources Package v1.0.0`
5. Arrastra el ZIP creado
6. Click en "Publish release"

### 3. Configurar Supabase (Analytics)

1. Ve a https://supabase.com
2. Crea cuenta (gratis)
3. Crea proyecto: `yumman-rivals-analytics`
4. Ve a SQL Editor
5. Copia y ejecuta el contenido de `docs/database-schema.sql`
6. Ve a Settings → API
7. Copia:
   - Project URL
   - anon public key
8. Guárdalos para después

### 4. Implementar Auto-Updates

Sigue la guía completa en:
`docs/AUTO-UPDATES-IMPLEMENTATION.md`

## Resumen

```
1. Crear repo en GitHub
2. Ejecutar: .\scripts\upload-to-github.ps1 -RepoUrl "URL"
3. Verificar en GitHub
4. Preparar recursos: .\scripts\prepare-resources-package.ps1
5. Subir recursos a GitHub Releases
6. Configurar Supabase
7. Implementar auto-updates
```

---

Listo para subir a GitHub.
