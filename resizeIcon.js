// Script para redimensionar el icono a 256x256
const Jimp = require('jimp');
const fs = require('fs');

async function resizeIcon() {
  try {
    console.log('Convirtiendo icono a PNG...');
    
    // Leer el icono actual
    const image = await Jimp.read('icon.ico');
    
    console.log(`Tamaño original: ${image.bitmap.width}x${image.bitmap.height}`);
    
    // Redimensionar a 256x256
    image.resize(256, 256, Jimp.RESIZE_BICUBIC);
    
    // Guardar como PNG
    await image.writeAsync('icon-256.png');
    
    console.log('✓ Icono redimensionado a 256x256: icon-256.png');
    console.log('');
    console.log('SIGUIENTE PASO:');
    console.log('1. Ve a https://convertio.co/png-ico/');
    console.log('2. Sube icon-256.png');
    console.log('3. Descarga como icon.ico');
    console.log('4. Reemplaza el icon.ico actual');
    console.log('5. Ejecuta: npm run build:win');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

resizeIcon();
