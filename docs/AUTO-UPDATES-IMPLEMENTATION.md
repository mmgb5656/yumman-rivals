# Implementación de Auto-Updates y Analytics

## Arquitectura General

```
┌─────────────────────────────────────────────────────────────┐
│                    YUMMAN RIVALS APP                        │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │   Electron   │  │  Next.js UI  │  │   Analytics  │     │
│  │   Main.js    │  │  Dashboard   │  │   Module     │     │
│  └──────┬───────┘  └──────────────┘  └──────┬───────┘     │
│         │                                     │              │
└─────────┼─────────────────────────────────────┼─────────────┘
          │                                     │
          │ electron-updater                    │ Supabase Client
          │                                     │
          ▼                                     ▼
┌─────────────────────┐              ┌─────────────────────┐
│   GitHub Releases   │              │     Supabase DB     │
│                     │              │                     │
│  - latest.yml       │              │  - app_sessions     │
│  - Setup.exe        │              │  - skybox_applied   │
│  - Portable.exe     │              │  - errors           │
└─────────────────────┘              └─────────────────────┘
```

## Fase 1: Configurar Supabase (Analytics)

### 1.1 Crear Proyecto en Supabase

1. Ve a https://supabase.com
2. Crea una cuenta (gratis)
3. Click en "New Project"
4. Nombre: `yumman-rivals-analytics`
5. Database Password: (genera una segura)
6. Region: Closest to your users
7. Plan: Free (25,000 rows, 500 MB storage)

### 1.2 Ejecutar Schema SQL

1. En Supabase, ve a SQL Editor
2. Copia el contenido de `docs/database-schema.sql`
3. Ejecuta el script
4. Verifica que se crearon las tablas:
   - `app_sessions`
   - `skybox_applied`
   - `errors`

### 1.3 Obtener Credenciales

1. Ve a Settings → API
2. Copia:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...`
3. Guárdalas en `.env.local`:

```env
SUPABASE_URL=https://xxxxx.supabase.co
SUPABASE_ANON_KEY=eyJhbGc...
```

### 1.4 Instalar Dependencias

```bash
npm install @supabase/supabase-js
```

### 1.5 Crear Módulo de Analytics

Crea `analytics.js`:

```javascript
const { createClient } = require('@supabase/supabase-js');
const os = require('os');
const crypto = require('crypto');

class Analytics {
  constructor() {
    // Credenciales de Supabase
    const supabaseUrl = process.env.SUPABASE_URL || 'https://xxxxx.supabase.co';
    const supabaseKey = process.env.SUPABASE_ANON_KEY || 'eyJhbGc...';
    
    this.supabase = createClient(supabaseUrl, supabaseKey);
    this.userId = this.generateUserId();
    this.sessionId = crypto.randomUUID();
  }

  // Generar ID único basado en hardware (anónimo)
  generateUserId() {
    const hostname = os.hostname();
    const platform = os.platform();
    const arch = os.arch();
    const cpus = os.cpus()[0].model;
    
    const data = `${hostname}-${platform}-${arch}-${cpus}`;
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  // Registrar inicio de sesión
  async trackAppOpened(version) {
    try {
      await this.supabase.from('app_sessions').insert({
        user_id: this.userId,
        session_id: this.sessionId,
        app_version: version,
        os_platform: os.platform(),
        os_version: os.release()
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  // Registrar aplicación de skybox
  async trackSkyboxApplied(skyboxName, executor) {
    try {
      await this.supabase.from('skybox_applied').insert({
        user_id: this.userId,
        session_id: this.sessionId,
        skybox_name: skyboxName,
        executor: executor
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }

  // Registrar error
  async trackError(errorMessage, errorStack) {
    try {
      await this.supabase.from('errors').insert({
        user_id: this.userId,
        session_id: this.sessionId,
        error_message: errorMessage,
        error_stack: errorStack
      });
    } catch (error) {
      console.error('Analytics error:', error);
    }
  }
}

module.exports = Analytics;
```

### 1.6 Integrar en main.js

```javascript
const Analytics = require('./analytics');
const analytics = new Analytics();

// Al iniciar la app
app.whenReady().then(() => {
  analytics.trackAppOpened(app.getVersion());
  createWindow();
});

// Al aplicar skybox
ipcMain.handle('apply-skybox', async (event, skyboxName, executor) => {
  try {
    // ... código existente ...
    
    // Track analytics
    await analytics.trackSkyboxApplied(skyboxName, executor);
    
    return { success: true };
  } catch (error) {
    await analytics.trackError(error.message, error.stack);
    throw error;
  }
});
```

## Fase 2: Implementar Auto-Updates

### 2.1 Instalar electron-updater

```bash
npm install electron-updater
```

### 2.2 Configurar package.json

Agrega la configuración de publish:

```json
{
  "build": {
    "publish": {
      "provider": "github",
      "owner": "TU-USUARIO",
      "repo": "yumman-rivals"
    }
  }
}
```

### 2.3 Crear Módulo de Updates

Crea `updater.js`:

```javascript
const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');

class Updater {
  constructor(mainWindow) {
    this.mainWindow = mainWindow;
    this.setupAutoUpdater();
  }

  setupAutoUpdater() {
    // Configuración
    autoUpdater.autoDownload = false;
    autoUpdater.autoInstallOnAppQuit = true;

    // Eventos
    autoUpdater.on('update-available', (info) => {
      this.onUpdateAvailable(info);
    });

    autoUpdater.on('update-not-available', () => {
      console.log('App is up to date');
    });

    autoUpdater.on('download-progress', (progress) => {
      this.onDownloadProgress(progress);
    });

    autoUpdater.on('update-downloaded', () => {
      this.onUpdateDownloaded();
    });

    autoUpdater.on('error', (error) => {
      console.error('Update error:', error);
    });
  }

  // Verificar actualizaciones
  checkForUpdates() {
    autoUpdater.checkForUpdates();
  }

  // Cuando hay actualización disponible
  onUpdateAvailable(info) {
    const response = dialog.showMessageBoxSync(this.mainWindow, {
      type: 'info',
      title: 'Actualización Disponible',
      message: `Nueva versión ${info.version} disponible`,
      detail: 'Descargar e instalar ahora?',
      buttons: ['Descargar', 'Más Tarde'],
      defaultId: 0,
      cancelId: 1
    });

    if (response === 0) {
      autoUpdater.downloadUpdate();
      
      // Mostrar progreso en la UI
      this.mainWindow.webContents.send('update-downloading');
    }
  }

  // Progreso de descarga
  onDownloadProgress(progress) {
    const percent = Math.round(progress.percent);
    this.mainWindow.webContents.send('update-progress', percent);
  }

  // Actualización descargada
  onUpdateDownloaded() {
    const response = dialog.showMessageBoxSync(this.mainWindow, {
      type: 'info',
      title: 'Actualización Lista',
      message: 'La actualización se instalará al cerrar la aplicación',
      detail: 'Reiniciar ahora?',
      buttons: ['Reiniciar', 'Más Tarde'],
      defaultId: 0,
      cancelId: 1
    });

    if (response === 0) {
      autoUpdater.quitAndInstall();
    }
  }
}

module.exports = Updater;
```

### 2.4 Integrar en main.js

```javascript
const Updater = require('./updater');

let updater;

app.whenReady().then(() => {
  createWindow();
  
  // Inicializar updater
  updater = new Updater(mainWindow);
  
  // Verificar actualizaciones al iniciar
  setTimeout(() => {
    updater.checkForUpdates();
  }, 3000);
});

// Handler para verificar actualizaciones manualmente
ipcMain.handle('check-for-updates', () => {
  updater.checkForUpdates();
});
```

### 2.5 Agregar UI para Updates

En `dashboard.tsx`:

```typescript
const [updateStatus, setUpdateStatus] = useState<string>('');
const [updateProgress, setUpdateProgress] = useState<number>(0);

useEffect(() => {
  // Escuchar eventos de actualización
  window.electron.on('update-downloading', () => {
    setUpdateStatus('Descargando actualización...');
  });

  window.electron.on('update-progress', (percent: number) => {
    setUpdateProgress(percent);
  });
}, []);

// Botón para verificar actualizaciones
<Button onClick={() => window.electron.checkForUpdates()}>
  Buscar Actualizaciones
</Button>

{updateStatus && (
  <div className="update-status">
    <p>{updateStatus}</p>
    {updateProgress > 0 && (
      <Progress value={updateProgress} />
    )}
  </div>
)}
```

## Fase 3: Configurar GitHub Actions

### 3.1 Crear Workflow

Ya creado en `.github/workflows/build.yml`

### 3.2 Configurar Secrets

En GitHub → Settings → Secrets and variables → Actions:

1. `SUPABASE_URL` - URL de tu proyecto Supabase
2. `SUPABASE_ANON_KEY` - API Key pública de Supabase

### 3.3 Crear Release

```bash
# Crear tag
git tag v1.0.0
git push origin v1.0.0

# GitHub Actions automáticamente:
# 1. Compila la app
# 2. Crea el instalador
# 3. Crea un Release
# 4. Sube los archivos .exe
```

## Fase 4: Descarga de Recursos en Primera Ejecución

### 4.1 Crear Módulo de Descarga

Crea `resourceDownloader.js`:

```javascript
const https = require('https');
const fs = require('fs-extra');
const path = require('path');
const { app } = require('electron');

class ResourceDownloader {
  constructor() {
    this.resourcesUrl = 'https://github.com/TU-USUARIO/yumman-rivals/releases/download/v1.0.0-resources/yumman-rivals-resources-v1.0.0.zip';
    this.resourcesPath = path.join(app.getPath('userData'), 'resources');
  }

  // Verificar si los recursos ya están descargados
  async checkResources() {
    const skyboxesPath = path.join(this.resourcesPath, 'skyboxes');
    return fs.existsSync(skyboxesPath);
  }

  // Descargar recursos
  async downloadResources(onProgress) {
    return new Promise((resolve, reject) => {
      const zipPath = path.join(app.getPath('temp'), 'resources.zip');
      const file = fs.createWriteStream(zipPath);

      https.get(this.resourcesUrl, (response) => {
        const totalSize = parseInt(response.headers['content-length'], 10);
        let downloadedSize = 0;

        response.on('data', (chunk) => {
          downloadedSize += chunk.length;
          const percent = Math.round((downloadedSize / totalSize) * 100);
          onProgress(percent);
        });

        response.pipe(file);

        file.on('finish', async () => {
          file.close();
          
          // Extraer ZIP
          await this.extractZip(zipPath);
          
          // Limpiar
          fs.unlinkSync(zipPath);
          
          resolve();
        });
      }).on('error', (error) => {
        fs.unlinkSync(zipPath);
        reject(error);
      });
    });
  }

  // Extraer ZIP
  async extractZip(zipPath) {
    const AdmZip = require('adm-zip');
    const zip = new AdmZip(zipPath);
    zip.extractAllTo(this.resourcesPath, true);
  }
}

module.exports = ResourceDownloader;
```

### 4.2 Integrar en main.js

```javascript
const ResourceDownloader = require('./resourceDownloader');

app.whenReady().then(async () => {
  const downloader = new ResourceDownloader();
  
  // Verificar si necesita descargar recursos
  const hasResources = await downloader.checkResources();
  
  if (!hasResources) {
    // Mostrar ventana de descarga
    const downloadWindow = createDownloadWindow();
    
    await downloader.downloadResources((percent) => {
      downloadWindow.webContents.send('download-progress', percent);
    });
    
    downloadWindow.close();
  }
  
  createWindow();
});
```

## Flujo Completo del Usuario

### Primera Instalación

1. Usuario descarga `YUMMAN-RIVALS-Setup.exe` (5 MB)
2. Ejecuta el instalador
3. App se abre y detecta que faltan recursos
4. Muestra ventana: "Descargando recursos... 0%"
5. Descarga 170 MB de GitHub Releases
6. Extrae recursos en `AppData/Roaming/yumman-rivals/resources`
7. App lista para usar

### Actualizaciones Posteriores

1. Usuario abre la app
2. App verifica actualizaciones en GitHub Releases
3. Si hay nueva versión:
   - Muestra notificación: "Nueva versión v1.1.0 disponible"
   - Usuario click en "Descargar"
   - Descarga en segundo plano
   - Muestra progreso: "Descargando... 45%"
   - Al terminar: "Reiniciar para actualizar?"
   - Usuario click en "Reiniciar"
   - App se cierra, instala actualización, se abre de nuevo
4. Si no hay actualización:
   - App funciona normalmente

### Analytics

Mientras el usuario usa la app:

1. Al abrir: Registra sesión en Supabase
2. Al aplicar skybox: Registra evento
3. Si hay error: Registra error con stack trace
4. Todo es anónimo (ID basado en hardware hash)

## Costos

- **GitHub**: Gratis (Actions, Releases, Storage)
- **Supabase**: Gratis (hasta 25,000 rows, 500 MB)
- **Total**: $0/mes

## Próximos Pasos

1. Implementar Supabase analytics
2. Implementar electron-updater
3. Crear primer release en GitHub
4. Subir paquete de recursos
5. Probar flujo completo
6. Distribuir a usuarios

---

Documentación completa para implementación de auto-updates y analytics.
