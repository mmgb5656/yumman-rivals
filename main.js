const { app, BrowserWindow, ipcMain, dialog, shell, protocol } = require('electron');
const path = require('path');
const fs = require('fs-extra');
const os = require('os');
const log = require('electron-log');
const { convertImageToSkybox, generatePreview } = require('./skyConverter');
const RbxStorageManager = require('./rbxStorageManager');
const AtmosphereManager = require('./atmosphereManager');
const Updater = require('./updater');
const ResourceDownloader = require('./resourceDownloader');

let mainWindow;
let updater;
let downloadWindow;
const rbxStorage = new RbxStorageManager();
const atmosphere = new AtmosphereManager();
const resourceDownloader = new ResourceDownloader();

// Configurar logging
log.transports.file.level = 'info';
log.info('App iniciada');

// Rutas de recursos empaquetados
// En producción, los recursos están en .asar.unpacked o en userData
const isPackaged = app.isPackaged;
let RESOURCES_PATH;

if (isPackaged) {
  // En producción: usar userData para recursos descargados
  RESOURCES_PATH = resourceDownloader.getResourcesPath();
  log.info('Modo empaquetado - Ruta de recursos:', RESOURCES_PATH);
} else {
  // En desarrollo: carpeta resources local
  RESOURCES_PATH = path.join(__dirname, 'resources');
  log.info('Modo desarrollo - Ruta de recursos:', RESOURCES_PATH);
}
  
const SKYBOXES_PATH = path.join(RESOURCES_PATH, 'skyboxes', 'all-skyboxes', 'ALL SKYBOXES');
const TEXTURES_PATH = path.join(RESOURCES_PATH, 'textures', 'ruptic-dark', 'Ruptic Dark');
const UI_IMAGES_PATH = path.join(RESOURCES_PATH, 'ui-images');

// Log para debugging
console.log('SKYBOXES_PATH:', SKYBOXES_PATH);
console.log('TEXTURES_PATH:', TEXTURES_PATH);

// Rutas por defecto
const DEFAULT_PATHS = {
  roblox: path.join(os.homedir(), 'AppData', 'Local', 'Roblox', 'Versions'),
  fishstrap: path.join(os.homedir(), 'AppData', 'Local', 'Fishstrap', 'Versions'),
  fishtrap: path.join(os.homedir(), 'AppData', 'Local', 'Fishstrap', 'Versions'), // Alias
  bloxtrap: path.join(os.homedir(), 'AppData', 'Local', 'Bloxtrap', 'Versions'),
  texturesBackup: path.join(app.getPath('userData'), 'backup'),
  customSkybox: path.join(app.getPath('userData'), 'custom_skybox'),
  previews: path.join(app.getPath('userData'), 'previews'),
  // Recursos empaquetados
  resources: RESOURCES_PATH,
  skyboxes: SKYBOXES_PATH,
  textures: TEXTURES_PATH,
  uiImages: UI_IMAGES_PATH
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
      webSecurity: false  // Permitir cargar recursos locales
    },
    autoHideMenuBar: true,
    icon: path.join(__dirname, 'icon.ico'),
    backgroundColor: '#0a0a0f',
    title: 'YUMMAN RIVALS'
  });

  // Desarrollo: cargar Next.js dev server
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    // Producción: usar nueva interfaz
    let uiPath;
    
    if (app.isPackaged) {
      // En producción empaquetada, la UI está en el ASAR
      uiPath = path.join(__dirname, 'b_W1nO7XZBZq9', 'out', 'index.html');
    } else {
      // En desarrollo
      uiPath = path.join(__dirname, 'b_W1nO7XZBZq9', 'out', 'index.html');
    }
    
    console.log('Cargando interfaz desde:', uiPath);
    console.log('Archivo existe:', fs.existsSync(uiPath));
    
    if (fs.existsSync(uiPath)) {
      mainWindow.loadFile(uiPath);
    } else {
      console.error('No se encontró la interfaz en:', uiPath);
      mainWindow.loadURL('data:text/html,<h1 style="color:white;font-family:sans-serif;text-align:center;margin-top:100px;">Error: No se encontró la interfaz<br><small>Ruta: ' + uiPath + '</small></h1>');
    }
  }
  
  // NO abrir DevTools en producción
  // mainWindow.webContents.openDevTools();
  
  // Abrir enlaces externos en el navegador, no en Electron
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Crear ventana de descarga de recursos
function createDownloadWindow() {
  downloadWindow = new BrowserWindow({
    width: 500,
    height: 300,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    autoHideMenuBar: true,
    resizable: false,
    frame: false,
    icon: path.join(__dirname, 'icon.ico'),
    backgroundColor: '#0a0a0f',
    title: 'Descargando Recursos'
  });

  // Crear HTML simple para la ventana de descarga
  const downloadHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }
        .container {
          text-align: center;
          padding: 40px;
        }
        h1 {
          font-size: 24px;
          margin-bottom: 10px;
        }
        .status {
          font-size: 14px;
          opacity: 0.9;
          margin-bottom: 20px;
        }
        .progress-bar {
          width: 100%;
          height: 8px;
          background: rgba(255,255,255,0.2);
          border-radius: 4px;
          overflow: hidden;
          margin-top: 20px;
        }
        .progress-fill {
          height: 100%;
          background: white;
          width: 0%;
          transition: width 0.3s ease;
        }
        .spinner {
          border: 3px solid rgba(255,255,255,0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          animation: spin 1s linear infinite;
          margin: 20px auto;
        }
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>YUMMAN RIVALS</h1>
        <div class="spinner"></div>
        <div class="status" id="status">Preparando descarga...</div>
        <div class="progress-bar">
          <div class="progress-fill" id="progress"></div>
        </div>
      </div>
      <script>
        window.electronAPI.onDownloadProgress((data) => {
          document.getElementById('status').textContent = data.status;
          if (data.progress !== null) {
            document.getElementById('progress').style.width = data.progress + '%';
          }
        });
      </script>
    </body>
    </html>
  `;

  downloadWindow.loadURL('data:text/html;charset=utf-8,' + encodeURIComponent(downloadHTML));
  
  return downloadWindow;
}

// Verificar y descargar recursos si es necesario
async function checkAndDownloadResources() {
  try {
    log.info('Verificando recursos...');
    
    // PRIMERO: Intentar usar recursos locales (carpeta resources/)
    const localResourcesPath = path.join(__dirname, 'resources');
    const localSkyboxes = path.join(localResourcesPath, 'skyboxes');
    const localTextures = path.join(localResourcesPath, 'textures');
    
    if (fs.existsSync(localSkyboxes) && fs.existsSync(localTextures)) {
      log.info('✓ Usando recursos locales de la carpeta resources/');
      // Actualizar rutas para usar recursos locales
      RESOURCES_PATH = localResourcesPath;
      DEFAULT_PATHS.resources = RESOURCES_PATH;
      DEFAULT_PATHS.skyboxes = path.join(RESOURCES_PATH, 'skyboxes', 'all-skyboxes', 'ALL SKYBOXES');
      DEFAULT_PATHS.textures = path.join(RESOURCES_PATH, 'textures', 'ruptic-dark', 'Ruptic Dark');
      DEFAULT_PATHS.uiImages = path.join(RESOURCES_PATH, 'ui-images');
      return true;
    }
    
    log.info('Recursos locales no encontrados, verificando recursos descargados...');
    
    // SEGUNDO: Si no hay recursos locales, verificar recursos descargados
    const hasResources = await resourceDownloader.checkResources();
    
    if (hasResources) {
      log.info('✓ Usando recursos descargados previamente');
      return true;
    }
    
    // TERCERO: Si no hay recursos, descargar desde GitHub (SOLO EN PRODUCCIÓN)
    if (!app.isPackaged) {
      log.warn('Modo desarrollo: No hay recursos locales ni descargados');
      log.warn('Continuando sin recursos (algunas funciones no estarán disponibles)');
      return true; // Continuar de todos modos en desarrollo
    }
    
    log.info('Recursos no encontrados, iniciando descarga desde GitHub...');
    
    // Crear ventana de descarga
    const dlWindow = createDownloadWindow();
    
    // Timeout de 30 segundos para la conexión inicial
    const downloadTimeout = setTimeout(() => {
      log.error('Timeout: La descarga tardó demasiado');
      if (dlWindow && !dlWindow.isDestroyed()) {
        dlWindow.close();
      }
    }, 30000);
    
    try {
      // Descargar recursos
      await resourceDownloader.downloadResources(
        (progress) => {
          // Enviar progreso
          if (dlWindow && !dlWindow.isDestroyed()) {
            dlWindow.webContents.send('download-progress', {
              progress,
              status: null
            });
          }
        },
        (status) => {
          // Enviar estado
          if (dlWindow && !dlWindow.isDestroyed()) {
            dlWindow.webContents.send('download-progress', {
              progress: null,
              status
            });
          }
        }
      );
      
      clearTimeout(downloadTimeout);
      log.info('Recursos descargados correctamente');
      
      // Cerrar ventana de descarga
      if (dlWindow && !dlWindow.isDestroyed()) {
        dlWindow.close();
      }
      
      // Actualizar rutas de recursos
      RESOURCES_PATH = resourceDownloader.getResourcesPath();
      DEFAULT_PATHS.resources = RESOURCES_PATH;
      DEFAULT_PATHS.skyboxes = path.join(RESOURCES_PATH, 'skyboxes');
      DEFAULT_PATHS.textures = path.join(RESOURCES_PATH, 'textures');
      DEFAULT_PATHS.uiImages = path.join(RESOURCES_PATH, 'ui-images');
      
      return true;
    } catch (downloadError) {
      clearTimeout(downloadTimeout);
      throw downloadError;
    }
  } catch (error) {
    log.error('Error descargando recursos:', error);
    
    // Cerrar ventana de descarga si existe
    if (dlWindow && !dlWindow.isDestroyed()) {
      dlWindow.close();
    }
    
    // Mostrar diálogo con opciones
    const result = await dialog.showMessageBox({
      type: 'error',
      title: 'Error al Descargar Recursos',
      message: 'No se pudieron descargar los recursos necesarios',
      detail: `Error: ${error.message}\n\nLos recursos (skyboxes y texturas) son necesarios para usar la aplicación.\n\n¿Qué deseas hacer?`,
      buttons: ['Reintentar', 'Continuar sin Recursos', 'Salir'],
      defaultId: 0,
      cancelId: 2
    });
    
    if (result.response === 0) {
      // Reintentar
      log.info('Usuario eligió reintentar descarga');
      return await checkAndDownloadResources();
    } else if (result.response === 1) {
      // Continuar sin recursos (modo desarrollo)
      log.warn('Usuario eligió continuar sin recursos');
      dialog.showMessageBox({
        type: 'warning',
        title: 'Modo Sin Recursos',
        message: 'La aplicación continuará sin recursos',
        detail: 'Algunas funciones no estarán disponibles:\n\n' +
                '- No se podrán aplicar skyboxes\n' +
                '- No se podrán aplicar texturas Ruptic Dark\n' +
                '- Las previews no estarán disponibles\n\n' +
                'Puedes descargar los recursos manualmente desde:\n' +
                'https://github.com/mmgb5656/yumman-rivals/releases'
      });
      return true; // Continuar de todos modos
    } else {
      // Salir
      return false;
    }
  }
}

app.whenReady().then(async () => {
  // Verificar y descargar recursos si es necesario
  const resourcesReady = await checkAndDownloadResources();
  
  if (!resourcesReady) {
    app.quit();
    return;
  }
  
  // Crear ventana principal
  createWindow();
  
  // Inicializar auto-updater
  updater = new Updater(mainWindow);
  updater.startAutoCheck();
});

app.on('window-all-closed', () => {
  // Detener verificación automática
  if (updater) {
    updater.stopAutoCheck();
  }
  
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// IPC Handlers

// Obtener rutas por defecto
ipcMain.handle('get-default-paths', () => {
  return DEFAULT_PATHS;
});

// Seleccionar carpeta
ipcMain.handle('select-folder', async (event, title) => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openDirectory'],
    title: title || 'Seleccionar carpeta'
  });
  
  return result.canceled ? null : result.filePaths[0];
});

// Verificar si Roblox está instalado
ipcMain.handle('verify-roblox-path', async (event, robloxPath) => {
  try {
    if (!fs.existsSync(robloxPath)) {
      return { valid: false, message: 'La ruta no existe' };
    }
    
    // Buscar la carpeta de versión más reciente (por fecha de modificación)
    const versions = fs.readdirSync(robloxPath)
      .filter(f => f.startsWith('version-'))
      .map(f => ({
        name: f,
        path: path.join(robloxPath, f),
        mtime: fs.statSync(path.join(robloxPath, f)).mtime
      }))
      .sort((a, b) => b.mtime - a.mtime); // Ordenar por fecha más reciente primero
    
    if (versions.length === 0) {
      return { valid: false, message: 'No se encontraron versiones de Roblox' };
    }
    
    const latestVersion = versions[0].name;
    const contentPath = path.join(robloxPath, latestVersion, 'PlatformContent', 'pc', 'textures');
    
    console.log('Versiones encontradas:', versions.map(v => v.name));
    console.log('Versión más reciente (por fecha):', latestVersion);
    console.log('Ruta de texturas:', contentPath);
    
    if (!fs.existsSync(contentPath)) {
      return { valid: false, message: 'No se encontró la carpeta de texturas' };
    }
    
    return { 
      valid: true, 
      message: 'Roblox encontrado correctamente',
      texturePath: contentPath,
      version: latestVersion
    };
  } catch (error) {
    return { valid: false, message: error.message };
  }
});

// Crear backup de texturas originales
ipcMain.handle('create-backup', async (event, texturePath) => {
  try {
    const backupPath = DEFAULT_PATHS.texturesBackup;
    
    // Si ya existe backup, no hacer nada
    if (fs.existsSync(backupPath) && fs.readdirSync(backupPath).length > 0) {
      return { success: true, message: 'Backup ya existe' };
    }
    
    await fs.ensureDir(backupPath);
    await fs.copy(texturePath, backupPath);
    
    return { success: true, message: 'Backup creado correctamente' };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// Aplicar texturas negras
ipcMain.handle('apply-black-textures', async (event, texturePath) => {
  try {
    console.log('=== APLICANDO TEXTURAS NEGRAS ===');
    console.log('Ruta de texturas Roblox:', texturePath);
    
    const ruptikDarkPath = TEXTURES_PATH;
    console.log('Ruta de Ruptic Dark:', ruptikDarkPath);
    console.log('Ruptic Dark existe:', fs.existsSync(ruptikDarkPath));
    
    if (!fs.existsSync(ruptikDarkPath)) {
      return { 
        success: false, 
        message: 'No se encontró la carpeta de texturas Ruptic Dark' 
      };
    }
    
    // Copiar TODO el contenido de Ruptic Dark a la carpeta de texturas de Roblox
    console.log('Copiando todo el contenido de Ruptic Dark...');
    
    // Obtener lista de archivos y carpetas
    const items = fs.readdirSync(ruptikDarkPath);
    console.log(`Total de items a copiar: ${items.length}`);
    
    let copiedCount = 0;
    let readOnlyCount = 0;
    
    for (const item of items) {
      const sourcePath = path.join(ruptikDarkPath, item);
      const destPath = path.join(texturePath, item);
      
      try {
        await fs.copy(sourcePath, destPath, { overwrite: true });
        copiedCount++;
        console.log(`  ✓ Copiado: ${item}`);
        
        // Marcar como solo lectura (recursivamente si es carpeta)
        try {
          const { exec } = require('child_process');
          await new Promise((resolve) => {
            // /S para recursivo en carpetas
            exec(`attrib +R "${destPath}" /S /D`, (error) => {
              if (!error) {
                readOnlyCount++;
                console.log(`  ✓ Protegido: ${item}`);
              }
              resolve();
            });
          });
        } catch (error) {
          // Ignorar errores de solo lectura
        }
      } catch (error) {
        console.log(`  ✗ Error copiando ${item}:`, error.message);
      }
    }
    
    console.log(`Total copiados: ${copiedCount}/${items.length}`);
    console.log(`Total protegidos: ${readOnlyCount}/${copiedCount}`);
    
    if (copiedCount === 0) {
      return { 
        success: false, 
        message: 'No se pudo copiar ningún archivo' 
      };
    }
    
    return { 
      success: true, 
      message: `Texturas negras aplicadas: ${copiedCount} items copiados, ${readOnlyCount} protegidos` 
    };
  } catch (error) {
    console.error('Error al aplicar texturas negras:', error);
    return { success: false, message: error.message };
  }
});

// Aplicar cielo oscuro (intenta rbx-storage primero, luego método tradicional)
ipcMain.handle('apply-dark-sky', async (event, texturePath) => {
  try {
    const darkSkySource = path.join(TEXTURES_PATH, 'sky');
    
    if (!fs.existsSync(darkSkySource)) {
      return { success: false, message: 'No se encontraron texturas de cielo oscuro' };
    }
    
    // Intentar método rbx-storage primero (más rápido)
    const rbxResult = await rbxStorage.applySkybox(darkSkySource);
    
    if (rbxResult.success) {
      return {
        success: true,
        message: 'Cielo oscuro aplicado (método rápido)',
        method: 'rbx-storage'
      };
    }
    
    // Si falla, usar método tradicional
    const skyPath = path.join(texturePath, 'sky');
    await fs.ensureDir(skyPath);
    await fs.copy(darkSkySource, skyPath, { overwrite: true });
    
    return {
      success: true,
      message: 'Cielo oscuro aplicado (método tradicional)',
      method: 'traditional'
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// Restaurar texturas originales
ipcMain.handle('restore-original', async (event, texturePath) => {
  try {
    const backupPath = DEFAULT_PATHS.texturesBackup;
    
    if (!fs.existsSync(backupPath)) {
      return { success: false, message: 'No se encontró backup de texturas originales' };
    }
    
    await fs.copy(backupPath, texturePath, { overwrite: true });
    
    return { success: true, message: 'Texturas originales restauradas' };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// Aplicar preset personalizado
ipcMain.handle('apply-custom-preset', async (event, presetName, texturePath) => {
  try {
    const presetPath = path.join(__dirname, presetName, presetName);
    
    if (!fs.existsSync(presetPath)) {
      return { success: false, message: 'Preset no encontrado' };
    }
    
    // Copiar todas las carpetas del preset
    const folders = fs.readdirSync(presetPath);
    
    for (const folder of folders) {
      const src = path.join(presetPath, folder);
      const dest = path.join(texturePath, folder);
      
      if (fs.statSync(src).isDirectory()) {
        await fs.copy(src, dest, { overwrite: true });
      }
    }
    
    return { success: true, message: `Preset "${presetName}" aplicado` };
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// Obtener lista de presets disponibles
ipcMain.handle('get-available-presets', async () => {
  try {
    const presets = [];
    const items = fs.readdirSync(__dirname);
    
    for (const item of items) {
      const itemPath = path.join(__dirname, item);
      if (fs.statSync(itemPath).isDirectory() && 
          fs.existsSync(path.join(itemPath, item))) {
        presets.push(item);
      }
    }
    
    return { success: true, presets };
  } catch (error) {
    return { success: false, presets: [], message: error.message };
  }
});

// Seleccionar imagen para skybox personalizado
ipcMain.handle('select-sky-image', async () => {
  const result = await dialog.showOpenDialog(mainWindow, {
    properties: ['openFile'],
    title: 'Seleccionar imagen para el cielo',
    filters: [
      { name: 'Imágenes', extensions: ['jpg', 'jpeg', 'png', 'bmp'] }
    ]
  });
  
  if (result.canceled) {
    return { success: false, message: 'Selección cancelada' };
  }
  
  const imagePath = result.filePaths[0];
  
  // Generar preview
  await fs.ensureDir(DEFAULT_PATHS.previews);
  const previewPath = path.join(DEFAULT_PATHS.previews, 'current_preview.png');
  const previewResult = await generatePreview(imagePath, previewPath);
  
  if (!previewResult.success) {
    return { success: false, message: 'Error al generar preview' };
  }
  
  return {
    success: true,
    imagePath: imagePath,
    previewPath: previewPath,
    message: 'Imagen cargada correctamente'
  };
});

// Aplicar skybox personalizado (intenta rbx-storage primero)
ipcMain.handle('apply-custom-sky', async (event, imagePath, texturePath) => {
  try {
    // Convertir imagen a skybox
    await fs.ensureDir(DEFAULT_PATHS.customSkybox);
    const conversionResult = await convertImageToSkybox(imagePath, DEFAULT_PATHS.customSkybox);
    
    if (!conversionResult.success) {
      return conversionResult;
    }
    
    // Intentar método rbx-storage primero
    const rbxResult = await rbxStorage.applySkybox(DEFAULT_PATHS.customSkybox);
    
    if (rbxResult.success) {
      return {
        success: true,
        message: 'Cielo personalizado aplicado (método rápido)',
        method: 'rbx-storage'
      };
    }
    
    // Si falla, usar método tradicional
    const skyPath = path.join(texturePath, 'sky');
    await fs.copy(DEFAULT_PATHS.customSkybox, skyPath, { overwrite: true });
    
    return {
      success: true,
      message: 'Cielo personalizado aplicado (método tradicional)',
      method: 'traditional'
    };
    
  } catch (error) {
    return { success: false, message: error.message };
  }
});

// Obtener ruta de preview
ipcMain.handle('get-preview-path', async () => {
  const previewPath = path.join(DEFAULT_PATHS.previews, 'current_preview.png');
  
  if (fs.existsSync(previewPath)) {
    return { success: true, path: previewPath };
  }
  
  return { success: false, path: null };
});

// Detectar ejecutores disponibles
ipcMain.handle('detect-executors', async () => {
  const executors = [];
  
  console.log('=== DETECTANDO EJECUTORES ===');
  
  // Verificar Roblox normal
  if (fs.existsSync(DEFAULT_PATHS.roblox)) {
    const versions = fs.readdirSync(DEFAULT_PATHS.roblox)
      .filter(f => f.startsWith('version-'));
    if (versions.length > 0) {
      console.log(`✓ Roblox Normal encontrado: ${versions.length} versiones`);
      executors.push({
        id: 'roblox',
        name: 'Roblox Normal',
        path: DEFAULT_PATHS.roblox,
        found: true
      });
    }
  }
  
  // Verificar Fishstrap/Fishtrap
  if (fs.existsSync(DEFAULT_PATHS.fishstrap)) {
    const versions = fs.readdirSync(DEFAULT_PATHS.fishstrap)
      .filter(f => f.startsWith('version-'));
    if (versions.length > 0) {
      console.log(`✓ Fishstrap encontrado: ${versions.length} versiones`);
      executors.push({
        id: 'fishtrap',
        name: 'Fishtrap',
        path: DEFAULT_PATHS.fishstrap,
        found: true
      });
    }
  }
  
  // Verificar Bloxtrap
  if (fs.existsSync(DEFAULT_PATHS.bloxtrap)) {
    const versions = fs.readdirSync(DEFAULT_PATHS.bloxtrap)
      .filter(f => f.startsWith('version-'));
    if (versions.length > 0) {
      console.log(`✓ Bloxtrap encontrado: ${versions.length} versiones`);
      executors.push({
        id: 'bloxtrap',
        name: 'Bloxtrap',
        path: DEFAULT_PATHS.bloxtrap,
        found: true
      });
    }
  }
  
  console.log(`Total ejecutores encontrados: ${executors.length}`);
  
  return { success: true, executors };
});

// Obtener ruta de texturas según el ejecutor seleccionado
ipcMain.handle('get-executor-texture-path', async (event, executorId, customPath = null) => {
  try {
    console.log('=== OBTENIENDO RUTA DE TEXTURAS ===');
    console.log('Ejecutor:', executorId);
    console.log('Ruta personalizada:', customPath);
    
    let basePath;
    
    // Si hay ruta personalizada, usarla
    if (customPath && executorId === 'other') {
      basePath = customPath;
    } else {
      // Usar ruta predefinida según el ejecutor
      basePath = DEFAULT_PATHS[executorId] || DEFAULT_PATHS.roblox;
    }
    
    console.log('Ruta base:', basePath);
    
    if (!fs.existsSync(basePath)) {
      return { 
        valid: false, 
        message: `No se encontró la carpeta del ejecutor: ${basePath}` 
      };
    }
    
    // Buscar la versión más reciente (por fecha de modificación)
    const versions = fs.readdirSync(basePath)
      .filter(f => f.startsWith('version-'))
      .map(f => ({
        name: f,
        path: path.join(basePath, f),
        mtime: fs.statSync(path.join(basePath, f)).mtime
      }))
      .sort((a, b) => b.mtime - a.mtime); // Ordenar por fecha más reciente primero
    
    if (versions.length === 0) {
      return { 
        valid: false, 
        message: 'No se encontraron versiones en la carpeta' 
      };
    }
    
    const latestVersion = versions[0].name;
    const texturePath = path.join(basePath, latestVersion, 'PlatformContent', 'pc', 'textures');
    
    console.log('Versión más reciente:', latestVersion);
    console.log('Ruta de texturas:', texturePath);
    
    if (!fs.existsSync(texturePath)) {
      return { 
        valid: false, 
        message: 'No se encontró la carpeta de texturas' 
      };
    }
    
    return { 
      valid: true, 
      message: `${executorId} encontrado correctamente`,
      texturePath: texturePath,
      version: latestVersion,
      executor: executorId
    };
  } catch (error) {
    console.error('Error al obtener ruta de texturas:', error);
    return { 
      valid: false, 
      message: error.message 
    };
  }
});

// Abrir enlace de donación
ipcMain.handle('open-donation-link', async () => {
  // Reemplazar con tu enlace de donación (PayPal, Ko-fi, etc.)
  const donationUrl = 'https://ko-fi.com/yumman'; // Cambiar por tu URL
  await shell.openExternal(donationUrl);
  return { success: true };
});

// Función auxiliar para aplicar skybox en una ruta específica
// Función para copiar assets al rbx-storage (equivalente al move.bat)
async function applyRbxStorageAssets() {
  try {
    console.log('=== EJECUTANDO MOVE-SILENT.BAT (SKYFIX) ===');
    log.info('=== EJECUTANDO MOVE-SILENT.BAT (SKYFIX) ===');
    
    const { exec } = require('child_process');
    const { promisify } = require('util');
    const execAsync = promisify(exec);
    
    // Buscar el bat en múltiples ubicaciones
    const possibleBatPaths = [
      path.join(app.getPath('userData'), 'resources', 'move-silent.bat'),
      path.join(RESOURCES_PATH, 'move-silent.bat'),
      path.join(__dirname, 'resources', 'move-silent.bat'),
      path.join(process.resourcesPath, 'app.asar.unpacked', 'resources', 'move-silent.bat'),
    ];

    let batPath = null;
    for (const p of possibleBatPaths) {
      console.log('Verificando bat en:', p, '- Existe:', fs.existsSync(p));
      if (fs.existsSync(p)) {
        batPath = p;
        console.log('✓ Bat encontrado en:', batPath);
        log.info('✓ Bat encontrado en:', batPath);
        break;
      }
    }

    if (!batPath) {
      console.error('❌ move-silent.bat NO ENCONTRADO');
      log.warn('move-silent.bat no encontrado');
      return { success: false, message: 'move-silent.bat no encontrado' };
    }

    // Ejecutar el bat silenciosamente
    console.log('Ejecutando bat silenciosamente...');
    const batDir = path.dirname(batPath);
    await execAsync(`"${batPath}"`, { 
      shell: 'cmd.exe',
      windowsHide: true,
      cwd: batDir
    });
    
    console.log('✓ move-silent.bat ejecutado correctamente');
    log.info('✓ move-silent.bat ejecutado correctamente');
    
    return { success: true, message: 'Skyfix aplicado correctamente' };
    
  } catch (error) {
    console.error('❌ Error ejecutando move-silent.bat:', error);
    log.error('Error ejecutando move-silent.bat:', error);
    return { success: false, message: error.message };
  }
}

async function applySkyboxToPath(skyboxPath, texFiles, texturePath) {
  const { exec } = require('child_process');
  const skyPath = path.join(texturePath, 'sky');
  
  try {
    // Crear carpeta sky
    await fs.ensureDir(skyPath);
    
    // Quitar protección de la carpeta sky completa
    await new Promise((resolve) => {
      exec(`attrib -R "${skyPath}" /S /D`, () => resolve());
    });
    
    // Copiar archivos .tex
    let copiedCount = 0;
    for (const file of texFiles) {
      const src = path.join(skyboxPath, file);
      const dest = path.join(skyPath, file);
      
      try {
        await fs.copy(src, dest, { overwrite: true });
        copiedCount++;
      } catch (error) {
        console.log(`Error copiando ${file}:`, error.message);
      }
    }
    
    // Proteger toda la carpeta sky recursivamente
    await new Promise((resolve, reject) => {
      exec(`attrib +R "${skyPath}" /S /D`, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
    
    return {
      success: true,
      filesApplied: copiedCount
    };
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

// Aplicar skybox por nombre de carpeta
ipcMain.handle('apply-skybox-by-name', async (event, skyboxName, texturePath) => {
  try {
    console.log('=== APLICANDO SKYBOX ===');
    console.log('Nombre del skybox:', skyboxName);
    console.log('Ruta de texturas:', texturePath);
    
    const skyboxPath = path.join(SKYBOXES_PATH, skyboxName);
    console.log('Ruta del skybox:', skyboxPath);
    console.log('Skybox existe:', fs.existsSync(skyboxPath));
    
    if (!fs.existsSync(skyboxPath)) {
      return { 
        success: false, 
        message: `Skybox "${skyboxName}" no encontrado en: ${skyboxPath}` 
      };
    }
    
    // Listar todos los archivos en el skybox
    const allFiles = fs.readdirSync(skyboxPath);
    console.log('Archivos en skybox:', allFiles);
    
    // Filtrar: copiar solo archivos .tex
    const texFiles = allFiles.filter(f => f.endsWith('.tex'));
    
    console.log('Archivos .tex a copiar:', texFiles);
    
    if (texFiles.length === 0) {
      return {
        success: false,
        message: `No se encontraron archivos .tex en ${skyboxName}`
      };
    }

    // =====================================================
    // PASO 1: Aplicar via rbx-storage (método principal)
    // Equivalente al move.bat - copia los .tex como hashes
    // al rbx-storage de Roblox
    // =====================================================
    log.info('Aplicando via rbx-storage...');
    const rbxResult = await rbxStorage.applySkyboxFromTexFiles(skyboxPath);
    log.info('Resultado rbx-storage:', rbxResult);

    // =====================================================
    // PASO 2: Copiar assets fijos al rbx-storage
    // Estos son los archivos del move.bat original
    // =====================================================
    log.info('Aplicando assets fijos al rbx-storage...');
    await applyRbxStorageAssets();
    
    // DETECTAR SI HAY MÚLTIPLES VERSIONES Y APLICAR EN TODAS
    // Extraer el ejecutor de la ruta (Roblox, Fishstrap, Bloxtrap)
    const pathParts = texturePath.split(path.sep);
    const versionsIndex = pathParts.indexOf('Versions');
    
    let totalVersionsApplied = 0;
    let versionsWithSky = [];
    
    if (versionsIndex !== -1) {
      // Obtener la ruta base hasta "Versions"
      const basePath = pathParts.slice(0, versionsIndex + 1).join(path.sep);
      console.log('Ruta base de versiones:', basePath);
      
      // Buscar TODAS las versiones
      const allVersions = fs.readdirSync(basePath)
        .filter(f => f.startsWith('version-'))
        .map(f => ({
          name: f,
          path: path.join(basePath, f, 'PlatformContent', 'pc', 'textures'),
          mtime: fs.statSync(path.join(basePath, f)).mtime
        }))
        .sort((a, b) => b.mtime - a.mtime);
      
      console.log(`✓ Encontradas ${allVersions.length} versiones`);
      
      // Aplicar en TODAS las versiones
      for (const version of allVersions) {
        if (fs.existsSync(version.path)) {
          console.log(`Aplicando en ${version.name}...`);
          const result = await applySkyboxToPath(skyboxPath, texFiles, version.path);
          if (result.success) {
            totalVersionsApplied++;
            versionsWithSky.push(version.name);
          }
        }
      }

      // Aplicar assets al rbx-storage (equivalente al move.bat)
      // Ya se hizo arriba, no repetir
      
      return {
        success: true,
        message: `Skybox "${skyboxName}" aplicado en ${totalVersionsApplied} versión(es)`,
        versionsApplied: totalVersionsApplied,
        versions: versionsWithSky
      };
    }
    
    // Si no se detectaron múltiples versiones, aplicar solo en la ruta dada
    console.log('Aplicando en ruta única...');
    const result = await applySkyboxToPath(skyboxPath, texFiles, texturePath);

    // Aplicar assets al rbx-storage siempre
    log.info('Aplicando assets al rbx-storage...');
    await applyRbxStorageAssets();
    
    if (result.success) {
      return {
        success: true,
        message: `Skybox "${skyboxName}" aplicado (${result.filesApplied} archivos)`,
        filesApplied: result.filesApplied
      };
    } else {
      return {
        success: false,
        message: `Error al aplicar skybox: ${result.message}`
      };
    }
    
  } catch (error) {
    console.error(`Error al aplicar skybox:`, error);
    return { 
      success: false, 
      message: `Error al aplicar skybox: ${error.message}` 
    };
  }
});

// Obtener información de rbx-storage
ipcMain.handle('get-rbx-storage-info', async () => {
  return await rbxStorage.getInfo();
});


// Obtener presets de atmósfera disponibles
ipcMain.handle('get-atmosphere-presets', async () => {
  try {
    const presets = atmosphere.getAtmospherePresets();
    return { success: true, presets };
  } catch (error) {
    return { success: false, presets: {}, message: error.message };
  }
});

// Aplicar atmósfera oscura
ipcMain.handle('apply-atmosphere', async (event, presetName, texturePath) => {
  try {
    console.log('=== APLICANDO ATMÓSFERA ===');
    console.log('Preset:', presetName);
    console.log('Ruta de texturas:', texturePath);
    
    const presets = atmosphere.getAtmospherePresets();
    const preset = presets[presetName];
    
    if (!preset) {
      return {
        success: false,
        message: `Preset "${presetName}" no encontrado`
      };
    }
    
    const result = await atmosphere.applyDarkAtmosphere(texturePath, preset);
    
    return result;
  } catch (error) {
    console.error('Error al aplicar atmósfera:', error);
    return { success: false, message: error.message };
  }
});


// Handler para verificar actualizaciones manualmente
ipcMain.handle('check-for-updates', () => {
  if (updater) {
    updater.checkForUpdates();
    return { success: true, message: 'Verificando actualizaciones...' };
  }
  return { success: false, message: 'Updater no inicializado' };
});

// Handler para obtener versión de la app
ipcMain.handle('get-app-version', () => {
  return app.getVersion();
});

// Handler para verificar si hay recursos descargados
ipcMain.handle('check-resources', async () => {
  try {
    const hasResources = await resourceDownloader.checkResources();
    return { success: true, hasResources };
  } catch (error) {
    return { success: false, hasResources: false, message: error.message };
  }
});

// Handler para re-descargar recursos
ipcMain.handle('redownload-resources', async () => {
  try {
    const dlWindow = createDownloadWindow();
    
    await resourceDownloader.downloadResources(
      (progress) => {
        if (dlWindow && !dlWindow.isDestroyed()) {
          dlWindow.webContents.send('download-progress', { progress, status: null });
        }
      },
      (status) => {
        if (dlWindow && !dlWindow.isDestroyed()) {
          dlWindow.webContents.send('download-progress', { progress: null, status });
        }
      }
    );
    
    if (dlWindow && !dlWindow.isDestroyed()) {
      dlWindow.close();
    }
    
    return { success: true, message: 'Recursos descargados correctamente' };
  } catch (error) {
    return { success: false, message: error.message };
  }
});
