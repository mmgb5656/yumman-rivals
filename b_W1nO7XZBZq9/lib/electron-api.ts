// API para comunicarse con Electron

// Mapeo de IDs de skybox a nombres de carpetas reales
const skyboxMap: Record<string, string> = {
  'night': 'Night',
  'aurora': 'Aurora',
  'moonlight': 'Moonlight',
  'space-blue': 'Space Blue',
  'universe': 'Universe',
  'pink-sunrise': 'Pink Sunrise',
  'beautiful': 'Beautiful',
  'neonsky': 'NeonSky',
  'neonsky2': 'NeonSky2',
  'hades': 'Hades',
  'spooky': 'Spooky',
  'goodnight': 'Goodnight',
  'overcast': 'Overcast',
  'hazy': 'Hazy',
  'blue': 'Blue',
  'light-blue': 'Light Blue',
  'cyan': 'Cyan',
  'orange': 'Orange',
  'red': 'Red',
  'chill-pink': 'Chill pink',
  'light-pink': 'Light pink',
  'chill-gray': 'Chill gray',
  'pandora': 'Pandora',
  'chromakey': 'ChromaKey',
  'emo': 'Emo',
};

export const electronAPI = {
  // Verificar si estamos en Electron
  isElectron() {
    return typeof window !== 'undefined' && (window as any).electronAPI;
  },

  // Aplicar cielo por ID
  async applySky(skyId: string, texturePath: string) {
    if (!this.isElectron()) {
      console.log('Simulando aplicación de cielo:', skyId);
      return { success: true, message: 'Cielo aplicado (modo web)' };
    }
    
    const api = (window as any).electronAPI;
    const folderName = skyboxMap[skyId] || skyId;
    
    console.log(`Aplicando skybox: ${skyId} -> ${folderName}`);
    return await api.applySkyboxByName(folderName, texturePath);
  },

  // Aplicar texturas oscuras
  async applyDarkTextures(enabled: boolean, texturePath: string) {
    if (!this.isElectron()) {
      console.log('Simulando texturas oscuras:', enabled);
      return { success: true, message: enabled ? 'Texturas oscuras activadas' : 'Texturas restauradas' };
    }
    
    const api = (window as any).electronAPI;
    if (enabled) {
      return await api.applyBlackTextures(texturePath);
    } else {
      return await api.restoreOriginal(texturePath);
    }
  },

  // Aplicar cielo personalizado
  async applyCustomSky(imagePath: string, texturePath: string) {
    if (!this.isElectron()) {
      console.log('Simulando cielo personalizado');
      return { success: true, message: 'Cielo personalizado aplicado' };
    }
    
    const api = (window as any).electronAPI;
    return await api.applyCustomSky(imagePath, texturePath);
  },

  // Seleccionar imagen de cielo
  async selectSkyImage() {
    if (!this.isElectron()) {
      console.log('Simulando selección de imagen');
      return { success: false, message: 'No disponible en modo web' };
    }
    
    const api = (window as any).electronAPI;
    return await api.selectSkyImage();
  },

  // Obtener rutas por defecto
  async getDefaultPaths() {
    if (!this.isElectron()) {
      const homedir = 'C:\\Users\\YUMMAN';
      return {
        roblox: `${homedir}\\AppData\\Local\\Roblox\\Versions`,
        fishstrap: `${homedir}\\AppData\\Local\\Fishstrap\\Versions`,
      };
    }
    
    const api = (window as any).electronAPI;
    return await api.getDefaultPaths();
  },

  // Verificar ruta de Roblox
  async verifyRobloxPath(path: string) {
    if (!this.isElectron()) {
      return { 
        valid: true, 
        texturePath: path + '\\content\\textures',
        version: 'version-test'
      };
    }
    
    const api = (window as any).electronAPI;
    return await api.verifyRobloxPath(path);
  },

  // Detectar ejecutores disponibles
  async detectExecutors() {
    if (!this.isElectron()) {
      return {
        success: true,
        executors: [
          { id: 'roblox', name: 'Roblox Normal', path: 'C:\\Users\\YUMMAN\\AppData\\Local\\Roblox\\Versions', found: true }
        ]
      };
    }
    
    const api = (window as any).electronAPI;
    return await api.detectExecutors();
  },

  // Obtener ruta de texturas según ejecutor
  async getExecutorTexturePath(executorId: string, customPath?: string) {
    if (!this.isElectron()) {
      return {
        valid: true,
        texturePath: 'C:\\Users\\YUMMAN\\AppData\\Local\\Roblox\\Versions\\version-test\\PlatformContent\\pc\\textures',
        version: 'version-test',
        executor: executorId
      };
    }
    
    const api = (window as any).electronAPI;
    return await api.getExecutorTexturePath(executorId, customPath);
  },

  // Abrir enlace externo
  async openExternal(url: string) {
    if (!this.isElectron()) {
      window.open(url, '_blank', 'noopener,noreferrer');
      return;
    }
    
    const api = (window as any).electronAPI;
    await api.openDonationLink();
  },

  // Restaurar texturas originales
  async restoreOriginal(texturePath: string) {
    if (!this.isElectron()) {
      console.log('Simulando restauración de texturas originales');
      return { success: true, message: 'Texturas restauradas (modo web)' };
    }
    
    const api = (window as any).electronAPI;
    return await api.restoreOriginal(texturePath);
  },
};
