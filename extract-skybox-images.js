const fs = require('fs-extra');
const path = require('path');

/**
 * Script para extraer las imágenes de preview de los skyboxes
 * y copiarlas a la carpeta public de la interfaz
 */

async function extractSkyboxImages() {
  const skyboxesPath = path.join(__dirname, 'skyboxfix', 'ALL SKYBOXES', 'ALL SKYBOXES');
  const publicPath = path.join(__dirname, 'b_W1nO7XZBZq9', 'public', 'skyboxes');
  
  // Crear carpeta de destino
  await fs.ensureDir(publicPath);
  
  console.log('📁 Buscando skyboxes en:', skyboxesPath);
  
  // Leer todas las carpetas de skyboxes
  const folders = await fs.readdir(skyboxesPath);
  
  let copied = 0;
  let errors = 0;
  
  for (const folder of folders) {
    const folderPath = path.join(skyboxesPath, folder);
    const stats = await fs.stat(folderPath);
    
    if (stats.isDirectory()) {
      // Buscar el archivo de screenshot
      const screenshotPath = path.join(folderPath, '! SCREENSHOT.png');
      
      if (await fs.pathExists(screenshotPath)) {
        // Crear nombre de archivo limpio (sin espacios, minúsculas)
        const cleanName = folder.toLowerCase().replace(/\s+/g, '-');
        const destPath = path.join(publicPath, `${cleanName}.png`);
        
        try {
          await fs.copy(screenshotPath, destPath);
          console.log(`✅ Copiado: ${folder} -> ${cleanName}.png`);
          copied++;
        } catch (error) {
          console.error(`❌ Error copiando ${folder}:`, error.message);
          errors++;
        }
      } else {
        console.log(`⚠️  No se encontró screenshot en: ${folder}`);
      }
    }
  }
  
  console.log('\n📊 Resumen:');
  console.log(`   ✅ Copiados: ${copied}`);
  console.log(`   ❌ Errores: ${errors}`);
  console.log(`   📁 Destino: ${publicPath}`);
  
  // Crear archivo JSON con la lista de skyboxes
  const skyboxList = folders
    .filter(f => fs.statSync(path.join(skyboxesPath, f)).isDirectory())
    .map(folder => {
      const cleanName = folder.toLowerCase().replace(/\s+/g, '-');
      return {
        id: cleanName,
        name: folder,
        image: `/skyboxes/${cleanName}.png`
      };
    });
  
  const listPath = path.join(publicPath, 'skybox-list.json');
  await fs.writeJSON(listPath, skyboxList, { spaces: 2 });
  console.log(`\n📝 Lista creada: skybox-list.json (${skyboxList.length} skyboxes)`);
}

// Ejecutar
extractSkyboxImages()
  .then(() => {
    console.log('\n✨ ¡Proceso completado!');
  })
  .catch(error => {
    console.error('\n❌ Error:', error);
    process.exit(1);
  });
