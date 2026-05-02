// Script para probar que las imágenes se cargan correctamente en Electron
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false
    }
  });

  const htmlPath = path.join(__dirname, 'b_W1nO7XZBZq9', 'out', 'index.html');
  console.log('Cargando HTML desde:', htmlPath);
  
  win.loadFile(htmlPath);
  win.webContents.openDevTools();
  
  // Escuchar errores de carga
  win.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Error al cargar:', errorCode, errorDescription);
  });
  
  // Escuchar cuando termine de cargar
  win.webContents.on('did-finish-load', () => {
    console.log('Página cargada correctamente');
    
    // Verificar si las imágenes se cargaron
    win.webContents.executeJavaScript(`
      const images = document.querySelectorAll('img');
      const results = Array.from(images).map(img => ({
        src: img.src,
        complete: img.complete,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight
      }));
      results;
    `).then(results => {
      console.log('\n=== IMÁGENES ENCONTRADAS ===');
      results.forEach((img, i) => {
        console.log(`\nImagen ${i + 1}:`);
        console.log('  src:', img.src);
        console.log('  cargada:', img.complete && img.naturalWidth > 0);
        console.log('  dimensiones:', `${img.naturalWidth}x${img.naturalHeight}`);
      });
    });
  });
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  app.quit();
});
