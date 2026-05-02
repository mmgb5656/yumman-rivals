// Script para probar las rutas de Roblox
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('=== PROBANDO RUTAS DE ROBLOX ===\n');

// Ruta de Roblox
const robloxPath = path.join(os.homedir(), 'AppData', 'Local', 'Roblox', 'Versions');
console.log('1. Ruta de Roblox:', robloxPath);
console.log('   Existe:', fs.existsSync(robloxPath));

if (fs.existsSync(robloxPath)) {
  const versions = fs.readdirSync(robloxPath).filter(f => f.startsWith('version-'));
  console.log('   Versiones encontradas:', versions.length);
  
  if (versions.length > 0) {
    const latestVersion = versions.sort().reverse()[0];
    console.log('   Última versión:', latestVersion);
    
    const texturePath = path.join(robloxPath, latestVersion, 'PlatformContent', 'pc', 'textures');
    console.log('   Ruta de texturas:', texturePath);
    console.log('   Existe:', fs.existsSync(texturePath));
    
    if (fs.existsSync(texturePath)) {
      const skyPath = path.join(texturePath, 'sky');
      console.log('   Ruta de sky:', skyPath);
      console.log('   Existe:', fs.existsSync(skyPath));
      
      if (fs.existsSync(skyPath)) {
        const skyFiles = fs.readdirSync(skyPath);
        console.log('   Archivos en sky:', skyFiles.length);
        console.log('   Archivos:', skyFiles.slice(0, 5).join(', '));
      }
    }
  }
}

console.log('\n2. Ruta de Fishstrap:', path.join(os.homedir(), 'AppData', 'Local', 'Fishstrap', 'Versions'));
const fishstrapPath = path.join(os.homedir(), 'AppData', 'Local', 'Fishstrap', 'Versions');
console.log('   Existe:', fs.existsSync(fishstrapPath));

if (fs.existsSync(fishstrapPath)) {
  const versions = fs.readdirSync(fishstrapPath).filter(f => f.startsWith('version-'));
  console.log('   Versiones encontradas:', versions.length);
  
  if (versions.length > 0) {
    const latestVersion = versions.sort().reverse()[0];
    console.log('   Última versión:', latestVersion);
    
    const texturePath = path.join(fishstrapPath, latestVersion, 'PlatformContent', 'pc', 'textures');
    console.log('   Ruta de texturas:', texturePath);
    console.log('   Existe:', fs.existsSync(texturePath));
  }
}

console.log('\n3. Ruta de rbx-storage:', path.join(os.homedir(), 'AppData', 'Local', 'Roblox', 'rbx-storage'));
const rbxStoragePath = path.join(os.homedir(), 'AppData', 'Local', 'Roblox', 'rbx-storage');
console.log('   Existe:', fs.existsSync(rbxStoragePath));

if (fs.existsSync(rbxStoragePath)) {
  const folders = fs.readdirSync(rbxStoragePath);
  console.log('   Carpetas:', folders.slice(0, 10).join(', '));
}

console.log('\n4. Skyboxes disponibles:');
const skyboxesPath = path.join(__dirname, 'skyboxfix', 'ALL SKYBOXES', 'ALL SKYBOXES');
if (fs.existsSync(skyboxesPath)) {
  const skyboxes = fs.readdirSync(skyboxesPath).filter(f => {
    const stat = fs.statSync(path.join(skyboxesPath, f));
    return stat.isDirectory();
  });
  console.log('   Total:', skyboxes.length);
  console.log('   Primeros 5:', skyboxes.slice(0, 5).join(', '));
  
  // Verificar archivos en el primer skybox
  if (skyboxes.length > 0) {
    const firstSkybox = skyboxes[0];
    const skyboxPath = path.join(skyboxesPath, firstSkybox);
    const files = fs.readdirSync(skyboxPath);
    console.log(`\n   Archivos en "${firstSkybox}":`, files.join(', '));
  }
}

console.log('\n5. Texturas Ruptic Dark:');
const ruptikPath = path.join(__dirname, 'Ruptic Dark', 'Ruptic Dark');
console.log('   Ruta:', ruptikPath);
console.log('   Existe:', fs.existsSync(ruptikPath));

if (fs.existsSync(ruptikPath)) {
  const materials = fs.readdirSync(ruptikPath).filter(f => {
    const stat = fs.statSync(path.join(ruptikPath, f));
    return stat.isDirectory();
  });
  console.log('   Materiales:', materials.join(', '));
}

console.log('\n=== FIN DE PRUEBAS ===');
