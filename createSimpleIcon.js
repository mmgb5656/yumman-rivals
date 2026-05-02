// Script para crear un icono simple de 256x256
const Jimp = require('jimp');

async function createIcon() {
  try {
    console.log('Creando icono simple 256x256...');
    
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
    await image.writeAsync('icon-256.png');
    
    console.log('✓ Icono PNG 256x256 creado: icon-256.png');
    console.log('');
    console.log('Ahora actualiza package.json para usar icon-256.png en lugar de icon.ico');
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createIcon();
