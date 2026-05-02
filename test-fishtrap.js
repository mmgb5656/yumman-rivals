// Script de prueba para verificar detección de Fishtrap
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

console.log('=== TEST: DETECCIÓN DE FISHTRAP ===\n');

// Rutas
const fishstrapPath = path.join(os.homedir(), 'AppData', 'Local', 'Fishstrap', 'Versions');

console.log('1. Verificando ruta base de Fishstrap:');
console.log('   Ruta:', fishstrapPath);
console.log('   Existe:', fs.existsSync(fishstrapPath));

if (!fs.existsSync(fishstrapPath)) {
  console.log('   ❌ ERROR: Carpeta de Fishstrap no existe');
  process.exit(1);
}

console.log('\n2. Buscando versiones:');
const versions = fs.readdirSync(fishstrapPath)
  .filter(f => f.startsWith('version-'))
  .map(f => ({
    name: f,
    path: path.join(fishstrapPath, f),
    mtime: fs.statSync(path.join(fishstrapPath, f)).mtime
  }))
  .sort((a, b) => b.mtime - a.mtime);

console.log(`   Versiones encontradas: ${versions.length}`);
versions.forEach((v, i) => {
  console.log(`   ${i + 1}. ${v.name} (${v.mtime.toLocaleString()})`);
});

if (versions.length === 0) {
  console.log('   ❌ ERROR: No se encontraron versiones');
  process.exit(1);
}

console.log('\n3. Verificando versión más reciente:');
const latestVersion = versions[0];
console.log('   Versión:', latestVersion.name);
console.log('   Fecha:', latestVersion.mtime.toLocaleString());

const texturePath = path.join(latestVersion.path, 'PlatformContent', 'pc', 'textures');
console.log('\n4. Verificando ruta de texturas:');
console.log('   Ruta:', texturePath);
console.log('   Existe:', fs.existsSync(texturePath));

if (!fs.existsSync(texturePath)) {
  console.log('   ❌ ERROR: Carpeta de texturas no existe');
  process.exit(1);
}

const skyPath = path.join(texturePath, 'sky');
console.log('\n5. Verificando carpeta sky:');
console.log('   Ruta:', skyPath);
console.log('   Existe:', fs.existsSync(skyPath));

if (fs.existsSync(skyPath)) {
  const skyFiles = fs.readdirSync(skyPath).filter(f => f.endsWith('.tex'));
  console.log(`   Archivos .tex: ${skyFiles.length}`);
  skyFiles.forEach(f => console.log(`     - ${f}`));
}

console.log('\n6. Verificando carpetas de texturas:');
const textureFolders = fs.readdirSync(texturePath)
  .filter(f => {
    const fullPath = path.join(texturePath, f);
    return fs.statSync(fullPath).isDirectory();
  });
console.log(`   Carpetas encontradas: ${textureFolders.length}`);
textureFolders.slice(0, 10).forEach(f => console.log(`     - ${f}`));
if (textureFolders.length > 10) {
  console.log(`     ... y ${textureFolders.length - 10} más`);
}

console.log('\n=== RESULTADO ===');
console.log('✅ Fishtrap detectado correctamente');
console.log(`✅ Ruta de texturas: ${texturePath}`);
console.log(`✅ Versión: ${latestVersion.name}`);
console.log('\n✅ TODO FUNCIONA CORRECTAMENTE');
