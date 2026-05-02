const { contextBridge, ipcRenderer } = require('electron');

// Exponer API segura al renderer
contextBridge.exposeInMainWorld('electronAPI', {
  // Obtener rutas por defecto
  getDefaultPaths: () => ipcRenderer.invoke('get-default-paths'),
  
  // Seleccionar carpeta
  selectFolder: (title) => ipcRenderer.invoke('select-folder', title),
  
  // Verificar ruta de Roblox
  verifyRobloxPath: (path) => ipcRenderer.invoke('verify-roblox-path', path),
  
  // Crear backup
  createBackup: (texturePath) => ipcRenderer.invoke('create-backup', texturePath),
  
  // Aplicar texturas negras
  applyBlackTextures: (texturePath) => ipcRenderer.invoke('apply-black-textures', texturePath),
  
  // Aplicar cielo oscuro
  applyDarkSky: (texturePath) => ipcRenderer.invoke('apply-dark-sky', texturePath),
  
  // Restaurar originales
  restoreOriginal: (texturePath) => ipcRenderer.invoke('restore-original', texturePath),
  
  // Aplicar preset personalizado
  applyCustomPreset: (presetName, texturePath) => ipcRenderer.invoke('apply-custom-preset', presetName, texturePath),
  
  // Obtener presets disponibles
  getAvailablePresets: () => ipcRenderer.invoke('get-available-presets'),
  
  // Seleccionar imagen para skybox
  selectSkyImage: () => ipcRenderer.invoke('select-sky-image'),
  
  // Aplicar skybox personalizado
  applyCustomSky: (imagePath, texturePath) => ipcRenderer.invoke('apply-custom-sky', imagePath, texturePath),
  
  // Aplicar skybox por nombre de carpeta
  applySkyboxByName: (skyboxName, texturePath) => ipcRenderer.invoke('apply-skybox-by-name', skyboxName, texturePath),
  
  // Obtener ruta de preview
  getPreviewPath: () => ipcRenderer.invoke('get-preview-path'),
  
  // Detectar ejecutores disponibles
  detectExecutors: () => ipcRenderer.invoke('detect-executors'),
  
  // Obtener ruta de texturas según ejecutor
  getExecutorTexturePath: (executorId, customPath) => ipcRenderer.invoke('get-executor-texture-path', executorId, customPath),
  
  // Abrir enlace de donación
  openDonationLink: () => ipcRenderer.invoke('open-donation-link'),
  
  // Auto-updates
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  onUpdateStatus: (callback) => ipcRenderer.on('update-status', (event, data) => callback(data)),
  
  // Recursos
  checkResources: () => ipcRenderer.invoke('check-resources'),
  redownloadResources: () => ipcRenderer.invoke('redownload-resources'),
  onDownloadProgress: (callback) => ipcRenderer.on('download-progress', (event, data) => callback(data))
});
