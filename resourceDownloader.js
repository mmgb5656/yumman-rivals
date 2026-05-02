const https = require('https');
const fs = require('fs-extra');
const path = require('path');
const { app, BrowserWindow } = require('electron');
const AdmZip = require('adm-zip');
const log = require('electron-log');

class ResourceDownloader {
  constructor() {
    this.resourcesUrl = 'https://github.com/mmgb5656/yumman-rivals/releases/download/v1.0.0-resources/yumman-rivals-resources-v1.0.0.zip';
    this.resourcesPath = path.join(app.getPath('userData'), 'resources');
    this.tempPath = path.join(app.getPath('temp'), 'yumman-rivals-resources.zip');
  }

  // Verificar si los recursos ya están descargados
  async checkResources() {
    try {
      const skyboxesPath = path.join(this.resourcesPath, 'skyboxes');
      const texturesPath = path.join(this.resourcesPath, 'textures');
      
      const skyboxesExist = await fs.pathExists(skyboxesPath);
      const texturesExist = await fs.pathExists(texturesPath);
      
      if (skyboxesExist && texturesExist) {
        // Verificar que haya archivos dentro
        const skyboxes = await fs.readdir(skyboxesPath);
        const textures = await fs.readdir(texturesPath);
        
        return skyboxes.length > 0 && textures.length > 0;
      }
      
      return false;
    } catch (error) {
      log.error('Error verificando recursos:', error);
      return false;
    }
  }

  // Descargar recursos
  async downloadResources(onProgress, onStatus) {
    return new Promise((resolve, reject) => {
      onStatus('Conectando al servidor...');
      
      const file = fs.createWriteStream(this.tempPath);

      https.get(this.resourcesUrl, (response) => {
        // Manejar redirecciones
        if (response.statusCode === 302 || response.statusCode === 301) {
          https.get(response.headers.location, (redirectResponse) => {
            this.handleDownload(redirectResponse, file, onProgress, onStatus, resolve, reject);
          }).on('error', reject);
        } else {
          this.handleDownload(response, file, onProgress, onStatus, resolve, reject);
        }
      }).on('error', (error) => {
        fs.unlinkSync(this.tempPath);
        reject(error);
      });
    });
  }

  handleDownload(response, file, onProgress, onStatus, resolve, reject) {
    const totalSize = parseInt(response.headers['content-length'], 10);
    let downloadedSize = 0;

    onStatus(`Descargando recursos (${this.formatBytes(totalSize)})...`);

    response.on('data', (chunk) => {
      downloadedSize += chunk.length;
      const percent = Math.round((downloadedSize / totalSize) * 100);
      const downloaded = this.formatBytes(downloadedSize);
      const total = this.formatBytes(totalSize);
      
      onProgress(percent);
      onStatus(`Descargando: ${downloaded} / ${total} (${percent}%)`);
    });

    response.pipe(file);

    file.on('finish', async () => {
      file.close();
      
      try {
        onStatus('Extrayendo archivos...');
        await this.extractZip(onStatus);
        
        onStatus('Limpiando archivos temporales...');
        await fs.unlink(this.tempPath);
        
        onStatus('¡Recursos instalados correctamente!');
        resolve();
      } catch (error) {
        reject(error);
      }
    });

    file.on('error', (error) => {
      fs.unlinkSync(this.tempPath);
      reject(error);
    });
  }

  // Extraer ZIP
  async extractZip(onStatus) {
    try {
      onStatus('Extrayendo archivos...');
      
      const zip = new AdmZip(this.tempPath);
      const zipEntries = zip.getEntries();
      
      // Asegurar que existe el directorio de destino
      await fs.ensureDir(this.resourcesPath);
      
      // Extraer todos los archivos
      zip.extractAllTo(this.resourcesPath, true);
      
      onStatus('Archivos extraídos correctamente');
      
      log.info('Recursos extraídos en:', this.resourcesPath);
    } catch (error) {
      log.error('Error extrayendo ZIP:', error);
      throw error;
    }
  }

  // Formatear bytes a formato legible
  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  }

  // Obtener ruta de recursos
  getResourcesPath() {
    return this.resourcesPath;
  }
}

module.exports = ResourceDownloader;
