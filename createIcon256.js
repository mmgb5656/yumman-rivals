// Script para crear un icono simple de 256x256
const Jimp = require('jimp');
const fs = require('fs');

async function createIcon() {
  try {
    console.log('Creando icono 256x256...');
    
    // Crear imagen de 256x256 con fondo oscuro
    const image = new Jimp(256, 256, 0x0a0a0fff);
    
    // Agregar texto "YR" (YUMMAN RIVALS)
    const font = await Jimp.loadFont(Jimp.FONT_SANS_128_WHITE);
    image.print(font, 0, 0, {
      text: 'YR',
      alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
      alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE
    }, 256, 256);
    
    // Guardar como PNG
    await image.writeAsync('icon-temp-256.png');
    
    console.log('✓ Icono PNG 256x256 creado: icon-temp-256.png');
    console.log('');
    console.log('IMPORTANTE:');
    console.log('1. Ve a https://convertio.co/png-ico/');
    console.log('2. Sube icon-temp-256.png');
    console.log('3. Descarga como icon.ico');
    console.log('4. Guarda en la raíz del proyecto');
    console.log('');
    console.log('O simplemente usa el icono que ya tienes.');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createIcon();
