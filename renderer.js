// Este archivo se conectará con la UI de v0.dev
// Aquí van las funciones que llamarán a la API de Electron

let currentTexturePath = null;
let currentRobloxPath = null;
let currentSkyImagePath = null;
let adCountdown = 0;

// Inicializar la aplicación
async function initApp() {
  const paths = await window.electronAPI.getDefaultPaths();
  
  // Establecer rutas por defecto en los inputs
  document.getElementById('roblox-path').value = paths.roblox;
  document.getElementById('fisch-path').value = paths.fisch;
  
  // Verificar Roblox automáticamente
  await verifyRobloxInstallation(paths.roblox);
  
  // Cargar presets disponibles
  await loadAvailablePresets();
}

// Verificar instalación de Roblox
async function verifyRobloxInstallation(path) {
  const result = await window.electronAPI.verifyRobloxPath(path);
  
  const statusElement = document.getElementById('status-indicator');
  const logElement = document.getElementById('log-panel');
  
  if (result.valid) {
    currentRobloxPath = path;
    currentTexturePath = result.texturePath;
    
    statusElement.textContent = 'Conectado';
    statusElement.className = 'status-connected';
    
    addLog(`✓ Roblox encontrado: ${result.version}`, 'success');
    
    // Crear backup automáticamente
    const backupResult = await window.electronAPI.createBackup(currentTexturePath);
    addLog(backupResult.message, backupResult.success ? 'info' : 'error');
    
    // Habilitar botones
    enableActionButtons(true);
  } else {
    statusElement.textContent = 'Desconectado';
    statusElement.className = 'status-disconnected';
    
    addLog(`✗ Error: ${result.message}`, 'error');
    enableActionButtons(false);
  }
}

// Seleccionar carpeta de Roblox
async function selectRobloxFolder() {
  const path = await window.electronAPI.selectFolder('Seleccionar carpeta de Roblox');
  if (path) {
    document.getElementById('roblox-path').value = path;
    await verifyRobloxInstallation(path);
  }
}

// Seleccionar carpeta de Fisch
async function selectFischFolder() {
  const path = await window.electronAPI.selectFolder('Seleccionar carpeta de Fisch');
  if (path) {
    document.getElementById('fisch-path').value = path;
    addLog(`Ruta de Fisch actualizada: ${path}`, 'info');
  }
}

// Aplicar texturas negras
async function applyBlackTextures() {
  if (!currentTexturePath) {
    addLog('Error: No hay ruta de texturas configurada', 'error');
    return;
  }
  
  addLog('Aplicando texturas negras...', 'info');
  const result = await window.electronAPI.applyBlackTextures(currentTexturePath);
  addLog(result.message, result.success ? 'success' : 'error');
}

// Aplicar cielo oscuro
async function applyDarkSky() {
  if (!currentTexturePath) {
    addLog('Error: No hay ruta de texturas configurada', 'error');
    return;
  }
  
  addLog('Aplicando cielo oscuro...', 'info');
  const result = await window.electronAPI.applyDarkSky(currentTexturePath);
  addLog(result.message, result.success ? 'success' : 'error');
}

// Restaurar texturas originales
async function restoreOriginal() {
  if (!currentTexturePath) {
    addLog('Error: No hay ruta de texturas configurada', 'error');
    return;
  }
  
  addLog('Restaurando texturas originales...', 'info');
  const result = await window.electronAPI.restoreOriginal(currentTexturePath);
  addLog(result.message, result.success ? 'success' : 'error');
}

// Aplicar preset personalizado
async function applyCustomPreset() {
  const presetSelect = document.getElementById('preset-select');
  const presetName = presetSelect.value;
  
  if (!presetName) {
    addLog('Selecciona un preset primero', 'error');
    return;
  }
  
  if (!currentTexturePath) {
    addLog('Error: No hay ruta de texturas configurada', 'error');
    return;
  }
  
  addLog(`Aplicando preset: ${presetName}...`, 'info');
  const result = await window.electronAPI.applyCustomPreset(presetName, currentTexturePath);
  addLog(result.message, result.success ? 'success' : 'error');
}

// Cargar presets disponibles
async function loadAvailablePresets() {
  const result = await window.electronAPI.getAvailablePresets();
  
  if (result.success) {
    const select = document.getElementById('preset-select');
    select.innerHTML = '<option value="">Seleccionar preset...</option>';
    
    result.presets.forEach(preset => {
      const option = document.createElement('option');
      option.value = preset;
      option.textContent = preset;
      select.appendChild(option);
    });
    
    addLog(`${result.presets.length} presets disponibles`, 'info');
  }
}

// Agregar mensaje al log
function addLog(message, type = 'info') {
  const logPanel = document.getElementById('log-panel');
  const timestamp = new Date().toLocaleTimeString();
  const logEntry = document.createElement('div');
  logEntry.className = `log-entry log-${type}`;
  logEntry.textContent = `[${timestamp}] ${message}`;
  
  logPanel.appendChild(logEntry);
  logPanel.scrollTop = logPanel.scrollHeight;
}

// Habilitar/deshabilitar botones de acción
function enableActionButtons(enabled) {
  const buttons = [
    'btn-black-textures',
    'btn-dark-sky',
    'btn-restore',
    'btn-apply-preset'
  ];
  
  buttons.forEach(id => {
    const btn = document.getElementById(id);
    if (btn) {
      btn.disabled = !enabled;
    }
  });
}

// Seleccionar imagen para skybox personalizado
async function selectSkyImage() {
  const result = await window.electronAPI.selectSkyImage();
  
  if (result.success) {
    currentSkyImagePath = result.imagePath;
    
    // Mostrar preview
    const previewImg = document.getElementById('sky-preview-img');
    if (previewImg) {
      previewImg.src = result.previewPath + '?t=' + Date.now(); // Cache bust
      previewImg.style.display = 'block';
    }
    
    // Habilitar botón de aplicar
    const applyBtn = document.getElementById('btn-apply-custom-sky');
    if (applyBtn) {
      applyBtn.disabled = false;
    }
    
    addLog(`✓ Imagen cargada: ${result.imagePath.split('\\').pop()}`, 'success');
  } else {
    addLog(`✗ ${result.message}`, 'error');
  }
}

// Aplicar skybox personalizado (con anuncio)
async function applyCustomSky() {
  if (!currentSkyImagePath) {
    addLog('Error: Primero selecciona una imagen', 'error');
    return;
  }
  
  if (!currentTexturePath) {
    addLog('Error: No hay ruta de texturas configurada', 'error');
    return;
  }
  
  // Mostrar mensaje de anuncio
  addLog('⏳ Preparando anuncio...', 'info');
  
  // Mostrar overlay de anuncio
  showAdOverlay();
  
  // Aplicar después del anuncio
  const result = await window.electronAPI.applyCustomSky(currentSkyImagePath, currentTexturePath);
  
  hideAdOverlay();
  
  if (result.success) {
    addLog(`✓ ${result.message}`, 'success');
    addLog(`💰 Anuncios vistos: ${result.adStats.totalAdsShown} | Ganancia estimada: $${result.adStats.estimatedRevenue.toFixed(2)}`, 'info');
  } else {
    addLog(`✗ ${result.message}`, 'error');
  }
}

// Mostrar overlay de anuncio
function showAdOverlay() {
  const overlay = document.getElementById('ad-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    
    // Countdown de 5 segundos
    adCountdown = 5;
    updateAdCountdown();
    
    const interval = setInterval(() => {
      adCountdown--;
      updateAdCountdown();
      
      if (adCountdown <= 0) {
        clearInterval(interval);
      }
    }, 1000);
  }
}

// Ocultar overlay de anuncio
function hideAdOverlay() {
  const overlay = document.getElementById('ad-overlay');
  if (overlay) {
    overlay.style.display = 'none';
  }
}

// Actualizar countdown del anuncio
function updateAdCountdown() {
  const countdownEl = document.getElementById('ad-countdown');
  if (countdownEl) {
    countdownEl.textContent = adCountdown;
  }
  
  const skipBtn = document.getElementById('ad-skip-btn');
  if (skipBtn) {
    if (adCountdown <= 0) {
      skipBtn.disabled = false;
      skipBtn.textContent = 'Continuar';
    } else {
      skipBtn.disabled = true;
      skipBtn.textContent = `Espera ${adCountdown}s`;
    }
  }
}

// Cerrar overlay de anuncio
function closeAdOverlay() {
  if (adCountdown <= 0) {
    hideAdOverlay();
  }
}

// Abrir enlace de donación
async function openDonation() {
  await window.electronAPI.openDonationLink();
  addLog('❤️ ¡Gracias por considerar donar!', 'success');
}

// Cargar preview guardado al iniciar
async function loadSavedPreview() {
  const result = await window.electronAPI.getPreviewPath();
  
  if (result.success) {
    const previewImg = document.getElementById('sky-preview-img');
    if (previewImg) {
      previewImg.src = result.path + '?t=' + Date.now();
      previewImg.style.display = 'block';
    }
  }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
  initApp();
  loadSavedPreview();
});
