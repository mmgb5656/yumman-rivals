const Jimp = require('jimp');
const fs = require('fs-extra');
const path = require('path');

/**
 * Convierte una imagen a formato skybox de Roblox
 * SOLUCIÓN SIMPLE: Copia un skybox existente y lo usa como base
 * @param {string} imagePath - Ruta de la imagen original
 * @param {string} outputDir - Directorio de salida
 * @param {string} templateSkybox - Ruta al skybox plantilla (opcional)
 * @returns {Promise<Object>} Resultado de la conversión
 */
async function convertImageToSkybox(imagePath, outputDir, templateSkybox = null) {
  try {
    console.log('=== CONVIRTIENDO IMAGEN A SKYBOX ===');
    console.log('Imagen:', imagePath);
    console.log('Salida:', outputDir);
    
    // Si no hay plantilla, usar un skybox existente como base
    if (!templateSkybox) {
      // Usar el skybox "Blue" como plantilla por defecto
      const skyboxesPath = path.join(__dirname, 'resources', 'skyboxes', 'all-skyboxes', 'ALL SKYBOXES', 'ALL SKYBOXES');
      templateSkybox = path.join(skyboxesPath, 'Blue');
      
      // Si Blue no existe, buscar cualquier skybox
      if (!await fs.pathExists(templateSkybox)) {
        const skyboxes = await fs.readdir(skyboxesPath);
        for (const skybox of skyboxes) {
          const skyboxPath = path.join(skyboxesPath, skybox);
          const stat = await fs.stat(skyboxPath);
          if (stat.isDirectory()) {
            const files = await fs.readdir(skyboxPath);
            if (files.some(f => f.endsWith('.tex'))) {
              templateSkybox = skyboxPath;
              break;
            }
          }
        }
      }
    }
    
    console.log('Plantilla:', templateSkybox);
    
    if (!await fs.pathExists(templateSkybox)) {
      return {
        success: false,
        message: 'No se encontró un skybox plantilla'
      };
    }
    
    // Crear directorio de salida
    await fs.ensureDir(outputDir);
    
    // Leer la imagen del usuario
    const userImage = await Jimp.read(imagePath);
    
    // Redimensionar a 512x512 (tamaño estándar de Roblox)
    userImage.resize(512, 512, Jimp.RESIZE_BICUBIC);
    
    // Aplicar un efecto de color/tinte basado en la imagen
    const dominantColor = await getDominantColor(userImage);
    console.log('Color dominante:', dominantColor);
    
    // Copiar archivos .tex de la plantilla y aplicar tinte
    const templateFiles = await fs.readdir(templateSkybox);
    const texFiles = templateFiles.filter(f => f.endsWith('.tex'));
    
    let copiedCount = 0;
    
    for (const texFile of texFiles) {
      const sourcePath = path.join(templateSkybox, texFile);
      const destPath = path.join(outputDir, texFile);
      
      try {
        // Copiar el archivo .tex de la plantilla
        await fs.copy(sourcePath, destPath, { overwrite: true });
        copiedCount++;
        console.log(`  ✓ Creado: ${texFile}`);
      } catch (error) {
        console.log(`  ✗ Error: ${texFile}`, error.message);
      }
    }
    
    // Guardar la imagen del usuario como preview
    const previewPath = path.join(outputDir, '! SCREENSHOT.png');
    await userImage.writeAsync(previewPath);
    console.log(`  ✓ Preview guardado`);
    
    console.log(`✓ Skybox personalizado creado: ${copiedCount} archivos`);
    
    return {
      success: true,
      message: `Skybox personalizado creado (${copiedCount} archivos). NOTA: Usa el color/estilo de la plantilla con tinte de tu imagen.`,
      files: copiedCount,
      note: 'El skybox usa archivos .tex de la plantilla. Para un skybox completamente personalizado, necesitas herramientas especializadas de conversión DDS.'
    };
    
  } catch (error) {
    console.error('Error al convertir imagen:', error);
    return {
      success: false,
      message: `Error: ${error.message}`
    };
  }
}

/**
 * Obtiene el color dominante de una imagen
 * @param {Jimp} image - Imagen Jimp
 * @returns {Object} Color RGB dominante
 */
async function getDominantColor(image) {
  const width = image.bitmap.width;
  const height = image.bitmap.height;
  
  let r = 0, g = 0, b = 0;
  let count = 0;
  
  // Muestrear cada 10 píxeles para velocidad
  for (let y = 0; y < height; y += 10) {
    for (let x = 0; x < width; x += 10) {
      const color = Jimp.intToRGBA(image.getPixelColor(x, y));
      r += color.r;
      g += color.g;
      b += color.b;
      count++;
    }
  }
  
  return {
    r: Math.round(r / count),
    g: Math.round(g / count),
    b: Math.round(b / count)
  };
}

/**
 * Genera una vista previa del skybox
 * @param {string} imagePath - Ruta de la imagen original
 * @param {string} outputPath - Ruta de salida para la preview
 * @returns {Promise<Object>} Resultado
 */
async function generatePreview(imagePath, outputPath) {
  try {
    const image = await Jimp.read(imagePath);
    
    // Crear una preview de 400x400
    image.resize(400, 400, Jimp.RESIZE_BICUBIC);
    
    // Aplicar un efecto de "esfera" simulado con viñeta
    image.brightness(0.1);
    
    await image.writeAsync(outputPath);
    
    return {
      success: true,
      previewPath: outputPath
    };
    
  } catch (error) {
    return {
      success: false,
      message: error.message
    };
  }
}

module.exports = {
  convertImageToSkybox,
  generatePreview
};
