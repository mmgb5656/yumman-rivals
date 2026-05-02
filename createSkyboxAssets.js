const fs = require('fs-extra');
const path = require('path');

/**
 * Script para crear carpetas assets para cada skybox
 * Copia los archivos .tex y los renombra a los hashes correctos
 * Esto replica lo que hace el skyfix para cada cielo
 */

const SKYBOXES_PATH = path.join(__dirname, 'resources', 'skyboxes', 'all-skyboxes', 'ALL SKYBOXES', 'ALL SKYBOXES');

// Mapeo de archivos a hashes (del move.bat)
const HASH_MAPPING = {
  'sky512_ft.tex': 'a564ec8aeef3614e788d02f0090089d8',
  'sky512_bk.tex': '7328622d2d509b95dd4dd2c721d1ca8b',
  'sky512_lf.tex': 'a50f6563c50ca4d5dcb255ee5cfab097',
  'sky512_rt.tex': '6c94b9385e52d221f0538aadaceead2d',
  'sky512_up.tex': '9244e00ff9fd6cee0bb40a262bb35d31',
  'sky512_dn.tex': '78cb2e93aee0cdbd79b15a866bc93a54'
};

async function createAssetsForSkybox(skyboxFolder) {
  const skyboxName = path.basename(skyboxFolder);
  const assetsFolder = path.join(skyboxFolder, 'assets');
  
  console.log(`\n=== Procesando: ${skyboxName} ===`);
  
  // Verificar que existan los archivos .tex
  const texFiles = await fs.readdir(skyboxFolder);
  const hasAllTexFiles = Object.keys(HASH_MAPPING).every(file => 
    texFiles.includes(file)
  );
  
  if (!hasAllTexFiles) {
    console.log(`  ✗ Faltan archivos .tex, saltando...`);
    return false;
  }
  
  // Crear carpeta assets
  await fs.ensureDir(assetsFolder);
  console.log(`  ✓ Carpeta assets creada`);
  
  let copiedCount = 0;
  
  // Copiar cada archivo .tex con su nombre hash
  for (const [texFile, hash] of Object.entries(HASH_MAPPING)) {
    const sourcePath = path.join(skyboxFolder, texFile);
    const destPath = path.join(assetsFolder, hash);
    
    try {
      await fs.copy(sourcePath, destPath, { overwrite: true });
      copiedCount++;
      console.log(`  ✓ ${texFile} -> ${hash}`);
    } catch (error) {
      console.log(`  ✗ Error copiando ${texFile}: ${error.message}`);
    }
  }
  
  console.log(`  ✓ Total: ${copiedCount}/6 archivos copiados`);
  return copiedCount === 6;
}

async function createAssetsForAllSkyboxes() {
  console.log('=== CREANDO ASSETS PARA TODOS LOS SKYBOXES ===');
  console.log(`Ruta: ${SKYBOXES_PATH}\n`);
  
  if (!await fs.pathExists(SKYBOXES_PATH)) {
    console.error('ERROR: No se encontró la carpeta de skyboxes');
    return;
  }
  
  const skyboxFolders = await fs.readdir(SKYBOXES_PATH);
  let successCount = 0;
  let totalCount = 0;
  
  for (const folder of skyboxFolders) {
    const skyboxPath = path.join(SKYBOXES_PATH, folder);
    const stat = await fs.stat(skyboxPath);
    
    if (stat.isDirectory()) {
      totalCount++;
      const success = await createAssetsForSkybox(skyboxPath);
      if (success) successCount++;
    }
  }
  
  console.log(`\n=== RESUMEN ===`);
  console.log(`Total de skyboxes: ${totalCount}`);
  console.log(`Assets creados exitosamente: ${successCount}`);
  console.log(`Fallidos: ${totalCount - successCount}`);
  
  if (successCount > 0) {
    console.log(`\n✓ ¡Listo! Ahora todos los skyboxes tienen carpetas assets.`);
    console.log(`La app podrá aplicar cualquier cielo correctamente.`);
  }
}

// Ejecutar
createAssetsForAllSkyboxes().catch(console.error);
