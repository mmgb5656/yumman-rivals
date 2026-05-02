// Script para verificar que todo está configurado correctamente
const fs = require('fs');
const path = require('path');
const os = require('os');

console.log('=== VERIFICACIÓN DE CONFIGURACIÓN ===\n');

let allGood = true;

// 1. Verificar UI buildeada
console.log('1. Verificando UI buildeada...');
const uiPath = path.join(__dirname, 'b_W1nO7XZBZq9', 'out', 'index.html');
if (fs.existsSync(uiPath)) {
  console.log('   ✓ UI buildeada encontrada');
} else {
  console.log('   ✗ UI no encontrada. Ejecuta: cd b_W1nO7XZBZq9 && npm run build');
  allGood = false;
}

// 2. Verificar imágenes de skyboxes
console.log('\n2. Verificando imágenes de skyboxes...');
const skyboxImagesPath = path.join(__dirname, 'b_W1nO7XZBZq9', 'out', 'skyboxes');
if (fs.existsSync(skyboxImagesPath)) {
  const images = fs.readdirSync(skyboxImagesPath).filter(f => f.endsWith('.png'));
  console.log(`   ✓ ${images.length} imágenes encontradas`);
  if (images.length < 25) {
    console.log('   ⚠ Se esperaban 25 imágenes');
  }
} else {
  console.log('   ✗ Carpeta de imágenes no encontrada');
  allGood = false;
}

// 3. Verificar Roblox
console.log('\n3. Verificando instalación de Roblox...');
const robloxPath = path.join(os.homedir(), 'AppData', 'Local', 'Roblox', 'Versions');
if (fs.existsSync(robloxPath)) {
  const versions = fs.readdirSync(robloxPath).filter(f => f.startsWith('version-'));
  if (versions.length > 0) {
    const latestVersion = versions.sort().reverse()[0];
    console.log(`   ✓ Roblox encontrado: ${latestVersion}`);
    
    const texturePath = path.join(robloxPath, latestVersion, 'PlatformContent', 'pc', 'textures');
    if (fs.existsSync(texturePath)) {
      console.log('   ✓ Carpeta de texturas encontrada');
    } else {
      console.log('   ✗ Carpeta de texturas no encontrada');
      console.log(`      Ruta esperada: ${texturePath}`);
      allGood = false;
    }
  } else {
    console.log('   ✗ No se encontraron versiones de Roblox');
    allGood = false;
  }
} else {
  console.log('   ✗ Roblox no encontrado');
  console.log('      Instala Roblox y ábrelo una vez para crear las carpetas');
  allGood = false;
}

// 4. Verificar Fishstrap (opcional)
console.log('\n4. Verificando Fishstrap (opcional)...');
const fishstrapPath = path.join(os.homedir(), 'AppData', 'Local', 'Fishstrap', 'Versions');
if (fs.existsSync(fishstrapPath)) {
  const versions = fs.readdirSync(fishstrapPath).filter(f => f.startsWith('version-'));
  if (versions.length > 0) {
    console.log(`   ✓ Fishstrap encontrado: ${versions.length} versión(es)`);
  }
} else {
  console.log('   ⚠ Fishstrap no encontrado (opcional)');
}

// 5. Verificar texturas Ruptic Dark
console.log('\n5. Verificando texturas Ruptic Dark...');
const ruptikPath = path.join(__dirname, 'resources', 'textures', 'ruptic-dark', 'Ruptic Dark');
if (fs.existsSync(ruptikPath)) {
  const materials = fs.readdirSync(ruptikPath).filter(f => {
    const stat = fs.statSync(path.join(ruptikPath, f));
    return stat.isDirectory();
  });
  console.log(`   ✓ ${materials.length} materiales encontrados`);
  if (materials.length < 10) {
    console.log('   ⚠ Se esperaban al menos 10 materiales');
  }
} else {
  console.log('   ✗ Ruptic Dark no encontrado');
  console.log(`      Ruta esperada: ${ruptikPath}`);
  allGood = false;
}

// 6. Verificar skyboxes
console.log('\n6. Verificando skyboxes...');
const skyboxesPath = path.join(__dirname, 'resources', 'skyboxes', 'all-skyboxes', 'ALL SKYBOXES', 'ALL SKYBOXES');
if (fs.existsSync(skyboxesPath)) {
  const skyboxes = fs.readdirSync(skyboxesPath).filter(f => {
    const stat = fs.statSync(path.join(skyboxesPath, f));
    return stat.isDirectory();
  });
  console.log(`   ✓ ${skyboxes.length} skyboxes encontrados`);
  if (skyboxes.length < 25) {
    console.log('   ⚠ Se esperaban 25 skyboxes');
  }
  
  // Verificar que al menos uno tenga archivos .tex
  if (skyboxes.length > 0) {
    const firstSkybox = skyboxes[0];
    const skyboxPath = path.join(skyboxesPath, firstSkybox);
    const files = fs.readdirSync(skyboxPath);
    const texFiles = files.filter(f => f.endsWith('.tex'));
    if (texFiles.length === 6) {
      console.log(`   ✓ Skybox "${firstSkybox}" tiene 6 archivos .tex`);
    } else {
      console.log(`   ⚠ Skybox "${firstSkybox}" tiene ${texFiles.length} archivos .tex (se esperaban 6)`);
    }
  }
} else {
  console.log('   ✗ Skyboxes no encontrados');
  console.log(`      Ruta esperada: ${skyboxesPath}`);
  allGood = false;
}

// 7. Verificar rbx-storage
console.log('\n7. Verificando rbx-storage...');
const rbxStoragePath = path.join(os.homedir(), 'AppData', 'Local', 'Roblox', 'rbx-storage');
if (fs.existsSync(rbxStoragePath)) {
  console.log('   ✓ rbx-storage encontrado');
} else {
  console.log('   ⚠ rbx-storage no encontrado (se creará automáticamente)');
}

// Resumen
console.log('\n=== RESUMEN ===');
if (allGood) {
  console.log('✓ Todo está configurado correctamente');
  console.log('\nPuedes iniciar la app con: npm start');
} else {
  console.log('✗ Hay problemas de configuración');
  console.log('\nRevisa los errores arriba y corrígelos antes de iniciar la app');
}

console.log('\n=== FIN DE VERIFICACIÓN ===');
